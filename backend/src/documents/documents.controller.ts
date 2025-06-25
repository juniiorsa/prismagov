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
