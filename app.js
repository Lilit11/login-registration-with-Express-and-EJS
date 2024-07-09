require('dotenv').config();
const express = require('express')
const app = express()
const PORT = process.env.PORT
const SECRET_KEY = process.env.SECRET_KEY
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const { tokenValidation } = require('./config/tokenValidation');
const authRouter = require('./routers/auth');
const fileUpload = require('express-fileupload');
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'config')));

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/register', (req, res) => {
    res.render('register')
})
app.get('/users', (req, res) => {
    let usersFs = fs.readFileSync('users.json')
    let users = JSON.parse(usersFs)
    res.render('users', { users })
})


app.post('/login', (req, res) => {
    const { email, password } = req.body
    let users = JSON.parse(fs.readFileSync('users.json'))
    let foundUser = users.find(user => user.email === email && user.password === password)

    if (foundUser) {
        const token = jwt.sign(foundUser, SECRET_KEY, { expiresIn: 60 });
        return res.status(200).send(token);
    } else {
        return res.status(401).send('Invalid credentials');
    }
}
)

app.get('/user', tokenValidation, (req, res) => {
    res.status(200).send("Welcome to your personal account dear " + req.user.name)
})

app.use('/', authRouter)
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);
app.post('/uploads', (req, res) => {
    const { file, fileName } = req.body;
  
    const newFile = Buffer.from(file, 'base64');
  
    const filePath = path.join(__dirname, 'uploads', Date.now() + fileName);
    fs.writeFile(filePath, newFile, (err) => {
      if (err) {
        return res.status(500).json({ message: err });
      }
      res.json({ message: 'File uploaded successfully' });
    });
  });

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})

