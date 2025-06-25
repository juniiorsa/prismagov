import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Módulo de configuração para variáveis de ambiente (.env)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, // Módulo para integração com o banco de dados Prisma
    AuthModule,     // Módulo que lida com autenticação
    DocumentsModule // Módulo que lida com a lógica de documentos
  ],
})
export class AppModule {}
