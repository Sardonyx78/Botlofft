import { Invite } from 'discord.js'
import client from '../../..'
import DiscordEvent from "../../../constants/DiscordEvent"
import EventHandler, { EVENT } from "../../../EventHandler"

export class InviteCreateEvent implements DiscordEvent {

     static event = EVENT.inviteCreate

     async handle(invite: Invite) {
          if (invite.inviter.id !== client.user.id) client.invites.set(invite.code, invite)
     }
}

EventHandler.register(InviteCreateEvent)