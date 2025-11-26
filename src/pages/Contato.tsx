import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/SEO/SEOHead";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Instagram, MessageCircle, Loader2, Linkedin } from "lucide-react";
import emailjs from '@emailjs/browser';
import SuccessDialog from "@/components/ui/success-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Contato = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<"success" | "error">("success");
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    vertical: "",
    message: "",
  });

  // Inicializar EmailJS quando o componente montar
  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      try {
        emailjs.init(publicKey);
        console.log('EmailJS inicializado com sucesso');
      } catch (error) {
        console.warn('Erro ao inicializar EmailJS:', error);
      }
    } else {
      console.warn('VITE_EMAILJS_PUBLIC_KEY não encontrada nas variáveis de ambiente');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação dos campos obrigatórios
    if (!formData.name || !formData.email || !formData.vertical || !formData.message) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      });
      return;
    }

    // Validação da mensagem (mínimo 10 caracteres)
    if (formData.message.length < 10) {
      toast({
        title: "Mensagem muito curta",
        description: "A mensagem deve ter pelo menos 10 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Configurar EmailJS
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      // Verificar se as variáveis de ambiente estão configuradas
      if (!serviceId || !templateId || !publicKey) {
        const missingVars = [];
        if (!serviceId) missingVars.push('VITE_EMAILJS_SERVICE_ID');
        if (!templateId) missingVars.push('VITE_EMAILJS_TEMPLATE_ID');
        if (!publicKey) missingVars.push('VITE_EMAILJS_PUBLIC_KEY');
        
        console.error('Variáveis de ambiente faltando:', missingVars);
        throw new Error(`Configuração do EmailJS incompleta. Variáveis faltando: ${missingVars.join(', ')}`);
      }

      // Inicializar EmailJS se ainda não foi inicializado
      try {
        emailjs.init(publicKey);
      } catch (initError) {
        // Se já foi inicializado, ignora o erro
        console.log('EmailJS já inicializado ou erro na inicialização:', initError);
      }

      // Mapear vertical para texto legível
      const verticalMap: { [key: string]: string } = {
        'construcao': 'Construção e Topografia',
        'industrial': 'Inspeção Industrial e Energia',
        'seguranca': 'Segurança Pública e Defesa Civil',
        'resgate': 'Resgate e Emergências',
        'outro': 'Outro'
      };

      // Preparar dados para o template
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || 'Não informado',
        company: formData.company || 'Não informado',
        vertical: verticalMap[formData.vertical] || formData.vertical,
        message: formData.message,
        to_name: 'Equipe Aerion Technologies'
      };

      console.log('Enviando email via EmailJS...', {
        serviceId,
        templateId,
        hasPublicKey: !!publicKey,
        params: { ...templateParams, message: '[oculto]' }
      });

      // Enviar email via EmailJS
      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      console.log('Email enviado com sucesso:', response);

      // Sucesso - mostrar diálogo
      setDialogType("success");
      setDialogTitle("Mensagem Enviada!");
      setDialogMessage("Obrigado pelo seu contato! Você receberá um e-mail de confirmação e responderemos em até 1 dia útil.");
      setShowDialog(true);

      // Limpar formulário
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        vertical: "",
        message: "",
      });

    } catch (error: any) {
      console.error('Erro detalhado ao enviar email:', error);
      
      // Determinar mensagem de erro mais específica
      let errorMessage = "Ocorreu um erro ao enviar sua mensagem. Tente novamente ou entre em contato por telefone.";
      
      if (error?.message) {
        if (error.message.includes('Configuração do EmailJS')) {
          errorMessage = "Erro de configuração: As credenciais do EmailJS não estão configuradas corretamente. Por favor, entre em contato com o suporte técnico.";
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = "Erro de conexão: Não foi possível conectar ao servidor. Verifique sua conexão com a internet e tente novamente.";
        } else if (error.message.includes('CORS') || error.message.includes('same origin')) {
          errorMessage = "Erro de configuração: O domínio não está autorizado no EmailJS. Entre em contato com o suporte técnico.";
        } else if (error.status === 400) {
          errorMessage = "Erro de validação: Os dados do formulário são inválidos. Verifique os campos e tente novamente.";
        } else if (error.status === 401 || error.status === 403) {
          errorMessage = "Erro de autenticação: As credenciais do EmailJS são inválidas. Entre em contato com o suporte técnico.";
        } else if (error.status === 429) {
          errorMessage = "Limite excedido: Muitas tentativas de envio. Por favor, aguarde alguns minutos e tente novamente.";
        }
      }
      
      // Erro - mostrar diálogo
      setDialogType("error");
      setDialogTitle("Erro ao Enviar");
      setDialogMessage(errorMessage);
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Contato | Aerion Technologies - Distribuidor Oficial Autel"
        description="Entre em contato com a Aerion Technologies. Especialistas em drones profissionais Autel. Suporte técnico, programa de revendas e soluções para Construção, Industrial, Segurança e Resgate."
        keywords="contato aerion, suporte drones, programa revendas, distribuidor autel contato"
        canonical="https://aerion.com.br/contato"
      />
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="py-2" style={{ backgroundColor: '#ffffff' }}>
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-navy-deep">
              Entre em Contato
            </h1>
            <p className="text-xl max-w-3xl mx-auto font-semibold" style={{ color: '#111827', backgroundColor: 'transparent' }}>
              Pronto para revolucionar suas operações? Nossa equipe de especialistas está pronta para ajudar você a escolher a solução ideal para seu negócio
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-8 bg-gray-100">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                  <h2 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                    Envie sua Mensagem
                  </h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                          Nome Completo *
                        </label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Seu nome"
                          required
                          className="border-2 focus:border-blue-medium"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seu@email.com"
                          required
                          className="border-2 focus:border-blue-medium"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                          Telefone
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(11) 99999-9999"
                          className="border-2 focus:border-blue-medium"
                        />
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                          Empresa
                        </label>
                        <Input
                          id="company"
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Nome da empresa"
                          className="border-2 focus:border-blue-medium"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="vertical" className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                        Vertical de Interesse *
                      </label>
                      <Select value={formData.vertical} onValueChange={(value) => setFormData({ ...formData, vertical: value })}>
                        <SelectTrigger className="border-2 focus:border-blue-medium">
                          <SelectValue placeholder="Selecione uma vertical" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="construcao">Construção e Topografia</SelectItem>
                          <SelectItem value="industrial">Inspeção Industrial e Energia</SelectItem>
                          <SelectItem value="seguranca">Segurança Pública e Defesa Civil</SelectItem>
                          <SelectItem value="resgate">Resgate e Emergências</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="message" className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                        Mensagem *
                      </label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Conte-nos sobre suas necessidades..."
                        required
                        rows={5}
                        className="border-2 focus:border-blue-medium resize-none"
                      />
                      <p className="text-sm text-gray-medium mt-1">Mínimo 10 caracteres</p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isLoading}
                      className="w-full bg-action hover:bg-action/90 text-action-foreground font-heading font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        "Enviar Mensagem"
                      )}
                    </Button>

                    <p className="text-xs text-gray-medium text-center mt-4">
                      Ao enviar este formulário, você concorda com nossa Política de Privacidade
                    </p>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="lg:col-span-2 space-y-4">
                {/* Contact Details Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-heading font-bold text-navy-deep mb-6">
                    Informações de Contato
                  </h3>
                  
                  <div className="space-y-3">
                    <a
                      href="tel:+551151024229"
                      className="flex items-center space-x-3 group hover:bg-gray-light/30 p-3 rounded-xl transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-medium/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-medium/20 transition-colors">
                        <Phone className="h-6 w-6 text-blue-medium" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark mb-1">Telefone</p>
                        <p className="text-navy-deep">+55 11 5102-4229</p>
                      </div>
                    </a>

                    <a
                      href="https://wa.me/5511934668839"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 group hover:bg-gray-light/30 p-3 rounded-xl transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-medium/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-medium/20 transition-colors">
                        <MessageCircle className="h-6 w-6 text-blue-medium" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark mb-1">WhatsApp (Comercial)</p>
                        <p className="text-navy-deep">+55 11 93466-8839</p>
                      </div>
                    </a>

                    <a
                      href="mailto:comercial@aerion.com.br"
                      className="flex items-center space-x-3 group hover:bg-gray-light/30 p-3 rounded-xl transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-medium/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-medium/20 transition-colors">
                        <Mail className="h-6 w-6 text-blue-medium" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark mb-1">Email</p>
                        <p className="text-navy-deep">comercial@aerion.com.br</p>
                      </div>
                    </a>

                    <div className="flex items-start space-x-3 p-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-medium/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-blue-medium" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark mb-1">Endereço</p>
                        <p className="text-navy-deep leading-relaxed">
                          Edifício Itamaracá<br />
                          R. Quintana 887, Cj. 111, 11º Andar<br />
                          Brooklin Novo - SP<br />
                          CEP: 04569-011
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-medium/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-blue-medium" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark mb-1">Horário</p>
                        <p className="text-navy-deep">Seg-Sex: 9h-18h</p>
                      </div>
                    </div>

                    <a
                      href="https://instagram.com/aerion.technologies"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 group hover:bg-gray-light/30 p-3 rounded-xl transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-medium/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-medium/20 transition-colors">
                        <Instagram className="h-6 w-6 text-blue-medium" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark mb-1">Instagram</p>
                        <p className="text-navy-deep">@aerion.technologies</p>
                      </div>
                    </a>

                    <a
                      href="https://linkedin.com/company/aerion-technologies-br"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-3 group hover:bg-gray-light/30 p-3 rounded-xl transition-all duration-200 hover:shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-xl bg-blue-medium/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-medium/20 transition-colors">
                        <Linkedin className="h-6 w-6 text-blue-medium" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark mb-1">LinkedIn</p>
                        <p className="text-navy-deep">@aerion-technologies-br</p>
                      </div>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Success/Error Dialog */}
      <SuccessDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        type={dialogType}
        title={dialogTitle}
        message={dialogMessage}
      />
    </div>
  );
};

export default Contato;
