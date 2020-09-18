import DiscordEvent from "../../constants/DiscordEvent"
import EventHandler, { EVENT } from "../../EventHandler"
import { Message, MessageEmbed, TextChannel } from "discord.js"
import { checkPermission } from '../../constants/Util'
import https from "https"
import client from '../..'


export class MessageEvent implements DiscordEvent {

     static event = EVENT.message

     async handle(message: Message) {
          if (message.author.bot) return

          if (message.channel.type !== "dm") {

               if (message.attachments.size !== 0) {
                    if (!message.attachments.first().height) return;

                    https.get(message.attachments.first().url, res => {
                         Object.assign(client.cache, { [message.id]: { name: message.attachments.first().url.split("/")[6], img: res } })
                    })
               }

               
               const args = message.content.split(" ")

               if (message.channel.id === "754330083019325480") {

                    const user = client.users.cache.get(args[0])

                    if (!user) return message.react(client.emojis.cache.get("754397390005469216"))

                    return user.send(new MessageEmbed().setColor("BLUE").setDescription(args.slice(1).join(" ")).setAuthor("Karma Communityden bir mesajınız var!", message.guild.iconURL({ dynamic: true }))).then(() => message.react("✅")).catch(() => message.channel.send("\\❌ Bu kişiye mesaj gönderilemedi!"))
               }

               if (!message.content.startsWith('!')) return

               if (client.commands.has(args[0].substr(1))) {

                    const command = client.commands.get(args[0].substr(1))

                    if (!checkPermission(command, message.member)) return

                    if (command.info.args.filter(x => !x.optional).length + 1 > args.length) return message.channel.send(new MessageEmbed().setTitle('Yanlış Kullanım!')
                         .setDescription(`\`\`\`\n!${command.info.cmd} ${command.info.args.map((x: any) => `${x.optional ? '?' : ''}${x.title}`).join(" ")}\`\`\``).setColor('RED'))

                    if (!args) return message.channel.send(new MessageEmbed().setTitle('Yanlış Kullanım!')
                         .setDescription(`\`\`\`\n!${command.info.cmd} ${command.info.args.map((x: any) => `${x.optional ? '?' : ''}${x.title}`).join(" ")}\`\`\``).setColor('RED'))

                    command.exec(message, args)
               }
          } else {
               if (!client.guild.member(message.author).roles.cache.has("622344228760059946")) return
               message.channel.send("\✅ Iletiniz adminlere ulaşmıştır")
               client.guild.channels.cache.get<TextChannel>("754330083019325480").send(new MessageEmbed().setColor(0x2f3136).setDescription(message.content).setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true })))
          }
     }
}

EventHandler.register(MessageEvent)