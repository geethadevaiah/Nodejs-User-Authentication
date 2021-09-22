const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

// so that appl express can use json
app.use(express.json())

// const users as local var ( database to be used )
const users = []

// get all the users registered in the session
app.get('/users', (req, res) => {
    res.json(users)
})

// post the new user to save or register a new user
app.post('/users', async (req, res) => {

    try{
        // can use salt or default it to 10
        // const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, 10/*salt*/)
        // user local to hold current user and hashedpassword
        const user = {
            name :req.body.name ,
            password: hashedPassword
        }
        // save to the users list
        users.push(user)
        // response sent as added success
        res.status(201).send()
    } catch {
        res.status(500).send()
    }
})

// user login to authenticate chech if the user is present and is authorized
app.post('/users/login', async (req, res) => {

    // get the entered user name
    const user = users.find(user => user.name == req.body.name)
    if(user == null){ //no user present
        return res.status(400).send("cannot find user")
    }
    try{
        // check if the password entered is correct
        // bcrypt is an async function
        // it compared the entered password and the hashed password
        if(await bcrypt.compare(req.body.password , user.password)){
            res.send('Success')
        }
        else{
            res.send('not allowed')
        }
    } catch{
        res.status(500).send()
    }

})


app.listen(3000)