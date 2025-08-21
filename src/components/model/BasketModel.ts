import {Model} from "../base/Model";
import {IBasket, IProduct} from "../../types";

export class BasketModel extends Model<IBasket> {
    items: Map<IProduct, number> = new Map();

    add(product: IProduct): void {
        if (!this.items.has(product)) this.items.set(product, 0);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.items.set(product, this.items.get(product)! + 1);
        this.emitChanges('basket:change', {});
    }

    remove(product: IProduct): void {
        if (!this.items.has(product)) return;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.items.get(product)! > 0) {
            const currentCount = this.items.get(product) - 1;
            if (currentCount > 0) {
                this.items.set(product, currentCount);
            } else {
                this.items.delete(product);
            }
        }
        this.emitChanges('basket:change', {});
    }

    get(product: IProduct): number {
        const count = this.items.get(product);
        return count ? count : 0;
    }

    getTotalItems(): number {
        return Array.from(this.items.values()).reduce((acc, value) => acc + value, 0);
    }

    getTotalPrice(): number {
        return Array.from(this.items.entries()).reduce((acc, entry) => acc + entry[0].price * entry[1], 0);
    }

    clear(): void {
        this.items = new Map();
        this.emitChanges('basket:change', {});
    }
}