"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrape = void 0;
const selenium_webdriver_1 = __importDefault(require("selenium-webdriver"));
const chrome_js_1 = __importDefault(require("selenium-webdriver/chrome.js"));
const promises_1 = __importDefault(require("fs/promises"));
async function scrape(urls) {
    const { By } = selenium_webdriver_1.default;
    const finalResObj = {};
    async function adoScrape(url) {
        const options = new chrome_js_1.default.Options();
        // options.addArguments("--headless");
        options.addArguments("log-level=3");
        const driver = new selenium_webdriver_1.default.Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();
        await driver.manage().setTimeouts({ implicit: 20000 });
        await driver.get(url);
        await driver.sleep(10000);
        const resObj = {
            title: "not_found",
            date: "not_found",
            text: [],
            img: [],
            links: [],
        };
        //title
        try {
            const titleNode = await driver.findElement(By.css("h6"));
            resObj.title = await titleNode.getText();
            // console.log("title: ", resObj.title);
        }
        catch {
            console.log("Error on Title", url);
        }
        //date
        try {
            const dateNode = await driver.findElement(By.className("MuiTypography-root MuiTypography-caption"));
            resObj.date = await dateNode.getText();
            // console.log("date: ", resObj.date);
        }
        catch {
            console.log("Error on date", url);
        }
        //body
        try {
            const bodyNode = await driver
                .findElement(By.css("p"))
                .findElement(By.xpath(".."));
            //text
            const textNodes = await bodyNode.findElements(By.css("p"));
            const textPromises = textNodes.map((node) => node.getText());
            const text = await Promise.all(textPromises);
            resObj.text = text
                .map((e) => e.replaceAll("\n", ""))
                .filter((e) => e !== "");
            // console.log(bodyRes.text)
            //images
            const imgNodes = await bodyNode.findElements(By.css("img"));
            const imgPromises = imgNodes.map((node) => node.getAttribute("src"));
            resObj.img = await Promise.all(imgPromises);
            // console.log(bodyRes.img);
            //links
            const linkNodes = await bodyNode.findElements(By.css("a"));
            const linkPromises = linkNodes.map((node) => node.getAttribute("href"));
            resObj.links = await Promise.all(linkPromises);
            // console.log(bodyRes.links);
        }
        catch {
            console.log("Error on body", url);
        }
        finalResObj[url] = resObj;
        await driver.close();
    }
    async function main(urlArr) {
        for (const url of urlArr) {
            await adoScrape(url);
        }
        promises_1.default.writeFile("./data/scraped.json", JSON.stringify(finalResObj));
    }
    await main(urls);
    return finalResObj;
}
exports.scrape = scrape;
//# sourceMappingURL=scrape.js.map