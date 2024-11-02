import { Form } from "./common/Form";
import { TOrderAddressAndPayment } from "../types";
import { IEvents } from "./base/EventEmitter";
import { ensureAllElements } from "../utils/utils";

export class AddressAndPayment extends Form<TOrderAddressAndPayment> {
    protected _paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentButtons = ensureAllElements('.button_alt', this.container);

        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.payment = button.name;
                this.onInputChange('payment', button.name)               
            });                
        });
    }

    set payment(name: string) {
        this._paymentButtons.forEach(button => {
            this.toggleClass(button, 'button_alt-active', button.name === name)
        })
    }

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set valid(value: boolean) {
        this.setDisabled(this._submit, !value);
    }
}