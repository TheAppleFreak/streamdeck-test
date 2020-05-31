# streamdeck-test
Test repository to test out Elgato Stream Deck development. This is mostly just to learn how to do it better in actual applications.

## Setup
There's two components to this, a Node server and the plugin. Both must be configured before it'll work.

### Node
The plugin requires a server running on `127.0.0.1:3000` to show anything. 

1. Install Node.js 10 or newer. I'm running this on v14.3.0, but it really doesn't matter too much.
2. Install Yarn package manager system-wide by running `npm install -g yarn` or by following the instructions on the Yarn site. Note that while this project uses Yarn 2, so long as you have Yarn 1.22 or above installed you should be good. 
3. `cd` into the `node` directory and install the requisite dependencies by running `yarn install`
4. Run the application by running `yarn start` or `yarn node build/index.js`. **NOTE**: You cannot use `node start` or `node build/index.js`, as this requires the Yarn 2 PnP shim to function, which does not get loaded by default in the standard Node runtime. 

To edit the server application, [follow the instructions here](https://yarnpkg.com/advanced/editor-sdks) to enable type hinting for your particular editor of choice, then modify as you wish in `src`. To compile the code, run `yarn build`.

### Plugin
Since I kinda just bootstrapped this off of the Counter sample code, it's not really organized, but it does sorta work. To edit:

1. Install the TypeScript compiler system wide by running `npm install -g typescript`. 
2. `cd` into the `plugin` directory.
3. Edit the code in `src\com.theapplefreak.server-count.sdPlugin\test.ts`, then run `tsc src\com.theapplefreak.server-count.sdPlugin\test.ts` to compile. Alternatively, just edit the compiled code in `src\com.theapplefreak.server-count.sdPlugin/test.js` directly. 
4. Run `.\DistributionTool.exe -b -i src/com.theapplefreak.server-count.sdPlugin -o Release` to compile the plugin. 
5. Install the plugin by double clicking the output file in the `Releases` folder and following the instructions on screen. The counter should begin incrementing once the plugin is dragged onto an empty Stream Deck square.