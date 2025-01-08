// src/types.ts
export interface Product {
  _id?: string;
  name: string;
  slug: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  countInStock: number;
  description: string;
  rating: number;
  numReviews: number;
}

// Product Response Types
export type AllProductsResponse = {
  message: string;
  status: number;
  ok: boolean;
  products: Product[];
};

export interface ProductCreateRequest {
  name: string | null;
  slug: string | null;
  image: string | null;
  category: string | null;
  brand: string | null;
  price: number | null;
  countInStock: number | null;
  description: string | null;
}

export interface ProductDeleteRequest {
  id: number;
  name: string;
}

export interface ProductUpdateRequest extends ProductDeleteRequest {
  slug?: string;
  image?: string;
  category?: string;
  brand?: string;
  price?: number;
  countInStock?: number;
  description?: string;
  rating?: number;
  numReviews?: number;
}

export interface ProductResponse {
  message?: string;
  status?: number;
  ok?: boolean;
  error?: string;
  reason?: string;
  product?: Product;
}

export interface ProductState {
  products: Product[];
  productDetails: Product | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  mode: string;
  products: ProductState; // Include products state here
}
