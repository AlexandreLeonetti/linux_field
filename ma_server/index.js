/* initialization
 * reads a file containing 10 lat prices,
 * push all ten prices directly into databases,
 * then keep absorbing the new prices as usual.
 * just make sure to initialize without interferences with cron.
 */


/* a good thing would be to factor the code and also generate logs.
 * to monitor behavior closely
 */

require('dotenv').config();

const fs = require('fs');
const crypto = require("crypto");
const cron = require("node-cron");
const robot = require("./robot");
const utilMa= require("./util_ma");
const express = require("express");
const cors  = require("cors");
const Redis = require("redis");
const redisClient =Redis.createClient() ;
const symbol = "BTCFDUSD";
const DEFAULT_EXPIRATION = 1000000;

redisClient.connect()
const app = express();
app.listen(1111);

const filePath = 'ma15m.txt';

// Read the file asynchronously
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }
  const numbersAsStringArray = data.split('\n');
  const numbersArray = numbersAsStringArray.map(Number);
  const validNumbersArray = numbersArray.filter(number => !isNaN(number));
  const first10Numbers = validNumbersArray.slice(0, 10);
  utilMa.loopAndInit(first10Numbers, redisClient);//this should happen first 

});


/* call to database from the server to get the values
 * when API is called
 */

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

cron.schedule("50 14,29,44,59  * * * *", () => { // 5 stars means every minutes. 
    // 0 0 * * * *  means every hours
     const currentDate = newDate();
     console.log(currentDate);
     utilMa.injectHistPrice(symbol, redisClient, robot.getTickerPrice );
});




