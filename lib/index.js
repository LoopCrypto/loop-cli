const { ethers, BigNumber } = require("ethers");
const fs = require("fs/promises");

async function sign(_, opts) {
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

        const rawConfig = await fs.readFile(configFilePath, {
            encoding: "utf8",
        });
        const lines = rawConfig.toString().split("\n");
        const config = {};
        for (let line = 0; line < lines.length; line++) {
            const currentLine = lines[line].split("=");
            config[currentLine[0]] = currentLine[1];
        }
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
    } catch (error) {
        console.log("😡  Error signing parameters:", error);
    }
}

module.exports = sign;
