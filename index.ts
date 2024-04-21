import { DiscordFactory, IntentsUtil } from 'discordoo'
import satori from 'satori'
import { Image } from './image'
import { Transformer } from '@napi-rs/image'
import fs from 'fs'
import { promisify } from 'util'

const readFileAsync = promisify(fs.readFile)

const TOKEN: string = 'AAAAA'

const app = DiscordFactory.create(TOKEN, {
    gateway: {
        intents: IntentsUtil.ALL
    }
})

app.on('messageCreate', async context => {
    const { message } = context

    if (message.content === 'mia!ping') {
        return message.reply('Pong!')
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
            width: 3200,
            height: 1600,
            fonts: [
                {
                    name: 'Onest',
                    data: onestFont,
                    weight: 400,
                    style: 'normal'
                },
            ],
        })

        const transformer = Transformer.fromSvg(svg)
        const image = await transformer.png()

        const after = Date.now()
        return message.reply(`Твой профиль! (render: ${after-before}ms) (react: ${afterReact-before}ms)`,{
            files: [
                {
                name: 'profile.png',
                file: image
                }
            ]
        })
    }
})

app.start()
    .then(() => console.log('Bot started'))
