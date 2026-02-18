import React from "react";
import { useNavigate } from "react-router-dom";
import NotAuthorizedImg from "../components/Images/401.png";

const NotAuthorized = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center px-3">
      <img
        src={NotAuthorizedImg}
        alt="Not Authorized"
        className="mb-3"
        style={{ width: "350px", height: "350px" }}
      />

      <h1 className="mb-2">You are not authorized</h1>
      <p className="text-secondary mb-4">
        It seems like you don't have permission to use this portal.
        <br />
        Please sign in with a different account.
      </p>

      <button className="btn btn-danger btn-lg" onClick={handleGoBack}>
        GO Back
      </button>
    </div>
  );
};

export default NotAuthorized;
