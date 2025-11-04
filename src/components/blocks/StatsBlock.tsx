import { StatsBlock as StatsBlockType, BlockProps } from "@/types/blocks";

interface StatsBlockProps extends BlockProps<StatsBlockType> {
  // Props específicas do StatsBlock se necessário
}

const StatsBlock = ({ block, isEditing = false }: StatsBlockProps) => {
  const { content } = block;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-blue-dark to-navy-deep text-white">
      <div className="container-custom">
        {/* Section Header */}
        {(content.title || content.subtitle) && (
          <div className="text-center mb-12">
            {content.title && (
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-lg text-white/90 max-w-2xl mx-auto">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {content.stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              {/* Number */}
              <div className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">
                {stat.number}
              </div>

              {/* Label */}
              <div className="text-lg font-semibold text-white/90 mb-2">
                {stat.label}
              </div>

              {/* Description */}
              {stat.description && (
                <div className="text-sm text-white/80">
                  {stat.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Stats Block
        </div>
      )}
    </section>
  );
};

export default StatsBlock;

