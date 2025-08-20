import {View} from "../base/View";
import {EventEmitter} from "../base/events";
import {createElement, ensureElement} from "../../utils/utils";

interface IBasketView {
    items: HTMLElement[];
    price: number;
    orderButton: HTMLElement;
}

export class BasketView extends View<IBasketView> {
    protected _list: HTMLElement;
    protected _price: HTMLElement;
    protected _orderButton: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._price = this.container.querySelector('.basket__price');
        this._orderButton = this.container.querySelector('.basket__button');
        this._orderButton.addEventListener('click', () => events.emit('order:start'))
        this.items = [];
    }

    set items(items: HTMLElement[]) {
        if (items && items.length) {
            this._list.replaceChildren(...items);
            this.setDisabled(this._orderButton, false);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this.setDisabled(this._orderButton, true);
        }
    }

    set price(price: number) {
        this.setText(this._price, price);
    }
}