import { ServiceBroker } from "moleculer";

import ApiService from "./services/api";

const broker = new ServiceBroker({
    cacher: "Memory"
});

broker.createService(ApiService);

broker.start();