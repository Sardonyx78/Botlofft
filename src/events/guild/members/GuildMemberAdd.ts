import DiscordEvent from "../../../constants/DiscordEvent"
import EventHandler, { EVENT } from "../../../EventHandler"
import svgcaptcha from "svg-captcha"
import { promisify } from 'util'
import svg2img from 'svg2img'
import { GuildMember, MessageAttachment, MessageEmbed, TextChannel, User } from 'discord.js'
import { createLinkedInvite } from '../../../constants/Util'
import client from '../../..'

export class GuildMemberAdd implements DiscordEvent {

     static event = EVENT.guildMemberAdd

     async handle(member: GuildMember) {
          if (member.user.bot) return  (<TextChannel>client.guild.channels.cache.get("754355939272032408")).send(new MessageEmbed().setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ dynamic: true })).setColor(0x3ed878).setTimestamp())

          const { data: svg, text: answer } = svgcaptcha.create({ background: "#000", color: true })

          const olds = client.invites.map(x => ({ code: x.code, uses: x.uses, inviter: x.inviter }))

          const newInvites = await client.guild.fetchInvites()

          const inviteCode = await new Promise((resolve) => newInvites.map(x => ({ code: x.code, uses: x.uses, inviter: x.inviter })).forEach(y => {
               const res = olds.find(x => {
                    if (x.code === y.code && x.uses !== y.uses) return true
                    else return false
               })
               if (res) resolve(res.code)
          })) as string

          const inv = client.invites.get(inviteCode).linked ? client.invites.get(inviteCode).linkedTo : client.invites.get(inviteCode)

          await member.send("**Karma Community'e** hoşgeldin! Öncellikle doğrulama için aşşağıdaki kodu yaz. (20 Saniyen var)", new MessageAttachment(await promisify(svg2img)(svg), "captcha.png"))

          const kickTimer = setTimeout(async () => {
               await member.send(`Doğrulaman başarısız oldu. Yeniden gelmen için: ${createLinkedInvite(inv)}`)
               member.kick("Dogrulama başarısız")
          }, 20000);

          (await member.createDM()).awaitMessages(() => true, { max: 1, time: 20000 }).then(async x => {
               const msg = x.first()

               clearTimeout(kickTimer)

               if (msg.content === answer) {
                    member.send("Doğrulama başarılı! Sunucumuza hoşgeldin. <#622344240071966726>ı okumayı lütfen ihmal etme")
                    const doc = await client.database.mute.findOne({ discord_id: member.id })
                    if (doc) member.roles.add("754323794180440094")
                    else member.roles.add("622344228760059946");
                    client.guild.channels.cache.get<TextChannel>("754355939272032408").send(new MessageEmbed().setAuthor(`${member.user.tag} (${member.id})`, member.user.displayAvatarURL({ dynamic: true })).setColor(0x3ed878).setFooter(`Davet eden: ${inv.inviter.tag} (${inv.inviter.id})`, inv.inviter.displayAvatarURL({ dynamic: true })).setTimestamp())
               }else {
                    await member.send(`Doğrulaman başarısız oldu. Yeniden gelmen için: ${createLinkedInvite(inv)}`)
                    member.kick("Dogrulama başarısız")
               }
          })

          const newList = newInvites.clone()

          newList.forEach(x => {
               const el = client.invites.get(x.code)

               if (el.linked) newList.set(x.code, Object.assign(x, { linked: true, linkedTo: el.linkedTo }))
          })

          client.invites = newList
     }
}

EventHandler.register(GuildMemberAdd)