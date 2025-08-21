import './scss/styles.scss';

import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {ShopAPI} from "./components/ShopApi";
import {AppState} from "./components/model/AppState";
import {Page} from "./components/view/Page";
import {addModalCloseEventListener, cloneTemplate, closeAllModals, ensureElement} from "./utils/utils";
import {BasketCard, CatalogCard, PreviewCard} from "./components/view/Card";
import {Modal} from "./components/view/Modal";
import {BasketView} from "./components/view/BasketView";
import {Product} from "./components/model/Product";
import {OrderAddressForm} from "./components/view/OrderAddressForm";
import {FinishModal} from "./components/view/FinishModal";
import {BasketModel} from "./components/model/BasketModel";
import {OrderContactForm} from "./components/view/OrderContactForm";
import {IAddressOrderForm, IEmailPhoneOrderForm} from "./types";

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const finishTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
// Модель данных приложения
const appState = new AppState({}, events);
const basket = new BasketModel({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const orderAddressForm = new OrderAddressForm(cloneTemplate(orderTemplate), events);
const orderContactForm = new OrderContactForm(cloneTemplate(contactTemplate), events);
const orderFinishForm = new FinishModal(cloneTemplate(finishTemplate), () => modal.close());

// Чтобы мониторить все события, для отладки
events.onAll(({eventName, data}) => {
    console.log(eventName, data);
})

events.on('modal:open', () => {
    page.lock();
});

events.on('modal:close', () => {
    page.unlock();
});

// Изменились элементы каталога
events.on('items:changed', () => {
    page.catalog = Array.from(appState.catalog.values()).map(item => {
        const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        })
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price ?? 666
        });
    });
});

events.on('card:select', (item: Product) => {
    appState.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
    const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
        onClick: (event) => {
            event.stopPropagation();
            event.preventDefault();
            basket.add(item);
            modal.close();
        }
    });
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price ?? 666,
            description: item.description
        })
    });
});

events.on('basket:change', () => {
    page.basketCount = basket.getTotalItems();
});

events.on('basket:open', () => {
    const bids: HTMLElement[] = [];
    basket.items.forEach((productCount, product) => {
        const targetProduct = appState.catalog.get(product.id);
        const bid = new BasketCard(cloneTemplate(cardBasketTemplate),
            {
                onClick: (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    basket.remove(targetProduct);
                    const targetPress = event.target as HTMLElement;
                    const reducingBid = targetPress.closest('.card');
                    const countElement = reducingBid.querySelector('.basket__item-index');
                    const currentCount = basket.get(targetProduct);
                    const totalBidPriceElement = reducingBid.querySelector('.card__price');
                    if (currentCount > 0) {
                        countElement.textContent = currentCount as unknown as string;
                        totalBidPriceElement.textContent = currentCount * targetProduct.price as unknown as string + ' синапсов';
                    } else {
                        reducingBid.remove();
                    }
                    basketView.price = basket.getTotalPrice();
                    if (basket.getTotalItems() === 0) {
                        basketView.items = [];
                    }
                }
            });
        bid.render(
            {
                category: targetProduct.category,
                price: targetProduct.price * productCount,
                title: targetProduct.title,
                count: productCount
            });
        bids.push(bid.render())
    })
    modal.render({
        content: basketView.render(
            {
                price: basket.getTotalPrice(),
                items: bids
            }
        )
    });
});

events.on('order:start', () => {
    modal.render({
        content: orderAddressForm.render(
            {
                address: '',
                valid: false,
                errors: []
            }
        )
    });
});

events.on('order:contacts', () => {
    modal.render({
        content: orderContactForm.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});

events.on(/^contacts\..*:change/, (data: { field: keyof IEmailPhoneOrderForm, value: string }) => {
    appState.setPhoneEmailField(data.field, data.value);
});

events.on(/^order\..*:change/, (data: { field: keyof IAddressOrderForm, value: string }) => {
    appState.setAddressField(data.field, data.value);
});

events.on('formErrorsPhoneEmail:change', (errors: Partial<IEmailPhoneOrderForm>) => {
    const {email, phone} = errors;
    orderContactForm.valid = !email && !phone;
    orderContactForm.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on('formErrorsAddress:change', (errors: Partial<IAddressOrderForm>) => {
    const {address} = errors;
    orderAddressForm.valid = !address;
    orderAddressForm.errors = address ? address : '';
});

events.on('order:finish', () => {
    const description = 'Списано ' + basket.getTotalPrice() + ' синапсов';
    orderFinishForm.setDescription(description);
    modal.render({
        content: orderFinishForm.render()
    });
    basket.clear();
});

const api = new ShopAPI(API_URL, CDN_URL);

// Получаем лоты с сервера
api.getProducts()
    .then(appState.setCatalog.bind(appState))
    .catch(err => {
        console.error(err);
    });

closeAllModals();
addModalCloseEventListener();