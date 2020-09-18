import Command from '../constants/Command';
import Perms from '../constants/Perms';
import { MessageEmbed } from 'discord.js';
import client from '..';

export class Ping implements Command {
    info: { args: { title: string; optional: boolean; type: "number" | "mention" | 'string'; }[]; cmd: string; perms: import("../constants/Perms").default[]; roles: string[]; desc: string; };

    constructor(){
        this.info = {
            args: [],
            cmd: "ping",
            perms: [Perms.SEND_MESSAGES],
            roles: ['574331102383046669'],
            desc: "Bot'un bağlantı gecikmelerini listeler."
        }
    }

    async exec (message: import("discord.js").Message): Promise<any> {

        const apiTime = Date.now()

        const m = await message.channel.send('**Pong**')

        m.edit('**Pong!**', new MessageEmbed().setDescription(`⏰ WebSocket pingi: ${client.ws.ping}ms\n\n⌚ API pingi: ${m.createdTimestamp - apiTime}ms\n\n🕰 Komutu işleme süresi: ${Date.now() - apiTime}ms`).setColor('RED'))
    };
}

client.commands.set("ping", new Ping())