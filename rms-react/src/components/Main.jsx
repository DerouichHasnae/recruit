import React from "react";
import Header from "./header/Header";

import FeaturedJob from "./featured-jobs/FeaturedJob";
import Jobs from "./jobs/Jobs";
import Footer from "./footer/Footer";

const Main = () => {
  return (
    <>
      <Header />

      <FeaturedJob />
      <Jobs />
      <Footer />
    </>
  );
};

export default Main;
