import express from 'express';

const app =  express();
const PORT = 3000;

app.use(express.json());


const data = [
    {
        email: "jignesh@gmail.com",
        password:"1234ABC",
    },
]

app.get("/", (req,res)=>{
    res.send("hello")
})

app.post("/login", (req,res)=>{
     const {email, password} = req.body;
     console.log(email,password)
     if(email === data[0].email && password === data[0].password ){
        res.status(200).json({message:"login success"})
     } else {
        res.status(401).json({message:"Invalid credentials"})
     }
})
app.listen(PORT ,()=>{
    console.log(`server runing on ${PORT}`)
})