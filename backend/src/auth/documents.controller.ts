import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/documents.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('documentos')
@UseGuards(JwtAuthGuard) // Protege todas as rotas deste controlador
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async listDocuments(@Request() req) {
    const userId = req.user.userId;
    return this.documentsService.listDocuments(userId);
  }

  @Post('novo')
  async createNewDocument(@Body() createDto: CreateDocumentDto, @Request() req) {
    // Adiciona o ID do usuário logado ao payload antes de enviar para o N8N
    const payload = { ...createDto, usuario_id: req.user.userId };
    return this.documentsService.callN8NWebhook('webhook-formulario-novo-tr', payload);
  }

  // ... outras rotas de etapas aqui ...
}
