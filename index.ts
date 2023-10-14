import gmail from "./gmail/gmail.cjs";
import { findNewUrls } from "./functions/findNewUrls";
import { scrape } from "./functions/scrape";
import { translate } from "./functions/translate";
import { postToDB } from "./functions/postToDB";
import { discord } from "./discord/discord_index";
import notifier from "node-notifier";

async function main() {
    console.log("checking mail");

    const gmail_urls = await gmail().catch((error) => {
        console.error("Delete token and Re-auth", error);
        notifier.notify("Delete token and Re-auth");
    });

    if (gmail_urls) {
        const new_urls = await findNewUrls(gmail_urls);

        if (new_urls.length === 0) {
            console.log("No new articles");
            notifier.notify("No new urls");
        } else {
            const articles_JP = await scrape(new_urls);

            const articles_EN = await translate(articles_JP);

            await postToDB(new_urls, articles_JP, articles_EN);

            await discord(articles_EN);

            notifier.notify(`Posted ${new_urls.length} new articles`);
        }
    }
}

try {
    main();
} catch {
    notifier.notify("Delete token and Re-auth");
}

setInterval(() => {
    main();
}, 1000 * 60 * 60 * 24);
