"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gmail_cjs_1 = __importDefault(require("./gmail/gmail.cjs"));
const findNewUrls_1 = require("./functions/findNewUrls");
const scrape_1 = require("./functions/scrape");
const translate_1 = require("./functions/translate");
const postToDB_1 = require("./functions/postToDB");
const discord_index_1 = require("./discord/discord_index");
const node_notifier_1 = __importDefault(require("node-notifier"));
async function main() {
    console.log("checking mail");
    const gmail_urls = await (0, gmail_cjs_1.default)().catch((error) => {
        console.error("Delete token and Re-auth", error);
        node_notifier_1.default.notify("Delete token and Re-auth");
    });
    if (gmail_urls) {
        const new_urls = await (0, findNewUrls_1.findNewUrls)(gmail_urls);
        if (new_urls.length === 0) {
            console.log("No new articles");
            node_notifier_1.default.notify("No new urls");
        }
        else {
            const articles_JP = await (0, scrape_1.scrape)(new_urls);
            const articles_EN = await (0, translate_1.translate)(articles_JP);
            await (0, postToDB_1.postToDB)(new_urls, articles_JP, articles_EN);
            await (0, discord_index_1.discord)(articles_EN);
            node_notifier_1.default.notify(`Posted ${new_urls.length} new articles`);
        }
    }
}
try {
    main();
}
catch {
    node_notifier_1.default.notify("Delete token and Re-auth");
}
setInterval(() => {
    main();
}, 1000 * 60 * 60 * 24);
//# sourceMappingURL=index.js.map