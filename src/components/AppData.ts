import {Model} from "./base/Model";
import {IAppState, IBasket, IProduct} from "../types";
import {IEvents} from "./base/events";

export class Product extends Model<IProduct> {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
}

export class Basket extends Model<IBasket> {
    items: Map<string, number> = new Map();

    add(id: string): void {
        if (!this.items.has(id)) this.items.set(id, 0);
        this.items.set(id, this.items.get(id)! + 1);
        this.emitChanges('basket:change', Array.from(this.items.keys()));
    }

    remove(id: string): void {
        if (!this.items.has(id)) return;
        if (this.items.get(id)! > 0) {
            const currentCount = this.items.get(id) - 1;
            if (currentCount > 0) {
                this.items.set(id, currentCount);
            } else {
                this.items.delete(id);
            }
        }
        this.emitChanges('basket:change', Array.from(this.items.keys()));
    }

    emitChanges(event: string, payload: object | undefined): void {
        this.events.emit(event, payload)
    }
}

export type CatalogChangeEvent = {
    catalog: Product[]
};

export class AppState extends Model<IAppState> {
    catalog: Product[];
    basket: Basket;
    preview: string | null;

    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);
        this.basket = new Basket({}, events);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('items:changed', {catalog: this.catalog});
    }

    setPreview(item: Product) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addToBasket(item: Product) {
        this.basket.add(item.id);
    }
}