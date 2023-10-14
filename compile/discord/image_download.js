"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.image_download = void 0;
const selenium_webdriver_1 = __importDefault(require("selenium-webdriver"));
const chrome_js_1 = __importDefault(require("selenium-webdriver/chrome.js"));
const fs_1 = __importDefault(require("fs"));
const hash_js_1 = __importDefault(require("hash.js"));
async function image_download(url, image_urls) {
    const { By } = selenium_webdriver_1.default;
    const options = new chrome_js_1.default.Options();
    options.addArguments("log-level=3");
    const driver = new selenium_webdriver_1.default.Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
    await driver.manage().setTimeouts({ implicit: 20000 });
    await driver.get(url);
    await driver.sleep(10000);
    async function image(image_url) {
        try {
            await driver.get(image_url);
            let encodedString = await driver.takeScreenshot();
            const file_name = hash_js_1.default
                .sha256()
                .update(image_url)
                .digest("hex")
                .slice(0, 20);
            await fs_1.default.writeFileSync(`./discord/images_temp/${file_name}.png`, encodedString, "base64");
        }
        catch {
            console.log("Error on image: ", image_url);
        }
    }
    for (const image_url of image_urls) {
        await image(image_url);
    }
    await driver.close();
}
exports.image_download = image_download;
//# sourceMappingURL=image_download.js.map