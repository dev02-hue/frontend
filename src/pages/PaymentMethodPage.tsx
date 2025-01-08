import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { loadShippingAddress } from "../slices/shippingSlice"; // Import shipping actions
import { setPaymentMethod } from "../slices/paymentSlice"; // Import payment actions
import { useNavigate } from "react-router-dom";
import { Form, Button, Col } from "react-bootstrap";
import CheckoutSteps from "./CheckoutSteps";
import { Helmet } from "react-helmet-async";

const PaymentMethodPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Load shipping address when component mounts
  useEffect(() => {
    dispatch(loadShippingAddress());
  }, [dispatch]);

  const selectedPaymentMethod = useSelector(
    (state: RootState) => state.payment.paymentMethod
  );

  // Local state for the selected payment method
  const [paymentMethod, setPaymentMethodState] = useState(
    selectedPaymentMethod || "PayPal"
  );

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPaymentMethodState(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save payment method to Redux
    dispatch(setPaymentMethod(paymentMethod));

    // Save payment method to localStorage
    localStorage.setItem("paymentMethod", paymentMethod);

    // Navigate based on payment method
    if (paymentMethod === "PayPal") {
      navigate("/paypalpayment");
    } else if (paymentMethod === "BankTransfer") {
      navigate("/transfer"); // Navigate to the BankTransfer component
    } else {
      navigate("/placeorder");
    }
  };

  return (
    <div className="container mt-4">
      <CheckoutSteps />
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col>
            <Form.Check
              type="radio"
              label="PayPal"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={handlePaymentMethodChange}
            />
            <Form.Check
              type="radio"
              label="Credit Card"
              id="CreditCard"
              name="paymentMethod"
              value="CreditCard"
              checked={paymentMethod === "CreditCard"}
              onChange={handlePaymentMethodChange}
            />
            <Form.Check
              type="radio"
              label="Bank Transfer"
              id="BankTransfer"
              name="paymentMethod"
              value="BankTransfer"
              checked={paymentMethod === "BankTransfer"}
              onChange={handlePaymentMethodChange}
            />
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Continue
        </Button>
      </Form>
    </div>
  );
};

export default PaymentMethodPage;
