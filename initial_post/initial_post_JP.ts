import { PrismaClient } from "@prisma/client";
import scraped from "./scraped.json";

const prisma = new PrismaClient();

async function main() {
    for (const url in scraped) {
        try {
            await prisma.adoArticlesJP.create({
                data: {
                    url: url,
                    //@ts-ignore
                    data: scraped[url],
                },
            });
            console.log("post success: ", url);
        } catch (e) {
            console.error("post failed: ", url);
        }
    }
}

main();
