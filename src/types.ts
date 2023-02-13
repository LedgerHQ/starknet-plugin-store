export type PluginLedger = {
  id: string, // classhash
  signature: string[], //signature is an array
  name: string,
  description?: string,
}

export type Listing = PluginLedger[];