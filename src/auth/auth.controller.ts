import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  SetMetadata,
  Patch,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { idText } from 'typescript';
import { AuthService } from './auth.service';
import { RoleProtected, Auth, RawHeaders, GetUser } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/users.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces/valid-roles';
import { UpdateUser } from './dto/update-user.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  // UPDATE ROOL
  @Patch(':id')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userUpdate: UpdateUser,
  ) {
    return this.authService.update(id, userUpdate);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() userUpdate: UpdateUser,
  //   @GetUser() user: User,
  // ) {
  //   return this.authService.update(id, userUpdate);
  // }

  @Get('users')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }

  @Get('private')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') email: string,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      msg: 'Hola Mundo Private',
      user,
      email,
      rawHeaders,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return { ok: true, user };
  }

  @Get('private3')
  @Auth()
  privateRoute3(@GetUser() user: User) {
    return { ok: true, user };
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
