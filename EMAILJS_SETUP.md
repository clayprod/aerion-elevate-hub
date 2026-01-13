# Configuração do EmailJS

Este documento explica como configurar o EmailJS para o funcionamento do formulário de contato.

## 1. Criar Conta no EmailJS

1. Acesse [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crie uma conta gratuita
3. Verifique seu email

## 2. Configurar Serviço de Email

1. No painel do EmailJS, vá para **Email Services**
2. Clique em **Add New Service**
3. Escolha seu provedor de email (Gmail, Outlook, etc.)
4. Siga as instruções para conectar sua conta
5. Anote o **Service ID** gerado

## 3. Criar Template de Email

1. Vá para **Email Templates**
2. Clique em **Create New Template**
3. Use o seguinte template:

### Template HTML:
```html
<h2>Nova Mensagem do Site Aerion Technologies</h2>

<p><strong>Nome:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Telefone:</strong> {{phone}}</p>
<p><strong>Empresa:</strong> {{company}}</p>
<p><strong>Vertical de Interesse:</strong> {{vertical}}</p>

<h3>Mensagem:</h3>
<p>{{message}}</p>

<hr>
<p><em>Esta mensagem foi enviada através do formulário de contato do site Aerion Technologies.</em></p>
```

### Configurações do Template:
- **Template Name:** `aerion_contact_form`
- **Subject:** `Nova mensagem do site - {{from_name}}`
- **From Name:** `{{from_name}}`
- **From Email:** `{{from_email}}`
- **Reply To:** `{{from_email}}`
- **To Email:** `comercial@aerion.com.br`

4. Salve o template e anote o **Template ID**

## 4. Obter Chave Pública

1. Vá para **Account** > **General**
2. Na seção **API Keys**, copie a **Public Key**

## 5. Configurar Variáveis de Ambiente

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as seguintes variáveis:

```env
VITE_EMAILJS_SERVICE_ID=seu_service_id_aqui
VITE_EMAILJS_TEMPLATE_ID=seu_template_id_aqui
VITE_EMAILJS_PUBLIC_KEY=sua_public_key_aqui
```

## 6. Configurar Domínios Permitidos

1. No painel do EmailJS, vá para **Account** > **General**
2. Na seção **Authorized Domains**, adicione:
   - `localhost` (para desenvolvimento)
   - Seu domínio de produção (ex: `aerion.com.br`)

## 7. Testar a Integração

1. Instale as dependências: `npm install` ou `bun install`
2. Inicie o servidor de desenvolvimento: `npm run dev`
3. Acesse a página de contato
4. Preencha e envie o formulário
5. Verifique se o email foi recebido

## Variáveis do Template

O template utiliza as seguintes variáveis:

- `{{from_name}}` - Nome do remetente
- `{{from_email}}` - Email do remetente
- `{{phone}}` - Telefone (ou "Não informado")
- `{{company}}` - Empresa (ou "Não informado")
- `{{vertical}}` - Vertical de interesse (mapeada para texto legível)
- `{{message}}` - Mensagem do usuário
- `{{to_name}}` - Nome do destinatário (Equipe Aerion Technologies)

## Limitações do Plano Gratuito

- 200 emails por mês
- 2 serviços de email
- 2 templates
- Suporte por email

## Troubleshooting

### Erro: "Configuração do EmailJS não encontrada"
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Certifique-se de que o arquivo `.env` está na raiz do projeto

### Erro: "Email não enviado"
- Verifique se o domínio está autorizado no EmailJS
- Confirme se o Service ID e Template ID estão corretos
- Verifique se a conta de email está conectada corretamente

### Emails não chegam
- Verifique a pasta de spam
- Confirme se o email de destino está correto no template
- Teste com um email diferente
