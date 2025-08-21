import {Model} from "../base/Model";
import {IProduct} from "../../types";

export class Product extends Model<IProduct> {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;

    equals(other: IProduct): boolean {
        return this.id === other.id;
    }

    hashCode(): string {
        return this.id;
    }
}