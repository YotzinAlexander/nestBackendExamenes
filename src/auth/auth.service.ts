import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { handleDBExceptions } from '../common/functions/handle-error.fucntion';
import { User } from './entities/users.entity';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UpdateUser } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      console.log(user);
      await this.userRepository.save(user);
      delete user.password;
      return { ...user, token: this.getJwtToken({ id: user.id }) };
    } catch (error) {
      handleDBExceptions('AuthService', error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true, fullName: true },
    });
    if (!user) throw new UnauthorizedException('Credentials are not valid');
    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async update(id: string, updateUser: UpdateUser) {
    const userUp = await this.userRepository.preload({
      id: id,
      ...updateUser,
    });
    if (!userUp) throw new NotFoundException(`User With ID: ${id} not found`);

    try {
      await this.userRepository.save(userUp);
      return userUp;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      const users = await this.userRepository.find({
        take: limit,
        skip: offset,
      });

      return users;
    } catch (error) {
      console.log(error);
    }
  }

  async checkAuthStatus(user: User) {
    return { ...user, token: this.getJwtToken({ id: user.id }) };
  }

  private getJwtToken(payload: JwtPayload): string {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(error);

    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
