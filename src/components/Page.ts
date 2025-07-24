import {View} from "./base/View";
import {ensureElement} from "../utils/utils";

interface IPage {
    catalog: HTMLElement[];
}

export class Page extends View<IPage> {
    protected _catalog: HTMLElement;
    protected _basketCounter: HTMLElement;


    constructor(container: HTMLElement) {
        super(container);
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter');
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set basketCount(size: number) {
        this._basketCounter.textContent=String(size);
    }
}