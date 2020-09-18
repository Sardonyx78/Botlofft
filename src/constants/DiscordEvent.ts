import { EVENT } from '../EventHandler';

export default class DiscordEvent {
    static event: EVENT
    handle: (...args: any) => any
}