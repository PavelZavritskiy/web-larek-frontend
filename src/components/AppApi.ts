import { Api } from './base/api';
import { IOrder, IProduct } from '../types/index';
import { API_URL, CDN_URL, settings } from '../utils/constants';

export type OrderResponse = {
    id: string;
    total: number;
}

export type ProductsResponse<T> = {
  total: number;
  items: T[];
}

export class AppApi extends Api{
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProduct(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(
      (item: IProduct) => ({
        ...item,
        image: this.cdn + item.image,})
    );
  };

  getProducts(): Promise<IProduct[]> {
    return this.get('/product/')
    .then((data: ProductsResponse<IProduct>) =>
      data.items.map((item: IProduct) => ({
        ...item,
        image: this.cdn + item.image}))
    );
  }

  placeOrder(data: IOrder): Promise<OrderResponse> {
	  return this.post(`/order`, data)
        .then((res: OrderResponse) => res);
  }

}

export const appApi = new AppApi(CDN_URL, API_URL, settings)
