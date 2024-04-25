"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findNewUrls = void 0;
const adoURLs_json_1 = __importDefault(require("C:/Users/aabou/Desktop/coding/adoDokiDoki/database/adoURLs.json"));
async function findNewUrls(gmail_urls) {
    const gmail_hash = {};
    gmail_urls.forEach((e) => {
        gmail_hash[e] = 1;
    });
    const new_urls = [];
    Object.keys(gmail_hash).forEach((e) => {
        if (!(e in adoURLs_json_1.default)) {
            new_urls.push(e);
            console.log(e);
        }
    });
    console.log("# of Gmail urls: ", Object.keys(gmail_hash).length);
    console.log("# of DB urls: ", Object.keys(adoURLs_json_1.default).length);
    console.log("# of New urls: ", new_urls.length);
    return new_urls;
}
exports.findNewUrls = findNewUrls;
//# sourceMappingURL=findNewUrls.js.map