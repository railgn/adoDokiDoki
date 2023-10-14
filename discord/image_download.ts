import webdriver from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import fs from "fs";
import hash from "hash.js";

export async function image_download(url: string, image_urls: string[]) {
    const { By } = webdriver;

    const options = new chrome.Options();
    options.addArguments("log-level=3");

    const driver = new webdriver.Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();

    await driver.manage().setTimeouts({ implicit: 20000 });
    await driver.get(url);
    await driver.sleep(10000);

    async function image(image_url: string) {
        try {
            await driver.get(image_url);

            let encodedString = await driver.takeScreenshot();

            const file_name = hash
                .sha256()
                .update(image_url)
                .digest("hex")
                .slice(0, 20);

            await fs.writeFileSync(
                `./discord/images_temp/${file_name}.png`,
                encodedString,
                "base64"
            );
        } catch {
            console.log("Error on image: ", image_url);
        }
    }

    for (const image_url of image_urls) {
        await image(image_url);
    }

    await driver.close();
}
