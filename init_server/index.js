/* 1 - let's inject the data into redis database.  DONE
 *  *
 *   * 2 TASK :  add discretionary value if needed and we are done.
 *    * perhaps build an adjustment server that is here only to replace the last
 *     * or few last values.
 *      * this would be possible via POST request
 *       * to either :
 *        * DELETE, CHANGE OR ADD element in the price history.
 *         * a bit like postman
 *          */

const express = require("express");
const cors = require("cors");
const Redis = require("redis");
const redisClient = Redis.createClient();
const yf = require("yahoo-finance");
const ob = require("./data.json");

redisClient.connect();
const app = express();
app.listen(1111);
async function insertHistory(prices){
	try {
                const str_data = [];
                for (let i = 0; i< prices.length; i++){
                        //console.log(i)
                        str_data[i]=JSON.stringify(prices[i]);
                        //console.log(str_data[i])
                }


		//const result = await redisClient.rPush("history", [`${str_data}`]);
                //console.log("str_data", str_data);
                const result = await redisClient.rPush("history", str_data)
                console.log("result from redis insertion ",result)
		return result;
	} catch (e) {
		console.log("error in createHistory",e);
	}
}
async function createHistory() {

	const prices = yf.historical(
		{
			symbol: "BTC-USD",
			from: "2023-01-01",
		},
		function (err, data) {
			try {
				console.log("yfinance API called");
                                //console.log(data)



			} catch (err) {
				console.log(err);
			}
		}
	).then(x => insertHistory(x));

}

async function getHistory() {
	const key = "history";
	try {
		const hist = await redisClient.lRange(key, -10, -1);
		console.log("getHistory has been called");
		return hist;
	} catch (e) {
		console.log(e);
	}
}

// Init Server and Redis

createHistory();

// API end points

app.get("/history", async (req, res) => {
	data = await getHistory();
	res.json(data);
});
