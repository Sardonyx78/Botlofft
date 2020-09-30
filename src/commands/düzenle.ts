import Command from '../constants/Command';
import Perms from '../constants/Perms';
import { GuildMember, MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js';
import client from '..';
import { redisGet, redisIncr, redisSet } from '../constants/Util';

export class Düzenle implements Command {
     info: { args: { title: string; optional: boolean; type: "number" | "mention" | 'string'; }[]; cmd: string; perms: import("../constants/Perms").default[]; roles: string[]; desc: string; };

     constructor() {
          this.info = {
               args: [{
                    title: "Vaka ID",
                    optional: false,
                    type: "number"
               },
               {
                    title: "Sebep",
                    optional: false,
                    type: "string"
               }],
               cmd: "ban",
               perms: [],
               roles: ['760221558190506004'],
               desc: "Kişiyi banlar."
          }
     }

     async exec(message: import("discord.js").Message, args: string[]): Promise<any> {
          const vaka = await redisGet(args[1])

          if (!vaka) return message.channel.send("\\❌ Geçersiz vaka idsi.")

          const msg = await client.channels.cache.get<TextChannel>("754335732482572288").messages.fetch(vaka).catch(() => message.channel.send("\\❌ Geçersiz vaka idsi"))

          if (!msg) return

          const i = msg.embeds[0].fields.findIndex(x => x.name === "Sebep")

          message.channel.send(new MessageEmbed().setColor(0x3ed878).setDescription(`**Vaka ${args[1]}** düzenlendi`).addField("Eski", msg.embeds[0].fields[i].value).addField('Yeni', `\`\`\`\n${args.slice(2).join(" ")}\n\`\`\``))

          msg.embeds[0].fields[i] = { name: 'Sebep', value: `\`\`\`\n${args.slice(2).join(" ")}\n\`\`\``, inline: true }

          await msg.edit({ embed: msg.embeds[0] })
     };
}

client.commands.set("düzenle", new Düzenle())