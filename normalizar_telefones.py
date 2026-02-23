#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para normalizar números de telefone em CSV do Chatwoot.
Padroniza telefones para formato: 55 + DDD (2 dígitos) + Telefone (8 ou 9 dígitos)
"""

import csv
import re
import os
from pathlib import Path


def normalizar_telefone(telefone: str) -> str:
    """
    Normaliza telefone para formato: 55 + DDD (2) + Telefone (8 ou 9)
    
    Args:
        telefone: String com número de telefone em qualquer formato
        
    Returns:
        String normalizada no formato 55DDDTelefone ou 'INVALIDO_' + original se inválido
    """
    # Se vazio, retorna vazio
    if not telefone or not telefone.strip():
        return ''
    
    # Remove todos os caracteres não numéricos
    numeros_apenas = re.sub(r'[^\d]', '', telefone.strip())
    
    # Se não tem dígitos, marca como inválido
    if not numeros_apenas:
        return f'INVALIDO_{telefone}'
    
    # Identifica e corrige DDI ANTES de remover zeros à esquerda
    ddi = '55'
    resto = numeros_apenas
    
    # Remove zeros à esquerda apenas para identificar o padrão
    numeros_sem_zeros = numeros_apenas.lstrip('0')
    
    # Se começa com 55 (após remover zeros), remove DDI
    if numeros_sem_zeros.startswith('55'):
        # Encontra onde começa o 55 no número original (pode ter zeros antes)
        idx_55 = numeros_apenas.find('55')
        if idx_55 >= 0:
            resto = numeros_apenas[idx_55 + 2:]
        else:
            resto = numeros_sem_zeros[2:]
    # Se começa com 055 (após remover zeros), corrige removendo o 0
    elif numeros_sem_zeros.startswith('055') or numeros_apenas.startswith('055'):
        # Encontra onde começa o 055 no número original
        idx_055 = numeros_apenas.find('055')
        if idx_055 >= 0:
            resto = numeros_apenas[idx_055 + 3:]
        else:
            resto = numeros_sem_zeros[3:]
    # Se não tem DDI, remove zeros à esquerda e mantém resto
    else:
        resto = numeros_sem_zeros
    
    # Valida tamanho mínimo (DDD + telefone mínimo = 10 dígitos)
    if len(resto) < 10:
        return f'INVALIDO_{telefone}'
    
    # Extrai DDD (2 primeiros dígitos do resto)
    ddd = resto[:2]
    
    # Valida DDD (deve ser entre 11 e 99)
    if not ddd.isdigit() or int(ddd) < 11 or int(ddd) > 99:
        return f'INVALIDO_{telefone}'
    
    # Extrai número do telefone (resto após DDD)
    numero_telefone = resto[2:]
    
    # Identifica tamanho do telefone
    tamanho_telefone = len(numero_telefone)
    
    # Valida tamanho (deve ser 8 ou 9 dígitos)
    if tamanho_telefone < 8 or tamanho_telefone > 9:
        # Se tiver mais de 9 dígitos, pode ser que tenha zeros extras
        # Tenta remover zeros à esquerda do número
        numero_telefone_limpo = numero_telefone.lstrip('0')
        if len(numero_telefone_limpo) >= 8 and len(numero_telefone_limpo) <= 9:
            numero_telefone = numero_telefone_limpo
            tamanho_telefone = len(numero_telefone)
        else:
            return f'INVALIDO_{telefone}'
    
    # Monta número normalizado: DDI + DDD + Telefone
    telefone_normalizado = ddi + ddd + numero_telefone
    
    return telefone_normalizado


def detectar_encoding(arquivo_path):
    """
    Tenta detectar o encoding do arquivo.
    Tenta primeiro utf-8, depois latin-1, depois cp1252.
    """
    encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
    
    for encoding in encodings:
        try:
            with open(arquivo_path, 'r', encoding=encoding) as f:
                f.read()
            return encoding
        except (UnicodeDecodeError, UnicodeError):
            continue
    
    # Se nenhum funcionar, retorna utf-8 como padrão
    return 'utf-8'


def processar_csv(arquivo_entrada: str, arquivo_saida: str):
    """
    Processa CSV e normaliza coluna Telefone (coluna K, índice 10).
    
    Args:
        arquivo_entrada: Caminho do arquivo CSV de entrada
        arquivo_saida: Caminho do arquivo CSV de saída
    """
    # Detecta encoding
    encoding = detectar_encoding(arquivo_entrada)
    print(f'Encoding detectado: {encoding}')
    
    linhas_processadas = 0
    telefones_normalizados = 0
    telefones_invalidos = 0
    
    # Lê arquivo de entrada e escreve arquivo de saída
    with open(arquivo_entrada, 'r', encoding=encoding, newline='') as entrada, \
         open(arquivo_saida, 'w', encoding=encoding, newline='') as saida:
        
        # Lê CSV com delimitador ponto e vírgula
        reader = csv.reader(entrada, delimiter=';')
        writer = csv.writer(saida, delimiter=';')
        
        # Processa cada linha
        for linha in reader:
            if len(linha) > 10:  # Verifica se tem pelo menos a coluna Telefone
                telefone_original = linha[10] if len(linha) > 10 else ''
                telefone_normalizado = normalizar_telefone(telefone_original)
                
                # Atualiza coluna Telefone
                linha[10] = telefone_normalizado
                
                # Estatísticas
                if telefone_normalizado.startswith('INVALIDO_'):
                    telefones_invalidos += 1
                elif telefone_normalizado:
                    telefones_normalizados += 1
            
            # Escreve linha processada
            writer.writerow(linha)
            linhas_processadas += 1
    
    print(f'\nProcessamento concluído!')
    print(f'Linhas processadas: {linhas_processadas}')
    print(f'Telefones normalizados: {telefones_normalizados}')
    print(f'Telefones inválidos: {telefones_invalidos}')
    print(f'Arquivo salvo em: {arquivo_saida}')


def main():
    """Função principal"""
    # Caminhos dos arquivos
    pasta_base = r'G:\Drives compartilhados\AERION\02 - Comercial\Leads\Chatwoot'
    arquivo_entrada = os.path.join(pasta_base, 'exportar_chatwoot.csv')
    arquivo_saida = os.path.join(pasta_base, 'exportar_chatwoot_padronizado.csv')
    
    # Verifica se arquivo de entrada existe
    if not os.path.exists(arquivo_entrada):
        print(f'Erro: Arquivo não encontrado: {arquivo_entrada}')
        return
    
    print(f'Processando arquivo: {arquivo_entrada}')
    print(f'Arquivo de saída: {arquivo_saida}')
    
    # Processa CSV
    processar_csv(arquivo_entrada, arquivo_saida)


if __name__ == '__main__':
    main()





