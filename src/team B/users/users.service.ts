import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with username=${createUserDto.userName}`);
    this.logger.log('createUserDto:', createUserDto);
    const { password, userName } = createUserDto;
    const existingUser = await this.usersRepository.findOne({
      where: { userName },
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password!, 10);
    const user = new User();
    Object.assign(user, {
      ...createUserDto,
      password: hashedPassword,
    });
    this.logger.log('User entity before saving:', user);

    return this.usersRepository.save(user);
  }

  async findAll(page: number, limit: number, search: string): Promise<any> {
    this.logger.log(`Fetching users: page=${page}, limit=${limit}, search=${search}`);
    const skip = (page - 1) * limit;
    const where = search
      ? [
          { firstName: ILike(`%${search}%`) },
          { lastName: ILike(`%${search}%`) },
          { userName: ILike(`%${search}%`) },
        ]
      : {};

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      skip,
      take: limit,
    });

    return {
      users,
      total,
      start: skip + 1,
      end: Math.min(skip + limit, total),
    };
  }

  async findAllWithoutPagination(): Promise<User[]> {
    this.logger.log('Fetching all users without pagination');
    return this.usersRepository.find();
  }

  async searchByFullName(query: string): Promise<User[]> {
    this.logger.log(`Searching users with full name query: ${query}`);
    return this.usersRepository
      .createQueryBuilder('user')
      .where("CONCAT(user.firstName, ' ', user.lastName) ILIKE :query", { query: `%${query}%` })
      .select(['user.id', 'user.firstName', 'user.lastName', 'user.designation', 'user.department']) // Add designation and department
      .take(10)
      .getMany();
  }

  async findOne(id: number): Promise<User> {
    this.logger.log(`Fetching user with id=${id}`);
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async toggleStatus(
    id: number,
    updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<User> {
    this.logger.log(
      `Toggling status for user id=${id}, isActive=${updateUserStatusDto.isActive}`,
    );
    const user = await this.findOne(id);
    user.isActive = updateUserStatusDto.isActive;
    return this.usersRepository.save(user);
  }

async update(id: number, updateUserDto: CreateUserDto): Promise<User> {
  this.logger.log(`Updating user id=${id}`);
  this.logger.log('updateUserDto:', updateUserDto);
  const user = await this.findOne(id);

  if (updateUserDto.userName && updateUserDto.userName !== user.userName) {
    const existingUser = await this.usersRepository.findOne({
      where: { userName: updateUserDto.userName },
    });
    if (existingUser && existingUser.id !== id) {
      throw new ConflictException('Username already exists');
    }
  }

  if (updateUserDto.password) {
    user.password = await bcrypt.hash(updateUserDto.password, 10);
  }

  // Explicitly assign fields to avoid overwriting password with null/undefined
  user.firstName = updateUserDto.firstName;
  user.lastName = updateUserDto.lastName;
  user.userName = updateUserDto.userName;
  user.contactNo = updateUserDto.contactNo ?? '';
  user.emailId = updateUserDto.emailId ?? '';
  user.address = updateUserDto.address ?? '';
  user.userRoleId = updateUserDto.userRoleId ?? '';
  user.employeeNo = updateUserDto.employeeNo ?? '';
  user.department = updateUserDto.department ?? '';
  user.designation = updateUserDto.designation ?? '';
  user.notes = updateUserDto.notes ?? '';

  this.logger.log('User entity before saving:', user);

  return this.usersRepository.save(user);
}


  async delete(id: number): Promise<void> {
    this.logger.log(`Deleting user id=${id}`);
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async validateUser(userName: string, password: string): Promise<User> {
    this.logger.log(`Validating user with username=${userName}`);
    const user = await this.usersRepository.findOne({
      where: { userName },
      select: ['id', 'userName', 'password', 'isActive'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.isActive) {
      throw new ConflictException('User account is not active');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ConflictException('Invalid password');
    }

    return user;
  }
}