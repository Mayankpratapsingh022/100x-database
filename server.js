const express = require('express')
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs')
const db = require('./models/index.js');
const cookieParser = require('cookie-parser');
const { expressjwt: JWT } = require("express-jwt");
//const bodyParser = require('body-parser');
const app = express();
//app.use(bodyParser.urlencoded())
app.use(express.json())
app.use(cookieParser());
const port = 3000;
var cors = require('cors')
const {Users,Posts} = require('./models');
const nodemailer = require('nodemailer');

require('dotenv').config();



let VerificationOpt;
let token;




// const {Users} = require('./models');
//await db.sequelize.close()

const generateVerificationOtp =() =>{
  return Math.floor(100000 + Math.random()*900000);
}



const transporter = nodemailer.createTransport(
 { host: process.env.SMTP_HOST,
   port:process.env.SMPT_PORT,
   secure:false,
   auth:{
    user:process.env.SMTP_MAIL,
    pass:process.env.SMTP_PASSWORD,
   }
}
)

console.log(process.env.SMTP_HOST,"hos")
app.use(cors({
  origin: 'http://localhost:5173',
  credentials:true,
}))






app.get("/healthcheck", async (req, res) => {
    try {
      await db.sequelize.authenticate();
      await db.sequelize.close();
      res.status(200).send("I'm healthy!");
    } catch (error) {
      await db.sequelize.close();
      res.status(500).send("unable to connect to sever");

      console.log(error);
    }
  });


const authenticateUser = async (req,res,next)=>{
  // const user_id = req.cookies.user_id;
  // const user_id = req.headers(Aut)
  const token = req.cookies.user_id;
  const isvalid = jwt.verify(token,"hellothisiscode")
  if(!isvalid){

    return res.status(401).send("Unauthorized");
  }
  try{
    const jwtdata = jwt.decode(token,"hellothisiscode");
    console.log(jwtdata);
    req.current_user = await Users.findOne({where:{id:jwtdata.user_id}})
    next();
  }
  catch(err){
    res.status(401).send("Invalid token");
  }



};




app.post('/signup', async (req,res)=>{
  console.log(req.body);
   try{
   
  const hashedPassword = await bcrypt.hash(req.body.password,10);



await Users.create({

    
    displayName: req.body.displayName,
    // username: req.body.username,
    email: req.body.email,
    password:hashedPassword,
    // bio: req.body.bio, 
    // location: req.body.location,
    // webiste: req.body.webiste,
    // profilePicUrl: req.body.profilePicUrl,
    // headerPicUrl:  req.body.headerPicUrl,
    dateOfBirth: new Date(req.body.dateOfBirth),
});
res.status(201).send({message:'User created!'});




}
catch (error){
res.status(500).send({error:'Failded tso Create  user'})
console.log(error)
}


});


app.post('/login',async (req,res)=>{
    const {email,password} = req.body;
    
    try{
        const user = await Users.findOne({where:{email}});
        if(!user){
          return res.status(400).send('user not found');
        }
          const isValidPassword = await bcrypt.compare(password,user.password);
          if(!isValidPassword){
            return res.status(401).send('Invalid credentials.');

          }
          const token = jwt.sign({user_id:user.id},"hellothisiscode");
          // res.cookie('user_id',user.id,{
          //   httpOnly:true,
          //   //secure:true,
          //   maxAge:3600000
          // });
       
          res.cookie('user_id',token,{
            httpOnly:true,
            //secure:true,
            maxAge:3600000
          });



          // res.status(200).send('Logged in.');
          res.status(200).json({token,message:"message is login"});


        
        }catch(err){
          console.error("Error during login:",err);
          res.status(500).send("Internal server error.");
        }
})

app.get('/feed',authenticateUser,async(req,res)=>{
try{

  const posts = await Posts.findAll();
  res.status(200).json({posts:posts});
  console.log(posts)
}
catch(error){
  res.status(500).json({error:"failed to fetch posts"});
  console.log(error,"eeee")
}


})

app.post("/SendMail", async (req,res) => {


VerificationOpt = generateVerificationOtp();
res.status(303).send(`${VerificationOpt}`)





const mailOptions = {
  from:process.env.SMTP_MAIL,
  to:req.body.email,
  subject:"Your 100x Verification Code",
  text:`Your verification code is ${VerificationOpt} `
}

transporter.sendMail(mailOptions,function(error,info){
  if(error){
    console.log(error)
  }
  else{
    console.log("Email send successfully!")

  }
})




});



app.post('/addTweet',authenticateUser,async(req,res)=>{
try{

  await Posts.create(

    {
      type:'post',
      content:req.body.tweet,
      


    }

  );

  res.status(201).send({message:'Post Created'});
}catch(error){
  console.log(error);
}

})


app.post('/verifyMail', async (req,res)=>{
  if(VerificationOpt == req.body.otp){
    res.status(230).send({msg:"Your are verified"});
  }else{
    res.status(530).send({msg:"OTP is wrong"});
  }



})

app.listen(port, () => {


  console.log("app runnning ")
})
