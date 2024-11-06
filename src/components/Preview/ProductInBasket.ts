import { ProductsBase } from "../common/ProductBase";
import { IEvents } from "../base/EventEmitter";



export class ProductInBasket extends ProductsBase {

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container, events);
        this._button = this.container.querySelector(`.card__button`);
    }

    addEventListeners(): void {
        this._button.addEventListener('click', () => this.events.emit('productInBasket:delete', {id: this.id}));
    }
}