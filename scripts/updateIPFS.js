const fs = require('fs');
const process = require('process');
const pinataSDK = require('@pinata/sdk');

const API_KEY = process.env.API_KEY;

const API_SECRET = process.env.API_SECRET;

const filters = {
    status: 'pinned'
}

const pinata = new pinataSDK(API_KEY, API_SECRET);


async function main() {

    await pinata.testAuthentication()
    const pin = await pinata.pinList(filters);
    for (let i = 0; i < pin.rows.length; i++) {
        await pinata.unpin(pin.rows[i].ipfs_pin_hash)
        console.log("Unpin done")
    }
    //retrieve the JSON of the plugins list
    const data = fs.readFileSync('src/listing.json', 'utf8');
    const jsonData = JSON.parse(data);

    //setup pinata options
    const options = {
        pinataMetadata: {
            name: "Plugins List",
        },
        pinataOptions: {
            cidVersion: 1
        }
    }
    //add pin new json on pinata
    const pinResult = await pinata.pinJSONToIPFS(jsonData, options)
    //show the address of the JSON file on IPFS by using Pinata
    console.log(`Link IPFS: ${process.env.PINATA_GATEWAY}/ipfs/${pinResult.IpfsHash}`);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
