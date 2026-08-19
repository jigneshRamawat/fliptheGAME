import React, { useEffect, useState } from "react";
import axios from "axios";
import img1 from "../src/img/quiz1.jpg";
import img2 from "../src/img/quiz2.jpg";
import img3 from "../src/img/quiz3.jpg";
import img4 from "../src/img/quiz4.jpg";

import img05 from "../src/img/img5.jpg";
import img06 from "../src/img/img6.jpg";
import img07 from "../src/img/img7.jpg";
import img08 from "../src/img/img8.jpg";

import imgQ from "../src/img/mark.jpg";

const images = [img1, img2, img3, img4, img05,img06, img07 ,img08];

const createCards = () => {
  const cards = [...images, ...images];

  return cards
    .map((img, index) => ({
      id: index,
      img,
      matched: false,
    }))
    .sort(() => Math.random() - 0.5);
};

function Game() {
  const [start, setStart] = useState(false);
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [hide, setHide] = useState(false);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [LoggedIn, setLoggedIn] = useState(false);
  const [winner, setWinner] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const[have, setHave] = useState("")

  const API_URL = "https://flipthegame.onrender.com";
  // const API_URL = "http://localhost:3000";


  const handleLogin = async () => {
    try {
      const resp = await axios.post(`${API_URL}/login`, { email });
      
      console.log("login", resp.data);
      
      setLoggedIn(true);
      
      localStorage.setItem("UserLogindata", JSON.stringify(resp.data.user));
      alert(resp.data.message);
      setHave(resp.data.message)
      setCurrentUser(resp.data.user);
      startGame();
    } catch (error) {
      console.error("Login error:", error);

      setLoggedIn(false);

      alert(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("UserLogindata");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      setCurrentUser(user);
      setLoggedIn(true);
    }

    howWin();
  }, []);

  const handleRegister = async () => {
    try {
      const resp = await axios.post(`${API_URL}/register`, {
        email,
        username,
      });

      console.log("Register response:", resp.data);
      alert(resp.data.message);

      setIsRegister(false);
      setPassword("");
    } catch (error) {
      console.error("Register error:", error);

      alert(error.response?.data?.message || "Registration failed");
    }
  };

  const setScoreinbackend = async (quickwon, finalScore) => {
    try {
      const userData = JSON.parse(localStorage.getItem("UserLogindata"));
      const userid = userData.id;
      console.log(userid, "userid.....");
      const resp = await axios.put(`${API_URL}/score/${userid}`, {
        score: finalScore,
        time: quickwon,
      });

      console.log("Backend score:", resp.data.user);

      setCurrentUser(resp.data.user);

      howWin();
    } catch (error) {
      console.error("Score error:", error);
    }
  };

  const howWin = async () => {
    try {
      const res = await axios.get(`${API_URL}/data`);
      const players = res.data.data;
      console.log(players);

      if (players.length === 0) {
        console.log("No players found");
        return;
      }

      const winner = players.reduce((best, player) => {
        if (player.score > best.score) {
          return player;
        }
        if (player.score === best.score && player.time < best.time) {
          return player;
        }
        return best;
      });
      setWinner(winner);
      console.log("Winner:", winner);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // const settimeinbackend = async(quickWon)=>{
  //   try{
  //        const resp = await axios.post("http://localhost:3000/time",{
  //         time: quickWon,
  //        });

  //   }catch(err){
  //     console.log(err)
  //   }

  // }
  const handleLogout = () => {
    setLoggedIn(false);

    setCurrentUser(null);

    localStorage.removeItem("user");

    setStart(false);
    setCards([]);
    setFirstCard(null);
    setSecondCard(null);
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setIsWon(false);

    setEmail("");
    setUsername("");
    setPassword("");

    alert("You Want Logout");
  };

  const startGame = () => {
    setCards(createCards());
    setStart(true);
    setScore(0);
    setTimeLeft(60);
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
    setGameOver(false);

    setIsWon(false);
    howWin();
  };

  useEffect(() => {
    if (!start || gameOver || isWon) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      setStart(false);
      setScoreinbackend(60 - timeLeft, score);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 500);
    return () => clearInterval(timer);
  }, [start, gameOver, isWon, timeLeft]);
  const handleCardClick = (card) => {
    if (disabled || !start || card.matched || card.id === firstCard?.id) return;
    if (!firstCard) {
      setFirstCard(card);
    } else {
      setSecondCard(card);
    }
  };
  useEffect(() => {
    console.log("first", firstCard);

    console.log("seco", secondCard);
  }, [firstCard, secondCard]);

  useEffect(() => {
    if (!firstCard || !secondCard) return;
    setDisabled(true);

    if (firstCard.img === secondCard.img) {
      setCards((prev) =>
        prev.map((card) =>
          card.img === firstCard.img ? { ...card, matched: true } : card,
        ),
      );

      setScore((prevScore) => {
        const newScore = prevScore + 1;

        if (newScore === images.length) {
          setIsWon(true);
          const time = 60 - timeLeft;
          setScoreinbackend(time, newScore);
          setStart(false);
        }
        return newScore;
      });

      Again();
    } else {
      const timer = setTimeout(() => {
        Again();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [firstCard, secondCard]);

  const Again = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="flex bg-red-950 border-5 border-dotted items-center  overflow-hidden border-white rounded-full  w-40 h-40 absolute right-10 top-15">
              <h2 className="text-white uppercase text-xl p-5">
        Quickest  {winner ?  winner.time : "No winner "} <span className="text-yellow-200 lowercase text-sm">s</span>  By {winner ? winner.username : "No winner"}
             </h2>
      </div>
      <h1 className="text-3xl font-bold text-white mt-1">
        Memory Matching Game
      </h1>

      <h2 className="text-white text-xl mt-2 capitalize">{have} {currentUser?.username}</h2>

      <h2 className="text-white text-2xl pt-3">Score : {score}</h2>

      {!LoggedIn ? (
        <div className="wrap border-2 border-white p-10 mt-20 rounded-b-2xl">
          <h1 className="text-white p-2 text-4xl">
            {isRegister ? "Register" : "Login"}
          </h1>

          <div className="loginpane flex flex-col">
            {/* Username only for Register */}
            {isRegister && (
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-white border-4 rounded-3xl mt-5 p-3 text-2xl text-white"
                type="text"
                placeholder="Username"
              />
            )}

            {/* Email */}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white border-4 rounded-3xl mt-5 p-3 text-2xl text-white"
              type="email"
              placeholder="Email"
            />

          </div>

          {/* Main button */}
          <button
            onClick={isRegister ? handleRegister : handleLogin}
            className="w-40 h-14 mt-5 rounded-full bg-white hover:bg-gray-200 text-xl text-black font-bold cursor-pointer transition"
          >
            {isRegister ? "Register" : "Login"}
          </button>

          {/* Switch Login/Register */}
          <p
            className="text-white mt-5 cursor-pointer underline"
            onClick={() => {
              setIsRegister(!isRegister);
              setPassword("");
            }}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </p>
        </div>
      ) : (
        <div className="mt-2">

          <div className="flex flex-col gap-5">
            <button
              onClick={()=>startGame()}
              className="w-30  h-8 rounded-full bg-red-900 hover:bg-red-600 text-xl text-white font-bold cursor-pointer transition"
            >
              Restart
            </button>
            <button
              onClick={handleLogout}
              className="w-30 h-8 rounded-full bg-red-500 hover:bg-red-600 text-xl text-white font-bold cursor-pointer transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {isWon && (
        <h2 className="text-3xl text-green-400 font-bold mt-4">
          You Won in {60 - timeLeft}s!
        </h2>
      )}

      {gameOver && !isWon && (
        <h2 className="text-3xl text-red-400 font-bold mt-4">
          Time's Up! Final Score: {score}
        </h2>
      )}

      {(start || isWon) && (
        <div className="w-full px-4 sm:px-6 lg:px-10 mt-2">
          <div className="flex justify-center gap-8 mb-4">
            <h2 className="text-2xl font-bold text-white">Time: {timeLeft}s</h2>
            <h2 className="text-2xl font-bold text-white">Score: {score}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 max-w-lg mx-auto">
            {cards.map((card) => {
              const isOpen =
                card.id === firstCard?.id ||
                card.id === secondCard?.id ||
                card.matched;

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(card)}
                  className="w-full aspect-square bg-gray-400 rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all duration-200"
                >
                  <img
                    className="w-full h-full object-cover"
                    src={isOpen ? card.img : imgQ}
                    alt="card"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;
