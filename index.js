const express = require('express');
const app = express()
const Users = require('./models')


app.get('/', async (req, res)=> {
    try {
        const users = await Users.findAll();
        res.json({ users }); 
        console.log(users);
        
    } catch (error) {
        console.log(error);         
    }

})


app.listen(3000, ()=> {
    console.log('Server listening on port 3000');
})