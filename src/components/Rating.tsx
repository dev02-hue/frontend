import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

function Rating({
  rating,
  numReviews = 0, // Default value to handle undefined cases
  caption,
}: {
  rating: number;
  numReviews?: number;
  caption?: string;
}) {
  return (
    <div className="rating">
      <span>
        {rating >= 1 ? (
          <FaStar />
        ) : rating >= 0.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>{" "}
      <span>
        {rating >= 2 ? (
          <FaStar />
        ) : rating >= 1.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>{" "}
      <span>
        {rating >= 3 ? (
          <FaStar />
        ) : rating >= 2.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>{" "}
      <span>
        {rating >= 4 ? (
          <FaStar />
        ) : rating >= 3.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>{" "}
      <span>
        {rating >= 5 ? (
          <FaStar />
        ) : rating >= 4.5 ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : numReviews > 0 ? ( // Ensure that we handle undefined or 0 reviews
        <span>{" " + numReviews + " reviews"}</span>
      ) : (
        <span>No reviews yet</span>
      )}
    </div>
  );
}

export default Rating;
