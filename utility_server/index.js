const express = require("express");
const cors      = require("cors");
const Redis     = require("redis");
const redisClient= Redis.createClient();



const app = express();
app.listen(1111);

redisClient.connect();


async function getHistory(){
    const key = "history";
    const formatted_history = [];
    try{
        const hist = await redisClient.lRange(key, 0, 10);
        for (let i = 0; i<hist.length; i++){
            formatted_history[i] = JSON.parse(hist[i]);
        }
        console.log("get history has been called");
            //console.log(formatted_history)
        hist2 = formatted_history.reverse();
        return hist2;
    }catch(e){
        console.log(e);
    }
}


// API end points.

app.get("/history", async(req, res) => {
    data =  await getHistory();
    console.log(data);
    res.json(data);
});




