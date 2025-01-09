import { APiError } from "./types/ApiError";
import { CartItem } from "./types/Cart";
import { Product } from "./types/Product";

export const getError = (error: APiError) => {
  return error.response && error.response.data.message
    ? error.response.data.message
    : error.message;
};

export const convertProductToCartItem = (product: Product): CartItem => {
  if (!product._id) {
    throw new Error("Product ID is undefined.");
  }

  const cartItem: CartItem = {
    _id: product._id, // Now guaranteed to be a string
    image: product.image || "", // Optional fallback for other fields
    slug: product.slug || "",
    quantity: 1,
    countInStock: product.countInStock || 0,
    price: product.price || 0,
    name: product.name || "",
  };
  return cartItem;
};
