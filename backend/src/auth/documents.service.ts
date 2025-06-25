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
    // Pega a URL do N8N do arquivo .env
    this.N8N_ROUTER_URL = this.configService.get<string>('N8N_WEBHOOK_URL');
  }

  // Função genérica para chamar qualquer webhook no N8N
  async callN8NWebhook(path: string, payload: any): Promise<any> {
    const url = `${this.N8N_ROUTER_URL}/${path}`;
    console.log(`Enviando para o N8N: POST ${url}`, payload);
    try {
      const response = await firstValueFrom(this.httpService.post(url, payload));
      return response.data;
    } catch (error) {
      console.error('Erro ao comunicar com o N8N:', error.response?.data || error.message);
      throw new InternalServerErrorException('Falha na comunicação com o serviço de automação.');
    }
  }

  // Exemplo de como uma função para listar documentos seria
  async listDocuments(userId: string) {
    // Esta função poderia chamar um webhook GET no N8N que, por sua vez, consulta o banco
    // ou poderia consultar o banco diretamente com o PrismaService.
    console.log(`Listando documentos para o usuário: ${userId}`);
    // return this.prisma.documentos_tr.findMany({ where: { usuario_id: userId } });
    return [{id: 'exemplo-1', titulo: 'TR de Exemplo', status: 'finalizado'}];
  }
}