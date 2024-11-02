import { IProduct, IProducts } from "../types";
import { IEvents } from "../components/base/EventEmitter";


export class Products implements IProducts {
    protected _products: IProduct[];
    protected events: IEvents;

    constructor (events: IEvents) {
        this.events = events;
    };

    set products(products:IProduct[]) {
        this._products = products;
        this.events.emit('products:set')
    };

     get products () {
        return this._products;
    };

   getProduct(productId: string) {
      return this._products.find((item) => item.id === productId);
  };
}