import {View} from "../base/View";
import {EventEmitter} from "../base/events";

interface IOrderFormView {
    onlineButton: HTMLElement;
    offlineButton: HTMLElement;
    addressField: HTMLElement;
    continueButton: HTMLElement;
    formErrors: HTMLElement;
}

export class OrderForm extends View<IOrderFormView> {
    protected _onlineButton: HTMLElement;
    protected _offlineButton: HTMLElement;
    protected _addressField: HTMLInputElement;
    protected _continueButton: HTMLElement;
    protected _formErrors: HTMLElement

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._formErrors = container.querySelector('.form__errors');
        this._onlineButton = container.querySelector('.button_online');
        this._onlineButton.addEventListener('click', () => {
            this.toggleClass(this._onlineButton, 'selected', true);
            this._offlineButton.classList.remove('selected');
            this.refreshModalActions();
        });
        this._offlineButton = container.querySelector('.button_offline');
        this._offlineButton.addEventListener('click', () => {
            this.toggleClass(this._offlineButton, 'selected', true);
            this._onlineButton.classList.remove('selected');
            this.refreshModalActions();
        });
        this._addressField = container.querySelector('.form__input');
        this._addressField.addEventListener('input', () => {
            this.refreshModalActions();
        })
        this._continueButton = container.querySelector('.order__button');
    }

    private refreshModalActions() {
        if (!this._addressField.value) {
            this._formErrors.textContent = 'Необходимо ввести адрес доставки';
        } else {
            this._formErrors.textContent = '';
        }
        if (this._addressField.value && ((this._offlineButton.classList.contains('selected')) || (this._onlineButton.classList.contains('selected')))) {
            this.setDisabled(this._continueButton, false);
        } else {
            this.setDisabled(this._continueButton, true);
        }
    }
}