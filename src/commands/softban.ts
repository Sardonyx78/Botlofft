import Command from '../constants/Command';
import Perms from '../constants/Perms';
import { GuildMember, MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js';
import client from '..';
import { redisGet, redisIncr, redisSet } from '../constants/Util';

export class SoftBan implements Command {
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
               cmd: "softban",
               perms: [],
               roles: ['760221558190506004'],
               desc: "Kişiyi softbanlar."
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

          if (user.bot) return message.channel.send("\\❌ Kullanıcı bot.")
          if (client.guild.member(user).roles.cache.has("760221558190506004")) return message.channel.send("\\❌ Kullanıcı bir yetkili.")

          const logRoom = client.channels.cache.get<TextChannel>("754335732482572288")

          const modLog = await client.database.moderation.findOne({ discord_id: user.id }) || { kicks: 0, bans: 0, warns: 0, mutes: 0, discord_id: user.id }

          message.channel.send(new MessageEmbed().setDescription("Softbanlamak istediğinize emin misiniz?\n```\n" + args.slice(2).join(" ") + "\n```").setColor(0xef984b).setAuthor(`${user.tag} (${user.id})`, user.avatarURL({ dynamic: true })).setFooter(`Warn: ${modLog.warns} • Mute: ${modLog.mutes} • Kick: ${modLog.kicks} • Ban: ${modLog.bans}`)).then(async x => {
               await x.react("✅")
               await x.react("754821689262735403")

               x.awaitReactions((reaction: MessageReaction, user: User) => user === message.author && ["white_cross", "✅"].includes(reaction.emoji.name), { max: 1, time: 15000, errors: ["time"] }).then(async y => {
                    const accepted = y.first().emoji.id !== "754821689262735403"

                    if (accepted) {

                         x.reactions.removeAll()

                         x.edit(new MessageEmbed().setTitle("Softban!").setDescription("\n```\n" + args.slice(2).join(" ") + "\n```").setColor(0xef984b).setAuthor(`${user.tag} (${user.id})`, user.avatarURL({ dynamic: true })).setFooter(`Warn: ${modLog.warns} • Mute: ${modLog.mutes} • Kick: ${modLog.kicks} • Ban: ${modLog.bans + 1}`))

                         logRoom.send({ embed: new MessageEmbed().setColor(0xef984b).addFields([{ name: 'Vaka', value: `**#${await redisIncr("last_case")}**`, inline: true }, { name: 'Yetkili', value: `${message.author}`, inline: true }, { name: 'Aksiyon', value: 'Softban', inline: true }, { name: 'Sebep', value: `\`\`\`\n${args.slice(2).join(" ")}\n\`\`\``, inline: true }]).setAuthor(`${user.tag} (${user.id})`, user.displayAvatarURL({ dynamic: true })) }).then(async v => redisSet(await redisGet("last_case"), v.id))

                         await user.send(`Karma Communityden **${args.slice(2).join(" ")}** sebebiyle softbanlandınız. Geri girebilirsiniz`).catch(() => { })

                         await client.guild.members.ban(user, { days: 7 })
                         await client.guild.members.unban(user, "Softban")

                         if (modLog.kicks === 0 && modLog.bans === 0 && modLog.mutes === 0 && modLog.warns === 0){
                              await client.database.moderation.create({ kicks: 0, bans: 1, warns: 0, mutes: 0, discord_id: user.id })
                         } else {
                              ++modLog.bans
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

client.commands.set("softban", new SoftBan())