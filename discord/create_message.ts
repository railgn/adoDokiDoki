import { ResObj } from "../functions/scrape";
import { image_download } from "./image_download";
import process from "process";
import path from "path";
import fs from "fs/promises";

export async function create_messages(url: string, article: ResObj) {
    const title = `@everyone**\n${article.title}**\n*${article.date}\n${url}*\n\n`;

    const text = article.text.join("\n");

    let body = "";
    let spill_text = "";

    const break_index = 1900 - title.length;

    if (text.length < break_index) {
        body = text;
    } else {
        body = text.slice(0, break_index);
        spill_text = text.slice(break_index);
    }

    const messages: any[] = [title + body];

    //recurse spill text
    function recurseText(text: string) {
        if (text.length < 2000) {
            messages.push(text);
        } else {
            messages.push(text.slice(0, 2000));
            recurseText(text.slice(2000));
        }
    }

    if (spill_text !== "") {
        recurseText(spill_text);
    }

    if (article.img.length > 0) {
        await image_download(url, article.img);

        const folder_path = path.join(process.cwd(), "/discord/images_temp/");

        const files = await fs.readdir(folder_path);

        function recurseImages(images: string[]) {
            if (images.length < 11) {
                const attachments: { attachment: string }[] = [];

                for (const img of images) {
                    const img_path = path.join(folder_path, img);
                    console.log(img_path);

                    attachments.push({
                        attachment: img_path,
                    });
                }
                messages.push({ files: attachments });
            } else {
                recurseImages(images.slice(0, 9));
                recurseImages(images.slice(9));
            }
        }

        recurseImages(files);
    }

    return messages;
}
