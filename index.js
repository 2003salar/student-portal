const express = require('express');
const app = express()
const Users = require('./models')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use("*", (req, res) => res.status(404).json({message: "Page not Found"}));

app.listen(3000, ()=> {
    console.log('Server listening on port 3000');
})