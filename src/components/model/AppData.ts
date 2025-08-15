import {Model} from "../base/Model";
import {IAppState, IBasket, IProduct} from "../../types";
import {IEvents} from "../base/events";

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
    totalPrice: number = 0;
    totalItems: number = 0;

    add(product: Product): void {
        const id = product.id;
        if (!this.items.has(id)) this.items.set(id, 0);
        this.items.set(id, this.items.get(id)! + 1);
        this.totalPrice += product.price;
        this.totalItems++;
        this.emitChanges('basket:change', this.totalItems as unknown as object);
    }

    remove(product: Product): void {
        const id = product.id;
        if (!this.items.has(id)) return;
        if (this.items.get(id)! > 0) {
            this.totalPrice -= product.price;
            this.totalItems--;
            const currentCount = this.items.get(id) - 1;
            if (currentCount > 0) {
                this.items.set(id, currentCount);
            } else {
                this.items.delete(id);
            }
        }
        this.emitChanges('basket:change', this.totalItems as unknown as object);
    }

    emitChanges(event: string, payload: object | undefined): void {
        this.events.emit(event, payload)
    }
}

export class AppState extends Model<IAppState> {
    catalog: Map<string, Product>;
    basket: Basket;
    preview: string | null;

    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);
        this.basket = new Basket({}, events);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = new Map<string, Product>();
        items.forEach(item => {
            this.catalog.set(item.id, new Product(item, this.events))
        })
        this.emitChanges('items:changed');
    }

    setPreview(item: Product) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }

    addToBasket(item: Product) {
        this.basket.add(item);
    }
}