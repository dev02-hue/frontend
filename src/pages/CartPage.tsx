import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { removeItemFromCart, updateItemQuantity } from "../slices/CartSlice";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, ListGroup, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import MessageBox from "../components/MessageBox";
import { Helmet } from "react-helmet-async";

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Select cart items from the Redux store
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { mode } = useSelector((state: RootState) => state.mode); // Assuming you have a theme slice

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItemFromCart(itemId));
    toast.success("Item removed from cart!");
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return; // Prevent negative quantity
    dispatch(updateItemQuantity({ itemId, quantity }));
    toast.success("Item quantity updated!");
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate("/signin?redirect=/shipping");
  };

  // Calculate the subtotal
  const calculateSubtotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  // Determine button styles based on mode
  const buttonStyle = mode === "dark" ? "btn-light" : "btn-dark";

  return (
    <div className="cart-page">
      <Helmet>
        <title>Cart Page</title>
      </Helmet>
      {cartItems.length === 0 ? (
        <MessageBox>
          Your cart is empty. <Link to="/">Go Shopping</Link>
        </MessageBox>
      ) : (
        <ListGroup>
          {cartItems.map((item) => (
            <ListGroup.Item key={item._id} className="cart-item">
              <Row className="align-items-center">
                <Col md={4}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-fluid rounded thumbnail"
                  />{" "}
                  <Link to={`/product/${item.slug}`}>{item.name}</Link>
                </Col>
                <Col md={3} className="quantity-controls">
                  <Button
                    className={buttonStyle}
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1} // Disable if quantity is 1
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    value={item.quantity}
                    min="1"
                    className="mx-2"
                    style={{ width: "60px" }} // Optional inline style to adjust width
                    readOnly
                  />
                  <Button
                    className={buttonStyle}
                    onClick={() =>
                      handleUpdateQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </Col>
                <Col md={3}>
                  <div>${item.price}</div>
                  <Button
                    className={buttonStyle}
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col md={9}>
                  <strong>Subtotal:</strong>
                </Col>
                <Col md={3}>
                  <strong>${calculateSubtotal()}</strong>
                </Col>
              </Row>
            </ListGroup.Item>
            <Button
              className={buttonStyle}
              variant="primary"
              onClick={handleCheckout}
              type="button"
              disabled={cartItems.length === 0}
            >
              Proceed to Checkout
            </Button>
          </ListGroup>
        </ListGroup>
      )}
    </div>
  );
}
