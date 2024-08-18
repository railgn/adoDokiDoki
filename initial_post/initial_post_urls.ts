import { PrismaClient } from "@prisma/client";
import scraped from "./translated.json";

import adoUrls from "../old-database/adoURLs.json";

const prisma = new PrismaClient();

async function main() {
    // for (const url in scraped) {
    //     try {
    //         await prisma.adoURLs.create({
    //             data: {
    //                 url: url,
    //             },
    //         });
    //         console.log("post success: ", url);
    //     } catch (e) {
    //         console.error("post failed: ", url);
    //     }
    // }

    for (const url in adoUrls) {
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

    const db_res = await prisma.adoURLs.findMany();

    console.log(db_res);
}

main();
