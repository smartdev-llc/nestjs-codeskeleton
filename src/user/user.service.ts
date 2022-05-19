import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<IUser>) {}

  async hashPassword(password: string): Promise<string> {
    // return bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS, 10));
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS, 10));
    return bcrypt.hash(password, salt);
  }

  async checkPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    const { email, password, name } = createUserDto;
    const hasedPassword = await this.hashPassword(password);
    const newUser = new this.userModel({
      name,
      email,
      password: hasedPassword,
    });
    await newUser.save();
    return newUser;
  }

  findAll() {
    return this.userModel.find();
  }

  findOne(_id: string) {
    return this.userModel.findOne({ _id });
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
