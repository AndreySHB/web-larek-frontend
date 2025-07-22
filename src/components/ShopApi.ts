import { Api, ApiListResponse } from './base/api';
import {IProduct} from "../types";

export interface IShopAPI {
    getProducts: () => Promise<IProduct[]>;
}

export class ShopAPI extends Api implements IShopAPI {

    readonly cdn: string;

    constructor(baseUrl: string, cdn: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getProducts(): Promise<IProduct[]> {
        return this.get('/product').then((data: ApiListResponse<IProduct>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }
}