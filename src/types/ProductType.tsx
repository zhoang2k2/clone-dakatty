export interface Product {
  id: string;
  name: string;
  price: string;
  quantity: string;
  image: string;
  catBreed: string;
  age: string;
  color: string;
  rate: string;
  sales: string;
  status: string;
}

export interface ProductState {
  products: Product[];
  status: string;
}
