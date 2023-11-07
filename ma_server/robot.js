// this is the module containing basic functions.
const crypto = require("crypto");



function formatter(s, factor, precision){
        n = factor*parseFloat(s);
        p = Math.pow(10, precision)
        n = Math.trunc(n*p)/p;
        n = parseFloat(n.toFixed(precision));
        return n
}



async function  getTickerPrice(symbol){
        try{
        const priceFetch = await fetch(`http://binance.com/api/v3/ticker/price?symbol=${symbol}`)
        const priceBody  = await priceFetch.json();
        return parseFloat(priceBody.price);

        }catch(error){
                            console.error("Error",error);
                            throw error;
        }

}




async function cancelOrders(symbol, apiKey, apiSecret){
        try{
                    const timestamp = Date.now();
                    const endpoint  = "https://binance.com/api/v3/openOrders";
                    const params    = {
                        symbol,
                        timestamp
                    };

                    let queryString = Object.keys(params).map(key=> `${key}=${encodeURIComponent(params[key])}`).join("&");

                    const signature = crypto.createHmac("sha256", apiSecret)
                    .update(queryString)
                    .digest("hex");

                    queryString+="&signature="+signature;

                    const url = endpoint + "?" + queryString;
                    const request = await fetch(url, {
                                    method:"DELETE",
                                    headers:{
                                                        "X-MBX-APIKEY": apiKey,
                                                        "Content-Type": "application/x-www-form-urlencoded"
                                                    }
                                })


                    const response = await request.json();
                    console.log(response);
                    return response;

                }catch(error){
                            console.log("error", error);
                            throw error ;
                        }
}


async function getAccountBalance(apiKey, apiSecret){
        try{
        const timestamp = Date.now();
        const endpoint = "https://binance.com/api/v3/account";
        const params ={
                        timestamp
                    };

                    let queryString = Object.keys(params).map(key=> `${key}=${encodeURIComponent(params[key])}`).join("&");

                    const signature = crypto.createHmac("sha256", apiSecret)
                    .update(queryString)
                    .digest("hex");

                    queryString+="&signature="+signature;

                    const url = endpoint + "?" + queryString;
                    const request = await  fetch(url, {
                                    method:"GET",
                                    headers:{
                                                        "X-MBX-APIKEY": apiKey,
                                                        "Content-Type": "application/x-www-form-urlencoded"
                                                    }
                                })

                    const response = await request.json();
                    //console.log("balance response", response)
                    var balances = response.balances;
                    var usdt = 0;
                    var currency = 0;
        for (i=0; i<balances.length; i++){// sometimes balances is undefined app crash
            if (balances[i].asset == "BTC"){
                                console.log(balances[i])
                                currency = balances[i].free;
                            }else if(balances[i].asset == "FDUSD"){
                                                console.log(balances[i])
                                                usdt = balances[i].free;
                                            }else{
                                                            }
                    }

            return { "fdusd": usdt, "bitcoin":currency};

        }catch(error){
                    console.log("error",error);
                    throw error;
                }
}

async function makeStopLossSell(symbol,  action, quantity, stopPrice, price, apiKey, apiSecret){
        try{
        const endpoint = "https://api.binance.com/api/v3/order";
        const timestamp= Date.now();
                    const params ={
                                    symbol,
                                    side : action, //SELL
                                    type : "STOP_LOSS_LIMIT",
                                    quantity,
                                    stopPrice,
                                    price,
                                    timeInForce : "GTC",
                                    timestamp
                                };
                    console.log(params);

                    let queryString = Object.keys(params).map(key=> `${key}=${encodeURIComponent(params[key])}`).join("&");

                    const signature = crypto.createHmac("sha256", apiSecret)
                    .update(queryString)
                    .digest("hex");

                    queryString+="&signature="+signature;

                    const url = endpoint + "?" + queryString;
                    const request = await  fetch(url, {
                                    method:"POST",
                                    headers:{
                                                        "X-MBX-APIKEY": apiKey,
                                                        "Content-Type": "application/x-www-form-urlencoded"
                                                    }
                                })

                    const response = await request.json();
                    console.log("response from stop loss order");
                    console.log(response);
                    return response;
                }catch(error){
                            console.log("Error", error)
                            throw error;
                        }
}

async function makeTrade(symbol,  action, quoteOrderQty, apiKey, apiSecret){
        try{
                    /*const apiKey = process.env.BINANCE_API_KEY;
                     *         const apiSecret = process.env.BINANCE_SECRET;*/
        const endpoint = "https://api.binance.com/api/v3/order";
        const timestamp= Date.now();
                    const params ={
                                    symbol,
                                    side : action,
                                    type : "MARKET",
                                    quoteOrderQty,
                                    newOrderRespType:"RESULT",
                                    /*timeInForce : "GTC"*/
                                    timestamp
                                };

                    let queryString = Object.keys(params).map(key=> `${key}=${encodeURIComponent(params[key])}`).join("&");

                    const signature = crypto.createHmac("sha256", apiSecret)
                    .update(queryString)
                    .digest("hex");

                    queryString+="&signature="+signature;

                    const url = endpoint + "?" + queryString;
                    const request = await  fetch(url, {
                                    method:"POST",
                                    headers:{
                                                        "X-MBX-APIKEY": apiKey,
                                                        "Content-Type": "application/x-www-form-urlencoded"
                                                    }
                                })

                    const response = await request.json();
                    return response;
                }catch(error){
                            console.log("Error", error)
                            throw error;
                        }
}



module.exports.getTickerPrice   = getTickerPrice;
module.exports.cancelOrders     = cancelOrders;
module.exports.getAccountBalance= getAccountBalance;
module.exports.makeStopLossSell = makeStopLossSell;
module.exports.makeTrade        = makeTrade;
module.exports.formatter        = formatter;
