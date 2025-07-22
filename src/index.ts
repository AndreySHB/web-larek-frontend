import './scss/styles.scss';

import {API_URL, CDN_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {ShopAPI} from "./components/ShopApi";
import {AppState, CatalogChangeEvent, Product} from "./components/AppData";
import {Page} from "./components/Page";
import {addModalCloseEventListener, cloneTemplate, closeAllModals, ensureElement} from "./utils/utils";
import {CatalogCard} from "./components/Card";

const events = new EventEmitter();
// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

// Чтобы мониторить все события, для отладки
events.onAll(({eventName, data}) => {
    console.log(eventName, data);
})

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
    page.catalog = appData.catalog.map(item => {
        const card = new CatalogCard(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        })
        return card.render({
            title: item.title,
            image: item.image,
            category: item.category,
            price: item.price ?? 666,
        });
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