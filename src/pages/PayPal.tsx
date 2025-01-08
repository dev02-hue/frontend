import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getPaypalClientId,
  processPaypalPayment,
  resetPaypalState,
} from "../slices/paypalSlice";
import { RootState, AppDispatch } from "../store"; // Import AppDispatch and RootState types
import { PayPalButtons } from "@paypal/react-paypal-js"; // Ensure you have this package installed
import { useDispatch } from "react-redux"; // Ensure this line is imported

const PayPal = ({ orderId }: { orderId: string }) => {
  const dispatch: AppDispatch = useDispatch(); // Use AppDispatch type here

  // Access the PayPal state from Redux
  const { paypalClientId, status, error } = useSelector(
    (state: RootState) => state.paypal
  );

  // Fetch PayPal Client ID when the component mounts
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        await dispatch(getPaypalClientId()).unwrap();
      } catch (error) {
        console.error("Failed to fetch PayPal Client ID:", error);
      }
    };

    fetchClientId();

    // Reset the PayPal state when the component unmounts
    return () => {
      dispatch(resetPaypalState());
    };
  }, [dispatch]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleApprove = async (_data: { orderID: string }, actions: string) => {
    // Process the payment after the user approves
    try {
      const paymentResult = await dispatch(
        processPaypalPayment(orderId)
      ).unwrap();
      alert("Payment successful!"); // You can replace this with a more user-friendly notification
    } catch (error) {
      alert("Payment failed! Please try again.");
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="paypal-container">
      {status === "loading" && <p>Loading PayPal...</p>}
      {error && <p className="error-message">{error.message}</p>}
      {status === "succeeded" && paypalClientId && (
        <PayPalButtons
          createOrder={(_data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: "0.01", // Replace with your dynamic amount
                  },
                },
              ],
              intent: "CAPTURE",
            });
          }}
          onApprove={handleApprove}
        />
      )}
    </div>
  );
};

export default PayPal;
