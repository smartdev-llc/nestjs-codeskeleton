import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { IUser } from '../user/interfaces/user.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUser> {
    const user = await this.userService.findOneByEmail(email);

    if (user) {
      const valid = await this.userService.checkPassword(
        password,
        user.password,
      );
      if (valid) {
        return user;
      }
    }
    return null;
  }

  async login(user: IUser): Promise<any> {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async profile({ email }: IUser): Promise<any> {
    const user: IUser = await this.userService.findOneByEmail(email);
    const { password, ...result } = user.toObject();

    if (user) {
      return result;
    }
    return null;
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    //check unique email
    const { email, password, name } = createUserDto;
    const user: IUser = await this.userService.findOneByEmail(email);

    if (user) {
      return null;
    }
    return this.userService.create({ email, password, name });
  }
}
