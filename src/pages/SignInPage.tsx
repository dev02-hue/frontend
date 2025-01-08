import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../slices/userSlice";
import { AppDispatch, RootState } from "../store";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form, Button, Spinner, Alert } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { APiError } from "../types/ApiError"; // Import your APiError type

const SignInPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loading = useSelector((state: RootState) => state.user.loading); // Loading state
  const userError = useSelector(
    (state: RootState) => state.user.error
  ) as APiError | null; // Get error from user state
  const userInfo = useSelector((state: RootState) => state.user.userInfo); // Get user info from state
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(signIn({ email, password }));
  };

  useEffect(() => {
    if (userError) {
      const errorMessage =
        userError.response && userError.response.data
          ? userError.response.data.message
          : "An unexpected error occurred"; // Fallback error message
      toast.error(errorMessage); // Display the error message from APiError
      setError(errorMessage); // Set the error to state
    } else {
      setError(null); // Reset error if successful
    }
  }, [userError]); // Dependency array with userError

  // Redirect logic based on userInfo
  useEffect(() => {
    if (userInfo) {
      navigate(redirect); // Redirect after successful sign-in
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Form onSubmit={handleSubmit}>
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <Form.Group controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}{" "}
      {/* Display error if exists */}
      <Button
        type="submit"
        variant="primary"
        disabled={loading}
        className="mt-3"
      >
        {loading ? <Spinner animation="border" size="sm" /> : "Sign In"}
      </Button>
      <div className="mt-3">
        New customer?{" "}
        <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
      </div>
    </Form>
  );
};

export default SignInPage;
