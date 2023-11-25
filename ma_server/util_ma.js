const robot = require("./robot");

function sleep(ms) {
          return new Promise((resolve) => {
                            setTimeout(resolve, ms);
                          });
}

async function loopAndInit(arr, redisClient){//goes through all array elts asyncly
    for(const item of arr){
        const res = await initHistory(item, redisClient);
    }
    createMA_10(redisClient);//  here it  works after await.
}

async function initHistory(price, redisClient){
        
        try{
            const result = await redisClient.rPush("history", [`${price}`]);
            if(result>101){
                const popped = await redisClient.lPop("history");
                console.log("history inited");

            }
       }catch(e){
            console.log("Error pushing init values to Redis: ");
            console.log(e);
       }
}

async function createMA_10(redisClient){
    const last10 = await redisClient.lRange("history", -10, -1);
    //mean of last 10 elements.
    const sum = last10.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    const avg = (sum / last10.length) || 0;

    try {
        const result = await redisClient.rPush("ma10", [`${avg}`]);
        if (result>101){
            const popped = await redisClient.lPop("ma10");
            console.log("ma10 updated");
        }
    }catch(e){
        console.log("error redis createMA_10 ",e);
    }
}

async function injectHistPrice(symbol, redisClient, getTickerPrice){
                console.log("injectHistPrice");
                const price = await getTickerPrice(symbol);
                try {
                                  const result = await redisClient.rPush("history", [`${price}`]);
                                  if (result > 101){
                                    const popped = await redisClient.lPop("history");
                                    console.log("injectPrice, history updated");
                                  }
                                  //sleep(500);
                                  createMA_10(redisClient);
                                    /* unsure if this happens at the right time */
                                    /* as createMA_10()  should be called AFTER result arrived */
                                } catch (e) {
                                                      console.log("Error pushing to Redis:");
                                                      console.log(e);
                                                }
                return price;
}

module.exports.sleep        =   sleep;
module.exports.loopAndInit  =   loopAndInit;
module.exports.initHistory  =   initHistory;
module.exports.createMA_10  =   createMA_10;
module.exports.injectHistPrice  =   injectHistPrice;
