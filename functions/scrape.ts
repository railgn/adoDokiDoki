import webdriver from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import fs from "fs/promises";

export type ResObj = {
    title: string;
    date: string;
    text: string[];
    img: string[];
    links: string[];
};

export type FinalResObj = {
    [key: string]: ResObj;
};

export async function scrape(urls: string[]) {
    const { By } = webdriver;

    const finalResObj: FinalResObj = {};

    async function adoScrape(url: string) {
        const options = new chrome.Options();
        // options.addArguments("--headless");
        options.addArguments("log-level=3");

        const driver = new webdriver.Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .build();

        await driver.manage().setTimeouts({ implicit: 20000 });
        await driver.get(url);
        await driver.sleep(10000);

        const resObj: ResObj = {
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
        } catch {
            console.log("Error on Title", url);
        }

        //date
        try {
            const dateNode = await driver.findElement(
                By.className("MuiTypography-root MuiTypography-caption")
            );
            resObj.date = await dateNode.getText();
            // console.log("date: ", resObj.date);
        } catch {
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
            const imgPromises = imgNodes.map((node) =>
                node.getAttribute("src")
            );
            resObj.img = await Promise.all(imgPromises);
            // console.log(bodyRes.img);

            //links
            const linkNodes = await bodyNode.findElements(By.css("a"));
            const linkPromises = linkNodes.map((node) =>
                node.getAttribute("href")
            );
            resObj.links = await Promise.all(linkPromises);
            // console.log(bodyRes.links);
        } catch {
            console.log("Error on body", url);
        }

        finalResObj[url] = resObj;

        await driver.close();
    }

    async function main(urlArr: string[]) {
        for (const url of urlArr) {
            await adoScrape(url);
        }
        fs.writeFile("./data/scraped.json", JSON.stringify(finalResObj));
    }

    await main(urls);

    return finalResObj;
}
