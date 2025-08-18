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

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket').content.querySelector('.card') as HTMLElement;

const events = new EventEmitter();
// Модель данных приложения
const appState = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new BasketView(cloneTemplate(basketTemplate));

// Чтобы мониторить все события, для отладки
events.onAll(({eventName, data}) => {
    console.log(eventName, data);
})

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
            appState.basket.add(item);
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
    appState.basket.items.forEach((productCount, productKey) => {
        const targetProduct = appState.catalog.get(productKey);
        const bid = new BasketCard(cardBasketTemplate.cloneNode(true) as HTMLElement,
            {
                onClick: (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    appState.basket.remove(targetProduct);
                    const targetPress = event.target as HTMLElement;
                    const reducingBid = targetPress.closest('.card');
                    const countElement = reducingBid.querySelector('.basket__item-index');
                    const currentCount = appState.basket.get(targetProduct);
                    const totalBidPriceElement = reducingBid.querySelector('.card__price');
                    if (currentCount > 0) {
                        countElement.textContent = currentCount as unknown as string;
                        totalBidPriceElement.textContent = currentCount * targetProduct.price as unknown as string + ' синапсов';
                    } else {
                        reducingBid.remove();
                    }
                    basketView.price = appState.basket.totalPrice;
                    if (appState.basket.totalItems === 0) {
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
        bids.push(bid.getContainer())
    })
    modal.render({
        content: basketView.render(
            {
                price: appState.basket.totalPrice,
                items: bids
            }
        )
    });
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