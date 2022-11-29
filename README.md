# Loop CLI

## Install
```
npm install -g loop-cli
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
  -d, --debug                     Print debug info? (default: false)
  -c, --config-file-path <value>  Full path to the file containing config information
  --invoice-id <value>            Invoice ID related to the transfer
  --from-address <value>          Wallet address funds are pulled from
  --to-address <value>            Wallet address funds are going to
  --token-address <value>         Address of the token used to pay
  --amount <value>                Amount to bill
  --usd                           Is the amount denominated in USD? Omit if false (default: false)
  -h, --help                      display help for command
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

### The `sign-and-send` command
**Coming soon...**