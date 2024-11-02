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

	abstract addEventListeners(): void;

set category(value: string) {
  this.setText(this._category, value);
  const allClasses = this._category.className.split(' ');
  for (let i = 1; i < allClasses.length; i++) {
    this._category.classList.remove(allClasses[i]);
  }
  this._category.classList.add(CategoryColor[value]);
}

	set image(value: string) {
		this.setImage(this._image, value);
	}
}