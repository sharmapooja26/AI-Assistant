import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function Customize2() {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      setLoading(false);
      console.log(result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-white relative px-4">
      <MdKeyboardBackspace
        className="absolute top-8 left-8 text-black cursor-pointer w-8 h-8"
        onClick={() => navigate("/customize")}
      />

      <div className="w-[90%] max-w-[500px] bg-[#f9f9f9] border border-[#ddd] rounded-3xl shadow-lg p-10 flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-bold text-center text-[#222]">
          Name your Assistant
        </h1>
        <p className="text-gray-500 text-center">
          Give a unique name to your Virtual Assistant!
        </p>

        <input
          type="text"
          placeholder="eg. Jenny"
          className="w-full h-[50px] rounded-xl px-4 text-lg text-black outline-none border border-[#ccc]"
          required
          onChange={(e) => setAssistantName(e.target.value)}
          value={assistantName}
        />

        {assistantName && (
          <button
            className="w-full h-[50px] bg-gradient-to-r bg-black text-white hover:scale-105 transition-transform"
            disabled={loading}
            onClick={handleUpdateAssistant}
          >
            {loading ? "Creating Assistant..." : "Create Assistant"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Customize2;
