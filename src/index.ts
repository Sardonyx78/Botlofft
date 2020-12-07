import { Client, Collection, Invite, Guild } from "discord.js"
import EventHandler, { EVENT } from "./EventHandler"
import Command from './constants/Command'
import { EventEmitter } from 'events'
import mongoose, { Document, Schema } from "mongoose"
import { loadFile } from './constants/Util'
import redis, { RedisClient } from "redis"
import express from "express"

loadFile

export interface MyClient extends Client {
     invites: Collection<string, LinkedInvite>,
     commands: Collection<string, Command>,
     cache: any,
     raidMode: boolean,
     guild: Guild,
     database: {
          moderation: mongoose.Model<moderationLog, {}>,
          mute: mongoose.Model<mute, {}>,
          redis: RedisClient
     }
}

export type mute = {
     discord_id: string,
     expires: number
} & Document

export type moderationLog = {
     kicks: number,
     bans: number,
     warns: number,
     mutes: number,
     discord_id: string
} & Document

const moderation = mongoose.model<moderationLog>("moderation", new Schema({
     kicks: Number,
     bans: Number,
     warns: Number,
     mutes: Number,
     discord_id: String
}), "moderation")

const mute = mongoose.model<mute>("mute", new Schema({
     expires: Number,
     discord_id: String
}), "mutes")

Client.prototype.emit = function (event: string, ...args: any[]): boolean {
     EventEmitter.prototype.emit.bind(this)("*", event, ...args)

     return EventEmitter.prototype.emit.bind(this)(event, ...args)
}

const client = new Client({ presence: { activity: { type: 'LISTENING', name: 'Önemli Mesajları' }, status: 'dnd' } }) as MyClient

client.database = { moderation, redis: redis.createClient({ password: "lCefFMUstHiJzEvGFSjTeqX1PtQBUQgenQXNAS+reBJmf6MZBCrcPzz4YneqXr356j8XX/OFcfszzGqn", db: 1 }), mute }

client.cache = {}

client.commands = new Collection()
client.invites = new Collection()

client.on("*", function (event: EVENT, ...args) {
     EventHandler.handle(event, args)
})

client.login("NzIzNzM4MTE0MTE1MjM5OTU2.Xu1_pA.KkVKBITDQ6Rp-B7JQPYOwMZWgGM")

export default client

mongoose.connect("mongodb://127.0.0.1:27017/Database", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
     .then(() => console.log("Connected to the database!"))

export interface LinkedInvite extends Invite {
     linked?: boolean,
     linkedTo?: Invite
}

const app = express()

app.get("/", (req, res) => {
     res.json(client.guild.members.cache.filter(x => x.user.avatar).random(8).map(x => x.user.displayAvatarURL({ format: "png", size: 128 })))
})

app.listen(9010)
