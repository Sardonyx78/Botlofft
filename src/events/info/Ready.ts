import { MessageReaction, ReactionCollector, TextChannel, User } from 'discord.js'
import client from '../..'
import DiscordEvent from "../../constants/DiscordEvent"
import { muteCb } from '../../constants/Util'
import EventHandler, { EVENT } from "../../EventHandler"

export class ReadyEvent implements DiscordEvent {

     static event = EVENT.ready

     async handle() {
          console.log("Ready!")
          
          client.guild = client.guilds.cache.first()

          client.invites = await client.guild.fetchInvites()

          const newComers = (await (<TextChannel>client.channels.cache.get("754319043057680485")).messages.fetch("754340230890258532", true)).createReactionCollector((reaction: MessageReaction, user: User) => client.guild.member(user).joinedAt.valueOf() < 1599918561444 && !client.guild.member(user).roles.cache.has("622344228760059946") && reaction.emoji.name === "✅")

          newComers.on("collect", (reaction, user) => client.guild.member(user).roles.add("622344228760059946"))

          client.channels.cache.get<TextChannel>("754335732482572288").messages.fetch({ limit: 100 }, true)

          const mutes = await client.database.mute.find({})

          mutes.forEach(x => {
               if (x.expires <= Date.now()) muteCb(x, x.discord_id)
               else client.setTimeout(muteCb, x.expires - Date.now(), x, x.discord_id)
          })
     }
}

EventHandler.register(ReadyEvent)