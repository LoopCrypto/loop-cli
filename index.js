#!/usr/bin/env node
const program = require("commander");
const { sign, signSend } = require("./lib");

program
    .command("sign")
    .description("Sign Loop transfer requests")
    .requiredOption(
        "-c, --config-file-path <value>",
        "Full path to the file containing config information (eg. /Users/<USERNAME>/Desktop/config.txt)"
    )
    .requiredOption("--invoice-id <value>", "Invoice ID for the transfer")
    .requiredOption(
        "--from-address <value>",
        "Wallet address funds are pulled from"
    )
    .requiredOption("--to-address <value>", "Wallet address funds are going to")
    .requiredOption(
        "--token-address <value>",
        "Address of the token used as payment"
    )
    .requiredOption(
        "--amount <value>",
        "Amount to bill. If '--usd' flag is present, specify the amount in USD cents (e.g. 2999 for $29.99). If '--usd' flag is not present, specify the native token amount (e.g. 1000000 for 1 USDC)"
    )
    .option(
        "--usd",
        "[Optional] This option should only be included if the amount is denominated in USD cents. No value is passed with this option, just '--usd' (default: false)",
        false
    )
    .option("-d, --debug", "[Optional] Print debug info", false)
    .action(sign);

program
    .command("signAndSend")
    .description("Sign and send Loop transfer requests to Loop API endpoint")
    .requiredOption(
        "-c, --config-file-path <value>",
        "Full path to the file containing config information (eg. /Users/<USERNAME>/Desktop/config.txt)"
    )
    .requiredOption("--invoice-id <value>", "Invoice ID for the transfer")
    .requiredOption(
        "--from-address <value>",
        "Wallet address funds are pulled from"
    )
    .requiredOption("--to-address <value>", "Wallet address funds are going to")
    .requiredOption(
        "--token-address <value>",
        "Address of the token used as payment"
    )
    .requiredOption(
        "--amount <value>",
        "Amount to bill. If '--usd' flag is present, specify the amount in USD cents (e.g. 2999 for $29.99). If '--usd' flag is not present, specify the native token amount (e.g. 1000000 for 1 USDC)"
    )
    .requiredOption(
        "--item-id <value>",
        "Loop Item ID that is associated with the transfer"
    )
    .option(
        "--entity-id <value>",
        "[Optional] The child entity ID that the item being billed is linked to. If omitted, the transfer will be linked to the entity ID in the config file"
    )
    .option(
        "--bill-date <value>",
        "[Optional] The date the transfer should be executed on, formatted as a UNIX timestamp. 0 value indicates immediate processing (default: 0)"
    )
    .option(
        "--usd",
        "[Optional] This option should only be included if the amount is denominated in USD cents. No value is passed with this option, just '--usd' when you want 'true'. If it is not included, it defaults to 'false'",
        false
    )
    .option("-d, --debug", "[Optional] Print debug info", false)
    .action(signSend);

program.parse(process.argv);
