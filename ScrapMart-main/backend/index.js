import { config } from 'dotenv'
config()

import express from 'express'
import http from 'http'
import cors from 'cors'
import { Server } from 'socket.io'

import { ConnectDB } from './config/mongoDB.js'
import { ConnectCloudinary } from './config/cloudinary.js'
import { userRouter } from './routes/Authentication.js'
import scrapRouter from './routes/scrapRoute.js'
import { ioInstance } from './controller/scrapController.js'

const app = express()
const server = http.createServer(app)

// Socket setup
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",   // frontend
            "http://localhost:5173",   // Vite (if used)
            "https://scrapmart-backend.onrender.com"
        ],
        methods: ["GET", "POST"],
        credentials: true
    }
})

ioInstance(io)

// DB + Cloudinary
ConnectDB()
ConnectCloudinary()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

// Routes
app.use('/user', userRouter)
app.use('/scrap', scrapRouter)

app.get('/', (req, res) => {
    res.json('landing page is here')
})

// PORT
const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})