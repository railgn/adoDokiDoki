"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToDB = void 0;
const adoURLs_json_1 = __importDefault(require("../database/adoURLs.json"));
const adoArticlesJP_json_1 = __importDefault(require("../database/adoArticlesJP.json"));
const adoArticlesEN_json_1 = __importDefault(require("../database/adoArticlesEN.json"));
const promises_1 = __importDefault(require("fs/promises"));
async function postToDB(new_urls, articles_JP, articles_EN) {
    const adoURLsSave = adoURLs_json_1.default;
    for (const url of new_urls) {
        adoURLsSave[url] = 0;
        console.log("saving url: ", url);
    }
    promises_1.default.writeFile("C:/Users/aabou/Desktop/coding/adoDokiDoki/database/adoURLs.json", JSON.stringify(adoURLsSave));
    const adoArticlesJPSave = adoArticlesJP_json_1.default;
    for (const url in articles_JP) {
        adoArticlesJPSave[url] = articles_JP[url];
    }
    promises_1.default.writeFile("./database/adoArticlesJP.json", JSON.stringify(adoArticlesJPSave));
    const adoArticlesENSave = adoArticlesEN_json_1.default;
    for (const url in articles_EN) {
        adoArticlesENSave[url] = articles_EN[url];
    }
    promises_1.default.writeFile("./database/adoArticlesEN.json", JSON.stringify(adoArticlesENSave));
}
exports.postToDB = postToDB;
//# sourceMappingURL=postToDB.js.map