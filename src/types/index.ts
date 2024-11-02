
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}

export interface IOrder {
  total: number;
  email: string;
  address: string;
  phone: string;
  payment: string;
  items: string[]
}

export interface IOrderData {
  orderData: TOrderAddressAndPayment & TOrderCommunication;
}

export interface IProducts{
  products: IProduct[];
  getProduct(productId: string): IProduct;
}

export interface IBasket {
  products: TProductBasketInfo[];
  productsForOrder:TProductBasketInfo[];
  addProduct(item: TProductBasketInfo): void;
  removeProduct(productId: string): void;
  getTotalPrice(): number;
  isEmpty(): boolean
  getCount(): number;
  emptyBasket(): void;
  inBasket(productId: string): boolean;
}

export type TProductBasketInfo = Pick<IProduct, 'title' | 'price' | 'id'>

export type TOrderAddressAndPayment= Pick<IOrder, 'payment' | 'address'>

export type TOrderCommunication = Pick<IOrder, 'email' | 'phone'>

export type ProductsWithAPrice = Pick<IProduct, 'id' | 'price'>

export type FormErrors = Partial<Record<keyof IOrder, string>>;