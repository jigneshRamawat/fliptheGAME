import React, { useState } from 'react'

function testGmae() {

    const[winner, setWinner] = useState(null);
    const [currentUser, setCurrentUser] = useState(null)
    const[hide, setHide] = useState(false);
    

    

  return (
    <div>
      <div className="flex flex-col  text-center justify-center pt-10 ">
        <h1 className='text-white text-4xl'>Memory Game</h1>
        <h2 className='text-white text-2xl pt-5'>Top Scorear  is : {winner ? winner.username : " ABC"}</h2>
        <h2 className='text-white text-2xl pt-5'>  {currentUser ?  "Welcome "  + currentUser.username : "Please Sign-in"}</h2>
      </div>

      <div className="wrap flex  mt-5 border-4 border-white rounded-b-4xl    justify-center">
        <div className="inputs flex flex-col m-20 ">
         <input className='rounded-3xl border-white border-3 w-100 p-5 text-white' type="text" placeholder='ex@gmail.com' />
         <input className='rounded-3xl border-white border-3 w-100 p-5 text-white' type="" placeholder='Jony.' />
         <input className='rounded-3xl border-white border-3 w-100 p-5 text-white' type={!setHide ? "text" : "password"} placeholder='*******' />
        </div>
      </div>

    </div>
  )
}

export default testGmae;
