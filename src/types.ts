export type PluginLedger = { 
    id: string, // classhash
    signature: string[2], //signature is an array of 2
    name: string,
    description?: string,
  }
  
export type Listing = PluginLedger[];