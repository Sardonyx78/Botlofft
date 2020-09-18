import { Message, MessageEmbed } from 'discord.js'
import client from '..'
import Command from '../constants/Command'
import Perms from '../constants/Perms'
import math = require("mathjs")

export class Calc implements Command {

     info: { args: { title: string; optional: boolean; type: 'string' | 'number' | 'mention' }[]; cmd: string; perms: Perms[]; roles: string[]; desc: string }

     constructor() {
          this.info = {
               args: [{
                    title: "hesap",
                    optional: false,
                    type: "string"
               }],
               cmd: "calc",
               perms: [Perms.SEND_MESSAGES],
               roles: [],
               desc: "Matematik hesaplaması yapmanı sağlar"
          }     
     }
 
     exec(message: Message, args: string[]) {
          let beEval: string;

          const splittedNewLine = message.content.split("\n")

          if (args[1].startsWith("```")) beEval = splittedNewLine.slice(1, splittedNewLine.length - 1).join("\n")
          else if (args[1].startsWith("`")) beEval = message.content.slice(7, message.content.length - 1)
          else beEval = args.slice(1).join(" ")

          try {
               const res = math.evaluate(beEval, { sn: 1000, dk: 60000, saat: 3600000 })

               message.channel.send(new MessageEmbed().addField("Problem", '```js\n' + beEval + '\n```').addField("Sonuç", '```js\n' + res + '\n```').setColor("BLUE"))
          } catch (error) {
               message.channel.send(new MessageEmbed().addField("Problem", '```js\n' + beEval + '\n```').addField("Sonuç", '```js\n' + error + '\n```').setColor("RED"))
          }
     }
}

client.commands.set("calc", new Calc())