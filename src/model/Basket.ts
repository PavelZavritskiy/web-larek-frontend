import { IEvents } from '../components/base/EventEmitter';
import { IBasket, TProductBasketInfo } from './../types/index';


export class Basket implements IBasket {
    protected _products: TProductBasketInfo[];
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
        this._products = [];
    };

    get products() {
        return this._products;
    };

    get productsForOrder() {
        return this._products.filter(product => product.price !== null)
    };

    addProduct(product: TProductBasketInfo): void {
        this._products = [product, ...this._products];
        this.events.emit('basket:changed');
    };

    removeProduct(productId: string): void {
        this._products = this._products.filter(product => product.id !== productId);
        this.events.emit('basket:changed');
    };

    emptyBasket(): void {
        this._products = [];
        this.events.emit('basket:changed');
    };

    getCount() {
        return this._products.length; 
    };

    getTotalPrice(): number {
        return this._products.reduce((total, product) => {
            if (product.price === null) {
                return total
            } 
            return total += product.price
        }, 0)
    };

    isEmpty(): boolean {
        return this.getTotalPrice() === 0;
    };

    inBasket(id: string): boolean {
        return this._products.some((product) => {
            return product.id === id;
        });
    };
}