import React, { useContext, useRef, useState } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";

function Customize() {
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
  const navigate = useNavigate();
  const inputImage = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white relative px-4">
      <MdKeyboardBackspace
        className="absolute top-8 left-8 text-black cursor-pointer w-8 h-8"
        onClick={() => navigate("/")}
      />

      <div className="w-full max-w-[1000px] bg-[#f9f9f9] border border-[#ddd] rounded-3xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-[#222] mb-8 text-center">
          Select Your Assistant Image
        </h1>

        <div className="grid grid-cols-3 md:grid-cols-4 gap-6">
          <Card image={image1} />
          <Card image={image2} />
          <Card image={image3} />
          <Card image={image4} />
          <Card image={image5} />
          <Card image={image6} />
          <Card image={image7} />

          <div
            className={`w-[150px] h-[150px] bg-[#f0f0f0] border-2 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300
            ${
              selectedImage === "input"
                ? "border-blue-500 shadow-lg shadow-blue-400"
                : "border-gray-300"
            }`}
            onClick={() => {
              inputImage.current.click();
              setSelectedImage("input");
            }}
          >
            {!frontendImage ? (
              <RiImageAddLine className="text-gray-500 w-10 h-10" />
            ) : (
              <img
                src={frontendImage}
                alt="Selected"
                className="h-full w-full object-cover rounded-xl"
              />
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={inputImage}
            hidden
            onChange={handleImage}
          />
        </div>

        {selectedImage && (
          <button
            className="w-[200px] h-[50px] mt-10 bg-black text-white rounded-xl font-semibold text-lg shadow-md hover:scale-105 transition-transform"
            onClick={() => navigate("/customize2")}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default Customize;
