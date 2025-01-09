import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import BankTransfer from "./pages/BankTransfer.tsx";
import HomePage from "./pages/HomPage.tsx";
import ProductPage from "./pages/ProductPage.tsx";
import { persistor, store } from "./store.ts";
import { Provider } from "react-redux";
import CartPage from "./pages/CartPage.tsx";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ShippingAddressPage from "./pages/ShippingAddress.tsx";
import PaymentMethodPage from "./pages/PaymentMethodPage.tsx";
import { PersistGate } from "redux-persist/integration/react";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import PlaceOrderPage from "./pages/PlaceOrderPage.tsx";
import OrderPage from "./pages/OrderPage.tsx";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
// import PayPal from "./pages/PayPal.tsx";
import AddProductForm from "./components/AddProducts.tsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} element={<HomePage />} />
      <Route path="product/:slug" element={<ProductPage />} />
      <Route path="cart" element={<CartPage />} />
      <Route path="signin" element={<SignInPage />} />
      <Route path="signup" element={<SignUpPage />} />
      <Route path="" element={<ProtectedRoute />}>
        <Route path="shipping" element={<ShippingAddressPage />} />
        <Route path="payment" element={<PaymentMethodPage />} />
        <Route path="transfer" element={<BankTransfer />} />
        <Route path="placeorder" element={<PlaceOrderPage />} />
        {/* <Route path="paypalpayment" element={<PayPal orderId={""} />} /> */}
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="addproduct" element={<AddProductForm />} />
      </Route>
    </Route>
  )
);

// biome-ignore lint/style/noNonNullAssertion: <explanation>
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PayPalScriptProvider options={{ clientId: "sb" }} deferLoading={true}>
          <HelmetProvider>
            <RouterProvider router={router} />
          </HelmetProvider>
        </PayPalScriptProvider>
      </PersistGate>
    </Provider>
  </StrictMode>
);
