// This feels a bit wrong to me, but everyone is writing their SD plugins using
// this syntax, so :shrug:
var sdWs = null;
var svWs = null;
var pluginUUID = null;
var DestinationEnum = Object.freeze({
    "HARDWARE_AND_SOFTWARE": 0,
    "HARDWARE_ONLY": 1,
    "SOFTWARE_ONLY": 2
});
var countAction = {
    type: "com.theapplefreak.server-count.action",
    /* onKeyDown: (context: any, settings: any, coordinates: any, userDesiredState: any): void => {
        countAction.SetTitle()
    }, */
    onWillAppear: function (context, settings, coordinates) {
        var counter = "\uD83E\uDD37\u200D\u2640\uFE0F\n";
        countAction.SetTitle(context, counter);
        svWs = new WebSocket("ws://127.0.0.1:3000");
        svWs.onopen = function () {
            countAction.SetTitle(context, "0");
        };
        // Set up handler for external events here
        svWs.onmessage = function (rawEvent) {
            var data = JSON.parse(rawEvent.data);
            countAction.SetTitle(context, data);
        };
    },
    onWillDisappear: function (context, settings, coordinates) {
        svWs.close();
    },
    // What's up with the capitalization here? What happened to camelCase?
    SetTitle: function (context, counter) {
        var payload = {
            event: "setTitle",
            context: context,
            payload: {
                title: String(counter),
                target: DestinationEnum.HARDWARE_AND_SOFTWARE
            }
        };
        sdWs.send(JSON.stringify(payload));
    },
    SetSettings: function (context, settings) {
        var payload = {
            event: "setSettings",
            context: context,
            payload: settings
        };
        sdWs.send(JSON.stringify(payload));
    }
};
function connectElgatoStreamDeckSocket(inPort, inPluginUUID, inRegisterEvent, inInfo) {
    sdWs = new WebSocket("ws://127.0.0.1:" + inPort);
    sdWs.onopen = function () {
        var payload = {
            event: inRegisterEvent,
            uuid: inPluginUUID
        };
        sdWs.send(JSON.stringify(payload));
    };
    sdWs.onmessage = function (rawEvent) {
        var data = JSON.parse(rawEvent.data);
        var payload;
        if (data.payload && data.payload !== null) {
            payload = data.payload;
        }
        switch (data.event) {
            case "willAppear":
                countAction.onWillAppear(data.context, payload.settings, payload.coordinates);
                break;
            case "willDisappear":
                countAction.onWillDisappear(data.context, payload.settings, payload.coordinates);
                break;
        }
    };
    sdWs.onclose = function () {
        if (svWs.readyState !== svWs.CLOSING || svWs.readyState !== svWs.CLOSED) {
            svWs.close();
        }
    };
}
