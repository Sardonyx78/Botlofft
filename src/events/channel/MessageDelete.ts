import { Message, TextChannel, MessageEmbed, MessageAttachment } from 'discord.js';
import client from '../..';
import DiscordEvent from '../../constants/DiscordEvent';
import EventHandler, { EVENT } from '../../EventHandler';

export class MessageDeleteEvent implements DiscordEvent {

     static event = EVENT.messageDelete

     async handle(message: Message) {
          if (message.author.bot) return

          const log = await client.guild.fetchAuditLogs({ type: "MESSAGE_DELETE", limit: 1 }).then(x => x.entries.first())

          const by = log.target === message.author && message.createdAt < log.createdAt ? log.executor : null

          client.channels.cache.get<TextChannel>("754876773342380113").send(
               new MessageEmbed()
                    .setColor(0xe74c3c)
                    .setAuthor(
                         message.author.username + "#" + message.author.discriminator,
                         message.author.displayAvatarURL()
                    )
                    .setDescription(
                         `${message.author} tarafından ${message.channel} kanalına gönderilen [**mesaj**](${message.url})${by ? ` ${by} tarafından` : ''} silindi!`
                    )
                    .setTimestamp()
                    .addField("Silinen Mesaj:", '```\n­' + message.content.split("`").join("\`") + '\n```', true)
                    .setFooter("ID: " + message.id)
          );

          if (message.attachments.size !== 0) {
               client.channels.cache.get<TextChannel>("754876773342380113").send(new MessageAttachment(client.cache[message.id].img, client.cache[message.id].name))
               Object.assign(client.cache[message.id], undefined)
         }
     }
}

EventHandler.register(MessageDeleteEvent)