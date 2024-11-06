import { Component } from '../base/Component';
import { IEvents } from '../base/EventEmitter';
import { ensureElement, formatNumber } from '../../utils/utils';

export interface IProductView {
	id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
	inBasket: boolean;
}

export abstract class ProductsBase extends Component<IProductView> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected events: IEvents;

	constructor (protected container: HTMLElement,	events: IEvents) {
		super(container);
		this.events = events;

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._button = this.container.querySelector('.card__button');

		this.addEventListeners();
	}

	abstract addEventListeners(): void

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'бесценно');
		} else {
			this.setText(this._price, `${formatNumber(value, ' ')} синапсов`);
		};
	};
};