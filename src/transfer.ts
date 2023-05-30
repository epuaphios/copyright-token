// Copyright © Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-console */

// import dotenv from 'dotenv';
// dotenv.config();

import {AptosClient, AptosAccount, CoinClient, FaucetClient,HexString} from "aptos";
import {NODE_URL,FAUCET_URL,aptosCoinStore} from "./common";
import * as yaml from 'js-yaml';
import * as fs from 'fs';


(async () => {
    // Create API and faucet clients.
    // :!:>section_1
    const client = new AptosClient(NODE_URL);
    // const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL); // <:!:section_1
    const fileContents = fs.readFileSync('.aptos/config.yaml', 'utf8');
    const data: any = yaml.load(fileContents);
    // console.log(data);
    const privateKey = data.profiles.default.private_key;
    // console.log(privateKey);


    // Create client for working with the coin module.
    // :!:>section_1a
    const coinClient = new CoinClient(client); // <:!:section_1a

    const hexObj = new HexString(privateKey);
    const alice = new AptosAccount(hexObj.toUint8Array());

    console.log(alice.address()); // account adresini yazdir

    const accountAddress = new HexString("0x9399b56f9283799b6f44a8e5979090b56433a04ead7ea481e14231e88379b43b")

    // const accountAddress = "0x9399b56f9283799b6f44a8e5979090b56433a04ead7ea481e14231e88379b43b";

    // Create accounts.
    // :!:>section_2
    // const alice = new AptosAccount();
    // const bob = new AptosAccount(); // <:!:section_2

    // Print out account addresses.
    console.log("=== Addresses ===");
    console.log(`Alice: ${alice.address()}`);
    console.log(`Bob: ${accountAddress}`);
    console.log("");

    // Fund accounts.
    // :!:>section_3
    // await faucetClient.fundAccount(accountAddress, 100_000_000_000);
    // await faucetClient.fundAccount(accountAddress, 0); // <:!:section_3
    // Have Alice send Bob some more AptosCoins.
    let txnHash = await coinClient.transfer(alice, accountAddress, 100_000 ,{ createReceiverIfMissing: true });
    // :!:>section_6b
    await client.waitForTransaction(txnHash, {checkSuccess: true}); // <:!:section_6b
    // Print out initial balances.
    console.log("=== Initial Balances ===");
    // :!:>section_4
    console.log(`Alice: ${await coinClient.checkBalance(alice, {coinType: aptosCoinStore})}`);
    // console.log(`Bob: ${await coinClient.checkBalance(bob)}`); // <:!:section_4
    console.log("");

    // Have Alice send Bob some AptosCoins.
    // :!:>section_5
    txnHash = await coinClient.transfer(alice, accountAddress, 100, {coinType: aptosCoinStore , createReceiverIfMissing: true}); // <:!:section_5
    // :!:>section_6a
    await client.waitForTransaction(txnHash, {checkSuccess: true}); // <:!:section_6a

    // Print out intermediate balances.
    console.log("=== Intermediate Balances ===");
    console.log(`Alice: ${await coinClient.checkBalance(alice)}`);
    // console.log(`Bob: ${await coinClient.checkBalance(accountAddress)}`);
    console.log("");

    // Have Alice send Bob some more AptosCoins.
    txnHash = await coinClient.transfer(alice, accountAddress, 1_000_000, {coinType: aptosCoinStore});
    // :!:>section_6b
    await client.waitForTransaction(txnHash, {checkSuccess: true}); // <:!:section_6b

    // Print out final balances.
    console.log("=== Final Balances ===");
    console.log(`Alice: ${await coinClient.checkBalance(alice)}`);
    // console.log(`Bob: ${await coinClient.checkBalance(accountAddress)}`);
    console.log("");
})();