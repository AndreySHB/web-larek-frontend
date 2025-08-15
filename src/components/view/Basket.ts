import {View} from "../base/View";
import {EventEmitter} from "../base/events";
import {createElement, ensureElement} from "../../utils/utils";

interface IBasketView {
    items: HTMLElement[];
    price: number;
}

export class Basket extends View<IBasketView> {
    protected _list: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._price = this.container.querySelector('.basket__price');

        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        }
    }

    // set selected(items: string[]) {
    //     if (items.length) {
    //         this.setDisabled(this._button, false);
    //     } else {
    //         this.setDisabled(this._button, true);
    //     }
    // }

    set price(price: number) {
        this.setText(this._price, price);
    }
}