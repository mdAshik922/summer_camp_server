const express = require('express');
const app = express();
require('dotenv').config();

const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//MONGODB CONECT
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.89jki.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

async function run() {
    try {
      await client.connect();
      const database = client.db('camp_data');
      const campCollaction = database.collection('data');
      const campCollact = database.collection('store');
      const orderCollact = database.collection('order');

//GET ALL DATA
      app.get('/capming', async(req, res) =>{
        const camp = campCollact.find({});
        const userCamp = await camp.toArray();
          res.json(userCamp);
      });

//GET ALL SPECIFIC DATA 
      app.get('/capming/:id', async(req, res) =>{
        const id = req.params.id;
        const userCamp =  {_id: ObjectId(id)};
        const user = await campCollact.findOne(userCamp);
          res.json(user);
      });

      ////GET User DATA
      app.get('/user', async(req, res) =>{
        const camp = campCollaction.find({});
        const userCamp = await camp.toArray();
          res.json(userCamp);
      });

// GET DELETE SERVICE
app.delete('/user/:id', async(req, res) =>{
  const id = req.params.id;
  // console.log('getting specific id', id);
  const query = {_id: ObjectId(id)};
  // console.log(query)
  const campService = await campCollaction.deleteOne(query);
  
  res.json(campService)
});

//GET POST API
app.post('/users', async(req, res)=>{
  const service = req.body;
  const allUsers = await campCollaction.insertOne(service);
//  console.log('delete', allUsers)
  res.json(allUsers);
});

//GET POST API
app.post('/order', async(req, res)=>{
  const order = req.body;
  const allOrder = await orderCollaction.insertOne(order);
//  console.log('delete', allUsers)
  res.json(allOrder);
});

  ////GET User DATA
  app.get('/order', async(req, res) =>{
    const campOrder = orderCollaction.find({});
    const userCamp = await campOrder.toArray();
      res.json(userCamp);
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