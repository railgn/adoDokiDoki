import adoURLs from "../database/adoURLs.json";

export async function findNewUrls(gmail_urls: string[]) {
    const gmail_hash: { [key: string]: number } = {};

    gmail_urls.forEach((e) => {
        gmail_hash[e] = 1;
    });

    const new_urls: string[] = [];

    Object.keys(gmail_hash).forEach((e) => {
        if (!(e in adoURLs)) {
            new_urls.push(e);
        }
    });

    console.log("# of Gmail urls: ", Object.keys(gmail_hash).length);
    console.log("# of DB urls: ", Object.keys(adoURLs).length);
    console.log("# of New urls: ", new_urls.length);

    return new_urls;
}
