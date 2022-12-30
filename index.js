const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
// middle ware

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1ndgjy2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




app.get('/', (req, res) => {
    res.send({
        success: true,
        message: 'it working'
    })
})


async function run() {
    try {

        // database collections
        const usersCollections = client.db('socialMediaApp').collection('usersInfo')
        const addPostCollection = client.db('socialMediaApp').collection('addPostInfo');
        const commentCollection = client.db('socialMediaApp').collection('usersComments')
        const likeCollection = client.db('socialMediaApp').collection('usersLike')


        app.put('/users/:email', async (req, res) => {
            const information = req.body;
            const email = req.params.email;
            const filter = { email: email }
            const updatedDoc = {
                $set: information
            }
            const options = { upsert: true };
            const user = await usersCollections.updateOne(filter, updatedDoc, options);
            res.send(user);
        })

        // add user information from about route
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email;
            const info = req.body;
            const query = { email: email }
            const options = { upsert: true };
            const updatedDoc = {
                $set: info
            }
            const result = await usersCollections.updateOne(query, updatedDoc, options)
            res.send(result)
        })

        // get user information 
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const result = await usersCollections.findOne({ email: email })
            res.send(result)
        })


        //  add post information store database 
        app.post('/postInformation', async (req, res) => {
            const information = req.body;
            const result = await addPostCollection.insertOne(information);
            res.send(result);
        })


        // get all added post for showing in media route
        app.get('/postInformation', async (req, res) => {
            const result = await addPostCollection.find({}).toArray();
            res.send(result);
        })

        // get post details by id for showing post details 
        app.get('/postInformation/:id', async (req, res) => {
            const result = await addPostCollection.findOne({ _id: ObjectId(req.params.id) });
            res.send(result)
        })

        // get post for single user he is login
        app.get('/usersPost/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            // console.log(email)
            const result = await addPostCollection.find(query).toArray();
            res.send(result);
        })


        // collect user comment
        app.post('/comment', async (req, res) => {
            const info = req.body;
            const result = await commentCollection.insertOne(info);
            res.send(result);
        })


        // get comment by id 
        app.get('/comment/:id', async (req, res) => {
            const result = await commentCollection.find({ postId: req.params.id }).toArray()
            res.send(result)
        })


        // post user like db 
        app.post('/like', async (req, res) => {
            const id = req.body;
            const result = await likeCollection.insertOne(id)
            res.send(result);
        })


        // get like for each post 
        app.get('/like/:id', async (req, res) => {
            const id = req.params.id;
            const result = await likeCollection.find({ postId: id }).toArray()
            res.send(result);
        })

    }
    finally {

    }
}
run().catch(error => console.error(error))


app.listen(port, () => {
    console.log(`server running on port ${port}`)
})
