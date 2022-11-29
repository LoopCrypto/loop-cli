const { ethers } = require("ethers");

async function sign(_, opts) {
    try {
        const { debug, invoiceId, fromAddress, toAddress, tokenAddress, amount, usd } =
            opts;

        const domain = {
            name: "LoopVariableRatesContract",
            version: "1",
            chainId: process.env.NETWORK_ID,
            verifyingContract: process.env.CONTRACT_ADDRESS,
        };
        if (debug) console.log("🐛  Domain", domain);

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
            invoiceId,
            from: fromAddress,
            to: toAddress,
            token: tokenAddress,
            amount: +amount,
            usd,
        };
        if (debug) console.log("🐛  Parameters:", transfer);

        const signer = new ethers.Wallet(
            process.env.SIGNER_PRIVATE_KEY,
            ethers.provider
        );

        const signature = await signer._signTypedData(domain, types, transfer);
        console.log("🖋  Generated Signature: ", signature);
    } catch (error) {
        console.log("Error signing parameters.", error);
    }
}

module.exports = sign;
