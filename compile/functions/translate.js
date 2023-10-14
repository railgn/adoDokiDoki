"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.translate = void 0;
const deepl = __importStar(require("deepl-node"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const promises_1 = __importDefault(require("fs/promises"));
async function translate(scraped) {
    const { authKey } = process.env;
    const finalResObj = {};
    //@ts-ignore
    const translator = new deepl.Translator(authKey);
    async function adoTranslate(url, article_obj) {
        const resObj = {
            title: "not_found",
            date: "not_found",
            text: [],
            img: article_obj.img,
            links: article_obj.links,
        };
        const titlePromise = translator.translateText(article_obj.title, "ja", "en-US");
        const datePromise = translator.translateText(article_obj.date, "ja", "en-US");
        const [title_EN, date_EN] = await Promise.all([
            titlePromise,
            datePromise,
        ]);
        resObj.title = title_EN.text;
        resObj.date = date_EN.text;
        const textPromises = article_obj.text.map((text) => {
            return translator.translateText(text, "ja", "en-US");
        });
        const text_EN_res = await Promise.all(textPromises);
        const text_EN = text_EN_res.map((res) => res.text);
        resObj.text = text_EN;
        finalResObj[url] = resObj;
        return {
            url: url,
            //@ts-ignore
            res: {
                title: title_EN.text,
                date: date_EN.text,
                text: text_EN,
                img: article_obj.img,
                links: article_obj.links,
            },
        };
    }
    async function main() {
        const urls = Object.keys(scraped);
        for (const url of urls) {
            //@ts-ignore
            await adoTranslate(url, scraped[url]);
        }
        // //@ts-ignore
        // await adoTranslate(urls[10], scraped[urls[10]]);
        promises_1.default.writeFile("./data/translated.json", JSON.stringify(finalResObj));
    }
    await main();
    return finalResObj;
}
exports.translate = translate;
//# sourceMappingURL=translate.js.map