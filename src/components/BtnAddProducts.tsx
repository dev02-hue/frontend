// import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BtnAddProducts() {
  return (
    <Button variant="primary" className="mt-3">
      <Link to="/addproduct">Add Products</Link>{" "}
    </Button>
  );
}
