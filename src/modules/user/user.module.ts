import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { authMiddleware } from '../../common/middleware/authintication.middleware';
import { userModel } from '../../DB/models/usermodels';

@Module({
  imports: [userModel],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authMiddleware)
      .forRoutes('user');
  }
}
