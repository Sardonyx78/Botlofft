import Command from '../constants/Command';
import Perms from '../constants/Perms';
import { Profile, Game } from '../constants/Items';
import { MessageEmbed, Message, User, MessageReaction, Collection, GuildMember } from 'discord.js';
import client, { MyClient } from ".."

const random = (min: number, max: number) => Math.floor(Math.random() * max) + min;

const emojis = [
    "758566023380336640",
    "758566023678132254",
    "758566023598833703",
    "758566023824801843",
    "758566024034779176",
    "758566023963344906"
]

export = class Fight implements Command {
    info: { args: { title: string; optional: boolean; type: "number" | "mention" | 'string'; }[]; cmd: string; perms: import("../constants/Perms").default[]; roles: string[]; desc: string; };

    constructor(){
        this.info = {
            args: [{title: 'Rakip', optional:false, type: 'mention'}],
            cmd: "fight",
            perms: [Perms.SEND_MESSAGES],
            roles: [],
            desc: "Belirlenen rakibe savaş açar. Büyüler ve açıklamaları: \nEpiskey: 20HP iyileştirir.\nDwisp: Rakibin canını 20HP azaltır.\nExpelliarmus: Rakibin bir sonraki hamlesi daha az vurdurtur.\nHeal: 10HP iyileştirir. %30 Şansla 30 HP iyileştirir.\nProtego: Rakibin bi sonraki hamlesini engeller."
        }
    }


    async exec(message: Message, args: string[]) {
        if (!message.mentions.members.first()) return message.channel.send("\\❌ Birini belirtmen lazım.")

        const member = message.mentions.members.first()
        const msg = await message.channel.send(`${member} savaş isteğini kabul ediyor musun?`)
        await msg.react('✅')
        await msg.react('724598686268653659')

        msg.awaitReactions((r: MessageReaction, u: User) => (r.emoji.id === '724598686268653659' || r.emoji.name === "✅") && u === member.user, { max: 1, time: 30000, errors: ['time']}).then(x => {
            msg.reactions.removeAll()
            if (x.first().emoji.name === "✅") this.start(message, msg, args, member)
            else msg.edit('Kabul etmediği için başlatılamadı.')
        }).catch(() => {
            msg.edit('Kabul etmediği için başlatılamadı.')
            msg.reactions.removeAll()
        })
    }

    async start (message: import("discord.js").Message, msg: Message, args: string[], member: GuildMember): Promise<any> {
        const p1 = new Profile(message.author)
        const p2 = new Profile(member.user)

        const game = new Game(p1, p2)

        const embed = new MessageEmbed().setTitle(`${message.author.username} vs ${member.user.username}`)
        .setDescription(`${message.author} ${game.player1.hp} HP \n${member.user} ${game.player2.hp}HP`)
        .addField('Büyüler', game.player1.spells.join(" | "))

        msg.edit(message.author.toString(), embed)

        await msg.react('758566023380336640')
        await msg.react('758566023678132254')
        await msg.react('758566023598833703')
        await msg.react('758566023824801843')
        await msg.react('758566024034779176')

        this.hamle(msg, message, args, embed, game, member)
    };

    hamle(msg: Message, message: Message, args: string[], embed: MessageEmbed, game: Game, member: GuildMember, turnAtFirst: boolean = true) {
            const filter = (r: MessageReaction, user: User) => user === (turnAtFirst ? message.author : member.user) && emojis.includes(r.emoji.id)
            embed.setImage(null)

            msg.awaitReactions(filter, { max:1, errors:['time'], time: 30000 }).catch(() => {
                msg.edit(`${turnAtFirst ? message.author : member.user} 30 saniye içinde cevap vermediği için oyun sona erdi. ${turnAtFirst ? member.user : message.author} Kazandı`)
                msg.reactions.removeAll()
                //@ts-ignore
            }).then((reactions: Collection<string, MessageReaction>) => {
                if (!(reactions instanceof Collection)) return
                const reaction = reactions.first()

                let subject: any = {}

                const player = (turnAtFirst ? game.player1 : game.player2)

                const oldState = {1: game.player1.hp, 2: game.player2.hp  }

                switch (reaction.emoji.id){
                    case "758566023380336640":
                        (turnAtFirst ? game.player1 : game.player2).spell1()
                        subject = { player, color: 'GREEN', text: `Episkey kullandı, ${(turnAtFirst ? game.player1.hp : game.player2.hp) - oldState[turnAtFirst ? 1 : 2]}HP iyileşti.` }
                        break
                    case "758566023678132254":
                        (turnAtFirst ? game.player1 : game.player2).spell2()
                        subject = { player, color: 'RED', text: `Dwisp kullandı, ${oldState[turnAtFirst ? 2 : 1] - (turnAtFirst ? game.player2.hp : game.player1.hp)}HP vurdu.` }
                        break
                    case "758566023598833703":
                        (turnAtFirst ? game.player1 : game.player2).spell3()
                        subject = { player, color: 'RED', text: 'Expelliarmus kullandı, rakibinin hasarını azalttı' }
                        break
                    case "758566023824801843":
                        (turnAtFirst ? game.player1 : game.player2).spell4()
                        subject = { player, color: 'GREEN', text: `Heal kullandı, ${(turnAtFirst ? game.player1.hp : game.player2.hp) - oldState[turnAtFirst ? 1 : 2] !== 30 ? '10HP iyileşti.': 'Şanslı Günü! 30HP iyileşti.'}` }
                        break
                    case "758566024034779176":
                        (turnAtFirst ? game.player1 : game.player2).spell5()
                        subject = { player, color: 'BLUE', text: `Protego kullandı, rakibinin hasarını engelleyebilir.` }
                        break
                    case "758566023963344906":
                        if (random(0, 100) < 8) {
                            (turnAtFirst ? game.player2 : game.player1).damage(100)
                            subject = { player, color: 'BLURPLE', text: `Avada Kedavra Bebeğim`}
                            embed.setImage('https://i.gifer.com/M8YI.gif')
                        }else {
                            subject = { player, color: 'BLURPLE', text: `bu laneti uygulayacak kadar kudretli değildi, büyü uygulanamadı.`}
                        }
                        break
                }

                msg.edit(!turnAtFirst ? message.author : member.user , embed.setTitle((turnAtFirst ? message.member.nickname || message.author.username : member.nickname || member.user.username ) + ' ' +subject.text).setColor(subject.color)
                .setDescription(`${message.author} ${game.player1.hp}HP \n${member.user} ${game.player2.hp}HP`))

                reactions.forEach(x => {
                    x.users.remove(message.author)
                    x.users.remove(member.user)
                })

                if (game.player1.hp === 0 || game.player2.hp === 0){
                    msg.reactions.removeAll()
                    return msg.edit(`${game.player1.hp === 0 ? message.author : member.user} Kaybetti :/`, embed)
                }else {
                    this.hamle(msg, message, args,embed, game, member, !turnAtFirst)
                }
            })
    }
}