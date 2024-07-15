import { JwtUser } from "../auth/interfaces";
import { Markup } from "telegraf";

export const menu = Markup.button.callback("Главное меню", "menu")

export function buttons(user?: JwtUser) {
    const buttons = []

    user ? null : buttons.push(Markup.button.callback("Авторизация", "auth"))
    user ? buttons.push(Markup.button.callback("Профиль", "profile")) : null 
    user ? buttons.push(Markup.button.callback("Выйти из аккаунта", "logout")) : null
    user ? buttons.push(Markup.button.callback("Уведомления", "alerts")) : null

    return Markup.inlineKeyboard(
        buttons,
        {
            columns: 1
        }
    )
}

export function profileButtons() {
    return Markup.inlineKeyboard(
        [
            Markup.button.callback("Безопасность", "security"),
            menu
        ],
        {
            columns: 1
        }
    )
}

export function securityButtons() {
    return Markup.inlineKeyboard(
        [
            Markup.button.callback("Двухфакторная авторизация", "twoFactorAuth"),
            menu
        ],
        {
            columns: 1
        }
    )
}