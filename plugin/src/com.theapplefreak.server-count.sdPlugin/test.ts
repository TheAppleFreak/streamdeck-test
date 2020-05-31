// This feels a bit wrong to me, but everyone is writing their SD plugins using
// this syntax, so :shrug:
let sdWs: WebSocket = null;
let svWs: WebSocket = null;
let pluginUUID: string = null;

let DestinationEnum = Object.freeze({
    "HARDWARE_AND_SOFTWARE": 0,
    "HARDWARE_ONLY": 1,
    "SOFTWARE_ONLY": 2
});

const countAction = {
    type: "com.theapplefreak.server-count.action",
    /* onKeyDown: (context: any, settings: any, coordinates: any, userDesiredState: any): void => {
        countAction.SetTitle()
    }, */
    onWillAppear: (context: any, settings: any, coordinates: any): void => {
        let counter = `🤷‍♀️\n`;
        
        countAction.SetTitle(context, counter);

        svWs = new WebSocket(`ws://127.0.0.1:3000`);
        svWs.onopen = () => {
            countAction.SetTitle(context, "0");
        }

        // Set up handler for external events here
        svWs.onmessage = (rawEvent: MessageEvent) => {
            let data = JSON.parse(rawEvent.data);

            countAction.SetTitle(context, data);
        }
    },
    onWillDisappear: (context: any, settings: any, coordinates: any): void => {
        svWs.close();
    },
    // What's up with the capitalization here? What happened to camelCase?
    SetTitle: (context: any, counter: string): void => {
        let payload = {
            event: "setTitle",
            context,
            payload: {
                title: String(counter),
                target: DestinationEnum.HARDWARE_AND_SOFTWARE
            }
        };

        sdWs.send(JSON.stringify(payload));
    },
    SetSettings: (context: any, settings: any): void => {
        let payload = {
            event: "setSettings",
            context,
            payload: settings
        };

        sdWs.send(JSON.stringify(payload));
    }
};

function connectElgatoStreamDeckSocket(
    inPort: number,
    inPluginUUID: string,
    inRegisterEvent: any,
    inInfo: any
) {
    sdWs = new WebSocket(`ws://127.0.0.1:${inPort}`);

    sdWs.onopen = () => {
        let payload = {
            event: inRegisterEvent,
            uuid: inPluginUUID
        };

        sdWs.send(JSON.stringify(payload))
    }

    sdWs.onmessage = (rawEvent: any) => {
        let data = JSON.parse(rawEvent.data);

        let payload;
        if (data.payload && data.payload !== null) {
            payload = data.payload;
        }
        switch (data.event) {
            case "willAppear": 
                countAction.onWillAppear(
                    data.context, 
                    payload.settings, 
                    payload.coordinates
                );
                break;
            case "willDisappear": 
                countAction.onWillDisappear(
                    data.context,
                    payload.settings,
                    payload.coordinates
                );
                break;
        }
    }

    sdWs.onclose = () => {
        if (svWs.readyState !== svWs.CLOSING || svWs.readyState !== svWs.CLOSED) {
            svWs.close();
        }
    }
}