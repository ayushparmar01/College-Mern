// to make a file
/*
const fs = require("fs");

fs.writeFileSync("notes.txt", "learning Node.js");
console.log("File created and data written successfully.");

// to read a file

const fs = require("fs");

const data = fs.readFileSync(
    "notes.txt", 
    "utf8"
);
console.log(data);


// to append data to a file:)

const fs = require("fs");
fs.appendFileSync(
    "notes.txt", 
    "\nLearning Node.js is fun!"
);
console.log("Data appended successfully.");


// to delete the file 
const fs = require("fs");
fs.unlinkSync("notes.txt");
console.log("File deleted successfully.");



const path  = require("path");

console.log(__filename);
console.log(__dirname);
console.log(path.basename(__filename));
console.log(path.basename(__dirname));
*/

const os = require("os");

console.log(os.platform());
console.log(os.arch());
console.log(os.cpus());
console.log(os.cpus().length);