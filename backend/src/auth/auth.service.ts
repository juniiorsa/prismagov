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
