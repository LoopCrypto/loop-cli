const sign = require("./sign.js");
const prompt = require("prompt");
const fetch = require("node-fetch");
const getConfig = require("./config.js");

async function signSend(opts) {
    try {
        const {
            debug,
            configFilePath,
            entityId,
            itemId,
            billDate,
            invoiceId,
            fromAddress,
            toAddress,
            tokenAddress,
            amount,
            usd,
        } = opts;
        console.log("🚀 ~ file: signSend.js:21 ~ signSend ~ usd", usd);
        const config = await getConfig(configFilePath);
        const finalEntityId = entityId || config.API_ENTITY_ID;
        if (!finalEntityId || finalEntityId === "") {
            throw new Error(
                "Entity ID is missing in either the parameters or the config file"
            );
        }
        const signature = await sign(opts);

        prompt.start();
        const { confirm } = await prompt.get([
            {
                name: "confirm",
                description:
                    "[Y/y] to confirm sending the transfer request to Loop",
            },
        ]);
        if (confirm && confirm.toLowerCase() === "y") {
            console.log("Sending transfer request to Loop...\n");

            const transfers = [
                {
                    invoiceId: invoiceId,
                    amount: amount,
                    from: fromAddress,
                    to: toAddress,
                    token: tokenAddress,
                    usd: usd,
                    billDate: billDate ? billDate : 0,
                    networkId: parseInt(config.NETWORK_ID),
                    entityId: finalEntityId,
                    planId: itemId,
                    signature: signature,
                },
            ];
            if (debug) console.log("👾  Sending transfers:", transfers);
            const response = await fetch(
                `${config.APP_API_URL}/api/v1/transfers`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "entity-id": config.API_ENTITY_ID,
                        "api-key": config.APP_API_KEY,
                    },
                    body: JSON.stringify(transfers),
                }
            );
            if (response.ok) {
                console.log(
                    "🙌 Success! The following transfers were created:"
                );
                console.log((await response.json()).transfers);
            } else {
                throw new Error((await response.json()).results);
            }
        } else {
            console.log(
                "\n✋  Program rejected. The transfer request was not sent."
            );
        }
    } catch (error) {
        console.log(
            "⛔️ Unable to process your transfer request:\n\t",
            error.message
        );
    }
}
module.exports = signSend;
