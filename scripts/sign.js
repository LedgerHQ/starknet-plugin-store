const {
    defaultProvider,
    ec,
    number,
    Provider,
    hash,
} = require('starknet');

const fs = require('fs');

const privateKey = process.env.STARKNET_PRIVATE_KEY ?? "";
const starkKeyPair = ec.getKeyPair(privateKey);

const provider = new Provider({
    sequencer: {
        baseUrl: "https://alpha-mainnet.starknet.io",
    }
});
console.log(provider.chainId)
const pubKey = ec.getStarkKey(starkKeyPair);
console.log(`Public Key: ${pubKey}`);
const bnPubKey = ec.ec.curve.pointFromX(number.toBN(pubKey)).encode(true, "hex");
const inferredKeyPair = ec.getKeyPairFromPublicKey(bnPubKey);
const data = fs.readFileSync('src/listing.json', 'utf8');
const jsonData = JSON.parse(data);
let i = 0;
for (const plugin of jsonData) {
    console.log(plugin.name);
    const classHash = plugin.id;
    const msgHash = hash.calculateDeclareTransactionHash(
        classHash,
        pubKey,
        1,
        undefined,
        provider.chainId,
        undefined
    );
    if (isPluginSigned(inferredKeyPair, msgHash, plugin.signature) == false) {
        const signature = ec.sign(starkKeyPair, msgHash)
        plugin.signature = signature;
        console.log(`New sign of Ledger for Classhash: ${classHash}\nSignature: ${signature}`);
        if(ec.verify(inferredKeyPair, msgHash, signature) == false)
            throw new Error("ERROR: Something went wrong with the sign");
    } else {
        console.log(`Classhash: ${classHash}\nAlready registered by Ledger`);
    }
    i++;
}

const jsonString = JSON.stringify(jsonData, null, 2);
const filePath = "src/"

if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
}

try {
    fs.writeFileSync(filePath + "listing.json", jsonString);
    console.log(`File listing.json has been updated`);
} catch (err) {
    console.error(err);
}

function isPluginSigned(inferredKeyPair, msgHash,signature) {
    try {
        if (ec.verify(inferredKeyPair, msgHash, signature) == false)
            return false;
        else return true;
    } catch {
        return false 
    }
}