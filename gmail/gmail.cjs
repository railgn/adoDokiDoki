const base64url = require("base64url");
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const jsdom = require("jsdom");
const { url } = require("inspector");
const { JSDOM } = jsdom;

async function gmail() {
    // If modifying these scopes, delete token.json.
    const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
    // The file token.json stores the user's access and refresh tokens, and is
    // created automatically when the authorization flow completes for the first
    // time.
    const TOKEN_PATH = path.join(process.cwd(), "/gmail/token.json");
    const CREDENTIALS_PATH = path.join(
        process.cwd(),
        "/gmail/credentials.json"
    );

    /**
     * Reads previously authorized credentials from the save file.
     *
     * @return {Promise<OAuth2Client|null>}
     */
    async function loadSavedCredentialsIfExist() {
        try {
            const content = await fs.readFile(TOKEN_PATH);
            const credentials = JSON.parse(content);
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    /**
     * Serializes credentials to a file compatible with GoogleAUth.fromJSON.
     *
     * @param {OAuth2Client} client
     * @return {Promise<void>}
     */
    async function saveCredentials(client) {
        const content = await fs.readFile(CREDENTIALS_PATH);
        const keys = JSON.parse(content);
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: "authorized_user",
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await fs.writeFile(TOKEN_PATH, payload);
    }

    /**
     * Load or request or authorization to call APIs.
     *
     */
    async function authorize() {
        let client = await loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: SCOPES,
            keyfilePath: CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await saveCredentials(client);
        }
        return client;
    }

    async function getLatestMessage(auth) {
        const gmail = google.gmail({ version: "v1", auth });
        const res = await gmail.users.messages.list({
            userId: "me",
            labelIds: "Label_8923732387829730783",
        });

        const msgPromises = res.data.messages.map((e) => {
            return gmail.users.messages.get({
                userId: "me",
                id: e.id,
            });
        });

        const msgs = await Promise.all(msgPromises);

        const all_urls = [];

        msgs.forEach((e) => {
            function geturls(html) {
                const dom = new JSDOM(html);

                const urls =
                    dom.window.document.querySelector("a")?.textContent;

                if (!urls) {
                    return urls;
                } else if (
                    urls.includes(
                        "https://ado-dokidokihimitsukichi-daigakuimo.com/join/"
                    )
                ) {
                    return undefined;
                } else {
                    return urls;
                }
            }

            function postMessage(message) {
                const url = geturls(base64url.decode(message.body.data));

                if (url !== undefined) {
                    all_urls.push(url);
                }
            }

            function getMessageDetails(message) {
                if (
                    message?.data?.payload?.mimeType === "text/html" ||
                    message?.data?.payload?.mimeType === "text/plain"
                ) {
                    postMessage(message.data.payload);
                } else if (
                    message?.mimeType === "text/html" ||
                    message?.mimeType === "text/plain"
                ) {
                    postMessage(message);
                } else {
                    message.data.payload.parts.forEach((e) => {
                        getMessageDetails(e);
                    });
                }
            }

            getMessageDetails(e);
        });

        return all_urls;
    }

    const auth = await authorize();

    const urls = await getLatestMessage(auth);

    return urls;
}

module.exports = gmail;
