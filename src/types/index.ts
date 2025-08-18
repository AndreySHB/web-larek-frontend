export interface IProduct {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number;
}

export interface IAppState {
    catalog: Map<string, IProduct>;
    basket: IBasket;
    setCatalog(items: IProduct[]): void;
    setPreview(item: IProduct): void;
}

export interface IBasket {
    items: Map<string, number>;

    totalPrice: number;

    totalItems: number;

    add(product: IProduct): void;

    remove(product: IProduct): void;

    get(product: IProduct): number;
}