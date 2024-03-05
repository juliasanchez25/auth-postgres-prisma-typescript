import express, { Request, Response, NextFunction} from 'express';
import dotenv from 'dotenv'
import jsonwebtoken from 'jsonwebtoken'
import { prisma } from '../prisma'

dotenv.config()

const app = express()
const port = 3000

app.use(express.json());

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid authorization header" });
  }

  const token = authHeader.replace("Bearer ", "")

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Authorization token not found" });
  }

  try {
    const decoded = jsonwebtoken.verify(token, (process.env as any).JWT_SECRET_KEY);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

app.get('/', async (req, res) => {
  res.send(await prisma.user.findMany())
})

app.get('/books', authMiddleware, (req, res) => {
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

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await prisma.user.findFirst({
    where: {
      email,
      password
    },
  });

  if (!user) {
    return res
      .status(401)
      .json({ message: 'Invalid login' })
  }

  const token = jsonwebtoken.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });

  return res.json({ user, token })
})

app.listen(port, () => console.log(`App is running on port ${port}`))
