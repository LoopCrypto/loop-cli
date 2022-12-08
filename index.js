#!/usr/bin/env node
const program = require("commander");
const { sign, signSend } = require("./lib");

program
    .command("sign")
    .description("Sign Loop transfer requests")
    .option("-d, --debug", "Print debug info?", false)
    .option(
        "-c, --config-file-path <value>",
        "Full path to the file containing config information"
    )
    .option("--invoice-id <value>", "Invoice ID related to the transfer")
    .option("--from-address <value>", "Wallet address funds are pulled from")
    .option("--to-address <value>", "Wallet address funds are going to")
    .option("--token-address <value>", "Address of the token used to pay")
    .option(
        "--amount <value>",
        "Amount to bill. If --usd=true, specify the amount in dollars (e.g. 29.99 for $29.99). If --usd=false, specify the native token amount (e.g. 1000000 for 1 USDC)."
    )
    .option("--usd", "Is the amount denominated in USD?", false)
    .action(sign);

program
    .command("signAndSend")
    .description("Sign and send Loop transfer requests to Loop API endpoint")
    .option("-d, --debug", "Print debug info?", false)
    .option(
        "-c, --config-file-path <value>",
        "Full path to the file containing config information"
    )
    .option(
        "--entity-id <value>",
        "Loop Entity ID that the item being billed is linked to"
    )
    .option(
        "--item-id <value>",
        "Loop Item ID that is associated with the transfer"
    )
    .option("--invoice-id <value>", "Invoice ID related to the transfer")
    .option("--from-address <value>", "Wallet address funds are pulled from")
    .option("--to-address <value>", "Wallet address funds are going to")
    .option("--token-address <value>", "Address of the token used to pay")
    .option(
        "--amount <value>",
        "Amount to bill. If --usd=true, specify the amount in dollars (e.g. 29.99 for $29.99). If --usd=false, specify the native token amount (e.g. 1000000 for 1 USDC)."
    )
    .option("--usd", "Is the amount denominated in USD?", false)
    .action(signSend);

program.parse(process.argv);
