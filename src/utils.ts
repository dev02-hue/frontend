import { APiError } from "./types/ApiError";
import { CartItem } from "./types/Cart";
import { Product } from "./types/Product";

export const getError = (error: APiError) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const convertProductToCartItem = (product: Product): CartItem => {
  const cartItem: CartItem = {
    _id: product._id,
    image: product.image,
    slug: product.slug,
    quantity: 1,
    countInStock: product.countInStock,
    price: product.price,
    name: product.name,
  };
  return cartItem;
};
