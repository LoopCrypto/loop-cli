#!/usr/bin/env node
require("dotenv").config();
const program = require("commander");
const sign = require("./lib");

program
    .argument("sign")
    .description("A CLI tool to sign Loop transfer requests")
    .option("--invoice-id <value>", "Invoice ID related to the transfer")
    .option("--from-address <value>", "Wallet address funds are pulled from")
    .option("--to-address <value>", "Wallet address funds are going to")
    .option("--token-address <value>", "Address of the token used to pay")
    .option("--amount <value>", "Amount to bill")
    .option("--usd", "Is the amount denominated in USD?", false)
    .option("-d, --debug", "Print debug info?", false)
    .action(sign)
    .parse(process.argv);
