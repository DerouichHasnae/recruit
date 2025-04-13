import React from "react";
import Header from "./header/Header";
import  Category from "./categories/Category";
import FeaturesJob from "./featured-jobs/FeaturedJob";
import Jobs from "./jobs/Jobs";
import Footer from "./footer/Footer";
import AboutUs from "./header/AboutUs";

const Main = () => {
  return (
    <>
      <Header />
       <FeaturesJob/>
     <AboutUs/>
      <Footer />
     
    </>
  );
};

export default Main;
