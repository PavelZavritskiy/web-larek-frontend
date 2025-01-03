import {Component} from "../base/Component";
import { IEvents } from "../base/EventEmitter";
import {ensureElement} from "../../utils/utils";


interface IModalData {
    content: HTMLElement;
}

export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;
    

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);

        this._closeButton.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (evt) => evt.stopPropagation());
        this.container.addEventListener('mousedown', (evt) => {
            if (evt.target === evt.currentTarget) {
              this.close();
            }
          });
    }

    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    _toggleModal(state: boolean = true) {
        this.toggleClass(this.container, 'modal_active', state);
    }
    
    _handleEscape = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
            this.close();
        }
    };

    open() {
        this._toggleModal();
        document.addEventListener('keydown', this._handleEscape);
        this.events.emit('modal:open');
    }

    close() {
        this._toggleModal(false); 
        document.removeEventListener('keydown', this._handleEscape);
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }

    
}