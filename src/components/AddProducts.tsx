import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProducts } from "../slices/productSlice";
import { selectLoading, selectError } from "../slices/productSlice";
import { AppDispatch } from "../store";
import MessageBox from "./MessageBox";
import LoadingBox from "./LoadingBox";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";

const AddProductForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [rating, setRating] = useState(0);
  const [numReviews, setNumReviews] = useState(0);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      name,
      slug,
      image,
      brand,
      category,
      description,
      price,
      countInStock,
      rating,
      numReviews,
    };

    dispatch(addProducts(newProduct));
    toast.success("user added successfully");
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <Helmet>
        <title>Add Product</title>
      </Helmet>
      <h2 className="text-center">Add Product</h2>
      <form onSubmit={handleAddProduct}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Product Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="slug" className="form-label">
            Slug
          </label>
          <input
            type="text"
            className="form-control"
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image URL
          </label>
          <input
            type="text"
            className="form-control"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="brand" className="form-label">
            Brand
          </label>
          <input
            type="text"
            className="form-control"
            id="brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <input
            type="text"
            className="form-control"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="countInStock" className="form-label">
            Count In Stock
          </label>
          <input
            type="number"
            className="form-control"
            id="countInStock"
            value={countInStock}
            onChange={(e) => setCountInStock(Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <input
            type="number"
            className="form-control"
            id="rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="numReviews" className="form-label">
            Number of Reviews
          </label>
          <input
            type="number"
            className="form-control"
            id="numReviews"
            value={numReviews}
            onChange={(e) => setNumReviews(Number(e.target.value))}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Adding Product..." : "Add Product"}
        </button>

        {loading && <LoadingBox className="mt-3">Loading...</LoadingBox>}
        {error && <MessageBox>Error: {error}</MessageBox>}
      </form>
    </div>
  );
};

export default AddProductForm;
