const express = require('express')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/videos', express.static(path.join(__dirname, 'uploads')))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage })

app.post('/upload', upload.single('video'), (req, res) => {
    res.json({
        message: 'Video uploaded',
        filename: req.file.filename
    })
})

app.get('/api/videos', (req, res) => {
    const files = fs.readdirSync('./uploads')

    const videos = files.map(file => ({
        name: file,
        url: `http://localhost:5000/videos/${file}`
    }))

    res.json(videos)
})

app.get('/api/comments', (req, res) => {
    const comments = JSON.parse(
        fs.readFileSync('./comments.json')
    )

    res.json(comments)
})

app.post('/api/comments', (req, res) => {
    const comments = JSON.parse(
        fs.readFileSync('./comments.json')
    )

    comments.push(req.body)

    fs.writeFileSync(
        './comments.json',
        JSON.stringify(comments, null, 2)
    )

    res.json({ message: 'Comment added' })
})

app.listen(5000, () => {
    console.log('Server running on port 5000')
})