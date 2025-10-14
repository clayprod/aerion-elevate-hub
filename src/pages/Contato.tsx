import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Clock, Instagram, MessageCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Contato = () => {
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
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-28 pb-20">
        {/* Hero Section */}
        <section className="bg-gradient-primary py-16 text-white">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
              Entre em Contato
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Pronto para revolucionar suas operações? Nossa equipe de especialistas está pronta para ajudar você a escolher a solução ideal para seu negócio
            </p>
          </div>
        </section>

        {/* Contact Content */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                  <h2 className="text-3xl font-heading font-bold text-navy-deep mb-6">
                    Envie sua Mensagem
                  </h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

                    <div className="mb-6">
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
                        rows={6}
                        className="border-2 focus:border-blue-medium resize-none"
                      />
                      <p className="text-sm text-gray-medium mt-1">Mínimo 10 caracteres</p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-action hover:bg-action/90 text-white font-heading font-semibold text-lg"
                    >
                      Enviar Mensagem
                    </Button>

                    <p className="text-xs text-gray-medium text-center mt-4">
                      Ao enviar este formulário, você concorda com nossa Política de Privacidade
                    </p>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                {/* Contact Details Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-heading font-bold text-navy-deep mb-6">
                    Informações de Contato
                  </h3>
                  
                  <div className="space-y-6">
                    <a
                      href="tel:+551151024229"
                      className="flex items-start space-x-4 group hover:bg-gray-light/30 p-3 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-medium/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-medium/20 transition-colors">
                        <Phone className="h-6 w-6 text-blue-medium" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark">Telefone</p>
                        <p className="text-navy-deep font-semibold">+55 11 5102-4229</p>
                      </div>
                    </a>

                    <a
                      href="https://wa.me/5511934668839"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-4 group hover:bg-gray-light/30 p-3 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                        <MessageCircle className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark">WhatsApp (Comercial)</p>
                        <p className="text-navy-deep font-semibold">+55 11 93466-8839</p>
                      </div>
                    </a>

                    <a
                      href="mailto:comercial@aerion.com.br"
                      className="flex items-start space-x-4 group hover:bg-gray-light/30 p-3 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-blue-dark/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-dark/20 transition-colors">
                        <Mail className="h-6 w-6 text-blue-dark" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark">Email</p>
                        <p className="text-navy-deep font-semibold">comercial@aerion.com.br</p>
                      </div>
                    </a>

                    <div className="flex items-start space-x-4 p-3">
                      <div className="w-12 h-12 rounded-lg bg-orange-energy/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-orange-energy" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark">Endereço</p>
                        <p className="text-navy-deep font-semibold leading-relaxed">
                          Edifício Itamaracá<br />
                          R. Quintana 887, Cj. 111, 11º Andar<br />
                          Brooklin Novo - SP<br />
                          CEP: 04569-011
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4 p-3">
                      <div className="w-12 h-12 rounded-lg bg-green-success/10 flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-green-success" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark">Horário</p>
                        <p className="text-navy-deep font-semibold">Seg-Sex: 9h-18h</p>
                      </div>
                    </div>

                    <a
                      href="https://instagram.com/aerion.technologies"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-4 group hover:bg-gray-light/30 p-3 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-500/20 transition-colors">
                        <Instagram className="h-6 w-6 text-pink-500" />
                      </div>
                      <div>
                        <p className="text-sm font-heading font-semibold text-gray-dark">Instagram</p>
                        <p className="text-navy-deep font-semibold">@aerion.technologies</p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Quick Response Card */}
                <div className="bg-gradient-accent rounded-2xl shadow-lg p-8 text-white">
                  <h3 className="text-xl font-heading font-bold mb-3">
                    Resposta Rápida
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    Nossa equipe responde a todas as solicitações em até 24 horas úteis. Para urgências, ligue diretamente.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contato;
