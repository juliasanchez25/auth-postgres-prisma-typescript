import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { userModel } from '../Models/UserModel';

export const userController = {
  async register(req: Request, res: Response) {
    const { name, email, password } = req.body;

    try {
      const user = await userModel.createUser(name, email, password);
      Reflect.deleteProperty(user, 'password');
      res.status(201).send(user);
    } catch (err) {
      res.status(500).send({ message: 'Can not create user'})
    }
  },

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmailAndPassword(email, password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid login' });
    }

    const token = jsonwebtoken.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    return res.status(200).json({ user, token });
  },

  async getUsers(req: Request, res: Response) {
    try {
      const users = await userModel.findUsers();
      const usersWithoutPassword = users.map((user) => {
        Reflect.deleteProperty(user, 'password')
        return user
      })
      res.status(200).send(usersWithoutPassword);
    } catch (err) {
      res.status(500).send({ message: 'Can not find users' })
    }
  }
};
