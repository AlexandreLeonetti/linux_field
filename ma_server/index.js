/*

 * then take on the nodejs robot and make it follow a classic ma crossover strat
 */


require('dotenv').config();

const crypto = require("crypto");
const cron = require("node-cron");
const robot = require("./robot");
const express = require("express");
const cors  = require("cors");
const Redis = require("redis");
const redisClient =Redis.createClient() ;
const symbol = "BTCFDUSD";
const DEFAULT_EXPIRATION = 1000000;

redisClient.connect()
const app = express();
app.listen(1111);

async function createHistory(symbol){
            const price = await robot.getTickerPrice(symbol);
            console.log(price);
            try {
              const result = await redisClient.rPush("history", [`${price}`]);
              console.log(result);
            } catch (e) {
                  console.log("Error pushing to Redis:");
                  console.log(e);
            }
            return price;
}

async function createMA_10(){
    const last10 = await redisClient.lRange("history", -10, -1);
    //mean of last 10 elements.
    const sum = last10.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    const avg = (sum / last10.length) || 0;

    console.log(`The sum is: ${sum}. The average is: ${avg}.`);
    try {
        const result = await redisClient.rPush("ma10", [`${avg}`]);
        console.log(result);
    }catch(e){
        console.log(e);
    }
}


async function getPriceHistory(symbol){
    const key = "history";
    try{
        const hist = await redisClient.lRange(key, -10, -1);
        return  hist;
    }catch(e){
        console.error(e);
    }
}


async function getMA10(){
    try{
        const ma = await redisClient.lRange("ma10", -10, -1);
        return ma;
    }catch(e){
        console.error(e);
    }
}

// API END POINTS

app.get("/history", async(req, res) =>{
    const data = await getPriceHistory(symbol)
    res.json(data);
});


app.get("/ma10", async(req, res) =>{
    const data = await getMA10()
    res.json(data);
});

// node cron

cron.schedule("0 * * * * *", () => { // 5 stars means every minutes. 0 0 * * * *  means every hours
     createHistory(symbol);
     createMA_10();
});
