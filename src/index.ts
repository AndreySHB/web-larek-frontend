import './scss/styles.scss';

import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {ShopAPI} from "./components/ShopApi";
import {AppState, Product} from "./components/model/AppData";
import {Page} from "./components/view/Page";
import {addModalCloseEventListener, cloneTemplate, closeAllModals, createElement, ensureElement} from "./utils/utils";
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
        const catalogProduct = appData.catalog.get(productKey);
        const bid = new BasketCard(cardBasketTemplate.cloneNode(true) as HTMLElement,
            {
                onClick: (event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    const target = event.target as HTMLElement;
                    const basket = target.closest('.basket');
                    const reducingBid = target.closest('.card');
                    const countElement = reducingBid.querySelector('.basket__item-index');
                    const currentCount = countElement.textContent as unknown as number;
                    const totalBidPriceElement = reducingBid.querySelector('.card__price');
                    const totalBidPriceText = totalBidPriceElement.textContent;
                    if (currentCount > 1) {
                        countElement.textContent = currentCount - 1 as unknown as string;
                        totalBidPriceElement.textContent = totalBidPriceText.replace(' синапсов', '') as unknown as number
                        - catalogProduct.price as unknown as string + ' синапсов';
                    } else {
                        reducingBid.remove();
                    }
                    appData.basket.remove(catalogProduct)
                    const basketPriceElement = basket.querySelector('.basket__price');
                    basketPriceElement.textContent = appData.basket.totalPrice as unknown as string;
                    if (appData.basket.totalItems === 0) {
                        basket.querySelector('.basket__list').replaceChildren(createElement<HTMLParagraphElement>('p', {
                            textContent: 'Корзина пуста'
                        }));
                    }
                }
            });
        bid.render(
            {
                category: catalogProduct.category,
                price: catalogProduct.price * productCount,
                title: catalogProduct.title,
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