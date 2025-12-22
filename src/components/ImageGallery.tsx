import { motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

interface ImageGalleryProps {
  images: string[];
  onRemoveImage: (index: number) => void;
  onClearAll: () => void;
}

export const ImageGallery = ({ images, onRemoveImage, onClearAll }: ImageGalleryProps) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mb-12 px-4">
      <div className="border-4 border-primary rounded-2xl p-6 bg-card/50 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-foreground">Selected Images ({images.length})</h3>
          <Button
            variant="destructive"
            size="sm"
            onClick={onClearAll}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear History
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
            >
              <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary/30">
                <img
                  src={image}
                  alt={`Uploaded product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 w-8 h-8 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <X className="w-4 h-4 text-destructive-foreground" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
