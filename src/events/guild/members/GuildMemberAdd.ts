import DiscordEvent from "../../../constants/DiscordEvent"
import EventHandler, { EVENT } from "../../../EventHandler"
import svgcaptcha, { loadFont } from "svg-captcha"
import { promisify } from 'util'
import svg2img from 'svg2img'
import { GuildMember, MessageAttachment, MessageEmbed, TextChannel } from 'discord.js'
import { createLinkedInvite } from '../../../constants/Util'
import client from '../../..'
import { createCanvas, loadImage } from 'canvas'
import { join } from 'path'

async function constructCanvas(member: GuildMember) {
     const canvas = createCanvas(1600, 900)
     const ctx = canvas.getContext("2d")

     ctx.drawImage(await loadImage(join(__dirname, "../../../../assets/giris.png")), 0, 0, 1600, 900)

     ctx.fillStyle = '#ffffff';
     ctx.font = "350px \"Magic School One\"";
     ctx.textAlign = "center";
     ctx.fillText(`${member.user.username}`, 800, 700, 850)

     ctx.beginPath()
     ctx.arc(800, 188, 288 / 2, 0, Math.PI * 2, true)
     ctx.closePath()

     ctx.clip()

     ctx.drawImage(await loadImage(member.user.avatarURL({ format: "png", size: 512 })), 650, 38, 300, 300)
     return canvas
}

export class GuildMemberAdd implements DiscordEvent {

     static event = EVENT.guildMemberAdd

     async handle(member: GuildMember, prev: boolean) {
          if (member.user.bot) return  (<TextChannel>client.guild.channels.cache.get("754355939272032408")).send(new MessageEmbed().setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ dynamic: true })).setColor(0x3ed878).setTimestamp())

          const { data: svg, text: answer } = svgcaptcha.create({ background: "#000" })

          if (member.roles.cache.has("622344228760059946") || prev) {
               const canvas = await constructCanvas(member)

               client.channels.cache.get<TextChannel>("756952147169378315").send(`${member}`, { files: [ new MessageAttachment(canvas.toBuffer(), "welcome.png") ], embed: new MessageEmbed().setColor("RANDOM").setDescription(`<a:blob_dance:757886155709612054> ${member} Karma Community'e hoşgeldin ! <a:blob_dance:757886155709612054>`).setImage("attachment://welcome.png") }) 

               return
          }

          await member.send("**Karma Community'e** hoşgeldin! Öncellikle doğrulama için aşşağıdaki kodu yaz. (20 Saniyen var)", new MessageAttachment(await promisify(svg2img)(svg), "captcha.png"))

          const kickTimer = setTimeout(async () => {
               await member.send(`Doğrulaman başarısız oldu. Yeniden gelmek için yeni bir davet bulman gerekli.`)
               member.kick("Dogrulama başarısız")
          }, 20000);

          (await member.createDM()).awaitMessages(m => m.author.id === member.id, { max: 1, time: 20000 }).then(async x => {
               const msg = x.first()

               clearTimeout(kickTimer)

               if (msg.content === answer) {
                    member.send("Doğrulama başarılı! Sunucumuza hoşgeldin. <#622344240071966726>ı okumayı lütfen ihmal etme")
                    const doc = await client.database.mute.findOne({ discord_id: member.id })
                    if (doc) member.roles.add("760733882458570762")
                    else member.roles.add("622344228760059946");

                    const canvas = await constructCanvas(member)

                    client.channels.cache.get<TextChannel>("756952147169378315").send(`${member}`, { files: [ new MessageAttachment(canvas.toBuffer(), "welcome.png") ], embed: new MessageEmbed().setColor("RANDOM").setDescription(`<a:blob_dance:757886155709612054> ${member} Karma Community'e hoşgeldin ! <a:blob_dance:757886155709612054>`).setImage("attachment://welcome.png") }) 
                    client.guild.channels.cache.get<TextChannel>("754355939272032408").send(new MessageEmbed().setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ dynamic: true })).setColor(0x3ed878).setTimestamp())
               }else {
                    await member.send(`Doğrulaman başarısız oldu. Yeniden gelmek için yeni bir davet bulman gerekli.`)
                    member.kick("Dogrulama başarısız")
               }
          })
     }
}

EventHandler.register(GuildMemberAdd)
