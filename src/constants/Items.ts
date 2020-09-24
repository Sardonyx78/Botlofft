import { Snowflake, User } from "discord.js";

const random = (min: number, max: number) => Math.floor(Math.random() * max) + min;

function Episkey(player: Player) {
    return () => player.heal(20)
}

function Dwisp(player: Player) {
    return () => player.enemy.damage(20)
}

function Expelliarmus(player: Player) {
    return () => {
        player.enemy.cache.dealted = false
        player.enemy.spell2 = function (this: Player) {
        if (!this.cache.dealted) {
            this.cache.dealted = true
            player.damage(10)
        }
        else {
            player.damage(20)
            this.spell2 = function() {player.damage(20)}
            this.cache.dealted = false
        }
    }}
}

function Heal(player: Player) {
    return () => {
        const chance = random(0, 100)
        if (chance <= 30){
            player.heal(30)
        }else {
            player.heal(10) 
        }
    }
}

function Protego(player: Player) {
    return () => {
        player.enemy.cache.dealted1 = false
        player.enemy.spell2 = function (this: Player) {
        if (!this.cache.dealted1) {
            this.cache.dealted1 = true
            player.damage(0)
        }
        else {
            player.damage(20)
            this.spell2 = function() {player.damage(20)}
            this.cache.dealted1 = false
        }
    }}
}



export class Profile {
    loadout: any[]
    id: Snowflake

    constructor(user: User) {
        this.id = user.id
        this.loadout = [Episkey, Dwisp, Expelliarmus, Heal, Protego]
    }
}



export class Player {
    id: Snowflake
    hp: number
    game: Game
    spells: string[]
    cache: any

    spell1: () => any
    spell2: () => any
    spell3: () => any
    spell4: () => any
    spell5: () => any

    constructor(profile: Profile, game: Game) {
        this.hp = 100
        this.game = game
        this.id = profile.id
        this.cache = {}
        this.spells = profile.loadout.map(x => x.name)
        this.spell1 = new profile.loadout[0](this)
        this.spell2 = new profile.loadout[1](this)
        this.spell3 = new profile.loadout[2](this)
        this.spell4 = new profile.loadout[3](this)
        this.spell5 = new profile.loadout[4](this)
    }

    get enemy(): Player {
        if (this.game.player1 === this) return this.game.player2
        else return this.game.player1
    }

    heal(hp: number) {
        if (this.hp + hp >= 100) this.hp = 100
        else this.hp = this.hp + hp
        return hp
    }

    damage(hp: number) {
        if (this.hp - hp <= 0) this.hp = 0
        else this.hp = this.hp - hp
        return hp
    }
}

export class Game {
    player1: Player
    player2: Player

    constructor(profile1: Profile, profile2: Profile) {
        this.player1 = new Player(profile1, this)
        this.player2 = new Player(profile2, this)
    }

    get currentState() {
        return {
            1: this.player1,
            2: this.player2
        }
    }
}