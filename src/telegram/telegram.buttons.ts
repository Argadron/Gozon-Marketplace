import { JwtUser } from "../auth/interfaces";
import { Markup } from "telegraf";

export function buttons(user?: JwtUser) {
    const buttons = []

    user ? null : buttons.push(Markup.button.callback("Авторизация", "auth"))
    user ? buttons.push(Markup.button.callback("Профиль", "profile")) : null 
    user ? buttons.push(Markup.button.callback("Выйти из аккаунта", "logout")) : null

    return Markup.inlineKeyboard(
        buttons,
        {
            columns: 1
        }
    )
}