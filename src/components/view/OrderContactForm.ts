import {IEmailPhoneOrderForm} from "../../types";
import {BaseForm} from "./BaseForm";
import {IEvents} from "../base/events";


export class OrderContactForm extends BaseForm<IEmailPhoneOrderForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._submit.addEventListener('click', () => events.emit('order:finish'));
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}