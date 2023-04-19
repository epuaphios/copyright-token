import * as fs from "fs";
import {HexString, TxnBuilderTypes} from "aptos";
import * as path from "path";

const modulePath = process.argv[2];
const packageMetadata = fs.readFileSync(path.join(modulePath, "build", "copyright-token", "package-metadata.bcs"));
const moduleData = fs.readFileSync(path.join(modulePath, "build", "copyright-token", "bytecode_modules", "moon_coin.mv"));

console.log("Publishing MoonCoin package.");
// @ts-ignore
let txnHash = client.publishPackage(alice, new HexString(packageMetadata.toString("hex")).toUint8Array(), [
    new TxnBuilderTypes.Module(new HexString(moduleData.toString("hex")).toUint8Array()),
]);
// @ts-ignore
client.waitForTransaction(txnHash, { checkSuccess: true });


