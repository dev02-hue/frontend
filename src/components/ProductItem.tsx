import { Button, Card } from "react-bootstrap";
import { Product } from "../types/Product";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { useDispatch } from "react-redux";
import { addItemToCart, calculatePrices } from "../slices/CartSlice";
import { AppDispatch } from "../store";
import { CartItem } from "../types/Cart";
import { convertProductToCartItem } from "../utils";
import { toast } from "react-toastify";

export default function ProductItem({ product }: { product: Product }) {
  const dispatch: AppDispatch = useDispatch();

  const handleAddItem = (item: CartItem) => {
    dispatch(addItemToCart(item));
    dispatch(calculatePrices());
    toast.success("Item added to cart!");
  };

  return (
    <>
      <Card className="shadow-sm">
        <Link to={`/product/${product.slug}`}>
          <Card.Img
            variant="top"
            src={product.image}
            alt={product.name}
            className="img-fluid"
            style={{ height: "200px", maxWidth: "100%" }}
          />
        </Link>
        <Card.Body>
          <Link
            to={`/product/${product.slug}`}
            className="text-decoration-none"
          >
            <Card.Title className="text-primary">{product.name}</Card.Title>
          </Link>
          <Rating rating={product.rating} numReviews={product.numReviews} />
          <Card.Text className="fw-bold">${product.price}</Card.Text>
          {product.countInStock === 0 ? (
            <Button variant="light" disabled>
              Out of stock
            </Button>
          ) : (
            <Button
              onClick={() => handleAddItem(convertProductToCartItem(product))}
              variant="success"
            >
              Add to cart
            </Button>
          )}
        </Card.Body>
      </Card>
    </>
  );
}
