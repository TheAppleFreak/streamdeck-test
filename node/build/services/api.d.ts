import { Service, Context } from "moleculer";
import { Server as WebSocketServer } from "ws";
export default class ApiService extends Service {
    counter: number;
    wss: WebSocketServer;
    constructor(broker: any);
    getCount(ctx: Context<any, any>): Promise<number>;
    serviceCreated(): void;
    serviceStarted(): Promise<void>;
    serviceStopped(): Promise<void>;
}
