const { ethers, BigNumber } = require("ethers");
const getConfig = require("./config");

async function sign(opts) {
    try {
        const {
            debug,
            configFilePath,
            invoiceId,
            fromAddress,
            toAddress,
            tokenAddress,
            amount,
            usd,
        } = opts;
        const config = await getConfig(configFilePath);
        if (debug) console.log("👾  Config:", config);

        const domain = {
            name: "LoopVariableRatesContract",
            version: "1",
            chainId: config.NETWORK_ID,
            verifyingContract: config.CONTRACT_ADDRESS,
        };
        if (debug) console.log("👾  Domain:", domain);

        const types = {
            Transfer: [
                { name: "invoiceId", type: "string" },
                { name: "from", type: "address" },
                { name: "to", type: "address" },
                { name: "token", type: "address" },
                { name: "amount", type: "uint256" },
                { name: "usd", type: "bool" },
            ],
        };

        const transfer = {
            invoiceId: invoiceId,
            from: fromAddress,
            to: toAddress,
            token: tokenAddress,
            amount: BigNumber.from(amount),
            usd: usd,
        };
        if (debug) console.log("👾  Parameters:", transfer);

        const signer = new ethers.Wallet(
            config.SIGNER_PRIVATE_KEY,
            ethers.provider
        );

        const signature = await signer._signTypedData(domain, types, transfer);
        console.log("📝  Generated Signature: ", signature);
        return signature;
    } catch (error) {
        console.log("⛔️  Error signing parameters:", error);
    }
}

module.exports = sign;
