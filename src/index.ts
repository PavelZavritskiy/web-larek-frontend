import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { EventEmitter } from './components/base/EventEmitter';
import { appApi } from './components/AppApi';
import { Modal } from './components/common/Modal';
import { Products } from './components/model/Products';
import { Basket } from './components/model/Basket';
import { Order } from './components/model/Order';
import { IProduct, TOrderAddressAndPayment, TOrderCommunication } from './types/index';
import { Page } from './components/Preview/Page';
import { ProductInCatalog } from './components/Preview/ProductInCatalog';
import { ProductInModal } from './components/Preview/ProductInModal';
import { BasketPreview } from './components/Preview/BasketPreview';
import { ProductInBasket } from './components/Preview/ProductInBasket';
import { AddressAndPayment } from './components/Preview/AddressAndPayment';
import { Communication } from './components/Preview/Communication';
import { Success } from './components/Preview/Success';

//Экземпляр эвент эмитера
const events = new EventEmitter();

//Модели данных
const productsData = new Products(events);
const basketData = new Basket(events);
const orderData = new Order(events);

//Необходимые темплейты
const productCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const productBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const addressAndPaymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const communicationTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

//Классы представления
const page = new Page(document.querySelector('.page'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new BasketPreview(cloneTemplate(basketTemplate), events);
const addressAndPayment = new AddressAndPayment(cloneTemplate(addressAndPaymentTemplate), events);
const communication = new Communication(cloneTemplate(communicationTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events)
const productInModal = new ProductInModal(cloneTemplate(productPreviewTemplate), events);

//Заполнение данными полученными с сервера
events.on('products:set', () => { 
    const productsArray = 
        productsData.products.map(product => 
                new ProductInCatalog(cloneTemplate(productCatalogTemplate), events)
                    .render(product));
    page.render({
        catalog: productsArray, 
        counter: basketData.getCount(),
    });
});

//Выбор товара
events.on('product:select', (data: {id: string}) => {
    const preview = productsData.getProduct(data.id);
    events.emit('product:selected', preview)
});

//Отображение товара в модальном окне
events.on('product:selected', (preview:IProduct) => {
    const previewElement = productInModal.render({
        ...preview, 
        inBasket: basketData.inBasket(preview.id)
    });
    modal.render({content: previewElement});
});

//Добавление товара в корзину
events.on('product:buy', (data: {id: string}) => {
    const productToBuy = productsData.getProduct(data.id);
    basketData.addProduct(productToBuy);
    modal.close();
});

//Изменение данных корзины
events.on('basket:changed', () => {   
    const productsInBasketArray = 
        basketData.products.map(product => 
            new ProductInBasket(cloneTemplate(productBasketTemplate), events)
                .render(product));
    basket.render({
        items: productsInBasketArray, 
        total: basketData.getTotalPrice(), 
        index: productsInBasketArray, 
        isEmpty: basketData.isEmpty(),
    });
    page.render({counter: basketData.getCount()});
});

//Открытие модального окна корзины
events.on('basket:open', () => {
	modal.render({
        content: basket.render({
            isEmpty: basketData.isEmpty()
        }),
    });
});

//Удаление товара из корзины
events.on('productInBasket:delete', (data: {id: string}) => {
    basketData.removeProduct(data.id);
});

//Открытие формы оформления заказа
events.on('order:open', () => {
    modal.render({
        content: addressAndPayment.render({
            payment: '',
            address: '',
            valid: false,
            errors: [],
        }),
    });
});

//Изменение в поле ввода данных способа оплаты и адреса
events.on(
    /^order\..*:change/,
    (data: { field: keyof TOrderAddressAndPayment; value: string }) => {
      orderData.setAddressAndPayment(data.field, data.value)
    },
  );

//Изменение данных выбор способа оплаты и адреса
events.on('orderForm:change', (errors: Partial<TOrderAddressAndPayment>) => {
    const { address, payment } = errors;
    addressAndPayment.valid = !payment && !address;
    addressAndPayment.errors = Object.values({ payment, address })
      .filter((i) => !!i)
      .join('; ');
  });

//Подтверждение в форме с выбором способа оплаты и адреса, открытие модального окна коммуникации
events.on('order:submit', () => {
    modal.render({
        content: communication.render({
            phone: '',
            email: '',
            valid: false,
            errors: [],
        }),
    });
});

////Изменение в полях ввода коммуникации
events.on(
    /^contacts\..*:change/,
    (data: { field: keyof TOrderCommunication; value: string }) => {
      orderData.setCommunicationField(data.field, data.value)
    }
  );

//Редактирование данных коммуникации
events.on('contactsForm:change', (errors: Partial<TOrderCommunication>) => {
    const { email, phone } = errors;
    communication.valid = !phone && !email;
    communication.errors = Object.values({ email, phone })
      .filter((i) => !!i)
      .join('; ');
  });

//Закрытие модального окна успешного заказа
events.on('success:submit', () => {
    modal.close();
});

//Открытие любого модального окна
events.on('modal:open', () => {
    page.locked = true;
});

//Закрытие любого модального окна
events.on('modal:close', () => {
    page.locked = false;
});

//Отправка данных заказа на сервер
events.on('contacts:submit', () => {     
    (async () => {
        try {
            const order = await appApi.placeOrder({
                ...orderData.orderData, 
                items: basketData.productsForOrder.map(product => product.id), 
                total: basketData.getTotalPrice()
            });
            basketData.emptyBasket();
            modal.render({
                content: success.render({
                    total: order.total,
                }),
            });
        } catch (error) {
            console.log(error);
        };
    })();
});

//Загрузка данных с сервера
(async () => {
    try { 
        const data = await appApi.getProducts();
        productsData.products = data;
    } catch (error) {
        console.log(error);
    };
})();

