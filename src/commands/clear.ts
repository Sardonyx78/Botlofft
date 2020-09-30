import Command from '../constants/Command';
import { Message, MessageAttachment, MessageEmbed, TextChannel, User } from 'discord.js';
import client from '..';

export class Clear implements Command {
     info: { args: { title: string; optional: boolean; type: "number" | "mention" | 'string'; }[]; cmd: string; perms: import("../constants/Perms").default[]; roles: string[]; desc: string; };

     constructor() {
          this.info = {
               args: [{
                    title: "hedef",
                    optional: false,
                    type: "string"
               }],
               cmd: "clear",
               perms: [],
               roles: ['760221558190506004'],
               desc: "Yazıları temizler."
          }
     }

     async exec(message: import("discord.js").Message, args: string[]): Promise<any> {
          let user: User;

          if (args[1]) {
               user = message.mentions.users.first() || client.users.cache.get(args[1])
          } else if (!args[1]) {
               user = message.author
          }

          if (!user) {
               const wanted = parseInt(args[1])

               if (isNaN(wanted)) return message.channel.send("\\❌ Geçersiz sayı.");

               if (message.channel.messages.cache.size < wanted) await message.channel.messages.fetch({ limit: wanted }, true)

               const messages = message.channel.messages.cache.last(wanted)

               const attachment = messages.map(m => ({ author_id: m.author.id, avatar_hash: m.author.avatar, hexcolor: m.member.displayHexColor.substr(1), timestamp: m.createdTimestamp, author_nickname: m.member.nickname || m.author.username, content: m.content }))

               const msg = await client.channels.cache.get<TextChannel>("754893341551755305").send(new MessageAttachment(Buffer.from(JSON.stringify(attachment)), 'bulkmsg.json'));

               client.channels.cache.get<TextChannel>("754876773342380113").send(new MessageEmbed().setColor(0xe74c3c).setDescription("Çoklu Mesaj Silme").setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true })).addField("Boyut", messages.length).addField("Mesajlar", `[[[Mesajlara Git]]](https://sardonyx.me/discord-bulk-message-viewer?channel=754893341551755305&attachment=${msg.attachments.first().id}&name=bulkmsg.json)`))

               const splittedArrays: Message[][] = [];

               let i, j, chunk = 100;
               for (i = 0, j = messages.length; i < j; i += chunk) {
                    splittedArrays.push(messages.slice(i, i + chunk))
               }

               splittedArrays.forEach(async x => {
                    await (message.channel as TextChannel).bulkDelete(x)
               })

               message.channel.send(
                    new MessageEmbed()
                         .setDescription(args[1] + " mesaj silindi.")
                         .setColor(0xa37985)
               );

               (<TextChannel>message.channel).bulkDelete(message.channel.messages.cache.last(i))
          } else {
               if (message.channel.messages.cache.filter(x => x.author.id === user.id).size === 0) await message.channel.messages.fetch({ limit: 100 }, true)

               const messages = message.channel.messages.cache.filter(x => x.author.id === user.id).last(100)

               const attachment = messages.map(m => ({ author_id: m.author.id, avatar_hash: m.author.avatar, hexcolor: m.member.displayHexColor.substr(1), timestamp: m.createdTimestamp, author_nickname: m.member.nickname || m.author.username, content: m.content }))

               const msg = await client.channels.cache.get<TextChannel>("754893341551755305").send(new MessageAttachment(Buffer.from(JSON.stringify(attachment)), 'bulkmsg.json'));

               client.channels.cache.get<TextChannel>("754876773342380113").send(new MessageEmbed().setDescription("Çoklu Mesaj Silme").setColor(0xe74c3c).setAuthor(`${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({ dynamic: true })).addField("Boyut", messages.length).addField("Mesajlar", `[[[Mesajlara Git]]](https://sardonyx.me/discord-bulk-message-viewer?channel=754893341551755305&attachment=${msg.attachments.first().id}&name=bulkmsg.json)`));

               (<TextChannel>message.channel).bulkDelete(messages);

               message.channel.send(
                    new MessageEmbed()
                         .setDescription(user.toString() + "'un mesajları silindi.")
                         .setColor(0xa37985)
               );
          }
     };
}

client.commands.set("clear", new Clear())