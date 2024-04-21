import { DiscordFactory, IntentsUtil } from 'discordoo'
import satori from 'satori'
import { Image } from './image'
import { Transformer } from '@napi-rs/image'
import fs from 'fs'
import { promisify } from 'util'
import dotenv from 'dotenv'
import * as os from 'os'
import { Resvg, ResvgRenderOptions } from '@resvg/resvg-js'
dotenv.config()

const readFileAsync = promisify(fs.readFile)

const TOKEN = process.env.TOKEN as string

const app = DiscordFactory.create(TOKEN, {
    gateway: {
        intents: IntentsUtil.ALL
    }
})

app.on('messageCreate', async context => {
    const { message } = context

    if (message.content === 'mia!ping') {
        return message.reply(`Pong@${os.hostname()}! ${app.gateway.ping}ms`)
    }

    if (message.content === 'mia!profile') {
        const author = await message.author()

        if (!author) return

        const before = Date.now()
        const component = Image(
            author.avatarUrl({ size: 256 }) ?? author.defaultAvatarUrl(),
            author.username
        )
        const afterReact = Date.now()

        const onestFont = await readFileAsync('Onest-Regular.ttf')

        const svg = await satori(component, {
            width: 1200,
            height: 800,
            fonts: [
                {
                    name: 'Onest',
                    data: onestFont,
                    weight: 400,
                    style: 'normal'
                },
            ],
        })

        const opts: ResvgRenderOptions = {
            background: 'rgba(238, 235, 230, .9)',
            fitTo: {
                mode: 'width',
                value: 1200,
            },
            font: {
                fontFiles: ['Onest-Regular.ttf'],
                loadSystemFonts: false,
            },
        }

        const resvg = new Resvg(svg, opts)
        const pngData = resvg.render()
        const pngBuffer = pngData.asPng()

        const after = Date.now()
        return message.reply(`Твой профиль@${os.hostname()}! (render: ${after-before}ms) (react: ${afterReact-before}ms)`,{
            files: [
                {
                    name: 'profile.png',
                    file: pngBuffer
                }
            ]
        })
    }
})

app.start()
    .then(() => console.log('Bot started'))
