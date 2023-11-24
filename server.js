const express = require('express')
const db = require('./models/index.js');
const app = express();
const port = 3000;


app.listen(port, () => {


    console.log("app runnning ")
})



app.get("/healthcheck", async (req,res)=>{  

    try {
        await db.sequelize.authenticate();
        await db.sequelize.close()
        res.status(200).send("I'm healthy!")
    } catch (error) {
        await db.sequelize.close() 
        res.status(500).send("unable to connnect to sever") 
    }

  

})