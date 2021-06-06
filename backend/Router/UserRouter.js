import express from 'express'
const expressRouter=express.Router()
import User from '../Model/UserModel.js'
import {isAuth, generateToken} from '../middleware/auth.js'

class UserRouter{
    
    constructor(userRouter){
     this.userRouter=expressRouter
     this.userRouter.put("/change_user_data/:user_data_change", isAuth,async(req,res)=>{

        try {
            
            const { changeUserData } = req.body;
            let user_Exit = await User.findById(req.user.id).select("-password");
            if(!user_Exit){
                res.status(200).send(" user is not found")
            }
            //  const user= await User.findOneAndUpdate(req.params.id, {$set:req.body},{new:true})  
            let userDataToChange = req.params.user_data_change.toString();

            if (user[userDataToChange] === changeUserData.toString())
          return res.status(401).send("This is the same data that is already in database");

         user[userDataToChange] = changeUserData.toString();
          
          const user=  await user.save();
            
             return res.status(200).send({user})


        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })




     this.userRouter.delete('/:id' ,async(req,res)=>{

        try {
            const user = await User.findByIdAndDelete(req.params.id);
         
            return res.send({user})

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })



     this.userRouter.get('/:id' ,async(req,res)=>{

        try {
            const user = await User.findById(req.params.id);
         
            return res.send({user})

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })


     this.userRouter.get('/' ,isAuth,async(req,res)=>{

        try {
            let user = await User.findById(req.user._id)
         
            return res.json({user});

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })


     this.userRouter.get('/get_user_by_email/:user_email' ,isAuth,async(req,res)=>{

        try {
            let userEmail=req.params.user_email
            let user = await User.findOne({email:userEmail}).select("-password")
         
            return res.json({user});

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })


     this.userRouter.put('/getUserByName' ,isAuth,async(req,res)=>{

        try {
            let { userNameFromSearch } = req.body;

            let users = await User.find().select("-password");
        
            let findUserByUsername = users.filter(
              (user) =>
                user.userName.toString().toLowerCase().split("").join("") ===
                userNameFromSearch.toString().toLowerCase().split("").join("")
            );
         
            return res.send({findUserByUsername});

        } catch (err) {
            return res.status(500).send(`${err.message}-${err.stack}`)
        }
     })


     



   



   



     this.userRouter.get('/userAllInfor',async (req, res) => {

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

export default UserRouter