// src/components/PlaceOrder.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { Link, useNavigate } from "react-router-dom";
import { setShippingAddress } from "../slices/shippingSlice";
import { createOrder } from "../slices/orderSlice";
import { resetCart } from "../slices/CartSlice";
import { Card, ListGroup, Button, Row, Col } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import CheckoutSteps from "./CheckoutSteps";

const PlaceOrder: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingAddress } = useSelector((state: RootState) => state.shipping);
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { paymentMethod } = useSelector((state: RootState) => state.payment);
  const { userInfo, currentUserId } = useSelector(
    (state: RootState) => state.user
  );

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = itemsPrice * 0.15;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    if (!shippingAddress || !paymentMethod) {
      toast.error("Please complete the shipping and payment details.");
      return;
    }
    const currentUser = userInfo?.find((user) => user._id === currentUserId);

    if (!currentUser || !currentUser._id) {
      toast.error("User not logged in.");
      return;
    }

    // Dispatch action to create the order
    dispatch(
      createOrder({
        user: currentUser._id,
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    );

    dispatch(resetCart());
    navigate(`/order/${currentUser._id}`);
  };

  useEffect(() => {
    if (!shippingAddress) {
      dispatch(
        setShippingAddress(
          JSON.parse(localStorage.getItem("shippingAddress") || "{}")
        )
      );
    }
  }, [dispatch, shippingAddress]);

  return (
    <div className="container mx-auto p-4">
      <Helmet>
        <title>Place Order</title>
      </Helmet>
      <CheckoutSteps />
      <h1 className="text-center mb-4">Place Order</h1>

      {/* Shipping Information */}
      <Card className="mb-4">
        <Card.Header as="h2">Shipping</Card.Header>
        <Card.Body>
          {shippingAddress ? (
            <div>
              <p>
                <strong>Name:</strong> {shippingAddress.fullName}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {`${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}`}
              </p>
            </div>
          ) : (
            <p>No shipping address provided.</p>
          )}
          <Link to="/shipping">Edit</Link>
        </Card.Body>
      </Card>

      {/* Payment Information */}
      <Card className="mb-4">
        <Card.Header as="h2">Payment Method</Card.Header>
        <Card.Body>
          <p>{paymentMethod || "No payment method selected."}</p>
          <Link to="/payment">Edit</Link>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h2">Items</Card.Header>
        <Card.Body>
          <ListGroup.Item variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item._id}>
                <Row className="align-items-center mb-3">
                  {" "}
                  <Col md={6} className="d-flex align-items-center">
                    {" "}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="img-fluid rounded me-2"
                      style={{ width: "80px", height: "80px" }}
                    />
                    <Link
                      to={`/product/${item.slug}`}
                      className="text-decoration-none"
                    >
                      {item.name}
                    </Link>
                  </Col>
                  <Col md={3} className="text-center">
                    {" "}
                    <span>{item.quantity}</span>
                  </Col>
                  <Col md={3} className="text-center">
                    {" "}
                    <span>${item.price.toFixed(2)}</span>{" "}
                    {/* Use toFixed for price formatting */}
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup.Item>
          <Link to="/cart">Edit</Link>
        </Card.Body>
      </Card>
      {/* Order Summary */}
      <Card className="mb-4">
        <Card.Header as="h2">Order Summary</Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>Items: ${itemsPrice.toFixed(2)}</ListGroup.Item>
            <ListGroup.Item>
              Shipping: ${shippingPrice.toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>Tax: ${taxPrice.toFixed(2)}</ListGroup.Item>
            <ListGroup.Item>Total: ${totalPrice.toFixed(2)}</ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Place Order Button */}
      <div className="text-center">
        <Button variant="primary" onClick={placeOrderHandler}>
          Place Order
        </Button>
      </div>
    </div>
  );
};

export default PlaceOrder;
