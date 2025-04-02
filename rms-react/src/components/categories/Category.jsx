import React from 'react';
import CategoryItem from './CategoryItem';
import "./Category.scss";
const Category = () => {
  return (
    <section className="category">
      <div className="category-container">
        <div className="category-container-info">
          <h1 className="category-container-info__heading">Browse Category</h1>
          <p className="category-container-info__description">
            {/* Description here */}
          </p>
        </div>
        <div className="category-container--card-wrapper">
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
          <CategoryItem />
        </div>
      </div>
    </section>
  );
};

export default Category;