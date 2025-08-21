import {View} from "../base/View";
import {ensureElement} from "../../utils/utils";

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    image?: string;
    category?: string;
    price: number;
    description?: string;
    count?: number;
}

class BaseCard extends View<ICard> {
    protected static categoryMap: Map<string, string> = new Map<string, string>;

    static {
        this.categoryMap.set('софт-скил', 'card__category_soft');
        this.categoryMap.set('другое', 'card__category_other');
        this.categoryMap.set('дополнительное', 'card__category_additional');
        this.categoryMap.set('кнопка', 'card__category_button');
        this.categoryMap.set('хард-скил', 'card__category_hard');
    }

    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = ensureElement<HTMLElement>('.card__title', container);
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
}

export class CatalogCard extends BaseCard {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._button = container.querySelector('.gallery__item');
        super.setActions(container, actions);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add(BaseCard.categoryMap.get(value));
    }

    get category(): string {
        return this._category.textContent || '';
    }
}

export class PreviewCard extends BaseCard {
    protected _image: HTMLImageElement;
    private _description: HTMLElement;
    protected _category: HTMLElement;


    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._image = ensureElement<HTMLImageElement>('.card__image', container);
        this._description = ensureElement<HTMLElement>('.card__text', container);
        this._category = ensureElement<HTMLElement>('.card__category', container);
        this._button = container.querySelector('.card__button');
        super.setActions(container, actions);
    }

    set description(value: string) {
        this.setText(this._description, value);
    }

    get description(): string {
        return this._description.textContent || '';
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set category(value: string) {
        this.setText(this._category, value);
        this._category.classList.add(BaseCard.categoryMap.get(value));
    }

    get category(): string {
        return this._category.textContent || '';
    }

    set price(value: number) {
        if (value < 1) {
            this.setDisabled(this._button, true);
        }
        this.setText(this._price, value + ' синапсов');
    }
}

export class BasketCard extends BaseCard {
    private _count: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._count = ensureElement<HTMLElement>('.basket__item-index', container);
        this._button = container.querySelector('.card__button');
        super.setActions(container, actions);
    }

    set count(value: number) {
        this.setText(this._count, value);
    }

    get count(): number {
        return this._count.textContent as unknown as number || 0;
    }
}