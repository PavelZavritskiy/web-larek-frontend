import { ProductsFull } from '../common/ProductFull';
import { IEvents } from '../base/EventEmitter';




export class ProductInCatalog extends ProductsFull {

	constructor( protected container: HTMLElement, events: IEvents
	) {
		super(container, events);
	}

	addEventListeners() {
    this.container.addEventListener('click', () => this.events.emit<{id: string}>('product:select', {id: this.id}));
	}
}