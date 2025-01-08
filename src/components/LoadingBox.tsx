import Spinner from "react-bootstrap/Spinner";

interface LoadingBoxProps {
  className?: string;
  children?: React.ReactNode;
}

const LoadingBox: React.FC<LoadingBoxProps> = ({ children }) => {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">
        {children || "Loading"}Loading.....
      </span>
    </Spinner>
  );
};

export default LoadingBox;
