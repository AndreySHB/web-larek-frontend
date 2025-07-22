import {EventEmitter} from "../components/base/events";

export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
}

export interface IAppState {
    catalog: IProduct[];
    basket: IBasket[];
}

export interface IBasket {
    items: Map<string, number>;

    add(id: string): void;

    remove(id: string): void;
}