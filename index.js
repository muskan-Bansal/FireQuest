// const firebase = require('firebase');

const express = require('express');

const app = express();

var admin = require('firebase-admin');

var serviceAccount = require('./key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const PORT=process.env.PORT||8080;

app.get('/', (req, res) => {
  res.send('hello world');
});

app.post('/api/create', async (req, res) => {
  // res.send(req.body);

  try {
    const { email, name, age } = req.body;
    const id = email;

    const response = await db.collection('users').add({ email, name, age });
    res.send(response);
  } catch (error) {
    res.send(error);
  }
});

app.get('/api/readAll', async (req, res) => {
  try {
    const userRef = db.collection('users');
    const response = await userRef.get();
    const responseArr = [];

    response.forEach((doc) => {
      responseArr.push(doc.data());
    });

    res.send(responseArr);
  } catch (err) {
    res.send(err);
  }
});

app.get('/api/read/:id', async (req, res) => {
  try {
    const userDocRef = await db.collection('users').doc(req.params.id);
    const response = await userDocRef.get();

    res.send(response.data());
  } catch (err) {
    res.send(err);
  }
});

app.post('/api/update', async (req, res) => {
  try {
    const id = req.body.id;
    const newName = req.body.name;

    const userDocRef = await db.collection('users').doc(id).update({
      name: newName,
    });

    res.send(userDocRef);
  } catch (err) {
    res.send(err);
  }
});

app.delete('/api/delete/:id', async (req, res) => {
  try {
    const response = await db.collection('users').doc(req.params.id).delete();

    res.send(response);
  } catch (err) {
    res.send(err);
  }
});

app.listen(8000, () => console.log(`server is listening to port 8000`));
