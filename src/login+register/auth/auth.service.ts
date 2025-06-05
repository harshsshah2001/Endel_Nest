import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/team B/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly itemRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.itemRepository.findOne({ where: { userName } });
    
    // Check if user exists and is active
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }
    
    // Validate password
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const { password: hashedPassword, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { username: user.userName, sub: user.id };

    const fullUser = await this.itemRepository.findOne({
      where: { id: user.id },
      relations: ['userRole', 'userRole.permissions', 'userRole.permissions.permission'],
    });

    if (!fullUser) {
      throw new UnauthorizedException('User not found or role missing');
    }

    // Double-check isActive status to ensure consistency
    if (!fullUser.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    return {
      token: this.jwtService.sign(payload),
      user: {
        id: fullUser.id,
        userName: fullUser.userName,
        role: fullUser.userRole?.userRoleName,
        permissions: fullUser.userRole?.permissions?.map(p => ({
          name: p.permission.permissionName,
          canRead: p.isRead,
          canCreate: p.isCreate,
          canUpdate: p.isUpdate,
          canDelete: p.isDelete,
        })) || [],
      },
    };
  }
}