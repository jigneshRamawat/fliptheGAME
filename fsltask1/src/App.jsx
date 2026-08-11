import { useState } from 'react';
import './App.css'
const questions = [
    {
        q: "Which is the smallest continent in the world?",
        answers: [
            { text: "Asia", correct: false },
            { text: "Australia", correct: true },
            { text: "Africa", correct: false },
            { text: "Europe", correct: false },
        ]
    },
    {
        q: "Which is the largest desert in the world?",
        answers: [
            { text: "Sahara", correct: false },
            { text: "Gobi", correct: false },
            { text: "Antarctica", correct: true },
            { text: "Kalahari", correct: false },
        ]
    },
    {
        q: "Which planet is known as the Red Planet?",
        answers: [
            { text: "Venus", correct: false },
            { text: "Mars", correct: true },
            { text: "Jupiter", correct: false },
            { text: "Saturn", correct: false },
        ]
    },
    {
        q: "What is the capital city of France?",
        answers: [
            { text: "Berlin", correct: false },
            { text: "Madrid", correct: false },
            { text: "Paris", correct: true },
            { text: "Rome", correct: false },
        ]
    },
    {
        q: "Which is the fastest land animal?",
        answers: [
            { text: "Cheetah", correct: true },
            { text: "Lion", correct: false },
            { text: "Horse", correct: false },
            { text: "Leopard", correct: false },
        ]
    },
    {
        q: "What is the hardest natural substance on Earth?",
        answers: [
            { text: "Gold", correct: false },
            { text: "Iron", correct: false },
            { text: "Diamond", correct: true },
            { text: "Platinum", correct: false },
        ]
    },
    {
        q: "How many continents are there on Earth?",
        answers: [
            { text: "5", correct: false },
            { text: "6", correct: false },
            { text: "7", correct: true },
            { text: "8", correct: false },
        ]
    }
];

const randomQ = (arr) => {
return [...arr].sort(() => Math.random() - 0.5)
  // console.log(ran)
};
// console.log("functioncalling",randomQ)



function App() {

const [currentIndex , setCurrentIndex] = useState(randomQ(questions[currentIndex].q));
const [Score , setScore] = useState(0);
const [SelectedAns ,setSelectedAns] = useState(null);
const [ShowScore , setShowScore] = useState(false)

const handleClick = (ans)=>{
   if(SelectedAns !== null)return;
   setSelectedAns(ans);
    if (ans.correct) {
      setScore((prevScore) => prevScore + 1)
    };
};

const handleNext = ()=>{
  const nextI = randomQ(questions[currentIndex].q);
  if(nextI < questions.length){
    setCurrentIndex(nextI);
    setSelectedAns(null);
  }else{
    setShowScore(true);
  }
};

const handleRestart = () => {
  
    setCurrentIndex(randomQ(questions[currentIndex].q));
    setScore(0);
    setSelectedAns(null);
    setShowScore(false);
  };




return (
    <>
      <div className="main">
        <div className="title">
          <h2>Play-Quiz</h2>
        </div>

        {ShowScore ? (
          <div>
            <h3 className="question">
              Your Score is: {Score} out of {questions.length}
            </h3>
            <button
              className="nextbtn"
              style={{ display: 'block' }}
              onClick={handleRestart}
            >
              Play Again
            </button>
          </div>
        ) : (
          <div>
            <h3 className="question">
              {currentIndex + 1}. {questions[currentIndex].q}
            </h3>

            <div className="option">
              {questions[currentIndex].answers.map((ans, i) => {
                let btnClass = "btn";
                if (SelectedAns !== null) {
                  if (ans.correct) {
                    btnClass += " correct";
                  } else if (SelectedAns === ans) {
                    btnClass += " Wrong";
                  }
                }

                return (
                  <button
                    key={i}
                    className={btnClass}
                    onClick={() => handleClick(ans)}
                    disabled={SelectedAns !== null}
                  >
                    {ans.text}
                  </button>
                );
              })}
            </div>

            {SelectedAns && (
              <button
                className="nextbtn"
                style={{ display: 'block' }}
                onClick={handleNext}
              >
                {currentIndex === questions.length - 1 ? "Finish" : "Next"}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default App;