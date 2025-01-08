import { Badge, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";
import { ToggleButton } from "./components/ToogleBtn";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, persistor, RootState } from "./store";
import { LinkContainer } from "react-router-bootstrap";
import { signOut } from "./slices/userSlice";
import { resetCart } from "./slices/CartSlice";
import React from "react";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const handleSignOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(signOut()); // This will clear userInfo in state
    localStorage.removeItem("userInfo"); // This will clear localStorage
    dispatch(resetCart()); // Ensure cart is reset if needed
    persistor.purge();
    window.location.href = "/signin";
  };

  return (
    <div className="d-flex flex-column vh-100">
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar expand="lg">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>tsamazona</Navbar.Brand>
            </LinkContainer>
            <Nav>
              <Link to="/cart" className="nav-link">
                Cart
                {cart.cartItems.length > 0 && (
                  <Badge pill bg="danger">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                  </Badge>
                )}
              </Link>
              {userInfo ? (
                <NavDropdown title={userInfo[0].name} id="basic-nav-dropdown">
                  <Link
                    to="#signout"
                    className="dropdown-item"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </Link>
                </NavDropdown>
              ) : (
                <Link className="nav-link" to="/signin">
                  Sign In
                </Link>
              )}
              <ToggleButton />
            </Nav>
          </Container>
        </Navbar>
      </header>
      <main>
        <Container className="mt-3">
          <Outlet />
        </Container>
      </main>
      <footer>
        <div className="text-center">All rights reserved</div>
      </footer>
    </div>
  );
}

export default App;
