import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getOrderById, resetOrder } from "../slices/orderSlice";
import { RootState, AppDispatch } from "../store"; // Adjust based on your store setup
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import MessageBox from "../components/MessageBox";
// import { Order } from "../types/order";

const OrderPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const { orderId } = useParams<{ orderId: string }>(); // Get orderId from URL params

  // Select order state from Redux store
  const { order, status, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    // Fetch order details by ID when the component mounts
    if (orderId) {
      dispatch(getOrderById(orderId));
    }

    // Clean up function to reset order state
    return () => {
      dispatch(resetOrder());
    };
  }, [dispatch, orderId]);

  // Render loading state
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Render error state
  if (status === "failed" && error) {
    return <div>Error: {error.message || "Failed to load order."}</div>;
  }

  // Render order details
  if (status === "succeeded" && order) {
    return (
      <Container className="my-5">
        <h1 className="mb-4">Order Details</h1>
        <Row>
          {/* Order Info Section */}
          <Col md={8}>
            <Card className="mb-4">
              <Card.Header as="h2">Order ID: {order._id}</Card.Header>
              <Card.Body>
                <h3>Customer Information</h3>
                {order.shippingAddress && (
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Full Name:</strong>{" "}
                      {order.shippingAddress.fullName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Address:</strong> {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.country}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Postal Code:</strong>{" "}
                      {order.shippingAddress.postalCode}
                    </ListGroup.Item>
                  </ListGroup>
                )}
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header as="h3">Items Ordered</Card.Header>
              <Card.Body>
                {order.orderItems.map((item) => (
                  <ListGroup variant="flush" key={item._id}>
                    <ListGroup.Item>
                      <Row>
                        <Col md={2}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid"
                          />
                        </Col>
                        <Col>
                          <p>
                            <strong>Name:</strong> {item.name}
                          </p>
                          <p>
                            <strong>Quantity:</strong> {item.quantity}
                          </p>
                          <p>
                            <strong>Price:</strong> ${item.price}
                          </p>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  </ListGroup>
                ))}
              </Card.Body>
            </Card>
          </Col>

          {/* Payment and Order Status Section */}
          <Col md={4}>
            <Card>
              <Card.Header as="h3">Payment Information</Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Status:</strong>{" "}
                    {order.isPaid ? (
                      <MessageBox variant="success">
                        Paid at {order.paidAt}
                      </MessageBox>
                    ) : (
                      <MessageBox variant="warning">Not Paid</MessageBox>
                    )}{" "}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Delivery:</strong>{" "}
                    {order.isDelivered ? (
                      <MessageBox variant="success">
                        Delivered at {order.deliveredAt}
                      </MessageBox>
                    ) : (
                      <MessageBox variant="warning">Not Delivered</MessageBox>
                    )}{" "}
                    {order.deliveredAt && `on ${order.deliveredAt}`}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  // Default return
  return null;
};

export default OrderPage;
