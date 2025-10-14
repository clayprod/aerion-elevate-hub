import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    vertical: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
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

    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em até 24 horas.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      vertical: "",
      message: "",
    });
  };

  return (
    <section className="py-20 md:py-28 bg-gray-light/30">
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
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
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
                  className="border-2 focus:border-aerion-blue"
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
                  className="border-2 focus:border-aerion-blue"
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
                  className="border-2 focus:border-aerion-blue"
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
                  className="border-2 focus:border-aerion-blue"
                />
              </div>
            </div>

            {/* Vertical */}
            <div className="mb-6">
              <label htmlFor="vertical" className="block text-sm font-heading font-semibold text-navy-deep mb-2">
                Vertical de Interesse *
              </label>
              <Select value={formData.vertical} onValueChange={(value) => setFormData({ ...formData, vertical: value })}>
                <SelectTrigger className="border-2 focus:border-aerion-blue">
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
                className="border-2 focus:border-aerion-blue resize-none"
              />
              <p className="text-sm text-gray-medium mt-1">Mínimo 10 caracteres</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-action hover:bg-action/90 text-white font-heading font-semibold text-lg"
            >
              Enviar Mensagem
            </Button>

            {/* Privacy Note */}
            <p className="text-xs text-gray-medium text-center mt-4">
              Ao enviar este formulário, você concorda com nossa Política de Privacidade
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
