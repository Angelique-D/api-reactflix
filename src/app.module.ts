import { Module } from '@nestjs/common';
import { CaslModule } from './permissions/casl/casl.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CaslModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [AuthService],
})
export class AppModule {}
