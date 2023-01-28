import {Listing} from '../src/types';
import * as fs from 'fs';
import {TsjsonParser, createSchema as S } from 'ts-json-validator'

export function checkListingJSON(): Boolean {
    const schemaPlugin = new TsjsonParser(
        S({ type: "array", items:
            S({
              type: "object",
              properties: {
                id: S({ type: "string"}),
                signature: S({ type: "array", 
                    items: S({type: "string"}),
                }),
                name: S({ type: "string" }),
                description: S({ type: "string" }),
              },
              required: ["id", "signature", "name"] // possible fields autocomplete here
            })
        })
    );
    try {
        const data = fs.readFileSync('./src/listing.json', 'utf8');
        const jsonData = JSON.parse(data);
        const stringToParse = JSON.stringify(jsonData);
        const parsed = schemaPlugin.parse(stringToParse);
        return true;
    } catch(e) {
        console.error(e);
        return false;
    }
}

const result = checkListingJSON();
console.log(`List correct: ${result.toString()}`);
result ? process.exit(0) : process.exit(1);