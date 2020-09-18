  
import { Message, Snowflake, GuildMember } from 'discord.js';
import Perms from './Perms';
import { MyClient } from ".."


export type Argument = string | GuildMember | number

export default interface Command {
    info: {
        args: {
            title: string,
            optional: boolean,
            type: 'mention' | 'number' | 'string'
        }[],
        cmd: string,
        perms: Perms[],
        roles: Snowflake[],
        desc: string
    }

    exec: (message: Message, args: string[]) => any
}