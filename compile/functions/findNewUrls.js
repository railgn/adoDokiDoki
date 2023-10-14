"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNewUrls = void 0;
const client_1 = require("@prisma/client");
async function findNewUrls(gmail_urls) {
    const prisma = new client_1.PrismaClient();
    const db_res = await prisma.adoURLs.findMany();
    const db_hash = {};
    db_res.forEach((e) => {
        db_hash[e.url] = e.id;
    });
    const gmail_hash = {};
    gmail_urls.forEach((e) => {
        gmail_hash[e] = 1;
    });
    const new_urls = [];
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
exports.findNewUrls = findNewUrls;
//# sourceMappingURL=findNewUrls.js.map