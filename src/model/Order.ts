import { FormErrors, IOrderData, TOrderAddressAndPayment, TOrderCommunication } from "../types";
import { IEvents } from "../components/base/EventEmitter";



export class Order implements IOrderData {
    protected _orderData: TOrderAddressAndPayment & TOrderCommunication;
    protected events: IEvents;
    formErrors: FormErrors = {};

    constructor (events: IEvents) {
        this.events = events;
        this._orderData = {
            payment: '',
            address: '',
            email: '',
            phone: '',
        };
    };;
    
    get orderData() {
        return this._orderData
    }

    setAddressAndPayment(field: keyof TOrderAddressAndPayment, value: string) {
        this._orderData[field] = value;
        if (this.validateAddressAndPayment()) {
            return;
        };
    };

    validateAddressAndPayment() {
        const errors: typeof this.formErrors = {};
        if (!this._orderData.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        };
        if (!this._orderData.address) {
            errors.address = 'Необходимо указать адрес';
        };
        this.formErrors = errors;
        this.events.emit('orderForm:change', this.formErrors);
        return Object.keys(errors).length === 0;
    };

    setCommunicationField(field: keyof TOrderCommunication, value: string) {
        this._orderData[field] = value;
        if (this.validateCommunication()) {
            return;
        };
    };

    validateCommunication() {                   
        const errors: typeof this.formErrors = {};
        if (!this._orderData.email) {
            errors.email = 'Необходимо указать email';
        };
        if (!this._orderData.phone) {
            errors.phone = 'Необходимо указать телефон';
        };
        this.formErrors = errors;        
        this.events.emit('contactsForm:change', this.formErrors);
        return Object.keys(errors).length === 0;
    };
};