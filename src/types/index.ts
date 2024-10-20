export interface IProduct {
  id: string;
  tittle: string;
  image: string;
  description?: string;
  category: string;
  price: number;
}

export interface IOrder {
  email: string;
  address: string;
  phoneNumber: string;
  payMethod: string;
}

export interface IProductData {
  products: IProduct[];
  preview: string | null;
  getProducts(): IProduct[];
  getProduct(): IProduct;
}

export type TProductInfo = Pick<IProduct, 'tittle' | 'price' | 'id'>

export type TOrderAddressAndPayment= Pick<IOrder, 'payMethod' | 'address'>

export type TOrderCommunication = Pick<IOrder, 'email' | 'phoneNumber'>