import Command from '../constants/Command';
import Perms from '../constants/Perms';
import query, { players } from "source-server-query";
import client from '..';
import { MessageEmbed } from 'discord.js';

const server = {
     ip: "78.46.21.247",
     port: 27015
}

export class Server implements Command {
     info: { args: { title: string; optional: boolean; type: "number" | "mention" | 'string'; }[]; cmd: string; perms: import("../constants/Perms").default[]; roles: string[]; desc: string; };


     constructor() {
          this.info = {
               args: [],
               cmd: "server",
               perms: [Perms.SEND_MESSAGES],
               roles: ['574331102383046669'],
               desc: "Sunucunun durumunu gösterir"
          }
     }

     async exec(message: import("discord.js").Message): Promise<any> {
          
          const serverInfo = await query.info(server.ip, server.port, 2000).catch(() => null)

          if (serverInfo === null) {
               message.channel.send(new MessageEmbed().setAuthor("Karma Hogwarts RolePlay", client.guild.iconURL({ dynamic: true })).setColor(0x808080)
               .setURL(`https://steam.sardonyx.studio/${server.ip}/${server.port}`)
               .setTitle(">> Bağlanmak İçin Tıkla <<")
               .addField(`\\🌐 | IP`, `${server.ip}:${server.port}`, true)
               .addField("\\👥 | Oyuncu Sayısı" ,`0/0`, true)
               .addField("­", "­", true)
               .addField(`\\🗺️ | Map`, "Yok", true)
               .addField("\\🎮 | Durum", "\\😴 Sunucu Offline", true)
               .addField("­", "­", true))
          } else {
               message.channel.send(new MessageEmbed().setAuthor("Karma Hogwarts RolePlay", client.guild.iconURL({ dynamic: true }))
               .setURL(`https://steam.sardonyx.studio/${server.ip}/${server.port}`)
               .setTitle(">> Bağlanmak İçin Tıkla <<")
               .addField(`\\🌐 | IP`, `${server.ip}:${server.port}`, true)
               .addField("\\👥 | Oyuncu Sayısı" ,`${serverInfo.playersnum}/${serverInfo.maxplayers}`, true)
               .addField("­", "­", true)
               .addField(`\\🗺️ | Map`, serverInfo.map, true)
               .addField("\\🎮 | Durum", !!serverInfo.visibility ? "\\🔐 Sunucu şifreli" : "<:PepeOK:754320776102150225> Sunucu açık", true)
               .addField("­", "­", true)
               .setColor("GREEN"))
          }
     };
}

client.commands.set("server", new Server())