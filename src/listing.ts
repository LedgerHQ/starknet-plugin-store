import {Listing} from './types';
import * as fs from 'fs';
//plugins list
const pluginList: Listing = [
]

//create JSON file from the list
const jsonString = JSON.stringify(pluginList, null, 2);
const filePath = "out/"

if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath);
}

try {
    fs.writeFileSync(filePath + "listing.json", jsonString);
    console.log(`File listing.json has been created or updated`);
} catch (err) {
    console.error(err);
}