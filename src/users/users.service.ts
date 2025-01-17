import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs'; // Importamos bcrypt para encriptar contraseñas

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: Partial<User>): Promise<User> {
    // Encriptar la contraseña antes de guardar
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10); // Salt rounds = 10
    }

    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async updateUser(email: string, userData: Partial<User>): Promise<User | null> {
    if (userData.password) {
      // Encriptar la nueva contraseña si se actualiza
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return this.userModel
      .findOneAndUpdate(
        { email }, // Usamos el email para identificar al usuario
        { $set: userData }, // Establecemos los nuevos datos
        { new: true } // Devuelve el documento actualizado
      )
      .exec();
  }

  async deleteUser(email: string): Promise<User | null> {
    return this.userModel.findOneAndDelete({ email }).exec();
  }
}
