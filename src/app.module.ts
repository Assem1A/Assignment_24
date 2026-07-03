import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './modules/auth/auth.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { DBLINK } from './config/cofig.env';

@Module({
  imports: [AuthModule, UserModule, ProductModule

    , MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: DBLINK,
        onConnectionCreate: (connection: Connection) => {
          connection.on('connected', () => console.log('el asool mtz3lsh'));
          connection.on('open', () => console.log('open'));
          connection.on('disconnected', () => console.log('disconnected'));
          connection.on('reconnected', () => console.log('reconnected'));
          connection.on('disconnecting', () => console.log('disconnecting'));
          return connection;
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
