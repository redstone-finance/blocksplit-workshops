// ~~ Write types for your contract ~~

export interface PstState {}

// represents contract's interaction
// two properties: caller and input
export interface PstAction {}

// ability to write three inputs: function, target, qty
export interface PstInput {}

// object possible to be returned by interacting with the contract when the state is not being changed
// target, ticker, balance
export interface PstResult {}

// mint, transfer, balance
export type PstFunction = '';

// contract's handler function should be terminated either by state or result
export type ContractResult = '';
