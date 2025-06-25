import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule], // Módulo para fazer requisições HTTP para o N8N
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}