// // const dns = require('dns');
// // dns.setServers(['8.8.8.8', '8.8.4.4']);

// // require("dotenv").config({ path: "./.env" });

// // console.log("DEBUG URI:", process.env.MONGODB_URI);
// // const express = require('express');
// // const cors = require('cors');
// // const { MongoClient, ServerApiVersion } = require('mongodb');

// // const app = express();
// // const PORT = process.env.PORT || 3000;

// // app.use(cors());
// // app.use(express.json());

// // const client = new MongoClient(process.env.MONGODB_URI, {
// //   serverApi: {
// //     version: ServerApiVersion.v1,
// //     strict: true,
// //     deprecationErrors: true,
// //   },
// // });

// // let messagesCollection;

// // app.get('/api/hello', async (req, res) => {
// //   try {
// //     const message = await messagesCollection.findOne({ key: 'hello' });

// //     res.json({
// //       message: message?.text || 'No MongoDB message found',
// //     });
// //   } catch (error) {
// //     console.error('Could not read from MongoDB: ', error);
// //     res.status(500).json({ message: 'Database error' });
// //   }
// // });

// // async function startServer() {
// //   try {
// //     // step1: Connect to MongoDB
// //     await client.connect();

// //     // step2: Get the database
// //     const db = client.db(process.env.DB_NAME);
// //     messagesCollection = db.collection('messages');

// //     // creates the first message only if it does not already exist
// //     await messagesCollection.updateOne(
// //       { key: 'hello' },
// //       {
// //         $setOnInsert: {
// //           key: 'hello',
// //           text: 'hello from MongoDB',
// //           createdAt: new Date(),
// //         },
// //       },
// //       { upsert: true }
// //     );

// //     console.log('Connected to MongoDB');

// //     app.listen(PORT, () => {
// //       console.log(`Server is running on http://localhost:${PORT}`);
// //     });

// //   } catch (error) {
// //     console.log('MongoDB connection failed: ', error);
// //     process.exit(1);
// //   }
// // }

// // startServer();

// const dns = require('dns');
// dns.setServers(['8.8.8.8', '8.8.4.4']);

// require("dotenv").config({ path: "./.env" });

// console.log("DEBUG URI:", process.env.MONGODB_URI);
// console.log("DEBUG Node version:", process.version);

// const express = require('express');
// const cors = require('cors');
// const { MongoClient, ServerApiVersion } = require('mongodb');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(cors());
// app.use(express.json());

// const client = new MongoClient(process.env.MONGODB_URI, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
//   tls: true,
//   tlsAllowInvalidCertificates: true,   // ⚠️ TEMPORARY — sirf debug ke liye
//   tlsAllowInvalidHostnames: true,      // ⚠️ TEMPORARY — sirf debug ke liye
// });

// let messagesCollection;

// app.get('/api/hello', async (req, res) => {
//   try {
//     const message = await messagesCollection.findOne({ key: 'hello' });
//     res.json({
//       message: message?.text || 'No MongoDB message found',
//     });
//   } catch (error) {
//     console.error('Could not read from MongoDB: ', error);
//     res.status(500).json({ message: 'Database error' });
//   }
// });

// async function startServer() {
//   try {
//     await client.connect();

//     const db = client.db(process.env.DB_NAME);
//     messagesCollection = db.collection('messages');

//     await messagesCollection.updateOne(
//       { key: 'hello' },
//       {
//         $setOnInsert: {
//           key: 'hello',
//           text: 'hello from MongoDB',
//           createdAt: new Date(),
//         },
//       },
//       { upsert: true }
//     );

//     console.log('Connected to MongoDB');

//     app.listen(PORT, () => {
//       console.log(`Server is running on http://localhost:${PORT}`);
//     });

//   } catch (error) {
//     console.log('MongoDB connection failed: ', error);
//     process.exit(1);
//   }
// }

// startServer();

// // hoisting


async function updateUser(){
    const updatedUser = {
        name: "Ojas",
        email: "ojas@example.com",
        age: 30
    };
        const response = await fetch('https://jsonplaceholder.typecode.com/users/1', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });
        const data = await response.json(); 
        console.log('User updated:', data);
}


