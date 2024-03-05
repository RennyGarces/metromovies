import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PropTypes from "prop-types";
Stars.propTypes = {
  color: PropTypes.string,
  fontSize: PropTypes.string,
  height: PropTypes.string,
  colorFont: PropTypes.string,
  onShowRating: PropTypes.func,
  definedRating: PropTypes.number,
  message: PropTypes.array,
  colorStartEmpty: PropTypes.string,
};

export default function Stars({
  maxRating = 5,
  color = "#ffff00",
  fontSize = "10px",
  height = "1.5rem",
  definedRating = 0,
  message = [],
  colorFont = "#ffff00",
  colorStartEmpty = "white",
  getStartRating,
  movesStars = true,
}) {
  const [rating, setRating] = useState(definedRating);
  let starsContainer = {
    display: "flex",
    color: colorStartEmpty,
    alignItems: "center",
    gap: "2px",
  };
  let styleStar = {
    cursor: `pointer`,
    color,
    height,
  };
  let numbeRating = {
    fontSize: fontSize,
    color: colorFont,
  };

  function handleRating(ratingNumber) {
    setRating(ratingNumber);
    getStartRating(ratingNumber);
  }
  function returnMessage(rating, maxRating, message) {
    if (message?.length !== 4 || maxRating < 4) return rating;
    if (rating < maxRating * 0.35) return message[0];
    if (rating > maxRating * 0.35 && rating < maxRating * 0.55)
      return message[1];
    if (rating > maxRating * 0.55 && rating < maxRating * 0.85)
      return message[2];
    if (rating > maxRating * 0.85) return message[3];
  }
  return (
    <>
      <div style={starsContainer}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          {movesStars &&
            Array.from({ length: maxRating }, (_, i) => (
              <Star
                key={i}
                onRating={() => handleRating(i + 1)}
                styleStar={rating >= i + 1 ? styleStar : { height }}
              />
            ))}
          {!movesStars &&
            Array.from({ length: maxRating }, (_, i) => (
              <Star
                key={i}
                styleStar={rating >= i + 1 ? styleStar : { height }}
              />
            ))}
        </div>
        <span style={numbeRating}>
          {!rating ? "Opinion" : returnMessage(rating, maxRating, message)}
        </span>
      </div>
    </>
  );
}

function Star({ onRating, styleStar }) {
  return (
    <FontAwesomeIcon
      style={styleStar}
      icon={faStar}
      onClick={onRating}
      onMouseEnter={onRating}
      onMouseLeave={onRating}
    />
  );
}

/* maxRating = 5,
  color ="#ffff00",
  fontSize = "1.3rem",
  height="1.6rem",
  definedRating 
  colorFont
  colorStartEmpty
  message only for message is allowed otherwise numbers as default
  */
