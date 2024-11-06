# Проектная работа "Веб-ларек"

<div id="header" align="center">
  <img src="https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExanBoMTU1MXl4cjFjeTVuYTJzN29lcThtemg3ZGN0aXNuZjh1Y3N5bSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qgQUggAC3Pfv687qPC/giphy.gif" width="100%"/>
</div>

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Данные и типы данных используемые в приложении

Интерфейс для данных продукта

```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}
```

Интерфейс для данных заказа
```
interface IOrder {
  total: number;
  email: string;
  address: string;
  phone: string;
  payment: string;
  items: string[]
}
```

Интерфейс для коллекции данных продуктов
```
interface interface IProducts{
  products: IProduct[];
  getProduct(productId: string): IProduct;
}
```

Интерфейс для данных в используемых в корзине
```
interface IBasket {
  products: TProductBasketInfo[];
  productsForOrder:TProductBasketInfo[];
  addProduct(item: TProductBasketInfo): void;
  removeProduct(productId: string): void;
  getTotalPrice(): number;
  isEmpty(): boolean
  getCount(): number;
  emptyBasket(): void;
  inBasket(productId: string): boolean;
}
```

Тип для данных продукта используемых в корзине
```
type TProductBasketInfo = Pick<IProduct, 'title' | 'price' | 'id'>
```

Тип для данных заказа используемых в форме выбора адреса доставки и способа оплаты
```
type TOrderAddressAndPayment= Pick<IOrder, 'payment' | 'address'>
```

Тип для данных заказа используемых в форме с коммуникацией
```
type type TOrderCommunication = Pick<IOrder, 'email' | 'phone'>
```

Тип данных товаров с ценой
```
type type ProductsWithAPrice = Pick<IProduct, 'id' | 'price'>
```

Тип данных для ошибок в форме
```
type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Архитектура приложения

Код приложения разделён на слои согласно парадигме MVP:
- Слой представления, отвечает за отображение данных на странице;
- Слой данных, отвечает за хранение данных;
- Презентер, отвечает за связь представления и данных;

### Базовый код

#### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.\

`constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

В полях класса хранятся следующие данные:
- `baseUrl: string` - базовый URL;
- `options: RequestInit` - глобальные опции для всех запросов;

Класс предоставляет следующие методы:
- `get(uri: string)` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- `handleResponse(response: Response): Promise<object>` - метод принимает ответ от сервера (объект Response) и обрабатывает его.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

В полях класса хранятся следующие данные:
- `_events: Map<EventName, Set<Subscriber>>` - хранит информацию о событии и подписчиках;

Класс предоставляет следующие методы::
- `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - установить обработчик на событие;
- ` off(eventName: EventName, callback: Subscriber)` - снять обработчик с события;
- ` emit<T extends object>(eventName: string, data?: T)` - инициировать событие с данными;
- `onAll(callback: (event: EmitterEvent) => void)` - cлушать все события;
- ` offAll()` - cбросить все обработчики;
- ` trigger<T extends object>(eventName: string, context?: Partial<T>)` - cделать коллбек триггер, генерирующий событие при вызове;

#### Класс Component
Класс является дженериком и родителем всех компонентов слоя представления. 

`constructor(protected readonly container: HTMLElement)` - конструктор класса принимает элемент разметки, который будет родительским контейнером компонента. 

Класс предоставляет следующие методы:
-  `render(data?: Partial<T>): HTMLElement` - метод для рендера элемента;
- `setImage(element: HTMLImageElement, src: string, alt?: string): void` - метод для установки изображения;
- `setVisible(element: HTMLElement): void` - метод с помощью которого можно сделать элемент видимым;
- `setHidden(element: HTMLElement): void` - метод с помощью которого можно скрыть элемент;
- `setDisabled(element: HTMLElement, state: boolean): void` - метод для отключения элемента;
- `setText(element: HTMLElement, value: unknown): void` - метод для установки текстового контента;
- `toggleClass(element: HTMLElement, className: string, force?: boolean)` - метод для переключения классов;

#### Класс Form

Класс является дженериком и расширяет класс Component, является родителем для всех форм. 

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

В полях класса хранятся следующие данные:
- `_submit: HTMLButtonElement` - кнопка сабмита;
- `_errors` - элемент для отображения ошибок;

Класс предоставляет следующие методы:
- `onInputChange(field: keyof T, value: string)` - метод реагирует на изменение значения в поле формы;
- `set valid(value: boolean)` - ссетер valid;
- `set errors(value: string)` - ссетер  errors;
- `render(state: Partial<T> & IFormState)` - метод отвечает за отрисовку формы;

### Слой данных

#### Класс Products
Класс отвечает за хранение и логику работы с данными товаров полученных с сервера.

`constructor (events: IEvents)` - конструктор класса принимает инстант брокера событий.

В полях класса хранятся следующие данные:
- `_products: IProduct[]` - массив объектов товаров;
- `events: IEvents` - экземпляр класса 'EventEmitter' для инициализации событий при изменении данных;

Класс предоставляет следующие методы:
- `set products(products:IProduct[])` - загрузка списка товаров;
- `get products (): IProduct[]` - получение списка товаров;
- `getProduct(productId: string): IProduct` - получение выбранного товара;

#### Класс Order
Класс отвечает за хранение и логику работы с данными заказа.

`constructor (events: IEvents)` - конструктор класса принимает инстант брокера событий.

В полях класса хранятся следующие данные:
- `_orderData: TOrderAddressAndPayment & TOrderCommunication` - информация по заказу, переданная клиентом;
- `events: IEvents` - экземпляр класса 'EventEmitter' для инициализации событий при изменении данных;
- `formErrors: FormErrors` - объект хранящий ошибки в формах;

Класс предоставляет следующие методы:
- `get orderData(): IOrder` - возвращает данные заказа;
- `setAddressAndPayment(field: keyof TOrderAddressAndPayment, value: string): void` - заполнение свойств объекта данными из формы со способом оплаты и адресом;
- `validateAddressAndPayment(): boolean` - валидация данных из формы  со способом оплаты и адресом;
- `setCommunicationField(field: keyof TOrderCommunication, value: string): void` - заполнение свойств объекта данными из формы с коммуникацией;
-` validateCommunication(): boolean` - валидации данных из формы с коммуникацией;

#### Класс Basket
Класс отвечает за хранение и логику работы с данными заказа.

`constructor (events: IEvents)` - конструктор класса принимает инстант брокера событий.

В полях класса хранятся следующие данные:
- `_products: TProductBasketInfo[]` - массив товаров;
- `events: IEvents` - экземпляр класса 'EventEmitter' для инициализации событий при изменении данных;

Класс предоставляет следующие методы:
- `get products(): TProductBasketInfo[]` - получение данных о товарах добавленных в корзину;
- `get productsForOrder:TProductBasketInfo[]` - получение массива продуктов, у которых цена не нулевая;
- `addProduct(item: TProductBasketInfo): void` - добавление товара в корзину;
- `removeProduct(productId: string): void` - удаление продукта из корзины;
- `getTotalPrice(): number` - подсчёт общей суммы заказа;
- `isEmpty(): boolean` - проверка наличия товаров в корзине для блокировки кнопки;
- `getCount(): number` - подсчёт количества товаров в корзине;
- `emptyBasket(): void` - очистка корзины;
- `inBasket(productId: string): boolean` - проверка наличия товара в корзине, для смены кнопки в модальном окне с товаром.


### Слой представления

#### Класс Modal
Класс Modal расширяет класс Component и отвечает за работу с модальными окнами, установка слушателей. Реализует функционал открытия и закрытия модального окна.

`constructor(container: HTMLElement, protected events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

В полях класса хранятся следующие данные:
- `_closeButton: HTMLButtonElement` - кнопка закрытия модального окна;
- `_content: HTMLElement` - контент модального окна;
- `events: IEvents` - экземпляр класса 'EventEmitter' для инициализации событий при изменении данных;

Класс предоставляет следующие методы:
- `set content(value: HTMLElement)` - сеттер контента модального окна;
- `open()` - метод для открытия модального окна;
- `close()` - метод для закрытия модального окна;
- `render(data: IModalData): HTMLElement` - метод для рендера модального окна;
- ` _toggleModal(state: boolean = true)` - метод для переключения класса;
- `_handleEscape = (evt: KeyboardEvent)` - метод для закрытия на Esc;

#### Класс ProductsBase
Класс ProductsBase расширяет класс Component и реализует начальное заполнение базовых полей продукта.

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

В полях класса хранятся следующие данные:
- `_title: HTMLElement` - название продукта;
- `_price: HTMLElement` - цена продукта;
- `_button: HTMLButtonElement` - кнопка;
- `events: IEvents` - экземпляр класса 'EventEmitter' для инициализации событий при изменении данных;

Класс предоставляет следующие методы:
- `abstract addEventListeners(): void` - абстрактный метод для установки слушателя на кнопку;
- `set id(value: string)` - сеттер id;
- `get id(): string` - геттер id;
- `set title(value: string)` - сеттер title;
- `set price(value: number)` - сеттер price;

#### Класс ProductsFull
Класс ProductsFull расширяет класс ProductsBase и реализует установку картинки и категории, что избежать повторений в будущем.

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

В полях класса хранятся следующие данные:
- `_category: HTMLElement` - категория продукта;
- `_image: HTMLElement` - изображение продукта;

Класс предоставляет следующие методы:
- `set category(value: string)` - сеттер category, реализует удаление дополнительных классов элемента при открытии модального окна;
- `set image(value: string)` - сеттер image;

#### Класс ProductInCatalog
Класс ProductInCatalog расширяет класс ProductsFull и отвечает за отображение товара в коллекции.

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

Все поля класс наследует от своего родителя.

Класс реализует только addEventListeners() - установку слушателя на кнопку.

#### Класс ProductInModal
Класс ProductInModal расширяет класс ProductsFull и отвечает за отображение товара в модальном окне.

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

В полях класса хранятся следующие данные:
- `_description: HTMLElement` - название продукта;\
Все остальные поля наследует от родителя.

Класс предоставляет следующие методы:
- `addEventListeners(): void` - реализует абстрактный метод для установки слушателя на кнопку;
- `set description(value: string)` - сеттер description, отвечает за отображение дополнительной информации о товаре;
- `set inBasket(value: boolean)` - сеттер inCart, отвечает за блокировку кнопки добавления товара в корзину и замену надписи в ней;

#### Класс ProductInBasket
Класс ProductInBasket расширяет класс ProductsBase и отвечает за отображение товара в корзине.

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

Все поля класс наследует от своего родителя, но заменят кнопку.

Класс реализует только `addEventListeners()` - установку слушателя на кнопку.

#### Класс Page
Класс Page расширяет класс Component отвечает за отображение главной страницы.

`constructor (container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

В полях класса хранятся следующие данные:
- `_pageWrapper: HTMLElement` - обёртка страницы;
- `_catalog: HTMLElement` - каталог товаров;
- `_basketButton: HTMLButtonElement` - кнопка с корзиной;
- `_counter: HTMLElement` - счётчик товаров в корзине;

Класс предоставляет следующие методы:
- `set counter(value: number)` - сеттер counter, отвечает за отображение числа товаров в корзине;
- `set catalog(items: HTMLElement[])` - сеттер catalog, заполняет коллекцию товаров;
- `set locked(value: boolean)` - метод отвечающий за блокировку страницы при открытии модального окна;

#### Класс BasketPreview
Класс Page расширяет класс Component отвечает за отображение модального окна с корзиной и открытия формы оформления заказа.

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

В полях класса хранятся следующие данные:
- `_list: HTMLElement` - коллекция добавленных товаров в корзину;
- `_total: HTMLElement` - сумма всего заказа;
- `_button: HTMLButtonElement` - кнопка, отвечающая за переход к оформлению заказа;

Класс предоставляет следующие методы:
- `set items(items: HTMLElement[])` - сеттер items, отвечает за отображение  коллекции товаров добавленных в корзину;
- `set index(items: HTMLElement[])` - сеттер index, отвечает за отображение индекса товара в корзине;
- `set total(total: number)` - сеттер total, отвечает за отображение общей суммы заказа;
- `set isEmpty(value: boolean)` - метод отвечающий проверку корзины на наличие товаров;

#### Класс AddressAndPayment
Класс AddressAndPayment расширяет класс Form отвечает за отображение модального окна с выбором способа оплаты и указанием адреса.

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

Класс хранит в себе `_paymentButtons: HTMLButtonElement[]` - кнопку отвечающую за переход к следующей форме.

Класс предоставляет следующие методы:
-  `set payment(name: string)` - сеттер payment, передаёт данные выбранные клиентом;
- `set address(value: string)` - сеттер address,  передаёт данные введённые клиентом;
- `set valid(value: boolean)` - метод для валидации формы;

#### Класс Communication
Класс Communication расширяет класс Form отвечает за отображение модального окна с выбором способа оплаты и указанием адреса.

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.

Класс предоставляет следующие методы:
-  `set phone(value: string)` - сеттер phone, передаёт данные введённые клиентом;
-  `set email(value: string)` - сеттер email,  передаёт данные введённые клиентом;

#### Класс Success
Класс Success расширяет класс Component отвечает за отображение модального окна с информацией о успешном заказе.

`constructor (protected container: HTMLElement,	events: IEvents)` - конструктор класса принимает элемент разметки контейнера и инстант брокера событий.


В полях класса хранятся следующие данные:
- `_close: HTMLButtonElement` - кнопка подтверждения;
- `_total: HTMLElement` - сумма всего заказа, поступает с сервера;
- `events: IEvents` - экземпляр класса 'EventEmitter' для инициализации событий при изменении данных;

Класс реализует единственный метод  `set total (total: number)` - сеттер total, получение общей суммы заказа с сервера.

### Слой коммуникации

#### Класс AppApi
Класс AppApi расширяет класс Api отвечает за работу с бэкендом.

`constructor(cdn: string, baseUrl: string, options?: RequestInit)` - конструктор класса принимает константы: cdn для загрузки изображений, baseUrl базовый адрес сервера, объект с заголовками запросов и глобальные опции для всех запросов(опционально).

Класс предоставляет следующие методы:
- getProduct(id: string): Promise - метод для получения и обработки данных одного товара
- getProducts(): Promise<IProduct[]> - метод для получения и обработки всего массива товаров
- placeOrder(data: IOrder): Promise - принимает объект с данными, и вызывает post метод родителя

### Взаимодействие компонентов
Взаимодействие слоёв представления и данных происходит в файле index.ts, выполняющем роль презентера.\
Взаимодействие между компонентами осуществляется через события, которые генерируются с помощью брокера событий. Обработчики этих событий описаны в файле index.ts.

В этом файле сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

#### События. 

#### События изменения данных (генерируются классами моделями данных):
- `products:set` - запись массива товаров
- `basket:changed` - изменение массива товаров в корзине
- `product:selected` - изменение товара для показа в модальном окне
- `orderForm:change` - изменение данных в форме с выбором способа оплаты и адреса
- `contactsForm:change` - изменение данных в форме контактов

#### События, возникающие при взаимодействии пользователя с интерфейсом:
- `product:select` - выбор товара для модального окна
- `basket:open` - открытие  корзины
- `product:buy` - добавление товара в корзину, замена надписи в товаре
- `productInBasket:delete` - удаление товара из корзины
- `order:open` - начало оформления товаров, открытие модального окна
- `order:submit` - подтверждение отправки данных в форме с выбором способа оплаты и адреса
- `contacts:submit` - отправка всех данных заказа на сервер
- `success:submit` - закрытие  формы успешного заказа
- `modal:open` - модальное окно открыто
- `modal:close` - модальное окно закрыто

## Ссылка на <a href="https://github.com/PavelZavritskiy/web-larek-frontend" target="_blank">репозиторий</a>