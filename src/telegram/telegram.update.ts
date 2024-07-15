import { twoFactorAuthEnum } from "@prisma/client";
import { alertsButtons, buttons, profileButtons, securityButtons } from "./telegram.buttons";
import { getData, init, terminateSession, writeData } from "./telegram.utils";
import { TelegramService } from "./telegram.service"
import { CategoriesService } from "../categories/categories.service";
import { Action, Ctx, Message, On, Start, Update } from "nestjs-telegraf";
import { Context } from "telegraf";

@Update()
export class TelegramUpdate {
    constructor(private readonly telegramService: TelegramService,
                private readonly categoriesService: CategoriesService
    ) {
        init()
    }

    private async JwtChecker(ctx: Context) {
        const telegramId = ctx.from.id 

        const data = await this.telegramService.findUserByTelegramId(telegramId)
 
        if (!data) {
            return undefined
        }
        else {
            return data 
        }
    }

    @Start()
    async start(@Ctx() ctx: Context) {
        const user = await this.JwtChecker(ctx)
        await ctx.reply("Приветствую! Это оффициальный бот Gozon Marketplace! \n\n Выбери нужное действие:", buttons(user))
        await writeData({ telegramId: ctx.from.id, data: {} })
    }

    @Action(/auth/)
    async auth(@Ctx() ctx: Context) {
        if (await this.JwtChecker(ctx)) {
            await ctx.reply("Авторизация уже пройдена!")
            return;
        }

        await ctx.reply("Авторизация возможна в форматах: \n\n 1. Подключитесь к аккаунту используя /connect \n\n 2. Сгенерируйте ключ доступа и пропишите: /connectKey [Ваш ключ доступа]")
    }

    @Action(/profile/)
    async profile(@Ctx() ctx: Context) {
        const user = await this.JwtChecker(ctx)

        if (!user) return;

        await ctx.reply(`Информация об аккаунте ${user.username}: \n Телефон: ${user.phone ? user.phone: "Не подключен"} \n Почта: ${user.email ? user.email: "Не подключена"} \n Роль: ${user.role} \n Двухфакторная авторизация ${user.twoFactorAuth === twoFactorAuthEnum.NONE ? "выключена":"включена"}`,
        profileButtons())
        return;
    }

    @Action(/logout/)
    async logout(@Ctx() ctx: Context) {
        if (await getData(ctx.from.id)) await terminateSession(ctx.from.id)

        const check = await this.telegramService.logout(ctx.from.id)

        if (!check) {
            await ctx.reply("Ошибка при выходе из аккаунта!")
            return;
        }

        await ctx.reply("Вы успешно вышли из аккаунта!")
        await this.start(ctx)
    }

    @Action(/security/)
    async security(@Ctx() ctx: Context) {
        if (!await this.JwtChecker(ctx)) return;

        await ctx.reply("Настрйоки безопасности аккаунта", securityButtons())
    }

    @Action(/menu/)
    async menu(@Ctx() ctx: Context) {
        await ctx.reply("Главное меню", buttons(await this.JwtChecker(ctx)))
    }

    @Action(/twoFactorAuth/)
    async twoFactorAuth(@Ctx() ctx: Context) {
        const User = await this.JwtChecker(ctx)

        if (!User) return; 

        const check = await this.telegramService.enableTwoFactorAuth(User)

        if (!check) {
            await ctx.reply("Ошибка при подключении двухфакторной авторизации!")
            await this.menu(ctx)
            return;
        }
        else {
            await ctx.reply(`Двухфакторная авторизация успешно ${check.twoFactorAuth === twoFactorAuthEnum.TELEGRAM ? "включена":"отключена"}`)
        }
    }

    @Action(/alerts/)
    async alerts(@Ctx() ctx: Context) {
        const user = await this.JwtChecker(ctx)

        if (!user) return;

        if (user.watchingCategories.length === 0) {
            await ctx.reply("У вас нет отслеживаемых категорий!", alertsButtons())
            return;
        }
        else {
            let reply = "Ваши отслеживаемые категории: \n";

            for (let i in user.watchingCategories) {
                reply += `${user.watchingCategories[i]} \n`
            }

            await ctx.reply(reply, alertsButtons())
        }
    }

    @Action(/addCategoryToWatch/)
    async addCategoryToWatch(@Ctx() ctx: Context) {
        const User = await this.JwtChecker(ctx)
        const telegramId = ctx.from.id

        if (!User) return; 

        const data = await getData(telegramId)

        await ctx.reply("Введите название категории:")
        await writeData({ telegramId, data: { ...data?.data, category: { type: "add" } } })
    }

    @Action(/removeCategoryFromWatch/)
    async removeCategoryFromWatch(@Ctx() ctx: Context) {
        const User = await this.JwtChecker(ctx)
        const telegramId = ctx.from.id 

        if (!User) return; 

        const data = await getData(telegramId)

        await ctx.reply("Введите название категории:")
        await writeData({ telegramId, data: { ...data?.data, category: { type: "delete" } } })
    }   

    @On("text")
    async text(@Ctx() ctx: Context, @Message("text") msg: string) {
        const telegramId = ctx.from.id

        if (!await getData(telegramId)) await writeData({ telegramId, data: {} })

        const data = await getData(telegramId)

        if (msg === "/connect" && !data.data.connect) {
            if (await this.JwtChecker(ctx)) {
                await ctx.reply("Авторизация уже пройдена")
                return;
            }
            
            await ctx.reply("Введите логин от аккаунта:")
            await writeData({ telegramId, data: { ...data.data, connect: { stage: 1 } } })
            return;
        }
        else if (data.data.connect?.stage === 1) {
            await ctx.reply("Введите пароль от аккаунта")
            await writeData({ telegramId, data: { ...data.data, connect: { stage: 2, username: msg } } })
        }
        else if (data.data.connect?.stage === 2) {
            await ctx.reply("Проверяем данные...")
            await terminateSession(telegramId)

            const check = await this.telegramService.createUserConnect({ username: data.data["connect"]["username"], password: msg, telegramId })

            if (check) {
                await ctx.reply("Аккаунт успешно подключен!", buttons(check))
            }
            else {
                await ctx.reply("Произошла ошибка при подключении аккаунта. Пожалуйста, проверьте правильность входных данных.")
            }
            return;
        }
        else if (msg.indexOf("/connectKey") === 0) {
            if (await this.JwtChecker(ctx)) {
                await ctx.reply("Авторизация уже пройдена")
                return;
            }

            const key = msg.split(" ")[1]

            if (!key) {
                await ctx.reply("Необходимо ввести ключ в формате: /connectKey [Ключ доступа]")
                return;
            }

            const check = await this.telegramService.createUserConnectWithKey(key, telegramId)

            if (!check) {
                await ctx.reply("Ключ недействителен!")
            }
            else {
                await ctx.reply("Аккаунт успешно подключен!")
            }
            return;
        }
        else if (data.data.category) {
            const User = await this.JwtChecker(ctx)

            if (!User) {
                await ctx.reply("Ошибка при добавлении категории: Пользователь не найден!")
                return;
            }
            
            const type = data.data.category.type

            await ctx.reply(`${type === "add" ? "Добавляем":"Удаляем"} категорию...`)

            let check = false;

            if (type === "add") {
                const categoryAddInfo = await this.categoriesService.addToWatching(msg, User.id)

                if (categoryAddInfo) check = true 
            }
            else if (type === "delete") {
                const categoryRemoveInfo = await this.categoriesService.removeFromWatch(msg, User.id)

                if (categoryRemoveInfo) check = true
            }
            else {
                await ctx.reply("Произошла ошибка: неверный тип взаимодействия")
                return;
            }

            if (check) {
                await ctx.reply(`Категория успешно ${type === "add" ? "добавлена к отслеживаемым.":"удалена из отслеживаемых."}`)
                return;
            }
            else {
                await ctx.reply(`Произошла ошибка при ${type === "add" ? "добавлении":"удалении"} категории. Убедитесь, что такая категория существует.`)
                return;
            }
        }
        else {
            return 'Неизвестная команда'
        }
    }
}