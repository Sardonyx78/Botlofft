import { Message, TextChannel, MessageEmbed } from 'discord.js';
import client from '../..';
import DiscordEvent from '../../constants/DiscordEvent';
import EventHandler, { EVENT } from '../../EventHandler';

export class MessageUpdateEvent implements DiscordEvent {

     static event = EVENT.messageUpdate

     handle(o: Message, message: Message) {
         if (o.author.bot) return
         if (o.content === message.content) return;
 
         const omsg: string = (() => {
             if (o.content.length > 1000) return '(Çok uzun bi mesaj)' 
             else return o.content.split("`").join("\`");
         })();
 
         const newmsg: string = (() => {
             if (message.content.length > 1000) return '(Çok uzun bi mesaj)' 
             else return message.content.split("`").join("\`");
         })();
     
         (client.channels.cache.get("754876773342380113") as TextChannel).send(new MessageEmbed()
             .setColor(0x2ecc71)
             .setAuthor(
                 message.author.username + "#" + message.author.discriminator,
                 message.author.displayAvatarURL()
             )
             .setDescription(
                 "<@!" +
                 message.author.id +
                 "> tarafından <#" +
                 message.channel.id +
                 "> kanalına gönderilen [**mesaj**](" + message.url + ") düzenlendi!"
             )
             .setTimestamp()
             .addField("Eski Mesaj:", "```\n­" + omsg + "\n```", true)
             .addField("Yeni Mesaj:", "```\n­" + newmsg + "\n```", true)
             .setFooter("ID: " + message.id))
     }
}

EventHandler.register(MessageUpdateEvent)