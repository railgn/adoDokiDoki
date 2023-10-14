"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToDB = void 0;
const client_1 = require("@prisma/client");
async function postToDB(new_urls, articles_JP, articles_EN) {
    const prisma = new client_1.PrismaClient();
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
exports.postToDB = postToDB;
//# sourceMappingURL=postToDB.js.map