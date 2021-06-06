import express from 'express'

import dotenv from 'dotenv'
import ConnectDB from './Database.js'
import AuthRouter from './Router/AuthRouter.js'
import UserRouter from './Router/UserRouter.js'
import PostRouter from './Router/PostRouter.js'



dotenv.config()
const app=express()

//Allows us to use body json thing to create posts

app.use(express.json({ extended: false }));


// funcation connect to app to database
ConnectDB()
const PORT=process.env.PORT||7799

app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})

app.use('/api', new AuthRouter().authRouter)
app.use('/api', new UserRouter().userRouter)
app.use('/api/post', new PostRouter().postRouter)