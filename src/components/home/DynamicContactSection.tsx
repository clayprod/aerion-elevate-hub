import ContactSection from "./ContactSection";

interface DynamicContactSectionProps {
  data: {
    title?: string;
    subtitle?: string;
  };
}

const DynamicContactSection = ({ data }: DynamicContactSectionProps) => {
  // Por enquanto, usa o componente ContactSection existente
  // Futuramente pode ser customizado com os dados do bloco
  return <ContactSection />;
};

export default DynamicContactSection;

