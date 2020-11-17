import { createCanvas, loadImage } from 'canvas'
import { GuildMember, MessageReaction, ReactionCollector, TextChannel, User } from 'discord.js'
import { join } from 'path'
import client from '../..'
import DiscordEvent from "../../constants/DiscordEvent"
import { muteCb } from '../../constants/Util'
import EventHandler, { EVENT } from "../../EventHandler"

async function constructCanvas(member: GuildMember) {
     const canvas = createCanvas(1600, 900)
     const ctx = canvas.getContext("2d")

     ctx.drawImage(await loadImage(join(__dirname, "../../../../assets/giris.png")), 0, 0, 1600, 900)

     ctx.fillStyle = '#ffffff';
     ctx.font = "350px \"Magic School One\"";
     ctx.textAlign = "center";
     ctx.fillText(`${member.user.username}`, 800, 720, 1500)

     ctx.beginPath()
     ctx.arc(800, 188, 288 / 2, 0, Math.PI * 2, true)
     ctx.closePath()

     ctx.clip()

     ctx.drawImage(await loadImage(member.user.avatarURL({ format: "png", size: 512 })), 650, 38, 300, 300)
     return canvas
}

export class ReadyEvent implements DiscordEvent {

     static event = EVENT.ready

     async handle() {
          console.log("Ready!")
          
          client.guild = client.guilds.cache.first()

          client.guild.members.cache = await client.guild.members.fetch()

          client.invites = await client.guild.fetchInvites()

          const newComers = (await (<TextChannel>client.channels.cache.get("754319043057680485")).messages.fetch("754340230890258532", true)).createReactionCollector((reaction: MessageReaction, user: User) => !client.guild.member(user).roles.cache.has("622344228760059946") && reaction.emoji.name === "✅")

          newComers.on("collect", async (reaction, user) => {
               const member = client.guild.member(user)

               const doc = await client.database.mute.findOne({ discord_id: member.id })
               if (doc) member.roles.add("760733882458570762")
               else member.roles.add("622344228760059946")
          })

          client.channels.cache.get<TextChannel>("754335732482572288").messages.fetch({ limit: 100 }, true)

          const mutes = await client.database.mute.find({})

          mutes.forEach(x => {
               if (x.expires <= Date.now()) muteCb(x, x.discord_id)
               else client.setTimeout(muteCb, x.expires - Date.now(), x, x.discord_id)
          })

          setInterval(async () => {
               const rekorKanalı = client.guild.channels.cache.get("757834749703356487")
               const currRekor = parseInt(rekorKanalı.name.split(" • ")[1])

               await client.guild.channels.cache.get("757834477601816596").edit({ name: `Toplam Üye • ${client.guild.memberCount}` })
               await client.guild.channels.cache.get("757834519909892147").edit({ name: `Toplam Online • ${client.guild.members.cache.filter(x => x.presence.status !== "offline").size}` })
               await rekorKanalı.edit({ name: `Rekor Online • ${parseInt(rekorKanalı.name.split(" • ")[1]) > client.guild.members.cache.filter(x => x.presence.status !== "offline").size ? currRekor : client.guild.members.cache.filter(x => x.presence.status !== "offline").size}` })
          }, 50000)
     }
}

EventHandler.register(ReadyEvent)