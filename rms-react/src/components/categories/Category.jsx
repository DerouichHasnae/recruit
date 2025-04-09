import React from 'react';
import CategoryItem from './CategoryItem';
import "./Category.scss";

const Category = () => {
  // Données des catégories (à remplacer par vos données réelles)
  const categories = Array(4).fill({ 
    title: "Nom Catégorie", 
    image: "lien-image.jpg" 
  });

  return (
    <section className="category">
      <div className="category-container">
        <div className="category-container-info">
          <h1 className="category-container-info__heading">Browse Category</h1>
          <p className="category-container-info__description">
            Parcourez nos différentes catégories
          </p>
        </div>
        
        <div className="category-container--card-wrapper">
          {categories.map((category, index) => (
            <CategoryItem 
              key={index} 
              title={category.title} 
              image={category.image} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;