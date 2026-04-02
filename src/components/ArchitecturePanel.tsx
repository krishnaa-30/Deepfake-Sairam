import { GlassCard } from "./GlassCard";
import { Cpu, Layers, ArrowRight } from "lucide-react";

export function ArchitecturePanel() {
  const layers = [
    { name: "EfficientNetB4", type: "Backbone", params: "17.7M", color: "text-primary" },
    { name: "GlobalAvgPool2D", type: "Pooling", params: "0", color: "text-secondary" },
    { name: "BatchNorm", type: "Normalization", params: "2K", color: "text-info" },
    { name: "Dense(512) + Dropout(0.5)", type: "FC Layer", params: "900K", color: "text-accent" },
    { name: "Dense(128) + Dropout(0.3)", type: "FC Layer", params: "65K", color: "text-accent" },
    { name: "Dense(1, sigmoid)", type: "Output", params: "129", color: "text-success" },
  ];

  return (
    <GlassCard className="p-5" delay={0.25}>
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-semibold">Model Architecture</h3>
      </div>

      <div className="space-y-2">
        {layers.map((layer, i) => (
          <div key={layer.name}>
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
              <Layers className={`w-3.5 h-3.5 ${layer.color} shrink-0`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{layer.name}</p>
                <p className="text-[10px] text-muted-foreground">{layer.type}</p>
              </div>
              <span className="text-[10px] text-muted-foreground shrink-0">{layer.params}</span>
            </div>
            {i < layers.length - 1 && (
              <div className="flex justify-center py-0.5">
                <ArrowRight className="w-3 h-3 text-muted-foreground rotate-90" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/15">
        <p className="text-[10px] text-muted-foreground">
          <span className="text-primary font-medium">Training Strategy:</span> 2-phase training — freeze backbone for 10 epochs, then fine-tune top 30 layers for 40 epochs with cosine decay LR.
        </p>
      </div>
    </GlassCard>
  );
}
