import {Model} from "../base/Model";
import {IEvents} from "../base/events";
import {
    FormErrorsAddress,
    FormErrorsEmailPhone,
    IAddressOrderForm,
    IAppState,
    IEmailPhoneOrderForm,
    IProduct
} from "../../types";


export class AppState extends Model<IAppState> {
    catalog: Map<string, IProduct>;
    preview: string | null;
    order: IEmailPhoneOrderForm & IAddressOrderForm = {
        address: '',
        email: '',
        phone: '',
        payment : 'online'
    };
    formErrorsEmailPhone: FormErrorsEmailPhone = {};

    formErrorsAddress: FormErrorsAddress = {};

    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);
    }

    setCatalog(items: IProduct[]) {
        this.catalog = new Map<string, IProduct>();
        items.forEach(item => {
            this.catalog.set(item.id, item)
        })
        this.emitChanges('items:changed');
    }

    setPreview(item: IProduct) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }


    setPhoneEmailField(field: keyof IEmailPhoneOrderForm, value: string) {
        this.order[field] = value;
        this.validatePhoneEmail();
    }

    setAddressField(field: keyof IAddressOrderForm, value: string) {
        this.order[field] = value;
        this.validateAddress();
    }

    validatePhoneEmail() {
        const errors: typeof this.formErrorsEmailPhone = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        this.formErrorsEmailPhone = errors;
        this.events.emit('formErrorsPhoneEmail:change', this.formErrorsEmailPhone);
        return Object.keys(errors).length === 0;
    }

    validateAddress() {
        const errors: typeof this.formErrorsAddress = {};
        if (!this.order.address) {
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrorsAddress = errors;
        this.events.emit('formErrorsAddress:change', this.formErrorsAddress);
        return Object.keys(errors).length === 0;
    }
}