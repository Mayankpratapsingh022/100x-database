const express = require('express')

const bcrypt = require('bcryptjs')
const db = require('./models/index.js');
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');
const app = express();
//app.use(bodyParser.urlencoded())
app.use(express.json())
app.use(cookieParser());
const port = 3000;

const {Users,Posts} = require('./models');
// const {Users} = require('./models');
//await db.sequelize.close()



app.get("/healthcheck", async (req, res) => {
    try {
      await db.sequelize.authenticate();
      await db.sequelize.close();
      res.status(200).send("I'm healthy!");
    } catch (error) {
      await db.sequelize.close();
      res.status(500).send("unable to connect to sever");
    }
  });


const authenticateUser = async (req,res,next)=>{
  const user_id = req.cookies.user_id;

  if(!user_id){
    return res.status(401).send("Unauthorized");
  }
  try{
    req.current_user = await Users.findOne({where:{id:user_id}})
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
      
    
    // id: "45344",
    // displayName: "mrenew",
    // username: "vefdsfsdfron",
    // email: "verosdfnsdfsdfdf@example.com",
    // password: "#ersdf34", // replace with a hashed password
    // bio: "I am strongest.",
    // location: "Vatican city",
    // webiste: "https://veron.com",
    // profilePicUrl: "https://veron.com/profile.jpg",
    // headerPicUrl: "https://veron.com/cover.jpg",
    // dateOfBirth: new Date("1996-08-23"),


    
    displayName: req.body.displayName,
    username: req.body.username,
    email: req.body.email,
    password:hashedPassword,
    bio: req.body.bio, 
    location: req.body.location,
    webiste: req.body.webiste,
    profilePicUrl: req.body.profilePicUrl,
    headerPicUrl:  req.body.headerPicUrl,
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

          res.cookie('user_id',user.id,{
            httpOnly:true,
            //secure:true,
            maxAge:3600000
          });

          res.status(200).send('Logged in.');


        
        }catch(err){
          console.error("Error during login:",err);
          res.status(500).send("Internal server error.");
        }
})

app.get('/feed',authenticateUser,async(req,res)=>{
try{
  const posts = await Posts.findAll();
  res.status(200).json({posts:posts,email:req.current_user.email});
}
catch(error){
  res.status(500).json({error:"failed to fetch posts"});
}


})


app.listen(port, () => {


  console.log("app runnning ")
})
