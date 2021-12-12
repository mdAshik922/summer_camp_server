const express = require('express');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

//MONGODB CONECT
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.89jki.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function verifyToken (req, res, next){
  if(req.headers?.authorization?.startsWith('Bearer ')){
    const token = req.headers.authorization.split(' ')[1];
    try{
      const decodedUser = await admin.auth().verifyIdToken(token);
      req.decodedEmail = decodedUser.email;
    }
    catch{

    };
  };
  next();
};

async function run() {
    try {
      await client.connect();
      const database = client.db('camp_data');
      const campCollection  = database.collection('data');
      const campCollect = database.collection('store');
      const orderCollect = database.collection('order');
      const usersCollection = database.collection('users');

//GET ALL DATA
      app.get('/capming', async(req, res) =>{
        const camp = campCollect.find({});
        const userCamp = await camp.toArray();
          res.json(userCamp);
      });

//GET ALL SPECIFIC DATA 
      app.get('/capming/:id', async(req, res) =>{
        const id = req.params.id;
        const userCamp =  {_id: ObjectId(id)};
        const user = await campCollect.findOne(userCamp);
          res.json(user);
      });

      ////GET User DATA
      app.get('/user', async(req, res) =>{
        const camp = campCollection.find({});
        const userCamp = await camp.toArray();
          res.json(userCamp);
      });

// GET DELETE SERVICE
app.delete('/user/:id', async(req, res) =>{
  const id = req.params.id;
  const query = {_id: ObjectId(id)};
  const campService = await campCollection.deleteOne(query);
  res.json(campService);
});

//GET POST API
app.post('/users', async(req, res)=>{
  const service = req.body;
  const allUsers = await campCollection.insertOne(service);
  res.json(allUsers);
});

//GET POST API
app.post('/order', async(req, res)=>{
  const order = req.body;
  const allOrder = await orderCollect.insertOne(order);
  res.json(allOrder);
});

  ////GET User DATA
  app.get('/order', async(req, res) =>{
    const campOrder = orderCollect.find({});
    const userCamp = await campOrder.toArray();
      res.json(userCamp);
  });
     
// GET DELETE SERVICE
app.delete('/order/:id', async(req, res) =>{
  const id = req.params.id;
  const query = {_id: ObjectId(id)};
  const campOrder = await orderCollect.deleteOne(query);
  res.json(campOrder);
});

// app.put('/users/admin',  async (req, res) => {
//   const user = req.body;
//   const requester = req.decodedEmail;
//   if (requester) {
//       const requesterAccount = await usersCollection.findOne({ email: requester });
//       if (requesterAccount.role === 'admin') {
//           const filter = { email: user.email };
//           const updateDoc = { $set: { role: 'admin' } };
//           const result = await usersCollection.updateOne(filter, updateDoc);
//           res.json(result);
//       };
//   }
//   else {
//       res.status(403).json({ message: 'you do not have access to make admin' })
//   }

// });
app.put('/users/admin',  async (req, res) => {
  const user = req.body;
          const filter = { email: user.email };
          const updateDoc = { $set: { role: 'admin' } };
          const result = await usersCollection.updateOne(filter, updateDoc);
          res.json(result);
     

});

app.get('/users/:email', async(req, res) =>{
  const email = req.params.email;
  const query = {email: email};
  const user = await usersCollection.findOne(query);
  let isAdmin = false;
  if(user?.role === 'admin'){
    isAdmin = true;
  };
  res.json({admin:isAdmin});
});

    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    };
  };
  run().catch(console.dir);



//cheack connectin server
app.get('/', (req, res) =>{
    console.log('server is open');
    res.send('hit api');
});

app.listen(port, () =>{
    console.log('camping server running', port);
});