import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Define um prefixo global para todas as rotas (ex: /api/v1/auth/login)
  app.setGlobalPrefix('api/v1');

  // Habilita a validação automática de dados de entrada (DTOs)
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  
  // Habilita o CORS para permitir que o frontend acesse a API
  app.enableCors();
  
  // Inicia o servidor na porta 3001
  await app.listen(3001);
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}
bootstrap();