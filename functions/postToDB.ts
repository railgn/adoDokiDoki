import { PrismaClient } from "@prisma/client";
import { FinalResObj } from "./scrape";

export async function postToDB(
    new_urls: string[],
    articles_JP: FinalResObj,
    articles_EN: FinalResObj
) {
    const prisma = new PrismaClient();

    for (const url of new_urls) {
        await prisma.adoURLs.create({
            data: {
                url: url,
            },
        });
    }

    for (const url in articles_JP) {
        await prisma.adoArticlesJP.create({
            data: {
                url: url,
                //@ts-ignore
                data: articles_JP[url],
            },
        });
    }

    for (const url in articles_EN) {
        await prisma.adoArticlesEN.create({
            data: {
                url: url,
                //@ts-ignore
                data: articles_EN[url],
            },
        });
    }
}
