# Loop CLI

## Install

```
npm install -g @loop-crypto/loop-cli
```

If you get an access denied error, try running `npm install` with elevated permissions:

-   Mac/Linux: `sudo npm install -g @loop-crypto/loop-cli`
-   Windows: Right-click Command prompt, click `Run as administrator` and then run `npm install -g @loop-crypto/loop-cli` again

<br />

## Setup

Create a configuration file in a convenient directory, the file can be named anything but must have `.txt` extension. For example,

-   `/Users/<USERNAME>/Desktop/config.txt` on a Mac, or
-   `C:\Users\<USERNAME>\Desktop\config.txt` on Windows.

The name and location of this file is important as it will be passed as a parameter to the specific command you are running (`sign`, `signAndSend` etc), so make sure to keep a note of it.

The contents of the file should contain the following key=value pairs:

| Key                | Description                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| SIGNER_PRIVATE_KEY | The private key of the wallet address that is configured as the `signer` wallet in the contract                                             |
| CONTRACT_ADDRESS   | The address of the contract the transfer request will be sent to                                                                            |
| NETWORK_ID         | The network ID that the contract is deployed to. See `Chain ID's` in the `Configuration` section below to determine which network ID to use |
| APP_API_URL        | The URL of the Loop API. See `Loop API` in the `Configuration` section below for the URL to use on a specific environment                   |
| APP_API_KEY        | The API key to use to make the API call. This will be sent to you during onboarding                                                         |
| API_ENTITY_ID      | The entity ID assigned to you. This will be sent to you during onboarding, or is available on the company portal on the `Developer` page.   |

For example:

```
SIGNER_PRIVATE_KEY=1234567890987654321
CONTRACT_ADDRESS=0x0f8b7433D045832f19Ca46183BE23502946F8Da8
NETWORK_ID=137
APP_API_URL=https://api.loopcrypto.xyz
APP_API_KEY=1234-5678-9087
API_ENTITY_ID=a49f6aeb-886b-11ed-9b88-0242ac120002
```

**NOTE**: Values should _not_ contain quotation marks

<br />

## Usage

<br />

### The `sign` command

<br />

In order to send a valid transfer request to Loop, the request must contain a signature field. This `sign` CLI command will generate this signature for you by using a combination of the configuration parameters set in the config file, and the fields describing the details of the individual transfer.

The message being signed is made of 6 fields which represent the details of the transfer itself:

1. `invoiceId` - Invoice ID for the payment. Invoiced ID's should be unique per payment
1. `from` - The wallet address the funds are coming from
1. `to` - The wallet address the funds are going to
1. `token` - The address of the token used as payment
1. `amount` - The invoice amount. Can either be specified in USD cents, or the native token. For example, if the invoice amount is \$29.99, the `amount` field would be `2999`. See more examples below
1. `usd` - A true/false flag indicating whether the `amount` was specified in USD.

As a result, each of the 6 fields above need to be specified as input to the `sign` command in order to generate a valid signature. The complete list of available parameter is as follows:

```
Options:
  -c, --config-file-path <value>  Full path to the file containing config information (eg. /Users/<USERNAME>/Desktop/config.txt)
  --invoice-id <value>            Invoice ID for the transfer
  --from-address <value>          Wallet address funds are pulled from
  --to-address <value>            Wallet address funds are going to
  --token-address <value>         Address of the token used as payment
  --amount <value>                Amount to bill. If '--usd' flag is present, specify the amount in USD cents (e.g. 2999 for $29.99). If '--usd' flag is not present, specify the native token amount (e.g. 1000000 for 1 USDC).
  --usd                           [Optional] This option should only be included if the amount is denominated in USD cents. No value is passed with this option, just '--usd' when you want 'true'. If it is not included, it defaults to 'false'
  -d, --debug                     [Optional] Print debug info (default: false)
  -h, --help                      display help for command
```

<br />

### Examples:

1. Sign a message for a transfer where the token is USDC and the amount is denominated in the **native token amount (USDC)**.
    - USDC on Polygon mainnet has 6 decimal places
    - An amount of 100 USDC is represented as `100 * 10**(token decimal places)` -> `100 * 10**6`. So the amount value should be passed in as `100000000`
    - Note: the `--usd` flag is _not_ passed since it defaults to `false` and the amount is denominated in the token amount

```
loop-cli sign \
    -c ./config.txt \
    --invoice-id=inv_1000 \
    --from-address=0xfc667b40851c3b1e50b31a8e9a206fa7934acf64 \
    --to-address=0xBf754A290cBd1E92041FaD676a331DD35939B1fD \
    --token-address=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 \
    --amount=100000000
```

2. Sign a message for a transfer where the token is WETH and the amount is denominated in the **native token amount (WETH)**.
    - WETH on Polygon mainnet has 18 decimal places
    - An amount of 0.02 is represented as `0.02 * 10**(token decimal places)` -> `0.02 * 10**18`. So the amount value should be passed in as `20000000000000000`
    - Note: the `--usd` flag is _not_ passed since it defaults to `false` and the amount is denominated in the token amount

```
loop-cli sign \
    -c ./config.txt \
    --invoice-id=inv_1001 \
    --from-address=0xfc667b40851c3b1e50b31a8e9a206fa7934acf64 \
    --to-address=0xBf754A290cBd1E92041FaD676a331DD35939B1fD \
    --token-address=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 \
    --amount=20000000000000000
```

3. Sign a message for a transfer where the token is USDC and the amount is denominated in **USD cents**.
    - An amount of \$29.99 should be converted to cents (`29.99 * 100`) so the amount value should be `2999`
    - In this case, the `--usd` flag _must_ be passed to indicate that the `amount` is in USD cents

```
loop-cli sign \
    -c ./config.txt \
    --invoice-id=inv_1002 \
    --from-address=0xfc667b40851c3b1e50b31a8e9a206fa7934acf64 \
    --to-address=0xBf754A290cBd1E92041FaD676a331DD35939B1fD \
    --token-address=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 \
    --amount=2999 \
    --usd
```

#### Output

The output of the `sign` command is the signature that is needed as a parameter for the transfer request.

```
📝  Generated Signature:  0x00000e022a4a9d04f9c186b98a2787de48f3f53ed80da4f8a03d836e4bf7d1d745d70cddcf2fe25562e51c959720a5bf0662afae57e6c55a0196694e4130e00000
```

<br />

---

### The `signAndSend` command

<br />

This command combines the above signature step with actually submitting the transfer request to Loop. There are additional fields that need to be passed to this command that are required to successfully send a transfer request.

Validations:

-   The signature must be signed by the wallet address that is saved in the contract
-   The `invoice-id`, `from-address`, `to-address`, `token-address`, `amount` and `usd` combination must be unique
-   The `bill-date`, if specified, must be a valid [UNIX timestamp](https://en.wikipedia.org/wiki/Unix_time) in seconds. If omitted, it defaults to `0` which indicates that the transfer will be executed immediately<sup>\*</sup>
-   The `token-address` must match the token the `from-address` gave the authorization for originally
-   The `item-id` must be a valid item linked to your entity ID. Initial item ID's will be sent to you during onboarding but will also be available on the company portal
-   The `entity-id`, if specified, must be a valid _child_ entity ID of the entity ID specified in the config file

If any of the validations fail, the transfer request will not send and return the relevant error message explaining why it failed

**NOTE**: There is a prompt you have to confirm before the request actually gets sent

The full list of parameters is as follows:

```
Options:
  -c, --config-file-path <value>  Full path to the file containing config information (eg. /Users/<USERNAME>/Desktop/config.txt)
  --invoice-id <value>            Invoice ID for the transfer
  --from-address <value>          Wallet address funds are pulled from
  --to-address <value>            Wallet address funds are going to
  --token-address <value>         Address of the token used as payment
  --amount <value>                Amount to bill. If '--usd' flag is present, specify the amount in USD cents (e.g. 2999 for $29.99). If '--usd' flag is not present, specify the native token amount (e.g. 1000000 for 1 USDC).
  --item-id <value>               Loop Item ID that is associated with the transfer
  --entity-id <value>             [Optional] The child entity ID that the item being billed is linked to. If omitted, the transfer will be linked to the entity ID in the config file
  --bill-date <value>             [Optional] The date the transfer should be executed on, formatted as a UNIX timestamp in seconds. 0 value indicates immediate processing (default: 0)
  --usd                           [Optional] This option should only be included if the amount is denominated in USD cents. No value is passed with this option, just '--usd' when you want 'true'. If it is not included, it defaults to 'false'
  -d, --debug                     [Optional] Print debug info (default: false)
  -h, --help                      display help for command

```

### Examples:

1. Send a transfer request for 100 USDC for item `00000556-9315-4b09-ac65-19929e500000`
    - The invoice will be executed immediately<sup>\*</sup> because the `billDate` is omitted

```
loop-cli signAndSend \
    -c ./config.txt \
    --invoice-id=inv_1003 \
    --from-address=0xfc667b40851c3b1e50b31a8e9a206fa7934acf64 \
    --to-address=0xBf754A290cBd1E92041FaD676a331DD35939B1fD \
    --token-address=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 \
    --amount=100000000 \
    --item-id=00000556-9315-4b09-ac65-19929e500000
```

2. Send a transfer request for 0.02 WETH for item `00000556-9315-4b09-ac65-19929e500000`
    - The transfer request will be executed on `Monday, January 30, 2023 3:36:29 PM GMT-06:00` (future date)

```
loop-cli signAndSend \
    -c ./config.txt \
    --invoice-id=inv_1003 \
    --from-address=0xfc667b40851c3b1e50b31a8e9a206fa7934acf64 \
    --to-address=0xBf754A290cBd1E92041FaD676a331DD35939B1fD \
    --token-address=0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 \
    --amount=20000000000000000 \
    --item-id=00000556-9315-4b09-ac65-19929e500000 \
    --bill-date=1675114589
```

2. Send a transfer request for \$29.99 in USDC for item `00000556-9315-4b09-ac65-19929e500000` for child entity `00000456-637a-11ed-8ba7-06a00de00000`
    - The transfer request will be executed on `Wednesday, March 8, 2023 3:36:29 PM GMT-06:00` (future date)

```
loop-cli signAndSend \
    -c ./config.txt \
    --invoice-id=inv_1003 \
    --from-address=0xfc667b40851c3b1e50b31a8e9a206fa7934acf64 \
    --to-address=0xBf754A290cBd1E92041FaD676a331DD35939B1fD \
    --token-address=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174 \
    --amount=2999 \
    --usd \
    --item-id=00000556-9315-4b09-ac65-19929e500000 \
    --entity-id=00000456-637a-11ed-8ba7-06a00de00000 \
    --bill-date=1678311389
```

#### Output

The output of the `signAndSend` command is the generated signature and the resulting transfer request that got created.

```
📝  Generated Signature:  0x00000e022a4a9d04f9c186b98a2787de48f3f53ed80da4f8a03d836e4bf7d1d745d70cddcf2fe25562e51c959720a5bf0662afae57e6c55a0196694e4130e00000
prompt: [Y/y] to confirm sending the transfer request to Loop:  Y
Sending signature to Loop...
🙌 Success! The following transfers are created:
[
  {
    transferId: '000008d1-cbde-47c6-972b-8338bf800000',
    invoiceId: 'ch_1j2IO92eZvKYlo2C0RYzSD7s',
    billDate: 1670971812,
    entityId: '00000456-637a-11ed-8ba7-06a00de00000',
    networkId: 5,
    toAddress: '0x000002BA12aed17BEe075F7AEabC24b98E300000',
    fromAddress: '0x00000ce746f129a9df375af2ddcf909753100000',
    amount: '1000000',
    token: '0x00000ca1f2de4661ED88A30C99A7a9449Aa00000',
    usd: false,
    itemId: '00000556-9315-4b09-ac65-19929e500000',
    status: 1,
    decodedSignature: {
      v: 27,
      r: '0x00000d232bcee3b6d12cf7bdf24571b28fc2425bdef15062f23739654fd00000',
      s: '0x00000d844a48c0367fec5ce6a825459443694bd84b6ea051c20548d598200000'
    }
  }
]
```

<br />

## Configuration

<br />

### Loop API

| Environment | Network ID | API URL                         |
| ----------- | :--------: | ------------------------------- |
| Production  |  1 or 137  | https://api.loopcrypto.xyz      |
| Demo        |     5      | https://demo.api.loopcrypto.xyz |

<br />

### Ethereum: Network ID's and token addresses:

| Chain    | Network | Network ID | Token Symbol | Token Address                                                                                                              |
| -------- | ------- | :--------: | ------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Ethereum | mainnet |     1      | USDC         | [0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48](https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48)        |
| Ethereum | mainnet |     1      | WBTC         | [0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599](https://etherscan.io/token/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599)        |
| Ethereum | mainnet |     1      | WETH         | [0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2](https://etherscan.io/token/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2)        |
| Ethereum | mainnet |     1      | USDT         | [0xdAC17F958D2ee523a2206206994597C13D831ec7](https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7)        |
| Ethereum | mainnet |     1      | DAI          | [0x6B175474E89094C44Da98b954EedeAC495271d0F](https://etherscan.io/token/0x6B175474E89094C44Da98b954EedeAC495271d0F)        |
| Ethereum | mainnet |     1      | BUSD         | [0x4Fabb145d64652a948d72533023f6E7A623C7C53](https://etherscan.io/token/0x4Fabb145d64652a948d72533023f6E7A623C7C53)        |
| Ethereum | mainnet |     1      | FRAX         | [0x853d955aCEf822Db058eb8505911ED77F175b99e](https://etherscan.io/token/0x853d955aCEf822Db058eb8505911ED77F175b99e)        |
| Ethereum | goerli  |     5      | USDC         | [0x07865c6e87b9f70255377e024ace6630c1eaa37f](https://goerli.etherscan.io/token/0x07865c6e87b9f70255377e024ace6630c1eaa37f) |
| Ethereum | goerli  |     5      | WBTC         | [0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05](https://goerli.etherscan.io/token/0xC04B0d3107736C32e19F1c62b2aF67BE61d63a05) |
| Ethereum | goerli  |     5      | WETH         | [0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6](https://goerli.etherscan.io/token/0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6) |

<br />

### Polygon: Network ID's and token addresses:

| Chain   | Network | Network ID | Token Symbol | Token Address                                                                                                          |
| ------- | ------- | :--------: | ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Polygon | mainnet |    137     | USDC         | [0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174](https://polygonscan.com/token/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174) |
| Polygon | mainnet |    137     | WBTC         | [0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6](https://polygonscan.com/token/0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6) |
| Polygon | mainnet |    137     | WETH         | [0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619](https://polygonscan.com/token/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619) |
| Polygon | mainnet |    137     | USDT         | [0xc2132D05D31c914a87C6611C10748AEb04B58e8F](https://polygonscan.com/token/0xc2132D05D31c914a87C6611C10748AEb04B58e8F) |
| Polygon | mainnet |    137     | DAI          | [0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063](https://polygonscan.com/token/0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063) |
| Polygon | mainnet |    137     | BUSD         | [0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7](https://polygonscan.com/token/0xdAb529f40E671A1D4bF91361c21bf9f0C9712ab7) |
| Polygon | mainnet |    137     | FRAX         | [0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89](https://polygonscan.com/token/0x45c32fA6DF82ead1e2EF74d17b76547EDdFaFF89) |
