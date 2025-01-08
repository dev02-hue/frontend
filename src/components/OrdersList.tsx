import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../slices/orderSlice"; // Import the async thunk
import { AppDispatch, RootState } from "../store"; // Adjust the import based on your store structure
import { Order } from "../types/order"; // Adjust import based on your project structure

const OrdersList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { orders, status, error } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrders()); // Dispatch the thunk to fetch all orders
  }, [dispatch]);

  // Render loading state or error message if necessary
  if (status === "loading") {
    return <div>Loading orders...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      <h1>Orders List</h1>
      {orders.length > 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order: Order) => (
            <li key={order._id}>
              <h2>Order ID: {order._id}</h2>
              <p>Items:</p>
              <ul>
                {order.orderItems.map((item) => (
                  <li key={item.slug}>
                    {item.name} - Quantity: {item.quantity}
                  </li>
                ))}
              </ul>
              <p>Total Price: ${order.totalPrice.toFixed(2)}</p>
              <p>Status: {order.isPaid ? "Paid" : "Not Paid"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersList;
