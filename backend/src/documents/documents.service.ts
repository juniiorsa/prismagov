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
