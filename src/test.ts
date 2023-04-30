import * as fs from "fs";
import { NODE_URL, FAUCET_URL } from "./common";
import { AptosAccount, AptosClient, TxnBuilderTypes, MaybeHexString, HexString, FaucetClient } from "aptos";import * as path from "path";
import * as yaml from "js-yaml";

const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});
class CoinClient extends AptosClient {
    constructor() {
        super(NODE_URL);
    }

    async registerCoin(coinTypeAddress: HexString, coinReceiver: AptosAccount): Promise<string> {
        const rawTxn = await this.generateTransaction(coinReceiver.address(), {
            function: "0x1::managed_coin::register",
            type_arguments: [`${coinTypeAddress.hex()}::copyright_coin::CopyrightCoin`],
            arguments: [],
        });

        const bcsTxn = await this.signTransaction(coinReceiver, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);

        return pendingTxn.hash;
    }
    async mintCoin(minter: AptosAccount, receiverAddress: HexString, amount: number | bigint): Promise<string> {
        const rawTxn = await this.generateTransaction(minter.address(), {
            function: "0x1::managed_coin::mint",
            type_arguments: [`${minter.address()}::copyright_coin::CopyrightCoin`],
            arguments: [receiverAddress.hex(), amount],
        });

        const bcsTxn = await this.signTransaction(minter, rawTxn);
        const pendingTxn = await this.submitTransaction(bcsTxn);

        return pendingTxn.hash;
    }
}
    async function main() {

        /** Register the receiver account to receive transfers for the new coin. */

        const modulePath = process.argv[2];
        const packageMetadata = fs.readFileSync(path.join(modulePath, "build", "Examples", "package-metadata.bcs"));
        const moduleData = fs.readFileSync(path.join(modulePath, "build", "Examples", "bytecode_modules", "copyright_coin.mv"));

        console.log("Publishing copyright package.");

        const client = new CoinClient();

        const fileContents = fs.readFileSync('.aptos/config.yaml', 'utf8');
        const data: any = yaml.load(fileContents);
// console.log(data);
        const privateKey = data.profiles.default.private_key;
// console.log(privateKey);

        const hexObj = new HexString(privateKey);
        const alice = new AptosAccount(hexObj.toUint8Array());

        let txnHash = await client.publishPackage(alice, new HexString(packageMetadata.toString("hex")).toUint8Array(), [
            new TxnBuilderTypes.Module(new HexString(moduleData.toString("hex")).toUint8Array()),
        ]);

        await client.waitForTransaction(txnHash, {checkSuccess: true});

        txnHash = await client.registerCoin(alice.address(), alice);
        await client.waitForTransaction(txnHash, { checkSuccess: true });
        txnHash = await client.mintCoin(alice, alice.address(), 100);
        await client.waitForTransaction(txnHash, { checkSuccess: true });

    }
if (require.main === module) {
    main().then((resp) => console.log(resp));
}

