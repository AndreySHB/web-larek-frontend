import {View} from "./base/View";
import {ensureElement} from "../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    image: string;
    category: string;
    price: number;
    description?: string;
}

class BaseCard extends View<ICard> {
    protected _title: HTMLElement;
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._price = ensureElement<HTMLElement>('.card__price', container);
    }

    protected setActions(container: HTMLElement, actions?: ICardActions) {
        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    get title(): string {
        return this._title.textContent || '';
    }

    set price(value: number) {
        this.setText(this._price, value + ' синапсов');
    }

    get price(): number {
        return this._price.textContent as unknown as number || 0;
    }

    set category(value: string) {
        this.setText(this._category, value);
    }

    get category(): string {
        return this._category.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }
}

export class CatalogCard extends BaseCard {
    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._button = container.querySelector('.gallery__item');
        super.setActions(container, actions);
    }
}

export class PreviewCard extends BaseCard {
    private _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._button = container.querySelector('.card__button');
        super.setActions(container, actions);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    get description(): string {
        return this._description.textContent || '';
    }
}