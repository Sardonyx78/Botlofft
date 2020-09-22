import { Snowflake, VoiceState } from 'discord.js'
import client from '../..'
import DiscordEvent from "../../constants/DiscordEvent"
import EventHandler, { EVENT } from "../../EventHandler"

export class ReadyEvent implements DiscordEvent {

     static event = EVENT.voiceStateUpdate

     async handle(o: VoiceState, n: VoiceState) {
          detectChanges(o, n, "757827773275570198", "754324302714896424")
          detectChanges(o, n, "757827800786010112", "754324362148184134")
          detectChanges(o, n, "757827819991728208", "757707273790423061")
          detectChanges(o, n, "757827844251320330", "757707293818224650")
          detectChanges(o, n, "757827872273727513", "757707678507204789")
     }
}

function detectChanges(o: VoiceState, n: VoiceState, text: Snowflake, voice: Snowflake) {
     if (o.channelID !== voice && n.channelID === voice) {
          client.guild.channels.cache.get(text).createOverwrite(o.member, {
               VIEW_CHANNEL: true
          })
     } else if (o.channelID === voice && n.channelID !== voice) {
          client.guild.channels.cache.get(text).createOverwrite(o.member, {
               VIEW_CHANNEL: false
          })
     }
}

EventHandler.register(ReadyEvent)