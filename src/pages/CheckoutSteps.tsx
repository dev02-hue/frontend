import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Link } from "react-router-dom";
import { Col, ListGroup, Row } from "react-bootstrap";

const CheckoutSteps: React.FC = () => {
  const shippingAddress = useSelector(
    (state: RootState) => state.shipping.shippingAddress
  );
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const paymentMethod = useSelector(
    (state: RootState) => state.payment.paymentMethod
  );
  const order = useSelector((state: RootState) => state.order.order);
  // const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  // const itemsPrice = useSelector((state: RootState) => state.cart.itemsPrice);
  // const shippingPrice = useSelector(
  //   (state: RootState) => state.cart.shippingPrice
  // );
  // const taxPrice = useSelector((state: RootState) => state.cart.taxPrice);
  // const totalPrice = useSelector((state: RootState) => state.cart.totalPrice);

  // Define boolean states for each step
  const isSignedIn = !!userInfo;
  const isShippingCompleted = !!shippingAddress;
  const isPaymentCompleted = !!paymentMethod;
  const isOrderCompleted = !!order;

  return (
    <div className="container mt-4">
      <h2 className="text-center">Checkout Steps</h2>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              {isSignedIn ? (
                <span className="text-success">Signed In</span>
              ) : (
                <Link to="/login" className="text-decoration-none">
                  Sign In
                </Link>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              {isShippingCompleted ? (
                <span className="text-success">Shipping Completed</span>
              ) : (
                <Link to="/shipping" className="text-decoration-none">
                  Shipping
                </Link>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              {isPaymentCompleted ? (
                <span className="text-success">Payment Method Selected</span>
              ) : (
                <Link to="/payment" className="text-decoration-none">
                  Payment
                </Link>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              {isOrderCompleted ? (
                <span className="text-success">Order Completed</span>
              ) : (
                <Link to="/placeorder" className="text-decoration-none">
                  Place Order
                </Link>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutSteps;
