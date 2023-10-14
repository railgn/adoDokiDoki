"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_messages = void 0;
const image_download_1 = require("./image_download");
const process_1 = __importDefault(require("process"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
async function create_messages(url, article) {
    const title = `@everyone**\n${article.title}**\n*${article.date}\n${url}*\n\n`;
    const text = article.text.join("\n");
    let body = "";
    let spill_text = "";
    const break_index = 1900 - title.length;
    if (text.length < break_index) {
        body = text;
    }
    else {
        body = text.slice(0, break_index);
        spill_text = text.slice(break_index);
    }
    const messages = [title + body];
    //recurse spill text
    function recurseText(text) {
        if (text.length < 2000) {
            messages.push(text);
        }
        else {
            messages.push(text.slice(0, 2000));
            recurseText(text.slice(2000));
        }
    }
    if (spill_text !== "") {
        recurseText(spill_text);
    }
    if (article.img.length > 0) {
        await (0, image_download_1.image_download)(url, article.img);
        const folder_path = path_1.default.join(process_1.default.cwd(), "/discord/images_temp/");
        const files = await promises_1.default.readdir(folder_path);
        function recurseImages(images) {
            if (images.length < 11) {
                const attachments = [];
                for (const img of images) {
                    const img_path = path_1.default.join(folder_path, img);
                    console.log(img_path);
                    attachments.push({
                        attachment: img_path,
                    });
                }
                messages.push({ files: attachments });
            }
            else {
                recurseImages(images.slice(0, 9));
                recurseImages(images.slice(9));
            }
        }
        recurseImages(files);
    }
    return messages;
}
exports.create_messages = create_messages;
//# sourceMappingURL=create_message.js.map