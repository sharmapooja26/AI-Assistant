import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

function Card({ image }) {
  const {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  return (
    <div
      className={`w-[150px] h-[150px] bg-[#f0f0f0] border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 
      ${
        selectedImage === image
          ? "border-blue-500 shadow-lg shadow-blue-400"
          : "border-gray-300"
      }`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} alt="Assistant" className="w-full h-full object-cover" />
    </div>
  );
}

export default Card;
