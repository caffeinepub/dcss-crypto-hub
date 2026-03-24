import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Stats {
    cyclesConsumed: bigint;
    circulatingSupply: number;
    totalSupply: number;
    txCount: bigint;
    holders: bigint;
}
export interface Token {
    id: bigint;
    name: string;
    price: number;
    symbol: string;
}
export interface Transaction {
    id: bigint;
    walletAddr: string;
    network: string;
    toAddr: string;
    tokenSymbol: string;
    fromAddr: string;
    timestamp: bigint;
    txType: string;
    amount: number;
}
export interface backendInterface {
    getBridgeFee(sourceChain: string, destChain: string, amount: number): Promise<[number, bigint]>;
    getStats(): Promise<Stats>;
    getTokenPrices(): Promise<Array<Token>>;
    getTransactions(walletAddr: string): Promise<Array<Transaction>>;
    recordTransaction(txType: string, tokenSymbol: string, amount: number, fromAddr: string, toAddr: string, network: string, walletAddr: string): Promise<bigint>;
}
