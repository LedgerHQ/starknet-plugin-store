export type PluginLedger = { 
    id: string, // classhash
    signature: string,
    name: string,
    description?: string,
  }
  
export type Listing = PluginLedger[];