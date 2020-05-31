"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const moleculer_1 = require("moleculer");
const api_1 = tslib_1.__importDefault(require("./services/api"));
const broker = new moleculer_1.ServiceBroker({
    cacher: "Memory"
});
broker.createService(api_1.default);
broker.start();
