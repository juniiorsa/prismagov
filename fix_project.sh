#!/bin/bash
# ==============================================================================
# SCRIPT DE SETUP COMPLETO DO BACKEND - PRISMAGOV
# ==============================================================================
#
#   Este script irá construir toda a estrutura do projeto NestJS do zero.
#   Ele irá:
#   1. Criar toda a estrutura de diretórios (src, auth, documents, etc.).
#   2. Criar cada arquivo .ts com seu respectivo conteúdo.
#   3. Criar os arquivos de configuração (package.json, tsconfig.json).
#
#   Execute este script a partir da pasta raiz do seu workspace.
#   Ele irá apagar e recriar a pasta 'backend' para garantir uma instalação limpa.
#
# ==============================================================================

echo "🚀 Iniciando a construção completa do workspace do Backend..."

# Garante uma instalação limpa apagando a pasta antiga, se existir
if [ -d "backend" ]; then
    echo "   - Removendo a pasta 'backend' antiga para uma instalação limpa..."
    rm -rf "backend"
fi

# --- 1. Criar Estrutura de Diretórios ---
echo "   - Criando estrutura de diretórios..."
mkdir -p "backend/src/auth/dto"
mkdir -p "backend/src/documents/dto"
mkdir -p "backend/src/prisma"

# --- 2. Criar os arquivos de configuração na raiz do backend ---

echo "   - Criando backend/package.json..."
cat <<'EOF' > "backend/package.json"
{
  "name": "prismagov-backend",
  "version": "0.0.1",
  "description": "Backend API for PrismaGov",
  "author": "",
  "private": true,
  "license": "UNLICENSED",
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
  },
  "dependencies": {
    "@nestjs/axios": "^3.0.2",
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.2.2",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/platform-express": "^10.0.0",
    "@prisma/client": "^5.15.0",
    "axios": "^1.7.2",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/schematics": "^10.0.0",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.17",
    "@types/node": "^20.3.1",
    "@types/passport-jwt": "^4.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.42.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-prettier": "^5.0.0",
    "prettier": "^3.0.0",
    "prisma": "^5.15.0",
    "source-map-support": "^0.5.21",
    "ts-loader": "^9.4.3",
    "ts-node": "^10.9.1",
    "tsconfig-paths": "^4.2.0",
    "typescript": "^5.1.3"
  }
}
EOF

echo "   - Criando backend/tsconfig.json..."
cat <<'EOF' > "backend/tsconfig.json"
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "ES2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./",
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false
  }
}
EOF

echo "   - Criando backend/tsconfig.build.json..."
cat <<'EOF' > "backend/tsconfig.build.json"
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "test", "dist", "**/*spec.ts"]
}
EOF

# --- 3. Criar os arquivos de código fonte em src/ ---

echo "   - Criando src/main.ts..."
cat <<'EOF' > "backend/src/main.ts"
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.enableCors();
  await app.listen(3001);
  console.log(`Aplicação backend rodando em: ${await app.getUrl()}`);
}
bootstrap();
EOF

echo "   - Criando src/app.module.ts..."
cat <<'EOF' > "backend/src/app.module.ts"
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    DocumentsModule,
  ],
})
export class AppModule {}
EOF

# Módulo Prisma
echo "   - Criando src/prisma/prisma.module.ts..."
cat <<'EOF' > "backend/src/prisma/prisma.module.ts"
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
EOF

echo "   - Criando src/prisma/prisma.service.ts..."
cat <<'EOF' > "backend/src/prisma/prisma.service.ts"
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
EOF

# Módulo Auth
echo "   - Criando src/auth/auth.module.ts..."
cat <<'EOF' > "backend/src/auth/auth.module.ts"
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
EOF

echo "   - Criando src/auth/auth.controller.ts..."
cat <<'EOF' > "backend/src/auth/auth.controller.ts"
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
  
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
      return this.authService.register(registerDto);
  }
}
EOF

echo "   - Criando src/auth/auth.service.ts..."
cat <<'EOF' > "backend/src/auth/auth.service.ts"
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.senha_hash))) {
      const { senha_hash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, pass: string) {
    const user = await this.validateUser(email, pass);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }
    const payload = { email: user.email, sub: user.id, name: user.nome };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  
  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email },
    });

    if (existingUser) {
        throw new ConflictException('O e-mail fornecido já está em uso.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.prisma.user.create({
        data: {
            nome: registerDto.nome,
            email: registerDto.email,
            senha_hash: hashedPassword,
        },
    });

    const { senha_hash, ...result } = user;
    return result;
  }
}
EOF

echo "   - Criando src/auth/jwt.strategy.ts..."
cat <<'EOF' > "backend/src/auth/jwt.strategy.ts"
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }
  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, name: payload.name };
  }
}
EOF

echo "   - Criando src/auth/dto/auth.dto.ts..."
cat <<'EOF' > "backend/src/auth/dto/auth.dto.ts"
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
EOF

# Módulo Documents
echo "   - Criando src/documents/documents.module.ts..."
cat <<'EOF' > "backend/src/documents/documents.module.ts"
import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
EOF

echo "   - Criando src/documents/documents.controller.ts..."
cat <<'EOF' > "backend/src/documents/documents.controller.ts"
import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/jwt.guard'; // Supondo que você crie este arquivo

@Controller('documentos')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async listDocuments(@Request() req) {
    const userId = req.user.userId;
    return this.documentsService.listDocuments(userId);
  }
  
  // Adicione outras rotas aqui conforme necessário
}
EOF

echo "   - Criando src/documents/documents.service.ts..."
cat <<'EOF' > "backend/src/documents/documents.service.ts"
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DocumentsService {
  private readonly N8N_ROUTER_URL: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.N8N_ROUTER_URL = this.configService.get<string>('N8N_WEBHOOK_URL');
  }

  async listDocuments(userId: string) {
    const url = `${this.N8N_ROUTER_URL}/api/documentos?usuario_id=${userId}`;
    try {
      const response = await firstValueFrom(this.httpService.get(url));
      return response.data;
    } catch (error) {
      console.error('Erro ao listar documentos via N8N:', error.response?.data || error.message);
      throw new InternalServerErrorException('Falha ao buscar os documentos.');
    }
  }
  
  // Adicione outros métodos de serviço aqui
}
EOF

echo "   - Criando src/auth/jwt.guard.ts (arquivo de guarda)..."
cat <<'EOF' > "backend/src/auth/jwt.guard.ts"
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
EOF

echo ""
echo "✅ Estrutura completa do backend criada com sucesso!"
echo "➡️  Próximo passo: siga o guia para instalar as dependências e iniciar o servidor."

