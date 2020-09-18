import { Invite } from 'discord.js'
import client from '../../..'
import DiscordEvent from "../../../constants/DiscordEvent"
import EventHandler, { EVENT } from "../../../EventHandler"

export class InviteDeleteEvent implements DiscordEvent {

     static event = EVENT.inviteDelete

     async handle(invite: Invite) {
          if (client.invites.has(invite.code)) client.invites.delete(invite.code)
     }
}

EventHandler.register(InviteDeleteEvent)