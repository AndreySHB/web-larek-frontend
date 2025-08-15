import './scss/styles.scss';

import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {ShopAPI} from "./components/ShopApi";
import {AppState, Product} from "./components/model/AppData";
import {Page} from "./components/view/Page";
import {addModalCloseEventListener, cloneTemplate, closeAllModals, ensureElement} from "./utils/utils";
import {BasketCard, CatalogCard, PreviewCard} from "./components/view/Card";
import {Modal} from "./components/view/Modal";
import {Basket} from "./components/view/Basket";

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket').content.querySelector('.card') as HTMLElement;

const events = new EventEmitter();
// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Чтобы мониторить все события, для отладки
events.onAll(({eventName, data}) => {
    console.log(eventName, data);
})

// Изменились элементы каталога
events.on('items:changed', () => {
    page.catalog = Array.from(appData.catalog.values()).map(item => {
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
    appData.setPreview(item);
});

events.on('preview:changed', (item: Product) => {
    const card = new PreviewCard(cloneTemplate(cardPreviewTemplate), {
        onClick: (event) => {
            event.stopPropagation();
            event.preventDefault();
            appData.addToBasket(item);
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

events.on('basket:change', (totalItems: object) => {
    page.basketCount = totalItems as unknown as number;
});

events.on('basket:open', () => {
    const bids: HTMLElement[] = [];
    appData.basket.items.forEach((productCount, productKey) => {
        const bid = new BasketCard(cardBasketTemplate.cloneNode(true) as HTMLElement);
        const relatedProduct = appData.catalog.get(productKey);
        bid.render(
            {
                category: relatedProduct.category,
                price: relatedProduct.price * productCount,
                title: relatedProduct.title,
                count: productCount
            });
        bids.push(bid.getContainer())
    })
    modal.render({
        content: basket.render(
            {
                price: appData.basket.totalPrice,
                items: bids
            }
        )
    });
});

const api = new ShopAPI(API_URL, CDN_URL);

// Получаем лоты с сервера
api.getProducts()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

closeAllModals();
addModalCloseEventListener();