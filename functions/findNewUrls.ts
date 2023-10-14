import { PrismaClient } from "@prisma/client";

export async function findNewUrls(gmail_urls: string[]) {
    const prisma = new PrismaClient();

    const db_res = await prisma.adoURLs.findMany();

    const db_hash: { [key: string]: number } = {};

    db_res.forEach((e) => {
        db_hash[e.url] = e.id;
    });

    const gmail_hash: { [key: string]: number } = {};

    gmail_urls.forEach((e) => {
        gmail_hash[e] = 1;
    });

    const new_urls: string[] = [];

    Object.keys(gmail_hash).forEach((e) => {
        if (!db_hash[e]) {
            new_urls.push(e);
        }
    });

    console.log("# of Gmail urls: ", Object.keys(gmail_hash).length);
    console.log("# of DB urls: ", Object.keys(db_hash).length);
    console.log("# of New urls: ", new_urls.length);

    return new_urls;
}
