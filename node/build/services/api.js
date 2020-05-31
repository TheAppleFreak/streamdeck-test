"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moleculer_1 = require("moleculer");
const moleculer_web_1 = tslib_1.__importDefault(require("moleculer-web"));
const ws_1 = require("ws");
class ApiService extends moleculer_1.Service {
    constructor(broker) {
        super(broker);
        this.parseServiceSchema({
            name: "api",
            mixins: [moleculer_web_1.default],
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
    async getCount(ctx) {
        this.counter += 1;
        return this.counter;
    }
    serviceCreated() {
        this.counter = 0;
    }
    async serviceStarted() {
        this.wss = new ws_1.Server({ server: this.server });
        this.wss.on("connection", ws => {
            this.logger.info("Client connected");
            let interval = setInterval(async () => {
                ws.send(JSON.stringify(await this.broker.call("api.count")), () => this.logger.info("sent time to client"));
            }, 3000);
            ws.on("close", () => {
                this.logger.info("Client disconnected");
                clearInterval(interval);
            });
        });
    }
    async serviceStopped() {
        this.wss.clients.forEach(client => {
            client.terminate();
        });
    }
}
exports.default = ApiService;
