import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";
import { ensureElement } from "../../utils/utils";


interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export class Page extends Component<IPage> {
    protected _pageWrapper: HTMLElement;
    protected _catalog: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected _counter: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._pageWrapper = ensureElement<HTMLElement>('.page__wrapper', container);
        this._catalog = ensureElement<HTMLElement>('.gallery', container);
        this._basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this._counter = ensureElement<HTMLElement>('.header__basket-counter', container);

        this._basketButton.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    };

    set counter(value: number) {
        this.setText(this._counter, String(value));
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }
    
    set locked(value: boolean) {
        this.toggleClass(this._pageWrapper, 'page__wrapper_locked', value);
    }
}
