import { Client, GatewayIntentBits } from "discord.js";
import config from "./config.json";
import { FinalResObj } from "../functions/scrape";

import test_article from "./test_article.json";
import { create_messages } from "./create_message";

import process from "process";
import path from "path";
import fs from "fs/promises";

export async function discord(articles_EN: FinalResObj) {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.once("ready", () => {
        console.log("Ready!");
    });

    client.on("ado", async () => {
        const channel = await client.channels.fetch("1158186760757583903");

        for (const url in articles_EN) {
            const messages = await create_messages(url, articles_EN[url]);

            for (const message of messages) {
                //@ts-ignore
                await channel.send(message);
            }

            //delete temp images
            const folder_path = path.join(
                process.cwd(),
                "/discord/images_temp/"
            );

            const files = await fs.readdir(folder_path);

            for (const img of files) {
                const img_path = path.join(folder_path, img);
                await fs.unlink(img_path);
            }
        }

        client.destroy();
    });

    await client.login(config.token);

    client.emit("ado");
}

// discord(test_article);
