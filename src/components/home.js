import React from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const user = useSelector((state) => state.user);
  console.log(user);
  return (
    <div className="container fluid mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6 offset-md-3 text-center">
            <h1 className="display-4 mb-4">Welcome to Our Website</h1>
            <p className="lead">
              We provide innovative solutions to your business needs.
            </p>
            <a href="/about" className="btn btn-primary mr-2">
              About Us
            </a>
            <a href="/contact" className="btn btn-secondary">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
