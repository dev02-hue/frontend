import { Button, Col, Row } from "react-bootstrap";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectLoading,
  selectError,
  selectProducts,
  deleteProduct,
} from "../slices/productSlice";
import { AppDispatch, RootState } from "../store";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import ProductItem from "../components/ProductItem";
import { Helmet } from "react-helmet-async";
import AdminDashboard from "../components/Admin";
import BtnAddProducts from "../components/BtnAddProducts";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const products = useSelector(selectProducts);

  const isAdmin =
    userInfo &&
    userInfo.length > 0 &&
    userInfo.some((user) => user.role === "admin");

  const isSeller =
    userInfo &&
    userInfo.length > 0 &&
    userInfo.some((user) => user.role === "seller");
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Function to handle the delete action
  const handleDelete = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(productId));
    }
  };
  return (
    <>
      <Helmet>
        <title>eCommerce-App</title>
      </Helmet>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Row>
          {products!.map((product) => (
            <Col key={product.slug} sm={6} md={4} lg={3}>
              <ProductItem product={product} />
              {/* Render delete button for admins and sellers */}
              {(isAdmin || isSeller) && product._id && (
                <Button
                  variant="danger"
                  className="mt-2"
                  onClick={() => handleDelete(product._id!)} // Call the delete handler with the product ID
                >
                  Delete
                </Button>
              )}
            </Col>
          ))}
        </Row>
      )}
      {/* Render the AdminDashboard if the user is an admin */}
      {isAdmin && <AdminDashboard />}
      {isSeller && <BtnAddProducts />}
    </>
  );
}
