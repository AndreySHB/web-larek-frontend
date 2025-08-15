import {View} from "../base/View";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";

interface IPage {
    catalog: HTMLElement[];
}

export class Page extends View<IPage> {
    protected _catalog: HTMLElement;
    protected _basketCounter: HTMLElement;
    protected _basketOpenButton: HTMLElement;


    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
        this._basketOpenButton = ensureElement<HTMLElement>('.header__basket');
        if (this._basketOpenButton) {
                this._basketOpenButton.addEventListener('click', () => {
                    events.emit('basket:open');
                });
        }
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set basketCount(size: number) {
        this._basketCounter.textContent=String(size);
    }
}