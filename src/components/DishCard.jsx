import { Link } from 'react-router-dom';

const DishCard = ({ dish }) => {
  return (
    <div className="dish-detail-card western-card">
      <div className="dish-image-wrapper">
        <img src={dish.image} alt={dish.name} className="dish-serve-image" />
      </div>
      <div className="dish-card-body-content">
        <div className="dish-card-header">
          <div className="dish-title-price">
            <h3>{dish.name}</h3>
            <span className="dish-detail-price blue-text">{dish.price}</span>
          </div>
          <div className="dish-badge-row">
            {dish.tags.map((tag, tIdx) => (
              <span key={tIdx} className="dish-detail-badge western-badge">{tag}</span>
            ))}
          </div>
        </div>

        <p className="dish-card-desc">{dish.description}</p>

        <div className="dish-ingredients">
          <strong>Key Ingredients:</strong>
          <div className="ingredients-pills">
            {dish.ingredients.map((ing, iIdx) => (
              <span key={iIdx} className="ingredient-pill">{ing}</span>
            ))}
          </div>
        </div>

        <div className="dish-card-actions">
          <Link
            to="/book"
            state={{ preselectCuisine: 'western', preselectDish: dish.value }}
            className="btn-primary dish-preorder-btn western-btn"
          >
            <span>Pre-order & Reserve</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
