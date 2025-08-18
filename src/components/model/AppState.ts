import {Model} from "../base/Model";
import {IEvents} from "../base/events";
import {BasketModel} from "./BasketModel";
import {IAppState, IBasket, IProduct} from "../../types";
import {Product} from "./Product";



export class AppState extends Model<IAppState> {
    catalog: Map<string, IProduct>;
    basket: IBasket;
    preview: string | null;

    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);
        this.basket = new BasketModel({}, events);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = new Map<string, IProduct>();
        items.forEach(item => {
            this.catalog.set(item.id, new Product(item, this.events))
        })
        this.emitChanges('items:changed');
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }
}