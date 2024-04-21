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

        const component = Image(
            author.avatarUrl({ size: 128 }) ?? author.defaultAvatarUrl(),
            author.username
        )

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

        return message.reply('Твой профиль:',{
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
