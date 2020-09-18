import { VoiceState } from 'discord.js'
import client from '../..'
import DiscordEvent from "../../constants/DiscordEvent"
import EventHandler, { EVENT } from "../../EventHandler"

export class ReadyEvent implements DiscordEvent {

     static event = EVENT.voiceStateUpdate

     async handle(o: VoiceState, n: VoiceState) {
          if (o.channelID === "754324302714896424" && n.channelID !== "754324302714896424") {
               client.guild.channels.cache.get("754324415617171558").createOverwrite(o.member, {
                    VIEW_CHANNEL: false
               })
          } else if (o.channelID !== "754324302714896424" && n.channelID === "754324302714896424") {
               client.guild.channels.cache.get("754324415617171558").createOverwrite(o.member, {
                    VIEW_CHANNEL: true
               })
          } else if (o.channelID !== "754324362148184134" && n.channelID === "754324362148184134") {
               client.guild.channels.cache.get("754324491345330216").createOverwrite(o.member, {
                    VIEW_CHANNEL: true
               })
          } else if (o.channelID === "754324362148184134" && n.channelID !== "754324362148184134") {
               client.guild.channels.cache.get("754324491345330216").createOverwrite(o.member, {
                    VIEW_CHANNEL: false
               })
          }
     }
}

EventHandler.register(ReadyEvent)