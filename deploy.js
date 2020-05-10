  
const fs = require('fs');

const fileContent = 'https://habit-tracker.surge.sh';
const filepath = `${__dirname}/build/CNAME`;
fs.writeFile(filepath, fileContent, () => {
  console.log('written');
});