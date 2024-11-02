import { ProductsFull} from "./common/ProductFull";
import { IEvents } from "./base/EventEmitter";
import { ensureElement } from "../utils/utils";



export class ProductInModal extends ProductsFull {
  protected _description: HTMLElement;

    constructor (container: HTMLElement, events: IEvents) {
        super(container, events);

        this._description = ensureElement<HTMLElement>('.card__text', container);
    };

    addEventListeners(): void {
        this._button.addEventListener('click', () => this.events.emit('product:buy', {id: this.id}));
    };

    set description(value: string) {
		this.setText(this._description, value);
	};

    set inCart(value: boolean) {
        this.setDisabled(this._button, value);
        if (value === true) {
            this.setText(this._button, 'Уже в корзине');
        } else {
            this.setText(this._button, 'В корзину');
        };                 
    };
}