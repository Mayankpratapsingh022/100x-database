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
const {Users,Posts,Likes,Follows} = require('./models');
const nodemailer = require('nodemailer');
const session = require('express-session');
const { where, BLOB } = require('sequelize');
const models = require('./models')
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
//importing multer
const multer = require('multer');

const sharp = require('sharp');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;


const supabase = createClient(process.env.SUPABASE_URL,process.env.SUPABASE_KEY);
let VerificationOpt;
let token;

// Set up Multer for file uploads

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

const storage = multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'./uploads')
  },
  filename:function(req,file,cb){
    const uniqueSuffix = Date.now() + '-'+ Math.round(Math.random()*1E9);
    cb(null,file.fieldname + '-'+ uniqueSuffix)
  }
})


const upload = multer({storage});
app.use(express.urlencoded({extended:false}));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,

  
}));

// const {Users} = require('./models');
//await db.sequelize.close()

const generateVerificationOtp =() =>{
  return Math.floor(100000 + Math.random()*900000);
}




          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key:process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath)=>{
    try{
          if(!localFilePath) return null
         const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
          });

          //file has been uploaded succesfully
          console.log("file is uploaded on cloudinary",response.url);
          return response;
    }catch(error){
            fs.unlinkSync(localFilePath) // remove the locally saved file when upload operartion got failed
            return null;
    }
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

  

  try{
    const token = await req.body.user_id;

    if (!token) {
     return res.status(401).send("Unauthorized: Token is missing");
   }
 
  const isvalid = jwt.verify(token,"hellothisiscode")
 
  if(!isvalid){
 
    return res.status(401).send("Unauthorized",);
  }

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
          //new else added try to remove if not works
          else{

            // req.session.email = email; 
          token = jwt.sign({"user_id":user.id},"hellothisiscode");
         //this is to store cookiee
          res.cookie('user_id',token,{maxAge:3600000});
                   

        }

          // res.status(200).send('Logged in.');
          res.status(200).json({token,message:"message is login"});


        
        }catch(err){
          console.error("Error during login:",err);
          res.status(500).send("Internal server error.");
        }
})

// app.get('/cookie',async function(req, res){
//   let minute = 60 * 1000;
  
//   const email = "aditya@gmail.com";
 
//   const user = await Users.findOne({where:{email}});
//   const token = jwt.sign({"user_id":user.id},"hellothisiscode");
//   res.cookie("user_id", token, {httpOnly: true ,maxAge: minute });
//   res.status(200).send({'cookie has been set!':token});
//   });

app.post('/PostUserInfo',async(req,res)=>{
  try{

const PostUserID= await Users.findOne({
  where:{
    id:req.body.id
  }
}) 



  }catch{

  }
})



app.post('/feed',authenticateUser,async(req,res)=>{
try{


  
  const posts = await Posts.findAll({
 
    order: [['createdAt', 'DESC']],
    include: [{
      model: Users,
      attributes: [ 'username', 'displayName','profilePicUrl'],
     
    }],
  });


  // const PostUserInfo= await Users.findOne({
  //   where:{
  //     id:posts[0].userId,
  //   }
  // }) 
  
  // ,userId:PostUserInfo

  res.status(200).json({posts:posts});
  // console.log(posts)
}
catch(error){
  res.status(500).json({error:"failed to fetch posts"});
  console.log(error,"eeee");
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




// app.get("/jwt",async(req,res)=>{
//   const cookietoken = await req.cookies.user_id;
  
//   console.log("start",cookietoken,"jwtdata");

// })

app.post('/addTweet',async(req,res)=>{
  const cookietoken = await req.body.user_id;
  
  
try{


  const jwtdata = jwt.decode(cookietoken,"hellothisiscode");


  
   
  await Posts.create(

    {
      type:'post',
      content:req.body.tweet,
      userId:jwtdata.user_id,


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



// UserFeed 

app.get("/CurrentUserProfile/:id",async(req,res)=>{

  const  UserDetails = await Users.findOne({
    where:{
      id:req.params.id,
    },
  });

  res.status(200).json({
    id: UserDetails.id,
    User: UserDetails.email,
    UserDisplayName: UserDetails.displayName,
    UserName:UserDetails.username,
    Bio:UserDetails.bio,
    Website:UserDetails.webiste,
    Joined:UserDetails.createdAt,
    location:UserDetails.location,
    profilePicUrl:UserDetails.profilePicUrl,


    // dp: UserDetails.profile_picture,
  });

})

app.post("/id",async(req,res)=>{
  const cookietoken = await req.body.user_id;
  const jwtdata = jwt.decode(cookietoken,"hellothisiscode");

  res.status(200).json({id:jwtdata.user_id});
})


app.get("/CurrentUserFeed/:id",async(req,res)=>{
  try{
  const CurrentUserId = req.params.id;
  const posts = await Posts.findAll({
    where: {
      userId: CurrentUserId,
      //why reply id is null ask
    },
    order: [['createdAt', 'DESC']],
    include: [{
      model: Users,
      attributes: [ 'username', 'displayName','profilePicUrl'],
     
    }],
  });

 res.status(200).json({posts:posts});

}catch(error){
       console.log("Your don't have Id in the URL")
  }

})




//EditUserProfile


app.put("/EditUserProfile" ,authenticateUser,async(req,res)=>{


// const userId = 20;

try{
  const {displayName,bio,location,webiste,user_id,username} =req.body;

  UpdatedFields = {
    displayName,bio,location,webiste,username
  }

  const jwtdata = jwt.decode(user_id,"hellothisiscode");
  await Users.update(UpdatedFields,{
    where:{
      id:jwtdata.user_id,
    },
  })


  res
  .status(200)
  .send({ message: "User updated successfully"});
}catch(error){
  console.log("Error updating user :",error)
  res.status(500).send({ error: "Failed to update user" });
}


})



//like
// app.post("/like",authenticateUser,async(req,res)=>{
   


// try{
//   await Likes.create({
//     userId:req.body.userId,
//     postid:req.body.postId,
//     Status:req.body.status,
//     createdAt: new Date()
//   })

//   res.status(200).send({message:"Post Liked"});

// }catch (error){
//   console.error("Error , can't like the post",error);
//   res.status(500).send({error:"Failed to like Post"});
// }

// });


// app.delete("/unlike",authenticateUser,async(req,res)=>{
// try{
//   await Likes.destroy({
//     where:{userId:req.body.userId,postid:req.body.postId}
//   });
//  res.status(204).send({message:"Post Unliked"})
// }catch(error){
//  console.log("error in unliking the post",error);
//  res.status(500).send({error:"Failed to Unliked post"});
// }





// })

//unlike
app.post("/likeStatus",async(req,res)=>{
  try{
    const userId = req.body.userId;
    const postId = req.body.postId;
    console.log(userId,postId,"this is like status");

    // Check if a record already exists with the given userId and postId
    const existingLike = await Likes.findOne({
      where: {
        userId: userId,
        postid: postId,
      },
    });

    const currentStatus = existingLike.Status;
    res.status(200).json({likestatus:currentStatus});

  }catch(error){
    console.log(error)
    res.status(500).send({ error: "Failed to send Status" });
  }
})


app.post("/like", authenticateUser, async (req, res) => {
  try {
    const userId = req.body.userId;
    const postId = req.body.postId;
    //  console.log(userId,postId,"this is like");

    // Check if a record already exists with the given userId and postId
    const existingLike = await Likes.findOne({
      where: {
        userId: userId,
        postid: postId,
      },
    });



    if (existingLike) {
      // If the record exists, update the status
      const currentStatus = existingLike.Status;
      console.log("new",existingLike,currentStatus,postId,userId,"hello htis is like");
      await existingLike.update({
        Status: !currentStatus ,
      });

      res.status(200).send({ message: "Post Liked/Unliked successfully updated" });
      

    } else {
      // If the record doesn't exist, create a new one
      await Likes.create({
        userId: userId,
        postid: postId,
        Status: true,
        createdAt: new Date(),
      });



      res.status(200).send({ message: "Post Liked" });
    }



  } catch (error) {
    console.error("Error, can't like/unlike the post", error);
    res.status(500).send({ error: "Failed to like/unlike post" });
  }
});




// Define route for file upload
// app.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     const fileBuffer = req.file.buffer;
// // const fileBlob = new Blob(fileBuffer,{type:"image/png"});
//     // Use a unique filename or generate one based on your requirements
//     const filename = `file_${Date.now()}.png`;
//     // const filename = 'filendfsdfdfew.png';
//     // const { data, error } = await supabase.storage
//     //   .from("ProfilePic")
//     //   .upload(filename, fileBuffer, {
//     //     contentType: req.file.mimetype,
//     //     // upsert:true,
//     //   });

//     console.log(req.file.path,req.file.destination,"he");
//  const uploadedURl = await uploadOnCloudinary(req.file.path);
// console.log(uploadedURl);
//     if (error) {
//       console.error('Error uploading file to Supabase Storage:', error.message);
//       return res.status(500).send('Internal Server Error');
//     }

//     console.log('File uploaded successfully:', data);

   
//     fs.unlinkSync(req.file.path);

//     return res.status(200).send('File uploaded to Supabase Storage successfully.');
//   } catch (error) {
//     console.error('Error:', error.message);
//     return res.status(500).send('Internal Server Error');
//   }
// });


app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // Optionally, you can access the file information like filename, size, etc.
    const { filename, size, mimetype } = req.file;
     const ImageResponce =  await uploadOnCloudinary(req.file.path);
     const ImageUrl = ImageResponce.url;
  
     fs.unlinkSync(req.file.path);
      Users.update({ profilePicUrl: ImageUrl}, { where: { id:req.body.userId} });
    // Return a success response
    console.log(ImageUrl);
    return res.status(200).json({
      message: 'File uploaded successfully.',
      fileInfo: {
        filename,
        size,
        mimetype,
        ImageUrl,
      
      },
    });


  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).send('Internal Server Error');
  }
});





//This route returns the like numbeers
app.post("/likenumber/:id",async(req,res)=>{
  const postId = req.params.id;
  

    try{
      const LikeCount = await Likes.count({
        where:{
          postid:postId,
        }
      })

      res.status(200).json({TotolLike:LikeCount});
    }catch(error){
      res.status(500).json({error:error});
     
    }
})


// how many people are i am following

app.post("/UserFollowing/:id",async(req,res)=>{
  const userId = req.params.id;
  

    try{
      const Following = await Follows.count({
        where:{
          followerID:userId,
        }
      })

      res.status(200).json({Following:Following});
    }catch(error){
      res.status(500).json({error:error});
     
    }
})

// how many people are following me
// app.post("/UserFollowers/:id",async(req,res)=>{
//   const userId = req.params.id;
  

//     try{
//       const Followers = await Follows.count({
//         where:{
//           followerID:userId,
//         }
//       })

//       res.status(200).json({Followers:Followers});
//     }catch(error){
//       res.status(500).json({error:error});
     
//     }
// })







app.post("/follow",authenticateUser,async(req,res)=>{
  const followerId = req.body.followerId;
  const followingId =req.body.followingId;
console.log(followerId,followingId);
try{

  const  isFollowing = await Follows.findOne({
    where:{
      followerID:followerId,
      followingId:followingId,
    },
  });
console.log("isFollowing",isFollowing)
if(isFollowing){

 try{

  await Follows.destroy({
    where:{
      followerID:followerId,
      followingId:followingId,
    }
  })

  res.status(204).send({message:"You succesfully Unfollowed"});
 }catch(error){
  console.log(error);
 }


}else{
  try{
    await  Follows.create({
      followerID:followerId,
      followingId:followingId,
    })
    res.status(201).send({message:"You Succesfully followed"});
  }catch(error){
    console.log("Error following user: ",error);
    res.status(500).send({error:"Failed to follow"});
  }
}

}catch(error){
console.log(error);

}


 
});

app.post("/isfollowing",async(req,res)=>{
  const  isFollowing = await Follows.findOne({
    where:{
      followerID:req.body.followerId,
      followingId:req.body.followingId,
    },
  });


  if(isFollowing){
    res.status(200).json({isFollowing:true,});

  }else{
  res.status(200).json({isFollowing:false,});

  }
})



//following feed


app.get("/FollowingFeed/:id",async(req,res)=>{
  try{
  const CurrentUserId = req.params.id;
  const followers = await Follows.findAll({
    where: {
      followerID:CurrentUserId,
    },
    include: [
      {
        model: Users,
        as: "followingUser",
        attributes: ["id"], // Include only necessary attributes
      },
    ],
  });


  const followingUserIds = followers.map(
    (follower) => follower.followingUser.id
  );

  console.log(followingUserIds)
  // const posts = await Posts.findAll({
  //   where: {
  //     userId: CurrentUserId,
  //     //why reply id is null ask
  //   },
  //   order: [['createdAt', 'DESC']],
  // });

 res.status(200).json({posts:"posts"});

}catch(error){
       console.log("Your don't have Id in the URL")
  }

})



app.listen(port, () => {


  console.log("app runnning ")
})
