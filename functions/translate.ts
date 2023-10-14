import * as deepl from "deepl-node";
import { ResObj } from "./scrape";
import dotenv from "dotenv";
dotenv.config();
import { FinalResObj } from "./scrape";
import fs from "fs/promises";

export async function translate(scraped: FinalResObj) {
    const { authKey } = process.env;

    const finalResObj: FinalResObj = {};

    //@ts-ignore
    const translator = new deepl.Translator(authKey);

    async function adoTranslate(url: string, article_obj: ResObj) {
        const resObj: ResObj = {
            title: "not_found",
            date: "not_found",
            text: [],
            img: article_obj.img,
            links: article_obj.links,
        };

        const titlePromise = translator.translateText(
            article_obj.title,
            "ja",
            "en-US"
        );

        const datePromise = translator.translateText(
            article_obj.date,
            "ja",
            "en-US"
        );

        const [title_EN, date_EN] = await Promise.all([
            titlePromise,
            datePromise,
        ]);

        resObj.title = title_EN.text;
        resObj.date = date_EN.text;

        const textPromises = article_obj.text.map((text) => {
            return translator.translateText(text, "ja", "en-US");
        });

        const text_EN_res = await Promise.all(textPromises);

        const text_EN = text_EN_res.map((res) => res.text);
        resObj.text = text_EN;

        finalResObj[url] = resObj;

        return {
            url: url,
            //@ts-ignore
            res: {
                title: title_EN.text,
                date: date_EN.text,
                text: text_EN,
                img: article_obj.img,
                links: article_obj.links,
            } as ResObj,
        };
    }

    async function main() {
        const urls = Object.keys(scraped);

        for (const url of urls) {
            //@ts-ignore
            await adoTranslate(url, scraped[url]);
        }

        // //@ts-ignore
        // await adoTranslate(urls[10], scraped[urls[10]]);

        fs.writeFile("./data/translated.json", JSON.stringify(finalResObj));
    }

    await main();

    return finalResObj;
}
