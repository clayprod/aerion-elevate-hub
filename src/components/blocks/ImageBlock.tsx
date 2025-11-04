import { ImageBlock as ImageBlockType, BlockProps } from "@/types/blocks";

interface ImageBlockProps extends BlockProps<ImageBlockType> {
  // Props específicas do ImageBlock se necessário
}

const ImageBlock = ({ block, isEditing = false }: ImageBlockProps) => {
  const { content } = block;

  // Classes de alinhamento
  const getAlignmentClass = (alignment?: string) => {
    switch (alignment) {
      case 'center':
        return 'flex justify-center';
      case 'right':
        return 'flex justify-end';
      default:
        return 'flex justify-start';
    }
  };

  // Classes de tamanho
  const getSizeClass = (size?: string) => {
    switch (size) {
      case 'small':
        return 'max-w-sm';
      case 'medium':
        return 'max-w-2xl';
      case 'large':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-2xl';
    }
  };

  return (
    <section className="py-8 md:py-12">
      <div className="container-custom">
        <div className={`${getAlignmentClass(content.alignment)}`}>
          <div className={`${getSizeClass(content.size)}`}>
            {/* Image */}
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={content.image_url}
                alt={content.alt_text}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>

            {/* Caption */}
            {content.caption && (
              <p className="text-sm text-gray-dark mt-4 text-center italic">
                {content.caption}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Editing indicator */}
      {isEditing && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium z-40">
          Image Block
        </div>
      )}
    </section>
  );
};

export default ImageBlock;

