import express from 'express'
const expressRouter=express.Router()
import bcrypt from 'bcrypt'
import User from '../Model/UserModel.js'
import gravatar from "gravatar";
import {isAuth, generateToken} from '../middleware/auth.js'


import jwt from 'jsonwebtoken'
class AuthRouter{
    authRouter
    constructor(){
     this.authRouter=expressRouter
     this.authRouter.post('/registration' ,async(req,res)=>{

        try {
            
            const {name,email,password,lastName,userName}=req.body

             const exitUser= await User.findOne({email})
             if(exitUser){
                 return res.send("email alreday exits")
             }
             const hasedPassword= await bcrypt.hash(password,12)

             const avatar = gravatar.url(email, {
                r: "pg",
                d: "mm",
                s: "200",
              });

            //  const newUser= {name,email,password:hasedPassword}
             const newUser = new User({
                name, email, password: hasedPassword,avatar,lastName,userName
            })

          const user=   await newUser.save()

          const payload = {
            user: {
              id: user._id,
            },
          };
      
     const token=jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 },
           
          );

             return res.status(200).send({
                 user,token
            })


        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })



     this.authRouter.post('/login' ,async(req,res)=>{

        try {
            
            const {email,password}=req.body

             const user= await User.findOne({email})
             if(!user){
                 return res.send("email does not exits")
             }
             const isMatch = await bcrypt.compare(password, user.password)
             if(!isMatch) return res.status(400).json({msg: "Incorrect password."})

             const token=jwt.sign({
                 _id:user._id,
                 "email":user.email,
                 "name":user.name,
                 "lastName":user.lastName,
                 "password":user.password,
                 "userName":user.userName
            },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"})
      

             return res.status(200).send({
                 user,token
                // _id: user._id,
                // name: user.name,
                // email: user.email,
                // userName: user.userName,
                // lastName: user.lastName,
                // password:user.password,
                // token: generateToken(user) 
             })


        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })




     this.authRouter.get('/:id' ,async(req,res)=>{

        try {
            const user = await User.findById(req.params.id);
           const { password, id, ...others } = user._doc;
            return res.send({others})

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })


     this.authRouter.put('changePassword/:id' ,async(req,res)=>{

        try {
            const {password}=req.body
            const hasedPassword= await bcrypt.hash(password,10)
            const resetPassword=   await User.findOneBy(req.params.id, {
                password: hasedPassword
            })
            return res.status(201).send("password change Suceesfull", resetPassword )

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })


   



   



     this.authRouter.get('/userAllInfor',async (req, res) => {

        try {
                const pageSize = 10
                const page = Number(req.query.pageNumber) || 1

               
                
              
                const keyword = req.query.keyword
                  ? {
                      name: {
                        $regex: req.query.keyword,
                        $options: 'i',
                      },
                    }
                  : {}
              
                const countUser = await User.countDocuments({ ...keyword })
                const totalUser = await User.count()

                const users = await User.find({ ...keyword })
                  .limit(pageSize)
                  .skip(pageSize * (page - 1))
              
                return res.json({ users,totalUser, page, pages: Math.ceil(countUser / pageSize) })
              
      } catch (err) {
          return res.status(500).send(`${err.message}-${err.stack}`)
      }
      },)
      









    }
}

export default AuthRouter