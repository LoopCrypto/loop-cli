# Loop CLI

## Install

```
npm install -g @loop-crypto/loop-cli
```

## Usage

Create a `config.txt` file in a convenient directory. This file path and file name will be passed as a parameter to each command. The file should contain the following key value pairs:

```
SIGNER_PRIVATE_KEY=<YOUR SIGNER PRIVATE KEY>
CONTRACT_ADDRESS=<YOUR CONTRACT ADDRESS>
NETWORK_ID=<CONTRACT NETWORK ID>
```

**NOTE**: Values should not contain quotation marks

### The `sign` command

The `sign` cli command can be used to generate the signature required in the transfer request. In order to generate the signature, run the `loop-cli` module passing it the `sign` command. The `sign` command takes a number of parameters required to generate a signature.

```
Options:
  -d, --debug                     Print debug info (default: false)
  -c, --config-file-path          Full path to the file containing config information
  --invoice-id                    Invoice ID related to the transfer
  --from-address                  Wallet address funds are pulled from
  --to-address                    Wallet address funds are going to
  --token-address                 Address of the token used to pay
  --amount                        Amount to bill. If --usd=true, specify the amount in dollars (e.g. 29.99 for $29.99). If --usd=false, specify the native token amount (e.g. 1000000 for 1 USDC).
  --usd                           Is the amount denominated in USD? Omit if false (default: false)
  -h, --help                      Display help for command
```

### Example:

```
loop-cli sign
    -c ./config.txt
    --invoice-id=ch_3LjpW92eZvKYlo2C0RYz8S7X
    --from-address=0x00000ce746f129a9df375af2ddcf909753100000
    --to-address=0x000002BA12aed17BEe075F7AEabC24b98E300000
    --token-address=0x00000ca1f2de4661ED88A30C99A7a9449Aa00000
    --amount=100000000
```

#### Output

The output of the `sign` command is the signature that is needed as a parameter for the transfer request.

```
📝  Generated Signature:  0x00000e022a4a9d04f9c186b98a2787de48f3f53ed80da4f8a03d836e4bf7d1d745d70cddcf2fe25562e51c959720a5bf0662afae57e6c55a0196694e4130e00000
```

### The `signAndSend` command

The `signAndSend` cli command can be used to generate and send the the transfer request. This includes signing and providing the required signature in the request parameters. Before the request is sent, there is a prompt that needs to be confirmed

In order to send the request, run the `loop-cli` module passing it the `signAndSend` command. The `signAndSend` command takes the following parameters to sign and send the request -

```
Options:
  -d, --debug                     Print debug info (default: false)
  -c, --config-file-path          Full path to the file containing config information
  --entity-id                     [Optional] Loop Entity ID that the item being billed is linked to. If not provided, the entity id in the config will be used
  --item-id                       Loop Item ID that is associated with the transfer
  --invoice-id                    Invoice ID related to the transfer
  --from-address                  Wallet address funds are pulled from
  --to-address                    Wallet address funds are going to
  --token-address                 Address of the token used to pay
  --amount                        Amount to bill. If --usd=true, specify the amount in dollars (e.g. 29.99 for $29.99). If --usd=false, specify the native token amount (e.g. 1000000 for 1 USDC).
  --usd                           Is the amount denominated in USD? (default: false)
  -h, --help                      Display help for command
```

### Example:

```
loop-cli signAndSend
    -c ./config.txt
    --entity-id=00000456-637a-11ed-8ba7-06a00de00000
    --item-id=00000556-9315-4b09-ac65-19929e500000
    --invoice-id=ch_1j2IO92eZvKYlo2C0RYzSD7s
    --from-address=0x00000ce746f129a9df375af2ddcf909753100000
    --to-address=0x000002BA12aed17BEe075F7AEabC24b98E300000
    --token-address=0x00000ca1f2de4661ED88A30C99A7a9449Aa00000
    --amount=100000000
```

#### Output

The output of the `signAndSend` command is the generated signature and the resulting transfer request that got created.

```
📝  Generated Signature:  0x00000e022a4a9d04f9c186b98a2787de48f3f53ed80da4f8a03d836e4bf7d1d745d70cddcf2fe25562e51c959720a5bf0662afae57e6c55a0196694e4130e00000
prompt: Type "Y" to confirm sending the transfer request to Loop:  Y
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
