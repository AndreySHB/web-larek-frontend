import {Model} from "../base/Model";
import {IBasket, IProduct} from "../../types";

export class BasketModel extends Model<IBasket> {
    items: Map<string, number> = new Map();
    totalPrice = 0;
    totalItems = 0;

    add(product: IProduct): void {
        const id = product.id;
        if (!this.items.has(id)) this.items.set(id, 0);
        this.items.set(id, this.items.get(id)! + 1);
        this.totalPrice += product.price;
        this.totalItems++;
        this.emitChanges('basket:change', this.totalItems as unknown as object);
    }

    remove(product: IProduct): void {
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

    get(product: IProduct): number {
        const count = this.items.get(product.id);
        return count ? count : 0;
    }

    emitChanges(event: string, payload: object | undefined): void {
        this.events.emit(event, payload)
    }
}