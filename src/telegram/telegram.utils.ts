import * as fs from 'fs'
import * as path from 'path'
import { Sessions, SessionWriteData } from './interfaces'

const sessionPath = path.join(process.cwd(), `sessions.json`)

export async function init() {
    if (!fs.existsSync(sessionPath)) await fs.promises.writeFile(sessionPath, JSON.stringify({ sessions: [] }))
    else {
        await sessionsCleaner()
    }
}

export async function reader() {
    return JSON.parse(await fs.promises.readFile(sessionPath, { encoding: `utf-8` })) as Sessions
}

export async function writer(data: any) {
    return await fs.promises.writeFile(sessionPath, JSON.stringify(data))
}

export async function writeData(data: SessionWriteData) {
    const sessions = await reader()

    const needSession = sessions.sessions.find(elem => elem.telegramId === data.telegramId)

    if (!needSession) {
        sessions.sessions.push({
            telegramId: data.telegramId,
            data: data.data
        })
    }
    else {
        const index = sessions.sessions.indexOf(needSession)

        sessions.sessions[index].data = data.data
    }

    return await writer(sessions)
}

export async function getData(telegramId: number) {
    const sessions = await reader()
    return sessions.sessions.find(elem => elem.telegramId === telegramId)
}

export async function terminateSession(telegramId: number) {
    const sessions = await reader()

    const index = sessions.sessions.indexOf(sessions.sessions.find(elem => elem.telegramId === telegramId))

    sessions.sessions.splice(index)

    return await writer(sessions)
}

export async function sessionsCleaner() {
    return await fs.promises.writeFile(sessionPath, JSON.stringify({ sessions: [] }))
}