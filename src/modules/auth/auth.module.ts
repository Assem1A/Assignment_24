import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { createClient } from "redis";
import { userModel } from "../../DB/models/usermodels";
import { Redis } from "../../common/redis/redis.service";
import { defaultLanguage } from "../../common/middleware/language.middleware";

@Module({
    imports:[userModel,ConfigModule],
    exports:[
    AuthService],
    controllers:[AuthController],
    providers:[AuthService,Redis,
        
     {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService:ConfigService) => {
        const client = createClient({
          url:configService.get<string>("REDISLINK"), // or your VPS URL
        });

        client.on('error', (err) => console.error('Redis Client Error', err));

        await client.connect();
        console.log('✅ Redis connected');

        return client;
      },
      inject:[ConfigService]
    },
    ]
})
export class AuthModule{
 configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(defaultLanguage)
      .forRoutes('auth');
  }
}