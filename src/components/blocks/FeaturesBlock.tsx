import { Card } from "@/components/ui/card";
import { FeaturesBlock as FeaturesBlockType, BlockProps } from "@/types/blocks";
import { 
  LucideIcon,
  Rocket,
  DollarSign,
  HeadphonesIcon,
  Shield,
  Zap,
  Users,
  Award,
  Globe,
  Target,
  Eye,
  CheckCircle,
  Star,
  Heart,
  Lightbulb,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  BarChart3,
  Package,
  Settings,
  Wrench,
  Cog,
  Tool,
  Hammer,
  Gear,
  Sliders,
  ToggleLeft,
  ToggleRight,
  Power,
  Battery,
  BatteryCharging,
  Plug,
  Wifi,
  Bluetooth,
  Radio,
  Signal,
  WifiOff,
  BluetoothOff,
  RadioOff,
  SignalOff,
  SignalLow,
  SignalMedium,
  SignalHigh,
  SignalZero,
  SignalOne,
  SignalTwo,
  SignalThree,
  SignalFour,
  SignalFive,
  SignalSix,
  SignalSeven,
  SignalEight,
  SignalNine,
  SignalTen,
  SignalEleven,
  SignalTwelve,
  SignalThirteen,
  SignalFourteen,
  SignalFifteen,
  SignalSixteen,
  SignalSeventeen,
  SignalEighteen,
  SignalNineteen,
  SignalTwenty,
  SignalTwentyOne,
  SignalTwentyTwo,
  SignalTwentyThree,
  SignalTwentyFour,
  SignalTwentyFive,
  SignalTwentySix,
  SignalTwentySeven,
  SignalTwentyEight,
  SignalTwentyNine,
  SignalThirty,
  SignalThirtyOne,
  SignalThirtyTwo,
  SignalThirtyThree,
  SignalThirtyFour,
  SignalThirtyFive,
  SignalThirtySix,
  SignalThirtySeven,
  SignalThirtyEight,
  SignalThirtyNine,
  SignalForty,
  SignalFortyOne,
  SignalFortyTwo,
  SignalFortyThree,
  SignalFortyFour,
  SignalFortyFive,
  SignalFortySix,
  SignalFortySeven,
  SignalFortyEight,
  SignalFortyNine,
  SignalFifty,
  SignalFiftyOne,
  SignalFiftyTwo,
  SignalFiftyThree,
  SignalFiftyFour,
  SignalFiftyFive,
  SignalFiftySix,
  SignalFiftySeven,
  SignalFiftyEight,
  SignalFiftyNine,
  SignalSixty,
  SignalSixtyOne,
  SignalSixtyTwo,
  SignalSixtyThree,
  SignalSixtyFour,
  SignalSixtyFive,
  SignalSixtySix,
  SignalSixtySeven,
  SignalSixtyEight,
  SignalSixtyNine,
  SignalSeventy,
  SignalSeventyOne,
  SignalSeventyTwo,
  SignalSeventyThree,
  SignalSeventyFour,
  SignalSeventyFive,
  SignalSeventySix,
  SignalSeventySeven,
  SignalSeventyEight,
  SignalSeventyNine,
  SignalEighty,
  SignalEightyOne,
  SignalEightyTwo,
  SignalEightyThree,
  SignalEightyFour,
  SignalEightyFive,
  SignalEightySix,
  SignalEightySeven,
  SignalEightyEight,
  SignalEightyNine,
  SignalNinety,
  SignalNinetyOne,
  SignalNinetyTwo,
  SignalNinetyThree,
  SignalNinetyFour,
  SignalNinetyFive,
  SignalNinetySix,
  SignalNinetySeven,
  SignalNinetyEight,
  SignalNinetyNine,
  SignalHundred,
} from "lucide-react";

// Mapeamento de ícones por nome (baseado nos ícones usados no WhyAerionSection)
const iconMap: Record<string, LucideIcon> = {
  'Rocket': Rocket,
  'DollarSign': DollarSign,
  'HeadphonesIcon': HeadphonesIcon,
  'Shield': Shield,
  'Zap': Zap,
  'Users': Users,
  'Award': Award,
  'Globe': Globe,
  'Target': Target,
  'Eye': Eye,
  'CheckCircle': CheckCircle,
  'Star': Star,
  'Heart': Heart,
  'Lightbulb': Lightbulb,
  'TrendingUp': TrendingUp,
  'Clock': Clock,
  'MapPin': MapPin,
  'Phone': Phone,
  'Mail': Mail,
  'MessageSquare': MessageSquare,
  'BarChart3': BarChart3,
  'Package': Package,
  'Settings': Settings,
  'Wrench': Wrench,
  'Cog': Cog,
  'Tool': Tool,
  'Hammer': Hammer,
  'Gear': Gear,
  'Sliders': Sliders,
  'ToggleLeft': ToggleLeft,
  'ToggleRight': ToggleRight,
  'Power': Power,
  'Battery': Battery,
  'BatteryCharging': BatteryCharging,
  'Plug': Plug,
  'Wifi': Wifi,
  'Bluetooth': Bluetooth,
  'Radio': Radio,
  'Signal': Signal,
  'WifiOff': WifiOff,
  'BluetoothOff': BluetoothOff,
  'RadioOff': RadioOff,
  'SignalOff': SignalOff,
  'SignalLow': SignalLow,
  'SignalMedium': SignalMedium,
  'SignalHigh': SignalHigh,
  'SignalZero': SignalZero,
  'SignalOne': SignalOne,
  'SignalTwo': SignalTwo,
  'SignalThree': SignalThree,
  'SignalFour': SignalFour,
  'SignalFive': SignalFive,
  'SignalSix': SignalSix,
  'SignalSeven': SignalSeven,
  'SignalEight': SignalEight,
  'SignalNine': SignalNine,
  'SignalTen': SignalTen,
  'SignalEleven': SignalEleven,
  'SignalTwelve': SignalTwelve,
  'SignalThirteen': SignalThirteen,
  'SignalFourteen': SignalFourteen,
  'SignalFifteen': SignalFifteen,
  'SignalSixteen': SignalSixteen,
  'SignalSeventeen': SignalSeventeen,
  'SignalEighteen': SignalEighteen,
  'SignalNineteen': SignalNineteen,
  'SignalTwenty': SignalTwenty,
  'SignalTwentyOne': SignalTwentyOne,
  'SignalTwentyTwo': SignalTwentyTwo,
  'SignalTwentyThree': SignalTwentyThree,
  'SignalTwentyFour': SignalTwentyFour,
  'SignalTwentyFive': SignalTwentyFive,
  'SignalTwentySix': SignalTwentySix,
  'SignalTwentySeven': SignalTwentySeven,
  'SignalTwentyEight': SignalTwentyEight,
  'SignalTwentyNine': SignalTwentyNine,
  'SignalThirty': SignalThirty,
  'SignalThirtyOne': SignalThirtyOne,
  'SignalThirtyTwo': SignalThirtyTwo,
  'SignalThirtyThree': SignalThirtyThree,
  'SignalThirtyFour': SignalThirtyFour,
  'SignalThirtyFive': SignalThirtyFive,
  'SignalThirtySix': SignalThirtySix,
  'SignalThirtySeven': SignalThirtySeven,
  'SignalThirtyEight': SignalThirtyEight,
  'SignalThirtyNine': SignalThirtyNine,
  'SignalForty': SignalForty,
  'SignalFortyOne': SignalFortyOne,
  'SignalFortyTwo': SignalFortyTwo,
  'SignalFortyThree': SignalFortyThree,
  'SignalFortyFour': SignalFortyFour,
  'SignalFortyFive': SignalFortyFive,
  'SignalFortySix': SignalFortySix,
  'SignalFortySeven': SignalFortySeven,
  'SignalFortyEight': SignalFortyEight,
  'SignalFortyNine': SignalFortyNine,
  'SignalFifty': SignalFifty,
  'SignalFiftyOne': SignalFiftyOne,
  'SignalFiftyTwo': SignalFiftyTwo,
  'SignalFiftyThree': SignalFiftyThree,
  'SignalFiftyFour': SignalFiftyFour,
  'SignalFiftyFive': SignalFiftyFive,
  'SignalFiftySix': SignalFiftySix,
  'SignalFiftySeven': SignalFiftySeven,
  'SignalFiftyEight': SignalFiftyEight,
  'SignalFiftyNine': SignalFiftyNine,
  'SignalSixty': SignalSixty,
  'SignalSixtyOne': SignalSixtyOne,
  'SignalSixtyTwo': SignalSixtyTwo,
  'SignalSixtyThree': SignalSixtyThree,
  'SignalSixtyFour': SignalSixtyFour,
  'SignalSixtyFive': SignalSixtyFive,
  'SignalSixtySix': SignalSixtySix,
  'SignalSixtySeven': SignalSixtySeven,
  'SignalSixtyEight': SignalSixtyEight,
  'SignalSixtyNine': SignalSixtyNine,
  'SignalSeventy': SignalSeventy,
  'SignalSeventyOne': SignalSeventyOne,
  'SignalSeventyTwo': SignalSeventyTwo,
  'SignalSeventyThree': SignalSeventyThree,
  'SignalSeventyFour': SignalSeventyFour,
  'SignalSeventyFive': SignalSeventyFive,
  'SignalSeventySix': SignalSeventySix,
  'SignalSeventySeven': SignalSeventySeven,
  'SignalSeventyEight': SignalSeventyEight,
  'SignalSeventyNine': SignalSeventyNine,
  'SignalEighty': SignalEighty,
  'SignalEightyOne': SignalEightyOne,
  'SignalEightyTwo': SignalEightyTwo,
  'SignalEightyThree': SignalEightyThree,
  'SignalEightyFour': SignalEightyFour,
  'SignalEightyFive': SignalEightyFive,
  'SignalEightySix': SignalEightySix,
  'SignalEightySeven': SignalEightySeven,
  'SignalEightyEight': SignalEightyEight,
  'SignalEightyNine': SignalEightyNine,
  'SignalNinety': SignalNinety,
  'SignalNinetyOne': SignalNinetyOne,
  'SignalNinetyTwo': SignalNinetyTwo,
  'SignalNinetyThree': SignalNinetyThree,
  'SignalNinetyFour': SignalNinetyFour,
  'SignalNinetyFive': SignalNinetyFive,
  'SignalNinetySix': SignalNinetySix,
  'SignalNinetySeven': SignalNinetySeven,
  'SignalNinetyEight': SignalNinetyEight,
  'SignalNinetyNine': SignalNinetyNine,
  'SignalHundred': SignalHundred,
};

interface FeaturesBlockProps extends BlockProps<FeaturesBlockType> {
  // Props específicas do FeaturesBlock se necessário
}

const FeaturesBlock = ({ block, isEditing = false }: FeaturesBlockProps) => {
  const { content } = block;

  // Função para obter o ícone
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || iconMap['Star'];
    return IconComponent;
  };

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-dark rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-medium rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy-deep mb-2">
            {content.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-dark max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.features.map((feature, index) => {
            const IconComponent = getIcon(feature.icon);
            
            return (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-medium/20 animate-fade-in bg-white"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-dark to-blue-medium flex items-center justify-center mb-6 shadow-glow">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-heading font-bold text-navy-deep mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-dark mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Features List */}
                {feature.features_list && feature.features_list.length > 0 && (
                  <ul className="space-y-3">
                    {feature.features_list.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start text-sm text-gray-dark">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0 text-blue-medium mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Features Block
        </div>
      )}
    </section>
  );
};

export default FeaturesBlock;

