import {View} from "../base/View";
import {EventEmitter} from "../base/events";

interface IOrderFormView {
    onlineButton: HTMLElement;
    offlineButton: HTMLElement;
    addressInput: HTMLElement;
    payButton: HTMLElement;
    formErrors: HTMLElement;
}

export class OrderForm extends View<IOrderFormView> {
    protected _onlineButton: HTMLElement;
    protected _offlineButton: HTMLElement;
    protected _addressInput: HTMLInputElement;
    protected _payButton: HTMLElement;
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
        this._addressInput = container.querySelector('.form__input');
        this._addressInput.addEventListener('input', () => {
            this.refreshModalActions();
        })
        this._payButton = container.querySelector('.order__button');
        this._payButton.addEventListener('click', () => events.emit('order:finish'))
    }

    private refreshModalActions() {
        if (!this._addressInput.value) {
            this._formErrors.textContent = 'Необходимо ввести адрес доставки';
        } else {
            this._formErrors.textContent = '';
        }
        if (this._addressInput.value && ((this._offlineButton.classList.contains('selected')) || (this._onlineButton.classList.contains('selected')))) {
            this.setDisabled(this._payButton, false);
        } else {
            this.setDisabled(this._payButton, true);
        }
    }
}