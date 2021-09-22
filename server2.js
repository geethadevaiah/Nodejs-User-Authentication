const express = require('express')
const bcrypt = require('bcrypt')
const app = express()

app.use(express.json())

const users = []

// to get the users

app.get('/users', (req, res) => {
    res.json(users)
})


// to add users
app.post('/users', async (req, res) => {

    try{
        const hashedpassword = await bcrypt.hash(req.body.password, 10)
        const user = {
            name : req.body.name,
            password : hashedpassword
        }
    
        // using bcrypt to hash the password   
        users.push(user);
        res.status(201).send('Created a new user')

    } catch{
        req.status(500).send("error in saving")
    }
})

// to authorize the user
app.post('/users/login', async (req, res) => {
    // check whether there is a user with that name
    // console.info(users)
    const user = users.find(user => user.name == req.body.name)
    // console.log("found user with ? ", user)
    if(user == null){
        return res.status(400).send('no user with that name exists')
    }
    try{
        // check the password
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Success! allowed')
        }
        else{
            res.send("not allowed")
        }
    } catch{
        res.status(500).send('not allowed')
    }
})



app.listen(3001)