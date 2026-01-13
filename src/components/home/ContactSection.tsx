import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import SuccessDialog from "@/components/ui/success-dialog";
import emailjs from "@emailjs/browser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactSection = () => {
  const { toast } = useToast();
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      try {
        emailjs.init(publicKey);
      } catch (error) {
        console.warn("Erro ao inicializar EmailJS:", error);
      }
    } else {
      console.warn("VITE_EMAILJS_PUBLIC_KEY não encontrada nas variáveis de ambiente");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
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
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        const missingVars = [];
        if (!serviceId) missingVars.push("VITE_EMAILJS_SERVICE_ID");
        if (!templateId) missingVars.push("VITE_EMAILJS_TEMPLATE_ID");
        if (!publicKey) missingVars.push("VITE_EMAILJS_PUBLIC_KEY");
        throw new Error(`Configuração do EmailJS incompleta. Variáveis faltando: ${missingVars.join(", ")}`);
      }

      const verticalMap: Record<string, string> = {
        construcao: "Construção e Topografia",
        industrial: "Inspeção Industrial e Energia",
        seguranca: "Segurança Pública e Defesa Civil",
        resgate: "Resgate e Emergências",
        generalista: "Generalista",
        outro: "Outro",
      };

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone || "Não informado",
        company: formData.company || "Não informado",
        vertical: verticalMap[formData.vertical] || formData.vertical,
        message: formData.message,
        to_name: "Equipe Aerion Technologies",
        origin: "Home Page",
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setDialogType("success");
      setDialogTitle("Mensagem Enviada!");
      setDialogMessage("Obrigado pelo seu contato! Você receberá um e-mail de confirmação e responderemos em até 1 dia útil.");
      setShowDialog(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        vertical: "",
        message: "",
      });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setDialogType("error");
      setDialogTitle("Não foi possível enviar sua mensagem");
      setDialogMessage("Por favor, tente novamente em instantes ou utilize nossos canais diretos de contato.");
      setShowDialog(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gray-100">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-4">
              Pronto para Começar?
            </h2>
            <p className="text-lg md:text-xl text-gray-dark">
              Entre em contato e descubra como podemos transformar suas operações
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
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
                  className="border-2 border-gray-300 focus:border-blue-medium"
                />
              </div>

              {/* Email */}
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
                  className="border-2 border-gray-300 focus:border-blue-medium"
                />
              </div>

              {/* Phone */}
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
                  className="border-2 border-gray-300 focus:border-blue-medium"
                />
              </div>

              {/* Company */}
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
                  className="border-2 border-gray-300 focus:border-blue-medium"
                />
              </div>
            </div>

            {/* Vertical */}
            <div className="mb-6">
              <label htmlFor="vertical" className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                Vertical de Interesse *
              </label>
              <Select value={formData.vertical} onValueChange={(value) => setFormData({ ...formData, vertical: value })}>
                <SelectTrigger className="border-2 border-gray-300 focus:border-blue-medium">
                  <SelectValue placeholder="Selecione uma vertical" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construcao">Construção e Topografia</SelectItem>
                  <SelectItem value="industrial">Inspeção Industrial e Energia</SelectItem>
                  <SelectItem value="seguranca">Segurança Pública e Defesa Civil</SelectItem>
                  <SelectItem value="resgate">Resgate e Emergências</SelectItem>
                  <SelectItem value="generalista">Generalista</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="mb-8">
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
                className="border-2 border-gray-300 focus:border-blue-medium resize-none"
              />
              <p className="text-sm text-gray-medium mt-1">Mínimo 10 caracteres</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full bg-action hover:bg-action/90 text-action-foreground font-heading font-semibold text-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Enviando..." : "Enviar Mensagem"}
            </Button>

            {/* Privacy Note */}
            <p className="text-xs text-gray-medium text-center mt-4">
              Ao enviar este formulário, você concorda com nossa Política de Privacidade
            </p>
          </form>
        </div>
      </div>
      
      {/* Success/Error Dialog */}
      <SuccessDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        type={dialogType}
        title={dialogTitle}
        message={dialogMessage}
      />
    </section>
  );
};

export default ContactSection;
