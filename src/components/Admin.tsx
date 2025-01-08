import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchUsers, deleteUser, addUser } from "../slices/userSlice";
import { Button, ListGroup, Row, Col, Form, Alert } from "react-bootstrap";
import { toast } from "react-toastify";

const AdminDashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userInfo, error } = useSelector((state: RootState) => state.user);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [role, setRole] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      await dispatch(fetchUsers());
    };

    fetchUserData();
  }, [dispatch]);

  const handleDeleteUser = (userId: string) => {
    dispatch(deleteUser(userId));
  };

  const handleAddUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Form validation: Ensure all fields are filled
    if (!name || !email || !password || !role) {
      toast.error("All fields are required!");
      return;
    }

    // Dispatch the addUser action
    await dispatch(addUser({ name, email, password, role }));

    // Clear the form fields after submission
    setName("");
    setEmail("");
    setPassword("");
    setRole("");

    toast.success("User added successfully!");
  };

  return (
    <>
      <h1 className="text-center mb-4">Admin Dashboard</h1>
      <h2 className="mb-3">Manage Users</h2>
      {error && <Alert variant="danger">{error.message}</Alert>}{" "}
      {/* Display error message */}
      <Row>
        <Col md={6}>
          <ListGroup>
            {userInfo && userInfo.length > 0 ? (
              userInfo.map((user) => (
                <ListGroup.Item
                  key={user._id}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div>
                    <strong>{user.name}</strong> - {user.role}
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete User
                  </Button>
                </ListGroup.Item>
              ))
            ) : (
              <ListGroup.Item>No users found</ListGroup.Item>
            )}
          </ListGroup>
        </Col>

        <Col md={6}>
          <h3>Add New User</h3>
          <Form onSubmit={handleAddUser}>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="seller">Seller</option>
                <option value="user">User</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Add User
            </Button>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default AdminDashboard;
