import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/cofig.env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT,()=>{
    console.log(`server is running ${PORT}😂😂`
    );
    
  });
}
bootstrap();
