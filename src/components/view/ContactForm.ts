import {View} from "../base/View";
import {EventEmitter} from "../base/events";

interface IContactFormView {
    emailInput: HTMLElement;
    phoneInput: HTMLElement;
    continueButton: HTMLElement;
    formErrors: HTMLElement;

}

export class ContactForm extends View<IContactFormView> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _continueButton: HTMLElement;

    protected _formErrors: HTMLElement


    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        this._formErrors = container.querySelector('.form__errors');
        this._emailInput = container.querySelector('.form__input_email');
        this._emailInput.addEventListener('input', () => this.refreshModalActions());
        this._phoneInput = container.querySelector('.form__input_phone');
        this._phoneInput.addEventListener('input', () => this.refreshModalActions());
        this._continueButton = container.querySelector('.button');
    }

    private refreshModalActions() {
        if (!this._emailInput.value || !this._phoneInput.value) {
            this.setDisabled(this._continueButton, true);
            this._formErrors.textContent = 'Заполните все поля';
        } else {
            this.setDisabled(this._continueButton, false);
            this._formErrors.textContent = '';
        }
    }
}