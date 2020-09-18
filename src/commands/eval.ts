import Command from '../constants/Command';
import Perms from '../constants/Perms';
import { MessageEmbed } from 'discord.js';
import __client from ".."

const client = __client

export class Eval implements Command {
    info: { args: { title: string; optional: boolean; type: "number" | "mention" | 'string'; }[]; cmd: string; perms: import("../constants/Perms").default[]; roles: string[]; desc: string; };

    constructor(){
        this.info = {
            args: [],
            cmd: "eval",
            perms: [Perms.BOT_OWNER],
            roles: [],
            desc: 'hidden'
        }
    }

    async exec(message: import("discord.js").Message): Promise<any> {
        let evalCMD = message.content.split('\n')

        evalCMD = evalCMD.slice(1, evalCMD.length -1)


        try {
            const res = await eval(evalCMD.join('\n'))

            message.channel.send(new MessageEmbed().setColor('BLUE').addField('Giriş', `\`\`\`js\n${evalCMD.join('\n')}\n\`\`\``).addField('Sonuç', `\`\`\`js\n${res}\n\`\`\``))
        }catch(err) {
            message.channel.send(new MessageEmbed().setColor('RED').addField('Hata', `\`\`\`\n${err}\n\`\`\``))
        }
    };
}

client.commands.set("eval", new Eval())