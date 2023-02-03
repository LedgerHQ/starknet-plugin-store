//an example of how to retrieve the link of the last push.
const filters = {
    status: 'pinned'
}

async function getLink(pinata) {
    //checking Authentication
    const auth = await pinata.testAuthentication();
    console.log(`Authentification: ${auth.authenticated}`);

    //getting Pin List
    const pin = await pinata.pinList(filters);
    //extracting IPFS Hash
    const ipfsHash = pin.rows[0].ipfs_pin_hash; 
    console.log(`Link IPFS: ${process.env.PINATA_GATEWAY}/ipfs/${ipfsHash}`);

    return `${process.env.PINATA_GATEWAY}/ipfs/${ipfsHash}`;
}

module.exports = { getLink }
