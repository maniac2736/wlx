import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import pw65 from "../../components/Images/image.png";
import grass from "../../components/Images/grass.webp";
import soil from "../../components/Images/soil.webp";
import water from "../../components/Images/water.webp";

function LandingPage() {
  const [products, setProducts] = useState([
    {
      name: "Yonex Power Cushion 65 Z C90 Men's Limited Edition (Natural)",
      image: grass,
      hoverImage: pw65,
    },
    {
      name: "Yonex Power Cushion 65 Z C90 Women's Limited Edition (Natural)",
      image: soil,
      hoverImage: pw65,
    },
    {
      name: "Yonex Power Cushion 65 Z C90 Wide Unisex Limited Edition (Natural)",
      image: water,
      hoverImage: pw65,
    },
  ]);

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (documentHeight - (scrollTop + windowHeight) < 100) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div className="container landing-page">
        <h3 className="text-center py-5">
          65 Z3 C90 (Limited Edition)
          <span className="hot-label badge bg-danger text-white">HOT</span>
        </h3>
        <div className="row landing-products-container">
          {products.map((product, index) => (
            <LandingProduct
              key={index}
              name={product.name}
              image={product.image}
              hoverImage={product.hoverImage}
            />
          ))}
        </div>
      </div>
      {showScrollToTop && (
        <div className="scroll-to-top-container">
          <button
            className="btn btn-primary scroll-to-top"
            onClick={scrollToTop}
          >
            <span>&uarr;</span>
          </button>
        </div>
      )}
    </>
  );
}

function LandingProduct({ name, image, hoverImage }) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="col-md-4 landing-product"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="landing-image-container">
        <img
          src={hovering ? hoverImage : image}
          alt={name}
          className="img-fluid rounded"
        />
      </div>
    </div>
  );
}

export default LandingPage;
