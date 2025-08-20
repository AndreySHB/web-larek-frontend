import {View} from "../base/View";
import {EventEmitter} from "../base/events";
import {closeAllModals} from "../../utils/utils";

interface IFinishFormView {
    description: HTMLElement;
    finishButton: HTMLElement;
}

export class FinishForm extends View<IFinishFormView> {
    protected _description: HTMLElement;

    protected _finishButton: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._description = container.querySelector('.order-success__description');
        this._finishButton = container.querySelector('.order-success__close');
        this._finishButton.addEventListener('click', () => closeAllModals())
    }

    setDescription(description: string) {
        this._description.textContent = description;
    }
}