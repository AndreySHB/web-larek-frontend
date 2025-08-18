import {Model} from "../base/Model";
import {IProduct} from "../../types";

export class Product extends Model<IProduct> {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
}