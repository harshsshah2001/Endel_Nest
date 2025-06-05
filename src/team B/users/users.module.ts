import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { UsersService } from './users.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // For User entity
    JwtModule.register({
      secret: 'your-secret-key', // Replace with a secure key (e.g., from environment variables)
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }), // Register JwtModule
  ],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}