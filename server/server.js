const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const cookieParser = require('cookie-parser')


const PORT = process.env.PORT||5000; 

mongoose.connect('mongodb://localhost:27017/Shopivo')
.then(()=>console.log("MongoDb connected"))
.catch((error)=>console.log(error));

app.use(
    cors(
        {
            origin:'http://localhost:5173/',
            methods:['GET','POST','DELETE','PUT'],
            allowedHeaders:[
                "Content-Type",
                "Authorization",
                "Cache-Control",
                "Expires",
                "Pragma"
            ],
            credentials:true
        }
    )
)
app.use(cookieParser());
app.use(express.json());

app.listen(PORT,()=>console.log(`Server running on ${PORT}`))