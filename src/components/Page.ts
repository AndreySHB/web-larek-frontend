import {View} from "./base/View";
import {ensureElement} from "../utils/utils";

interface IPage {
    catalog: HTMLElement[];
}

export class Page extends View<IPage> {
    protected _catalog: HTMLElement;


    constructor(container: HTMLElement) {
        super(container);
        this._catalog = ensureElement<HTMLElement>('.gallery');
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    protected doRender() {
    }
}