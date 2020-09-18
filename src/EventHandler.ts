import { MyClient } from "./index"
import DiscordEvent from './constants/DiscordEvent'
import { Collection } from 'discord.js'


export enum EVENT {
     channelCreate = "channelCreate",
     channelDelete = "channelDelete",
     channelPinsUpdate = "channelPinsUpdate",
     channelUpdate = "channelUpdate",
     debug = "debug",
     emojiCreate = "emojiCreate",
     emojiDelete = "emojiDelete",
     emojiUpdate = "emojiUpdate",
     error = "error",
     guildBanAdd = "guildBanAdd",
     guildBanRemove = "guildBanRemove",
     guildCreate = "guildCreate",
     guildDelete = "guildDelete",
     guildIntegrationsUpdate = "guildIntegrationsUpdate",
     guildMemberAdd = "guildMemberAdd",
     guildMemberRemove = "guildMemberRemove",
     guildMembersChunk = "guildMembersChunk",
     guildMemberSpeaking = "guildMemberSpeaking",
     guildMemberUpdate = "guildMemberUpdate",
     guildUnavailable = "guildUnavailable",
     guildUpdate = "guildUpdate",
     invalidated = "invalidated",
     inviteCreate = "inviteCreate",
     inviteDelete = "inviteDelete",
     message = "message",
     messageDelete = "messageDelete",
     messageDeleteBulk = "messageDeleteBulk",
     messageReactionAdd = "messageReactionAdd",
     messageReactionRemove = "messageReactionRemove",
     messageReactionRemoveAll = "messageReactionRemoveAll",
     messageReactionRemoveEmoji = "messageReactionRemoveEmoji",
     messageUpdate = "messageUpdate",
     presenceUpdate = "presenceUpdate",
     rateLimit = "rateLimit",
     ready = "ready",
     roleCreate = "roleCreate",
     roleDelete = "roleDelete",
     roleUpdate = "roleUpdate",
     shardDisconnect = "shardDisconnect",
     shardError = "shardError",
     shardReady = "shardReady",
     shardReconnecting = "shardReconnecting",
     shardResume = "shardResume",
     typingStart = "typingStart",
     userUpdate = "userUpdate",
     voiceStateUpdate = "voiceStateUpdate",
     warn = "warn",
     webhookUpdate = "webhookUpdate"
}



export default class EventHandler {
     static events = new Collection<EVENT, DiscordEvent>()

     static handle(event: EVENT, payload: any[]): void {
          if (EventHandler.events.has(event)) EventHandler.events.get(event).handle(...payload)
     }

     static register(event: typeof DiscordEvent): void {
          this.events.set(event.event, new event())
     }
}