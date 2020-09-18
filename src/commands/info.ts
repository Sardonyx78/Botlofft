import Command from '../constants/Command';
import Perms from '../constants/Perms';
import { GuildMember, MessageEmbed } from 'discord.js';
import client from '..';

export class Info implements Command {
     info: { args: { title: string; optional: boolean; type: "number" | "mention" | 'string'; }[]; cmd: string; perms: import("../constants/Perms").default[]; roles: string[]; desc: string; };

     constructor() {
          this.info = {
               args: [{
                    title: "Kişi",
                    optional: true,
                    type: "mention"
               }],
               cmd: "info",
               perms: [Perms.SEND_MESSAGES],
               roles: ['574331102383046669'],
               desc: "Kişi hakkındaki bilgileri gösterir."
          }
     }

     async exec(message: import("discord.js").Message, args: string[]): Promise<any> {
          let user;

          if (args[1]) {
               user = message.mentions.users.first() || client.users.cache.get(args[1])
          } else if (!args[1]) {
               user = message.author
          }

          if (!user) return message.channel.send("\\❌ Kullanıcı bulunamadı.")

          const modLog = await client.database.moderation.findOne({ discord_id: user.id }) || { kicks: 0, bans: 0, warns: 0, mutes: 0 }

          message.channel.send(new MessageEmbed().setColor(0xffcc00).setAuthor(`${user.tag} (${user.id})`, user.avatarURL({ dynamic: true })).setFooter(`Warn: ${modLog.warns} • Mute: ${modLog.mutes} • Kick: ${modLog.kicks} • Ban: ${modLog.bans}`))


     };
}

client.commands.set("info", new Info())