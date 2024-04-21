import { DiscordFactory, IntentsUtil } from 'discordoo'
import satori from 'satori'
import { Image } from './image'
import fs from 'fs'
import { promisify } from 'util'
import dotenv from 'dotenv'
import * as os from 'os'
import { Resvg, ResvgRenderOptions } from '@resvg/resvg-js'
import { MaxResPreset, UltraResPreset, LowResPreset, MediumResPreset, HighResPreset } from './preset.config'

dotenv.config()

const readFileAsync = promisify(fs.readFile)

const TOKEN = process.env.TOKEN as string
const RUNTIME = typeof Bun !== 'undefined' ? 'bun' : 'node'
let RESOLUTION_PRESET = new MaxResPreset()

const setResolutionPreset = (preset: string) => {
    switch (preset) {
        case 'low':
            RESOLUTION_PRESET = new LowResPreset()
            break
        case 'medium':
            RESOLUTION_PRESET = new MediumResPreset()
            break
        case 'high':
            RESOLUTION_PRESET = new HighResPreset()
            break
        case 'ultra':
            RESOLUTION_PRESET = new UltraResPreset()
            break
        case 'max':
        default:
            RESOLUTION_PRESET = new MaxResPreset()
            break
    }
}

const resetResolutionPreset = () => {
    RESOLUTION_PRESET = new MaxResPreset()
}

const app = DiscordFactory.create(TOKEN, {
    gateway: {
        intents: IntentsUtil.ALL
    }
})

app.on('messageCreate', async context => {
    const { message } = context

    if (message.content.startsWith('mia!ping') || message.content.startsWith(`mia-${RUNTIME}!ping`)) {
        return message.reply(`Pong ${os.hostname()}@${RUNTIME}! ${app.gateway.ping}ms`)
    }

    if (message.content.startsWith('mia!memory') || message.content.startsWith(`mia-${RUNTIME}!memory`)) {
        return message.reply(`Heap usage: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`)
    }

    if (message.content.startsWith('mia!profile') || message.content.startsWith(`mia-${RUNTIME}!profile`)) {
        const contentWithoutFlags = message.content.replace(/(-p=\w+)/g, (match) => {
            setResolutionPreset(match.split('=')[1])
            return ''
        })

        const args = contentWithoutFlags.split(/ +/g)

        let requestedUser = args[1].trim() || message.authorId
        if (requestedUser.includes('<')) requestedUser = requestedUser.replace(/[<>@]/g, '')

        let user = await app.users.cache.get(requestedUser)
        if (!user) user = await app.users.fetch(requestedUser)
        if (!user) return message.reply('Юзер не найден!')

        const before = Date.now()
        const component = Image(
            user.avatarUrl({ size: 512 }) ?? user.defaultAvatarUrl(),
            user.globalName ?? user.username,
            RESOLUTION_PRESET.font,
        )
        const afterReact = Date.now()

        const onestFont = await readFileAsync('Onest-Regular.ttf')
        const sawaFont = await readFileAsync('SawarabiGothic-Regular.ttf')

        const svg = await satori(component, {
            ...RESOLUTION_PRESET.satori,
            fonts: [
                {
                    name: 'Onest',
                    data: onestFont,
                    weight: 400,
                    style: 'normal'
                },
                {
                    name: 'SawarabiGothic-Regular.ttf',
                    data: sawaFont,
                    weight: 400,
                    style: 'normal'
                },
            ],
        })

        const opts: ResvgRenderOptions = {
            background: 'rgba(238, 235, 230, .9)',
            fitTo: {
                mode: 'width',
                ...RESOLUTION_PRESET.svg2png
            },
            font: {
                fontFiles: ['Onest-Regular.ttf', 'SawarabiGothic-Regular.ttf'],
                loadSystemFonts: false,
            },
        }

        const resvg = new Resvg(svg, opts)
        const pngData = resvg.render()
        const pngBuffer = pngData.asPng()

        const after = Date.now()

        await message.reply(
            `Картинка профиля от ${os.hostname()}@${RUNTIME}! `
            + `(preset: ${RESOLUTION_PRESET.name}) (render: ${after-before}ms) (react: ${afterReact-before}ms)`,
            {
                files: [
                    {
                        name: 'profile.png',
                        file: pngBuffer
                    }
                ]
            })

        resetResolutionPreset()
        return
    }
})

app.start()
    .then(() => console.log('Bot started'))
