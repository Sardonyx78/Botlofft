import DiscordEvent from "../../../constants/DiscordEvent"
import EventHandler, { EVENT } from "../../../EventHandler"
import { GuildMember, MessageEmbed, TextChannel } from 'discord.js'
import client from '../../..'

export class GuildMemberAdd implements DiscordEvent {

     static event = EVENT.guildMemberAdd

     async handle(member: GuildMember, prev: boolean) {
          (<TextChannel>client.guild.channels.cache.get("754355939272032408")).send(new MessageEmbed().setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ dynamic: true })).setColor(0x3ed878).setTimestamp())
     }
}

EventHandler.register(GuildMemberAdd)
