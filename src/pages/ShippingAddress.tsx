import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, Button, Col, Row } from "react-bootstrap";
import { ShippingAddress } from "../types/Cart";
import { setShippingAddress } from "../slices/shippingSlice";
import { RootState } from "../store";
import CheckoutSteps from "./CheckoutSteps";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const ShippingAddressPage: React.FC = () => {
  const dispatch = useDispatch();
  const shippingAddress = useSelector(
    (state: RootState) => state.shipping.shippingAddress
  );
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const navigate = useNavigate();

  const [fullName, setFullName] = React.useState(
    shippingAddress?.fullName || ""
  );
  const [address, setAddress] = React.useState(shippingAddress?.address || "");
  const [city, setCity] = React.useState(shippingAddress?.city || "");
  const [country, setCountry] = React.useState(shippingAddress?.country || "");
  const [postalCode, setPostalCode] = React.useState(
    shippingAddress?.postalCode || ""
  );

  useEffect(() => {
    if (!userInfo) {
      navigate("/signin?redirect=/shipping");
    }
  }, [userInfo, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      setShippingAddress({
        fullName,
        address,
        city,
        country,
        postalCode,
      } as ShippingAddress)
    );
    // Navigate to the payment route
    navigate("/payment");
  };

  return (
    <div className="container mt-4">
      <CheckoutSteps />

      <h2 className="mt-4">Shipping Address</h2>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="city">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="postalCode">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter postal code"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="country">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Button type="submit" variant="primary" className="mt-3">
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default ShippingAddressPage;
