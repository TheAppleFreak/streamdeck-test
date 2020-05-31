import { Service, Context, Errors } from "moleculer";
import ApiGateway from "moleculer-web";
import { Server as WebSocketServer } from "ws";

export default class ApiService extends Service {
    public counter: number;
    public wss: WebSocketServer

    constructor(broker) {
        super(broker);

        this.parseServiceSchema({
            name: "api",
            mixins: [ApiGateway],
            settings: {
                port: 3000,
                routes: [{
                    path: "/",
                    mappingPolicy: "restrict",
                    aliases: {
                        "GET /": "api.count"
                    }
                }]
            },
            actions: {
                getCount: {
                    name: "count",
                    handler: this.getCount
                }
            },
            created: this.serviceCreated,
            started: this.serviceStarted,
            stopped: this.serviceStopped
        });
    }

    async getCount(ctx: Context<any, any>) {
        this.counter += 1;
        return this.counter;
    }

    serviceCreated() {
        this.counter = 0;
    }

    async serviceStarted() {
        this.wss = new WebSocketServer({server: this.server});

        this.wss.on("connection", ws => {
            this.logger.info("Client connected");

            let interval = setInterval(async () => {
                ws.send(JSON.stringify(await this.broker.call("api.count")), () => this.logger.info("sent time to client"));
            }, 3000);

            ws.on("close", () => {
                this.logger.info("Client disconnected");
                clearInterval(interval);
            });
        })
    }

    async serviceStopped() {
        this.wss.clients.forEach(client => {
            client.terminate();
        })
    }
}