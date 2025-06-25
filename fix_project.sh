#!/bin/bash
# ==============================================================================
# SCRIPT DE CORREÇÃO E INSTALAÇÃO - PRISMAGOV (v1.1 - Corrigido)
# ==============================================================================
#
#   Este script irá:
#   1. Instalar todas as dependências do backend e frontend.
#   2. Corrigir a estrutura de arquivos e nomes no projeto backend.
#   3. Configurar o PostCSS para o Tailwind no projeto frontend.
#   4. Corrigir a sintaxe de importação de tipos no frontend.
#
#   Execute este script a partir da pasta raiz do seu workspace
#   (a pasta que contém as pastas 'backend' e 'frontend').
#
# ==============================================================================

echo "🚀 Iniciando a correção completa do workspace PrismaGov..."

# --- 1. Correção do Backend ---
echo ""
echo "--- [1/2] Corrigindo o Backend (backend/) ---"

if [ -d "backend" ]; then
    cd backend

    echo "   - Corrigindo estrutura de arquivos..."
    mkdir -p "src/documents/dto"

    # Move os arquivos de 'documents' para a pasta correta, se existirem em 'auth'
    if [ -f "src/auth/documents.controller.ts" ]; then mv "src/auth/documents.controller.ts" "src/documents/"; echo "     - Moveu documents.controller.ts"; fi
    if [ -f "src/auth/documents.module.ts" ]; then mv "src/auth/documents.module.ts" "src/documents/"; echo "     - Moveu documents.module.ts"; fi
    if [ -f "src/auth/documents.service.ts" ]; then mv "src/auth/documents.service.ts" "src/documents/"; echo "     - Moveu documents.service.ts"; fi
    if [ -f "src/auth/dto/documents.dto.ts" ]; then mv "src/auth/dto/documents.dto.ts" "src/documents/dto/"; echo "     - Moveu documents.dto.ts"; fi

    # Corrige o nome do arquivo da estratégia JWT
    if [ -f "src/auth/jtw.strategy.ts" ]; then mv "src/auth/jtw.strategy.ts" "src/auth/jwt.strategy.ts"; echo "     - Renomeou jtw.strategy.ts para jwt.strategy.ts"; fi

    echo "   - Instalando dependências do backend (npm install)..."
    if npm install; then
        echo "   - Dependências do backend instaladas com sucesso."
    else
        echo "   - ERRO: Falha ao instalar as dependências do backend."
        cd ..
        exit 1
    fi
    
    echo "✅ Backend corrigido."
    cd ..
else
    echo "⚠️  Aviso: Diretório 'backend' não encontrado. Pulando etapa."
fi


# --- 2. Correção do Frontend ---
echo ""
echo "--- [2/2] Corrigindo o Frontend (frontend/app-web/) ---"

if [ -d "frontend/app-web" ]; then
    cd frontend/app-web

    echo "   - Criando postcss.config.js para o Tailwind CSS..."
    cat <<'EOF' > "postcss.config.js"
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

    echo "   - Corrigindo a sintaxe de importação em src/App.tsx..."
    if [ -f "src/App.tsx" ]; then
        sed -i "s/import { FC } from 'react'/import type { FC } from 'react'/" "src/App.tsx"
    else
        echo "⚠️  Aviso: src/App.tsx não encontrado. Pulando correção de importação."
    fi
    
    echo "   - Instalando dependências do frontend (npm install)..."
    if npm install; then
        echo "   - Dependências do frontend instaladas com sucesso."
    else
        echo "   - ERRO: Falha ao instalar as dependências do frontend."
        cd ../..
        exit 1
    fi

    echo "✅ Frontend corrigido."
    cd ../..
else
    echo "⚠️  Aviso: Diretório 'frontend/app-web' não encontrado. Pulando etapa."
fi

echo ""
echo "🎉 Processo de correção concluído! Agora você pode tentar iniciar os servidores."
