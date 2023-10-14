"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.discord = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("./config.json"));
const create_message_1 = require("./create_message");
const process_1 = __importDefault(require("process"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
async function discord(articles_EN) {
    const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
    client.once("ready", () => {
        console.log("Ready!");
    });
    client.on("ado", async () => {
        const channel = await client.channels.fetch("1158186760757583903");
        for (const url in articles_EN) {
            const messages = await (0, create_message_1.create_messages)(url, articles_EN[url]);
            for (const message of messages) {
                //@ts-ignore
                await channel.send(message);
            }
            //delete temp images
            const folder_path = path_1.default.join(process_1.default.cwd(), "/discord/images_temp/");
            const files = await promises_1.default.readdir(folder_path);
            for (const img of files) {
                const img_path = path_1.default.join(folder_path, img);
                await promises_1.default.unlink(img_path);
            }
        }
        client.destroy();
    });
    await client.login(config_json_1.default.token);
    client.emit("ado");
}
exports.discord = discord;
// discord(test_article);
//# sourceMappingURL=discord_index.js.map