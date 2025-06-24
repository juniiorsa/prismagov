/*
 * =================================================================
 * ARQUIVO: main.ts - Ponto de Entrada da Aplicação
 * =================================================================
 * Este é o arquivo principal que inicia a sua aplicação NestJS.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.enableCors();
  
  await app.listen(3001);
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}
bootstrap();


/*
 * =================================================================
 * ARQUIVO: app.module.ts - Módulo Principal da Aplicação
 * =================================================================
 * Este módulo importa todos os outros módulos funcionais da aplicação.
 */
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DocumentsModule } from './documents/documents.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule, // Módulo do Prisma para acesso ao banco de dados
    AuthModule,
    DocumentsModule,
  ],
})
export class AppModule {}


/*
 * =================================================================
 * ARQUIVO: prisma/prisma.module.ts - Módulo do Prisma
 * =================================================================
 */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';


@Global() // Torna o PrismaService disponível globalmente
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}


/*
 * =================================================================
 * ARQUIVO: prisma/prisma.service.ts - Serviço do Prisma
 * =================================================================
 * Gerencia a conexão com o banco de dados.
 */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}


/*
 * =================================================================
 * ARQUIVO: auth/auth.module.ts - Módulo de Autenticação
 * =================================================================
 */
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


/*
 * =================================================================
 * ARQUIVO: auth/auth.controller.ts - Controlador de Autenticação
 * =================================================================
 */
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


/*
 * =================================================================
 * ARQUIVO: auth/auth.service.ts - Serviço de Autenticação (Real)
 * =================================================================
 */
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
    if (user && await bcrypt.compare(pass, user.senha_hash)) {
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


/*
 * =================================================================
 * ARQUIVO: auth/jwt.strategy.ts e auth/jwt-auth.guard.ts
 * =================================================================
 * (Estes arquivos permanecem os mesmos da versão anterior, pois sua
 * função de validar o token e proteger rotas já está correta.)
 */
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


import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}




/*
 * =================================================================
 * ARQUIVO: documents/documents.module.ts
 * =================================================================
 */
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


/*
 * =================================================================
 * ARQUIVO: documents/documents.controller.ts - Controlador Completo
 * =================================================================
 */
import { Controller, Post, Get, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto, PriceStepDto, JustificativaStepDto, FiscalizacaoStepDto, FinalizeTrDto, ExportDto } from './dto/documents.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('documentos')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}


  @Get()
  async listDocuments(@Request() req) {
    const userId = req.user.userId;
    return this.documentsService.listDocuments(userId);
  }


  @Get('status/:tr_id')
  async getDocumentStatus(@Param('tr_id') tr_id: string, @Request() req) {
    return this.documentsService.getDocumentStatus(tr_id, req.user.userId);
  }


  @Post('novo')
  async createNewDocument(@Body() createDto: CreateDocumentDto, @Request() req) {
    return this.documentsService.callN8NWebhook('webhook-formulario-novo-tr', { ...createDto, usuario_id: req.user.userId });
  }


  @Post('etapa/precos')
  async processPricesStep(@Body() priceDto: PriceStepDto, @Request() req) {
    return this.documentsService.callN8NWebhook('webhook-precos', { ...priceDto, usuario_id: req.user.userId });
  }


  @Post('etapa/justificativa')
  async processJustificativaStep(@Body() justDto: JustificativaStepDto, @Request() req) {
    return this.documentsService.callN8NWebhook('webhook-justificativa', { ...justDto, usuario_id: req.user.userId });
  }


  @Post('etapa/fiscalizacao')
  async processFiscalizacaoStep(@Body() fiscDto: FiscalizacaoStepDto, @Request() req) {
    return this.documentsService.callN8NWebhook('webhook-fiscalizacao', { ...fiscDto, usuario_id: req.user.userId });
  }
  
  @Post('finalizar-tr')
  async finalizeTR(@Body() finalizeDto: FinalizeTrDto, @Request() req) {
    return this.documentsService.callN8NWebhook('webhook-finalizar-tr', { ...finalizeDto, usuario_id: req.user.userId });
  }


  @Post('gerar-documentos')
  async generateDocuments(@Body() exportDto: ExportDto, @Request() req) {
    // Retorna o binário do PDF/DOCX
    return this.documentsService.callN8NWebhookAndGetFile('webhook-gerar-documentos', { ...exportDto, usuario_id: req.user.userId });
  }
}


/*
 * =================================================================
 * ARQUIVO: documents/documents.service.ts - Serviço de Documentos
 * =================================================================
 */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';


@Injectable()
export class DocumentsService {
  private readonly N8N_ROUTER_URL: string;


  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.N8N_ROUTER_URL = this.configService.get<string>('N8N_WEBHOOK_URL');
  }


  private async callN8N(method: 'get' | 'post', path: string, options: AxiosRequestConfig = {}): Promise<any> {
    const url = `${this.N8N_ROUTER_URL}/${path}`;
    console.log(`Enviando para o N8N: ${method.toUpperCase()} ${url}`, options.data || options.params || '');
    try {
      const response = await firstValueFrom(this.httpService[method](url, options.data, options));
      return response.data;
    } catch (error) {
      console.error('Erro ao comunicar com o N8N:', error.response?.data || error.message);
      throw new InternalServerErrorException('Falha na comunicação com o serviço de automação.');
    }
  }


  async callN8NWebhook(path: string, payload: any): Promise<any> {
    return this.callN8N('post', path, { data: payload });
  }


  async callN8NWebhookAndGetFile(path: string, payload: any): Promise<any> {
     const url = `${this.N8N_ROUTER_URL}/${path}`;
     try {
         const response = await firstValueFrom(this.httpService.post(url, payload, { responseType: 'arraybuffer' }));
         return response.data;
     } catch (error) {
        console.error('Erro ao buscar arquivo do N8N:', error.response?.data || error.message);
        throw new InternalServerErrorException('Falha ao gerar o documento.');
     }
  }


  async listDocuments(userId: string) {
    return this.callN8N('get', 'api/documentos', { params: { usuario_id: userId } });
  }


  async getDocumentStatus(tr_id: string, userId: string) {
    return this.callN8N('get', `api/status/${tr_id}`, { params: { userId } });
  }
}


/*
 * =================================================================
 * ARQUIVO: documents/dto/documents.dto.ts - DTOs de Documentos
 * =================================================================
 */
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';


export class CreateDocumentDto {
  @IsString() @IsNotEmpty()
  formulario_id: string; // Será o futuro tr_id


  @IsString() @IsNotEmpty()
  natureza: string;


  @IsString() @IsNotEmpty()
  problema: string;


  @IsString() @IsNotEmpty()
  resultados: string;


  @IsString() @IsOptional()
  etp_referencia?: string;
}


class CotaDto {
    @IsString() @IsNotEmpty()
    fonte: string;


    @IsNumber()
    valor: number;
}
export class PriceStepDto {
    @IsString() @IsNotEmpty()
    tr_id: string;


    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CotaDto)
    cotas: CotaDto[];
}


export class JustificativaStepDto {
    @IsString() @IsNotEmpty()
    tr_id: string;
    
    @IsString() @IsNotEmpty()
    solucao_proposta: string;


    @IsArray() @IsString({ each: true })
    solucoes_alternativas: string[];
}


export class FiscalizacaoStepDto {
    @IsString() @IsNotEmpty()
    tr_id: string;


    @IsArray() @IsString({ each: true })
    fiscais: string[];


    @IsString() @IsNotEmpty()
    periodicidade: string;
    
    @IsString() @IsNotEmpty()
    ferramentas: string;
    
    @IsString() @IsNotEmpty()
    criterios: string;
}


export class FinalizeTrDto {
    @IsString() @IsNotEmpty()
    tr_id: string;
}


export class ExportDto {
    @IsString() @IsNotEmpty()
    tr_id: string;
}
