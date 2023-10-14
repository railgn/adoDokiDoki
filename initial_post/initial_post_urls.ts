import { PrismaClient } from "@prisma/client";
import scraped from "./translated.json";

const prisma = new PrismaClient();

async function main() {
    for (const url in scraped) {
        try {
            await prisma.adoURLs.create({
                data: {
                    url: url,
                },
            });
            console.log("post success: ", url);
        } catch (e) {
            console.error("post failed: ", url);
        }
    }
}

main();
