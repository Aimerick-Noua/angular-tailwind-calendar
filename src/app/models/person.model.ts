import { Address } from "./address.model";

export interface Person {
    readonly id: number;
    readonly name: string;
    readonly address: Address;
}