const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 4200;
const ObjectID = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mcsxh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const BlogsCollection = client.db('Published_Perfection').collection("Blogs_Collection");
    const AdminsCollection = client.db('Published_Perfection').collection("Admin_Collection");
    app.post('/adding_a_blog', (req, res) => {
        const newBlog= req.body;
        BlogsCollection.insertOne(newBlog)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                console.log(result);
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/newAdminMaker', (req, res) => {
        const newAdmin = req.body;
        console.log(req.body, "come from client site")
        AdminsCollection.insertOne(newAdmin)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })
    app.get('/userIsAdmin', (req, res) => {
        AdminsCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/blogCollectionShow', (req, res) => {
        BlogsCollection.find({}).toArray((err, documents) => {
            console.log(err)
            console.log(documents)
            res.send(documents);
        })
    });
    app.get('/find_single_blog/:id', (req, res) => {
        BlogsCollection.find({ _id: ObjectID(req.params.id) })
          .toArray((err, products) => {
            res.send(products[0])
          })
      })
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})