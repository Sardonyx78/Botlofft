import { GuildMember, MessageEmbed, TextChannel } from 'discord.js';
import client from '../../..';
import DiscordEvent from '../../../constants/DiscordEvent';
import EventHandler, { EVENT } from '../../../EventHandler';

export class GuildMemberRemove implements DiscordEvent {
     static event = EVENT.guildMemberRemove


     handle(member: GuildMember) {
          (<TextChannel>client.guild.channels.cache.get("754355939272032408")).send(new MessageEmbed().setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ dynamic: true })).setColor(0xe74c3c).setTimestamp())
     }
}

EventHandler.register(GuildMemberRemove)