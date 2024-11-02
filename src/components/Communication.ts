import { Form } from './common/Form';
import { TOrderCommunication } from './../types/index';
import { IEvents } from './base/EventEmitter';


export class Communication extends Form<TOrderCommunication> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }

    set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
    }
}