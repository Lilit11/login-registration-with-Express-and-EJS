require('dotenv').config();
const express = require('express')
const app = express()
const PORT = process.env.PORT
const SECRET_KEY = process.env.SECRET_KEY
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

const auth = (req, res, next) => {
    const auth = req.headers['authorization']
    if (auth) {
        const token = auth.split(" ")[1]
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                return res.status(400).send("invalid token")
            }
            req.user = user
            return next()
        })
    }
    res.render('login')

}


app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', (req, res) => {
    const { name, login, password } = req.body
    let usersFs = fs.readFileSync('users.json')
    let users = JSON.parse(usersFs)
    const id = Math.floor(Math.random() * 1000)
    let newUser = { name, login, password, id }

    users.push(newUser)
    fs.writeFileSync('users.json', JSON.stringify(users))
    res.status(201).send("You have successfully registered");
});

app.get('/users', (req, res) => {
    let usersFs = fs.readFileSync('users.json')
    let users = JSON.parse(usersFs)
    res.render('users', { users })
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', (req, res) => {
    const { login, password } = req.body
    let usersFs = fs.readFileSync('users.json')
    let users = JSON.parse(usersFs)
    let found = users.find(user => user.login === login && user.password === password)

    if (found) {
        const user = found;
        const token = jwt.sign(user, SECRET_KEY, { expiresIn: 60 });
        return res.status(200).send(token);
    } else {
        return res.status(401).send('Invalid credentials');
    }
}
)

app.get('/user', auth, (req, res) => {
    res.status(200).send("Welcome to your personal account dear " + req.user.name)
})

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost: ${PORT}`);
})

