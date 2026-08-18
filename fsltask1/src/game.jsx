import React, { useEffect, useState } from "react";
import axios from "axios";
import img1 from "../src/img/quiz1.jpg";
import img2 from "../src/img/quiz2.jpg";
import img3 from "../src/img/quiz3.jpg";
import img4 from "../src/img/quiz4.jpg";
import imgQ from "../src/img/mark.jpg";

const images = [img1, img2, img3, img4];

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
const [password, setPassword] = useState("");
const [LoggedIn, setLoggedIn] = useState(false);


const handleLogin =async ()=>{
   
  try{
    const resp = await axios.post("http://localhost:3000/login",{email: email, password:password});
    console.log(resp.data)
    alert("Login successful");
    setLoggedIn(true)
    startGame();
  }catch{
    console.error("Login error:", error);
    setLoggedIn(false)
  }
}



const handleLogout = () => {
  setLoggedIn(false);

  setStart(false);

  setCards([]);
  setFirstCard(null);
  setSecondCard(null);
  setScore(0);
  setTimeLeft(60);
  setGameOver(false);
  setIsWon(false);

  setEmail("");
  setPassword("");

  alert("Logged out successfully");
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
  };

  useEffect(() => {
    if (!start || gameOver || isWon) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      setStart(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

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
  console.log("first", firstCard)

  console.log("seco", secondCard)

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
      <h1 className="text-4xl font-bold text-white mt-1">
        Memory Matching Game
      </h1>

 {!LoggedIn ? (

  <div className="wrap border-2 border-white p-10 mt-20 rounded-b-2xl">

    <h1 className="text-white p-2 text-4xl">
      Login
    </h1>

    <div className="loginpane flex flex-col">


      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border-white border-4 rounded-3xl mt-10 p-3 text-2xl text-white"
        type="email"
        placeholder="Ex@gmail.com"
      />


      <div className="relative">

        <input
          className="border-white border-4 rounded-3xl mt-5 p-3 text-2xl text-white"
          type={hide ? "password" : "text"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <i
          onClick={() => setHide(!hide)}
          className={`text-4xl absolute sm:left-[80%] sm:top-[40%]  top-[40%] left-[80%] text-white cursor-pointer ${
            hide
              ? "ri-eye-fill"
              : "ri-eye-off-fill"
          }`}
        ></i>

      </div>

    </div>


    <button
      onClick={handleLogin}
      className="w-40 h-14 mt-5 rounded-full bg-white hover:bg-gray-200 text-xl text-black font-bold cursor-pointer transition"
    >
      {LoggedIn === true ? "logout" : "Login"}
    </button>

  </div>

) : (


  <div className="mt-20">

    <h2 className="text-white text-3xl font-bold mb-5">
      Welcome, {email}
    </h2>

    <button
      onClick={handleLogout}
      className="w-40 h-14 rounded-full bg-red-500 hover:bg-red-600 text-xl text-white font-bold cursor-pointer transition"
    >
      Logout
    </button>

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
        <div className="w-full px-4 sm:px-6 lg:px-10 mt-6">
          <div className="flex justify-center gap-8 mb-4">
            <h2 className="text-2xl font-bold text-white">Time: {timeLeft}s</h2>
            <h2 className="text-2xl font-bold text-white">Score: {score}</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
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
