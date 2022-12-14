const sign = require("./sign.js");
const prompt = require("prompt");
const fetch = require("node-fetch");

async function signSend(opts) {
    try {
        const {
            debug,
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
        const { config, signature } = await sign(opts);

        prompt.start();
        const { confirm } = await prompt.get([
            {
                name: "confirm",
                description:
                    'Type "Y" to confirm sending the transfer request to Loop',
            },
        ]);
        if (confirm && confirm === "Y") {
            console.log("Sending signature to Loop...");
            const transfers = [
                {
                    invoiceId: invoiceId,
                    amount: amount,
                    from: fromAddress,
                    to: toAddress,
                    token: tokenAddress,
                    usd: usd,
                    billDate: billDate,
                    networkId: parseInt(config.NETWORK_ID),
                    entityId: entityId || config.API_ENTITY_ID,
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
                console.log("🙌 Success! The following transfers are created:");
                console.log((await response.json()).transfers);
            } else {
                throw new Error((await response.json()).message);
            }
        } else {
            console.log(
                "😡  Program rejected. The signed message was not sent."
            );
        }
    } catch (error) {
        console.log("😡  Error sending your request:", error);
    }
}
module.exports = signSend;
