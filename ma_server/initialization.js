const fs = require('fs');

// Replace 'yourfile.txt' with the actual path to your file
const filePath = 'ma15m.txt';

async function processArr(arr){ //goes through all array elements asyncly
        for (const item of arr){
            const res = await as1(item);
        }
}

async function as1 (item){ // receive res from db asyncly
    return new Promise(resolve => {
        const result = setTimeout(()=> {console.log("async ",item)
        
        resolve();
        },500);
    });
}

// Read the file asynchronously
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    return;
  }

  // Split the content into an array of strings (assuming each number is on a new line)
  const numbersAsStringArray = data.split('\n');

  // Convert the array of strings to an array of numbers
  const numbersArray = numbersAsStringArray.map(Number);

  // Filter out any NaN values
  const validNumbersArray = numbersArray.filter(number => !isNaN(number));

  // Take the first 10 numbers
  const first10Numbers = validNumbersArray.slice(0, 10);

   processArr(first10Numbers);
  console.log('Initialized array with the first 10 numbers:', first10Numbers);
});

