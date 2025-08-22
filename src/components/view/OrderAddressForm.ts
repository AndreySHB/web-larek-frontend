import {EventEmitter} from "../base/events";
import {BaseForm} from "./BaseForm";
import {IAddressOrderForm} from "../../types";

export class OrderAddressForm extends BaseForm<IAddressOrderForm> {
    protected _onlineButton: HTMLElement;
    protected _offlineButton: HTMLElement;

    constructor(container: HTMLFormElement, events: EventEmitter) {
        super(container, events);
        this._onlineButton = container.querySelector('.button_online');
        this._onlineButton.addEventListener('click', () => {
            this.toggleClass(this._onlineButton, 'selected', true);
            this._offlineButton.classList.remove('selected');
            events.emit("order:onlinePayment");
        });
        this._offlineButton = container.querySelector('.button_offline');
        this._offlineButton.addEventListener('click', () => {
            this.toggleClass(this._offlineButton, 'selected', true);
            this._onlineButton.classList.remove('selected');
            events.emit("order:offlinePayment");
        });
        this._submit.addEventListener('click', () => events.emit('order:contacts'));
        this.setInitialState();
    }

    private setInitialState() {
        const classListOnline = this._onlineButton.classList;
        if (!classListOnline.contains('selected')) classListOnline.add('selected');
        const classListOffline = this._offlineButton.classList;
        if (classListOffline.contains('selected')) classListOffline.remove('selected');
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }
}