const express = require('express')
const app = express()

const http = require('http')
const port = process.env.PORT || 5000
const multer = require('multer')
const cors = require('cors')

const server = http.createServer(app)
const mongoose = require('mongoose')
const employeeRoutes = require('./routes/employeeRoutes')
const employeePointsRoutes = require('./routes/employeePointsRoutes');

server.listen(port, () => {
  console.log('Listening on ' + port)
})

mongoose
  .connect('mongodb+srv://monginahdi:123@cluster0.v0sfiro.mongodb.net/KMA')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((e) => console.log('Connexion à MongoDB échouée !', e))

app.use(express.json())
app.use(
  cors({
    origin: '*',
    methods: ['POST', 'GET', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  }),
)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  )
  next()
})

const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extname = path.extname(file.originalname)
    cb(null, uniqueSuffix + extname)
  },
})

const upload = multer({ storage: storage })

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Aucun fichier téléchargé.')
  }

  res.send({ filename: req.file.filename })
})

app.use('/img', express.static(path.join(__dirname, 'img')))

app.use('/api/employee', employeeRoutes)
app.use('/api/employeePoints', employeePointsRoutes);


module.exports = app
