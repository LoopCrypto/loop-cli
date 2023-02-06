const sign = require("./sign.js");
const prompt = require("prompt");
const fetch = require("node-fetch");
const getConfig = require("./config.js");

async function signSend(opts) {
    try {
        const config = await getConfig(opts.configFilePath);
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
            networkId,
        } = validateInput(opts, config);

        const signature = await sign(opts);

        console.log("");
        console.log(
            "📣 The following values will be used for the transfer request:"
        );
        console.log(`       Invoice ID: ${invoiceId}`);
        console.log(`       Amount: ${amount}`);
        console.log(`       From address: ${fromAddress}`);
        console.log(`       To address: ${toAddress}`);
        console.log(`       Token address: ${tokenAddress}`);
        console.log(`       Usd flag: ${usd}`);
        console.log(`       Bill date: ${billDate ? billDate : 0}`);
        console.log(`       Network ID: ${networkId}`);
        console.log(`       Entity ID: ${entityId}`);
        console.log(`       Item ID: ${itemId}`);
        console.log(`       Signature: ${signature}`);
        console.log("");

        prompt.start();˜
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
                    networkId: networkId,
                    entityId: entityId,
                    itemId: itemId,
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

function validateInput(opts, config) {
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

    const validEntityId = entityId || config.API_ENTITY_ID;
    if (!validEntityId || validEntityId === "") {
        throw new Error(
            "Entity ID is missing in either the parameters or the config file"
        );
    }

    const validNetworkId = parseInt(config.NETWORK_ID);
    if (isNaN(validNetworkId))
        throw new Error(
            `Network ID must be a valid number, not '${config.NETWORK_ID}'`
        );

    let validBillDate = billDate;
    if (validBillDate) {
        validBillDate = parseInt(billDate);
        if (isNaN(validBillDate))
            throw new Error(
                `Bill date must be a valid UNIX timestamp in seconds, not '${billDate}'`
            );
    }

    return {
        debug,
        entityId: validEntityId,
        itemId,
        billDate: validBillDate,
        invoiceId,
        fromAddress,
        toAddress,
        tokenAddress,
        amount,
        usd,
        networkId: validNetworkId,
    };
}
module.exports = signSend;
