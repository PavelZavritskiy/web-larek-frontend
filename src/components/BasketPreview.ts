import { Component } from "./base/Component";
import { EventEmitter } from "./base/EventEmitter";
import { createElement, ensureElement, formatNumber } from "../utils/utils";


interface IBasketPreview {
    items: HTMLElement[];
    total: number;
    index: HTMLElement[];
    isEmpty: boolean;
}

export class BasketPreview extends Component<IBasketPreview> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', container);
        this._total = ensureElement<HTMLElement>('.basket__price', container);
        this._button = ensureElement<HTMLButtonElement>('.basket__button', container);

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');                
            });
        };

        this.items = [];
    };

    set items(items: HTMLElement[]) {    
        if (items.length) {
            this._list.replaceChildren(...items);
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
        };
    };

    set index(items: HTMLElement[]) {
        if (items) {
            for (let i = 0; i < items.length; i++) {
                const index = items[i].querySelector('.basket__item-index');
                index.textContent = `${i + 1}`
            }            
        };
    };

    set total(total: number) {
        this.setText(this._total, `${formatNumber(total, ' ')} синапсов`)
    };

    set isEmpty(value: boolean) {
        this.setDisabled(this._button, value);
    };
}