import Command from '../constants/Command';
import Perms from '../constants/Perms';
import { GuildMember, MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js';
import client from '..';
import { redisGet, redisIncr, redisSet } from '../constants/Util';

export class Warn implements Command {
     info: { args: { title: string; optional: boolean; type: "number" | "mention" | 'string'; }[]; cmd: string; perms: import("../constants/Perms").default[]; roles: string[]; desc: string; };

     constructor() {
          this.info = {
               args: [{
                    title: "Kişi",
                    optional: false,
                    type: "mention"
               },
               {
                    title: "Sebep",
                    optional: false,
                    type: "string"
               }],
               cmd: "warn",
               perms: [],
               roles: ['754324701731487764'],
               desc: "Kişiyi uyarır."
          }
     }

     async exec(message: import("discord.js").Message, args: string[]): Promise<any> {

          let user: User;

          if (args[1]) {
               user = message.mentions.users.first() || client.users.cache.get(args[1])
          } else if (!args[1]) {
               user = message.author
          }

          if (!user) return message.channel.send("\\❌ Kullanıcı bulunamadı.")

          const logRoom = client.channels.cache.get<TextChannel>("754335732482572288")

          const modLog = await client.database.moderation.findOne({ discord_id: user.id }) || { kicks: 0, bans: 0, warns: 0, mutes: 0, discord_id: user.id }

          message.channel.send(new MessageEmbed().setDescription("Warnlamak istediğinize emin misiniz?\n```\n" + args.slice(2).join(" ") + "\n```").setColor(0xff8300).setAuthor(`${user.tag} (${user.id})`, user.avatarURL({ dynamic: true })).setFooter(`Warn: ${modLog.warns} • Mute: ${modLog.mutes} • Kick: ${modLog.kicks} • Ban: ${modLog.bans}`)).then(async x => {
               await x.react("✅")
               await x.react("754821689262735403")

               x.awaitReactions((reaction: MessageReaction, user: User) => user === message.author && ["white_cross", "✅"].includes(reaction.emoji.name), { max: 1, time: 15000, errors: ["time"] }).then(async y => {
                    const accepted = y.first().emoji.id !== "754821689262735403"

                    if (accepted) {

                         x.reactions.removeAll()

                         x.edit(new MessageEmbed().setTitle("Warn!").setDescription("\n```\n" + args.slice(2).join(" ") + "\n```").setColor(0xff8300).setAuthor(`${user.tag} (${user.id})`, user.avatarURL({ dynamic: true })).setFooter(`Warn: ${modLog.warns + 1} • Mute: ${modLog.mutes} • Kick: ${modLog.kicks} • Ban: ${modLog.bans}`))

                         logRoom.send({ embed: new MessageEmbed().setColor(0xff8300).addFields([{ name: 'Vaka', value: `**#${await redisIncr("last_case")}**`, inline: true }, { name: 'Yetkili', value: `${message.author}`, inline: true }, { name: 'Aksiyon', value: 'Warn', inline: true }, { name: 'Sebep', value: `\`\`\`\n${args.slice(2).join(" ")}\n\`\`\``, inline: true }]).setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL({ dynamic: true })) }).then(async v => redisSet(await redisGet("last_case"), v.id))

                         user.send(`Karma Communityden **${args.slice(2).join(" ")}** sebebiyle warn yediniz.`).catch(() => { })

                         if (modLog.kicks === 0 && modLog.bans === 0 && modLog.mutes === 0 && modLog.warns === 0){
                              await client.database.moderation.create({ kicks: 0, bans: 0, warns: 1, mutes: 0, discord_id: user.id })
                         } else {
                              ++modLog.warns
                              await client.database.moderation.findOneAndUpdate({ discord_id: user.id }, modLog)
                         }
                    } else {
                         x.edit(new MessageEmbed({ description: "\❌ İşlem iptal edildi.", color: 0xe74c3c }))
                         x.reactions.removeAll()
                    }
               }).catch(err => {
                    console.error(err)
                    x.edit(new MessageEmbed({ description: "\❌ İşlem iptal edildi.", color: 0xe74c3c }))
                    x.reactions.removeAll()
               })
          })
     };
}

client.commands.set("warn", new Warn())