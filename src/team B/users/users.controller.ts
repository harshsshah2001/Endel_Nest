import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Query,
  Param,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log('Creating new user');
    const user = await this.usersService.create(createUserDto);
    return {
      message: 'User created successfully',
      user: { id: user.id, userName: user.userName },
    };
  }

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
  ) {
    this.logger.log(`Fetching users: page=${page}, limit=${limit}, search=${search}`);
    return this.usersService.findAll(parseInt(page), parseInt(limit), search);
  }

  @Get('all')
  async findAllWithoutPagination() {
    this.logger.log('Fetching all users without pagination');
    const users = await this.usersService.findAllWithoutPagination();
    return { message: 'All users fetched successfully', users };
  }

  @Get('search')
  async searchByFirstName(@Query('query') query: string) {
    this.logger.log(`Searching users with firstName query: ${query}`);
    const users = await this.usersService.searchByFullName(query);
    return { message: 'Users fetched successfully', users };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetching user with id=${id}`);
    const user = await this.usersService.findOne(parseInt(id));
    return { message: 'User fetched successfully', ...user };
  }

  @Patch(':id/toggle')
  @UsePipes(new ValidationPipe({ transform: true }))
  async toggleStatus(
    @Param('id') id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ) {
    this.logger.log(`Toggling status for user id=${id}`);
    const user = await this.usersService.toggleStatus(
      parseInt(id),
      updateUserStatusDto,
    );
    return { message: 'User status updated', user };
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    this.logger.log(`Updating user id=${id}`);
    const user = await this.usersService.update(parseInt(id), updateUserDto);
    return {
      message: 'User updated successfully',
      user: { id: user.id, userName: user.userName },
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    this.logger.log(`Deleting user id=${id}`);
    await this.usersService.delete(parseInt(id));
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginUserDto) {
    this.logger.log(`Login attempt for username=${loginDto.userName}`);
    const user = await this.usersService.validateUser(
      loginDto.userName,
      loginDto.password,
    );
    const payload = { sub: user.id, username: user.userName };
    const token = this.jwtService.sign(payload);
    return {
      message: 'Login successful',
      user: { id: user.id, userName: user.userName },
      token,
    };
  }
}