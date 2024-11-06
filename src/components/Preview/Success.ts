import { Component } from "../base/Component";
import { IEvents } from "../base/EventEmitter";
import { ensureElement, formatNumber } from "../../utils/utils";


interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLButtonElement;
    protected _total: HTMLElement;
    protected events: IEvents;

    constructor(protected container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;
        
        this._close = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this._total = ensureElement<HTMLElement>('.order-success__description', container);

        this._close.addEventListener('click', () => {
            events.emit('success:submit')
        })
    }

    set total (total: number) {
        this.setText(this._total, `Списано ${formatNumber(total, ' ')} синапсов`)
    }
}