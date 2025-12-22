import { useCallback, useState, memo, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Trash2, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface UploadSectionProps {
  onUpload: (files: File[]) => void;
  uploadedImages: string[];
  onClearHistory: () => void;
  isAnalyzing?: boolean;
}

const COLLAPSED_HEIGHT = 72;
const EXPANDED_HEIGHT = 480;

export const UploadSection = memo(({ onUpload, uploadedImages, onClearHistory, isAnalyzing }: UploadSectionProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles].slice(0, 10));
    if (acceptedFiles.length > 0) {
      setIsExpanded(true);
    }
  }, []);

  const dropzoneConfig = useMemo(() => ({
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 10,
  }), []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    ...dropzoneConfig,
  });

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (newFiles.length === 0) {
        setIsExpanded(false);
      }
      return newFiles;
    });
  }, []);

  const handleAnalyze = useCallback(() => {
    if (files.length > 0) {
      onUpload(files);
    }
  }, [files, onUpload]);

  const handleClearHistory = useCallback(() => {
    setFiles([]);
    setIsExpanded(false);
    onClearHistory();
  }, [onClearHistory]);

  const previewUrls = useMemo(() => 
    files.map(file => URL.createObjectURL(file)), 
    [files]
  );

  return (
    <section className="py-12 px-4 flex items-center justify-center">
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        .animate-pulse-ring {
          animation: pulse-ring 2s ease-in-out infinite;
        }
      `}</style>
      
      <motion.div
        layout
        onClick={() => !isExpanded && setIsExpanded(true)}
        className={cn(
          "relative bg-card/90 backdrop-blur-xl shadow-2xl shadow-primary/10 border border-border/50 overflow-hidden",
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
          !isExpanded && "cursor-pointer hover:shadow-3xl hover:shadow-primary/20 hover:border-primary/30",
          isDragActive && "border-primary bg-primary/10"
        )}
        style={{
          width: isExpanded ? Math.min(600, window.innerWidth - 32) : 320,
          height: isExpanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT,
          borderRadius: isExpanded ? 24 : 999,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Collapsed State Content */}
        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center px-6 gap-4"
            >
              {/* Animated Upload Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-pulse-ring" />
                <div className="relative w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              {/* Text */}
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {isDragActive ? "Drop images here" : "Upload Product Photos"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Click or drag to upload
                </p>
              </div>

              {/* Image preview stack in collapsed */}
              {files.length > 0 && (
                <div className="flex -space-x-2">
                  {files.slice(0, 3).map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, x: 20 }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="w-8 h-8 rounded-full border-2 border-card overflow-hidden"
                      style={{ zIndex: 3 - index }}
                    >
                      <img
                        src={previewUrls[index]}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  ))}
                  {files.length > 3 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center"
                    >
                      <span className="text-xs font-medium text-primary">+{files.length - 3}</span>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expanded State Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Product Photos</h3>
                    <p className="text-xs text-muted-foreground">{files.length}/10 images selected</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                >
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Dropzone Area */}
              <div className="flex-1 p-4 overflow-hidden">
                <div
                  {...getRootProps()}
                  className={cn(
                    "h-full rounded-xl border-2 border-dashed transition-all duration-300 overflow-hidden",
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-border/50 hover:border-primary/50",
                    files.length === 0 && "flex flex-col items-center justify-center cursor-pointer"
                  )}
                >
                  <input {...getInputProps()} />
                  
                  {files.length === 0 ? (
                    <div className="text-center p-6">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-2xl flex items-center justify-center"
                      >
                        <Upload className="w-8 h-8 text-primary" />
                      </motion.div>
                      <p className="text-lg font-medium text-foreground mb-1">
                        {isDragActive ? "Drop images here" : "Drag & drop images"}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        PNG, JPG, WEBP up to 10 images
                      </p>
                      <Button variant="outline" size="sm" className="gap-2">
                        <ImageIcon className="w-4 h-4" />
                        Browse Files
                      </Button>
                    </div>
                  ) : (
                    <div className="h-full overflow-y-auto p-3">
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {files.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative group aspect-square"
                          >
                            <img
                              src={previewUrls[index]}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg border border-border/50"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.div>
                        ))}
                        
                        {/* Add more button */}
                        {files.length < 10 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="aspect-square rounded-lg border-2 border-dashed border-border/50 hover:border-primary/50 flex items-center justify-center cursor-pointer transition-colors"
                          >
                            <Upload className="w-6 h-6 text-muted-foreground" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-4 pb-4 flex gap-2"
                >
                  {uploadedImages.length > 0 && (
                    <Button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearHistory();
                      }} 
                      variant="destructive" 
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear
                    </Button>
                  )}
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnalyze();
                    }} 
                    size="sm"
                    className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                    disabled={isAnalyzing}
                  >
                    <Sparkles className="w-4 h-4" />
                    {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
});

UploadSection.displayName = "UploadSection";
