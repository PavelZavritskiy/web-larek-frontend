import { ProductsBase } from './ProductBase';
import { IEvents } from '../base/EventEmitter';
import { ensureElement } from "../../utils/utils";
import { CategoryColor } from "../../utils/constants"




export abstract class ProductsFull extends ProductsBase {
	protected _category: HTMLElement;
	protected _image: HTMLImageElement;


	constructor( protected container: HTMLElement, events: IEvents
	) {
		super(container, events);

		this._category = ensureElement<HTMLElement>('.card__category', container);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
	}

	set category(value: string) {
  	this.setText(this._category, value);
		const keys = Object.entries(CategoryColor);
		  for (const [key, nameClass] of keys) {
					this.toggleClass(this._category, nameClass, key === value)
			}
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}
}