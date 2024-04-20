import { FinalResObj } from "./scrape";
import adoURLs from "../database/adoURLs.json";
import adoArticlesJP from "../database/adoArticlesJP.json";
import adoArticlesEN from "../database/adoArticlesEN.json";
import fs from "fs/promises";

export async function postToDB(
    new_urls: string[],
    articles_JP: FinalResObj,
    articles_EN: FinalResObj
) {
    const adoURLsSave: { [key: string]: number } = adoURLs;
    for (const url of new_urls) {
        adoURLsSave[url] = 0;
    }
    fs.writeFile("./database/adoURLs.json", JSON.stringify(adoURLsSave));

    const adoArticlesJPSave: FinalResObj = adoArticlesJP;
    for (const url in articles_JP) {
        adoArticlesJPSave[url] = articles_JP[url];
    }
    fs.writeFile(
        "./database/adoArticlesJP.json",
        JSON.stringify(adoArticlesJPSave)
    );

    const adoArticlesENSave: FinalResObj = adoArticlesEN;
    for (const url in articles_EN) {
        adoArticlesENSave[url] = articles_EN[url];
    }
    fs.writeFile(
        "./database/adoArticlesEN.json",
        JSON.stringify(adoArticlesENSave)
    );
}
