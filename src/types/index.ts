export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;

    equals(other: IProduct): boolean;

    hashCode(): string;
}

export interface IAppState {
    catalog: Map<string, IProduct>;
    basket: IBasket;

    setCatalog(items: IProduct[]): void;

    setPreview(item: IProduct): void;
}

export interface IBasket {
    items: Map<IProduct, number>;

    add(product: IProduct): void;

    remove(product: IProduct): void;

    get(product: IProduct): number;

    getTotalItems(): number;

    getTotalPrice(): number;

    clear(): void;
}

export interface IEmailPhoneOrderForm {
    email: string;
    phone: string;
}

export interface IAddressOrderForm {
    address: string;
    payment: string;
}


export type FormErrorsEmailPhone = Partial<Record<keyof IEmailPhoneOrderForm, string>>;

export type FormErrorsAddress = Partial<Record<keyof IAddressOrderForm, string>>;

export interface PaymentData {
    payment: string,
    email: string,
    phone: string,
    address: string,
    total: number,
    items: string[]
}

export interface IOrderResult {
    id: string;
}