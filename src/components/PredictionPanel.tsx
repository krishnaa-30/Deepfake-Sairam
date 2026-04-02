import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Loader2, CheckCircle, XCircle, RotateCcw, Sparkles, AlertTriangle } from "lucide-react";
import { GlassCard } from "./GlassCard";
import { GradCAMOverlay } from "./GradCAMOverlay";
import { usePrediction } from "@/lib/prediction-engine";

export function PredictionPanel() {
  const { result, isProcessing, imageUrl, predict, reset } = usePrediction();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) predict(file);
    },
    [predict]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <GlassCard className="p-6" delay={0.1}>
      <div className="flex items-center gap-2 mb-5">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold">Live Prediction</h2>
      </div>

      {!imageUrl && !isProcessing && (
        <motion.div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
            dragOver ? "border-primary bg-primary/5" : "border-glass-border hover:border-muted-foreground"
          }`}
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleFile(file);
            };
            input.click();
          }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">Drop an image or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WebP</p>
        </motion.div>
      )}

      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center py-10 gap-4"
        >
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <div className="text-center">
            <p className="font-medium">Analyzing image...</p>
            <p className="text-xs text-muted-foreground mt-1">Running CNN inference & Grad-CAM</p>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {result && imageUrl && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Result Badge */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.label === "Fake" ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/15 border border-destructive/30">
                    <XCircle className="w-5 h-5 text-destructive" />
                    <span className="font-bold text-destructive">FAKE</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-success/15 border border-success/30">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="font-bold text-success">REAL</span>
                  </div>
                )}
                <span className="text-sm text-muted-foreground">{result.confidence}% confidence</span>
              </div>
              <button
                onClick={reset}
                className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Images */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">Original</p>
                <img src={imageUrl} alt="Uploaded" className="rounded-xl w-full aspect-square object-cover" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">Grad-CAM Heatmap</p>
                <GradCAMOverlay heatmapData={result.gradCamData} imageUrl={imageUrl} />
              </div>
            </div>

            {/* Confidence Bar */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-success font-medium">Real</span>
                <span className="text-destructive font-medium">Fake</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${result.label === "Fake" ? result.confidence : 100 - result.confidence}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      result.label === "Fake"
                        ? "linear-gradient(90deg, hsl(38 90% 55%), hsl(0 72% 55%))"
                        : "linear-gradient(90deg, hsl(160 70% 45%), hsl(190 90% 50%))",
                  }}
                />
              </div>
            </div>

            {/* Indicators */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Detected Indicators
              </p>
              <div className="space-y-1.5">
                {result.indicators.map((ind, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full ${result.label === "Fake" ? "bg-destructive" : "bg-success"}`} />
                    <span className="text-muted-foreground">{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-right">
              Processed in {result.processingTime}ms
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
}
