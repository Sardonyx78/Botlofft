import { GuildChannel, GuildMember, Invite, Message, PermissionResolvable } from 'discord.js';
import Command, { Argument } from './Command';
import Perms from './Perms';
import client, { LinkedInvite, mute } from '..';
import { lstatSync, readdir, readdirSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

export const loadFile = {}

export const checkPermission = (command: Command, member: GuildMember): boolean => {
    if (command.info.roles.filter(x => member.roles.cache.map(x => x.id).includes(x)).length) return true
    else if (command.info.perms.includes(Perms.BOT_OWNER) && ['463667361984020491', '295222772546928641'].includes(member.id)) return true
    else if (member.hasPermission(command.info.perms as PermissionResolvable[])) return true
    else return false
}

export function redisGet(key: string) {
    return promisify(client.database.redis.get).call(client.database.redis, key)
}

export function redisSet(key: string, value: string) {
    return promisify(client.database.redis.set).call(client.database.redis, key, value)
}

export function redisIncr(key: string) {
    return promisify(client.database.redis.incr).call(client.database.redis, key)
}

/*export async function matchArgument(cmd: Command, __args__: string[], message: Message): Promise<Argument[] | null> {
    const args: Argument[] = []

    if (cmd.info.args.length === 0) return Promise.resolve(__args__)

    let success = true

    __args__.forEach(async (arg, i) => {
        if (i === 0) return args[0] = arg
        if (cmd.info.args[i - 1].type === "string") args[i] = arg
        else if (arg.match(/<@![0-9]+>/g)){
            const a = arg.match(/<@![0-9]+>/g)[0]
            args[i] = await client.guild.members.fetch(a.substring(3, a.length - 1))
        }else if (!isNaN(parseInt(arg))) args[i] = parseInt(arg)
        else args[i] = arg 
    })

    args.forEach((x, i) => {
        if (i === 0) success = true
        else if (x instanceof GuildMember) success = cmd.info.args[i - 1].type === "mention"
        else success = cmd.info.args[i - 1].type === typeof x
    })

    return Promise.resolve(success ? args : null)
}*/

export async function createLinkedInvite(invite: Invite): Promise<LinkedInvite> {
    const inv: LinkedInvite = await (invite.channel as GuildChannel).createInvite({ maxUses: 1, maxAge: 0, unique: true })

    inv.linked = true

    inv.linkedTo = invite

    return inv
}

function loadDir(path: string, callback: (file: string) => any) {
     readdir(join(__dirname, path), (err, files) => {
         if (err) throw err
 
         files.forEach(f => {
             if (f.match(/map/g)) return
             if (lstatSync(join(__dirname, path, f)).isDirectory()) {
                 loadDir(path + "/" + f, callback)
             } else {
               if (!f.endsWith(".map")) callback(join(__dirname, path, f))
             }
         })
     })
}

loadDir("../commands", require)
loadDir("../events", require)


export async function createMuteTimeout(user: string, expiration: Date) {
    const doc = await client.database.mute.create({ discord_id: user, expires: expiration.valueOf() })
    client.setTimeout(muteCb, expiration.valueOf() - Date.now(), doc, user)
}

export function muteCb(doc: mute, user: string) {
    const m = client.guild.member(user)
    if (m) {
        if (m.roles.cache.has("754323794180440094")) m.roles.add("622344228760059946").catch(() => {})
        m.roles.remove("754323794180440094").catch(() => {})
    }
    doc.deleteOne()
}

export function capitilizeFirstLetter(str: string): string {
    return str[0].toLocaleUpperCase("tr-TR") + str.substring(1)
}