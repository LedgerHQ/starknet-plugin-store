const fs = require('fs');
const process = require('process');
const pinataSDK = require('@pinata/sdk');

const API_KEY = process.env.API_KEY;

const API_SECRET = process.env.API_SECRET;

const filters = {
    status: 'pinned'
}

const pinata = new pinataSDK(API_KEY, API_SECRET);

pinata.testAuthentication().then((result) => {
    //handle successful authentication here
    console.log(result);
}).catch((err) => {
    //handle error here
    console.log(err);
    process.exit(1);
});

async function main() {

    const pin = await pinata.pinList(filters);
    for (let i = 0; i < pin.rows.length; i++)
        await pinata.unpin(pin.rows[i].ipfs_pin_hash).then((result) => {
            //handle results here
            console.log("Unpin done");
        }).catch((err) => {
            //handle error here
            console.log(err);
        });
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
    await pinata.pinJSONToIPFS(jsonData, options).then((result) => {
        //handle results here
        //show the address of the JSON file on IPFS by using Pinata
        console.log(`Link IPFS: https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`);
    }).catch((err) => {
        //handle error here
        console.log(err);
    });
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
