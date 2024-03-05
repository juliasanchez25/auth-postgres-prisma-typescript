import express from 'express'
import dotenv from 'dotenv'
import { prisma } from '../prisma'

dotenv.config()

const app = express()
const port = 3000

app.use(express.json());

app.get('/', async (req, res) => {
  res.send(await prisma.user.findMany())
})

app.post('/register', async (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const password = req.body.password

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    })

    Reflect.deleteProperty(user, 'password')

    res.send(user)
  } catch (error) {
    console.log('Can not create user')
  }
})

app.get('/books', (req, res) => {
  try {
    const books = [
      {
        title: "Percy Jackson",
        author: "Rick Riordan"
      },
      {
        title: "Scott Pilgrim",
        author: "Bryan Lee O'Malley"
      }
    ]

    res.send(books)
  } catch (err) {
    console.log('Can not find books')
  }
})

app.listen(port, () => console.log(`App is running on port ${port}`))
