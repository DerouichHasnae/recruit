import React from 'react';
import { Link } from "react-router-dom";
import catIcon from '../../assets/images/default.png';
import "./Category.scss";
const CategoryItem = () => {
  return (
    <div className="category-container--card-wrapper__card">
      <img src={catIcon} alt="Category-icon" width="100px" />
      <Link to="#">
        <h1>Engineer Sector</h1>
      </Link>
      <p>12</p>
    </div>
    
  );
};

export default CategoryItem;