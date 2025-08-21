import {View} from "../base/View";

interface IFinishModal {
    description: HTMLElement;
    finishButton: HTMLElement;
}

export class FinishModal extends View<IFinishModal> {
    protected _description: HTMLElement;

    protected _finishButton: HTMLElement;

    constructor(container: HTMLElement, onCloseAction: () => void) {
        super(container);
        this._description = container.querySelector('.order-success__description');
        this._finishButton = container.querySelector('.order-success__close');
        this._finishButton.addEventListener('click', onCloseAction)
    }

    setDescription(description: string) {
        this._description.textContent = description;
    }
}