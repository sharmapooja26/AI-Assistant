import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import { CgMenuRight } from "react-icons/cg";
import { RxCross1 } from "react-icons/rx";
import userImg from "../assets/user.gif";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();

  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const [ham, setHam] = useState(false);
  const [voices, setVoices] = useState([]);

  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const synth = window.speechSynthesis;

  // Load Voices Once
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      setVoices(allVoices);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition started");
      } catch (err) {
        if (err.name !== "InvalidStateError") console.error(err);
      }
    }
  };

  const speak = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) utterance.voice = hindiVoice;

    isSpeakingRef.current = true;
    synth.cancel();
    synth.speak(utterance);

    utterance.onend = () => {
      isSpeakingRef.current = false;
      setAiText("");
      if (callback) callback();
    };
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    speak(response, () => {
      startRecognition();
    });

    const query = encodeURIComponent(userInput);
    const openUrl = (url) => window.open(url, "_blank");

    switch (type) {
      case "google-search":
        openUrl(`https://www.google.com/search?q=${query}`);
        break;
      case "calculator-open":
        openUrl(`https://www.google.com/search?q=calculator`);
        break;
      case "instagram-open":
        openUrl(`https://www.instagram.com/`);
        break;
      case "facebook-open":
        openUrl(`https://www.facebook.com/`);
        break;
      case "weather-show":
        openUrl(`https://www.google.com/search?q=weather`);
        break;
      case "youtube-search":
      case "youtube-play":
        openUrl(`https://www.youtube.com/results?search_query=${query}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    let isMounted = true;

    const safeStart = () => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        startRecognition();
      }
    };

    setTimeout(safeStart, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      setTimeout(safeStart, 1000);
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      setTimeout(safeStart, 1000);
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    // Initial Greeting
    speak(`Hello ${userData.name}, what can I help you with?`, () => {
      safeStart();
    });

    return () => {
      isMounted = false;
      recognition.stop();
      synth.cancel();
    };
  }, []);

  return (
    <div className="w-full h-screen bg-whte flex flex-col items-center justify-center relative overflow-hidden">
      {/* Top Navbar */}
      <div className="absolute top-0 w-full flex justify-between items-center px-6 py-4 bg-white shadow-lg z-10">
        <h1 className="text-black text-2xl font-bold">AI Assistant</h1>
        <div className="flex gap-4">
          <button
            className="hidden lg:block bg-white text-black font-semibold px-4 py-2 rounded-full"
            onClick={() => navigate("/customize")}
          >
            Customize
          </button>
          <button
            className="hidden lg:block bg-white text-black font-semibold px-4 py-2 rounded-full"
            onClick={handleLogOut}
          >
            Logout
          </button>
          <CgMenuRight
            className="lg:hidden text-black w-8 h-8"
            onClick={() => setHam(true)}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-0 left-0 w-full h-full bg-[#000000aa] backdrop-blur-md flex flex-col items-start p-6 z-20 transition-transform duration-500 ${
          ham ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <RxCross1
          className="text-white w-8 h-8 self-end mb-4"
          onClick={() => setHam(false)}
        />
        <button
          className="w-full bg-white text-black transition duration-300 font-semibold py-3 rounded-full mb-3"
          onClick={() => navigate("/customize")}
        >
          Customize
        </button>
        <button
          className="w-full bg-white text-black transition duration-300 ease-in-out transform hover:scale-105 font-semibold py-3 rounded-full mb-3"
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <h2 className="text-white text-lg font-semibold mt-4 mb-2">History</h2>
        <div className="w-full overflow-y-auto h-[400px] space-y-2">
          {userData.history?.map((his, index) => (
            <div key={index} className="text-white bg-[#333] p-2 rounded">
              {his}
            </div>
          ))}
        </div>
      </div>

      {/* Assistant Image */}
      <div className="w-[250px] h-[300px] bg-white  overflow-hidden shadow-2xl mb-6">
        <img
          src={userData?.assistantImage}
          alt="Assistant"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Assistant Name */}
      <h2 className="text-black text-xl font-bold mb-2">
        I'm {userData?.assistantName}
      </h2>

      {/* AI Talking Animation */}
      <div className="flex items-center justify-center mb-4">
        {!aiText && <img src={userImg} alt="User" className="w-40" />}
        {aiText && <img src={aiImg} alt="AI Speaking" className="w-40" />}
      </div>

      {/* Live Text Display */}
      <div className="bg-white text-black rounded-full px-6 py-3 text-lg font-semibold shadow-lg max-w-[80%] text-center">
        {userText || aiText}
      </div>
    </div>
  );
}

export default Home;
