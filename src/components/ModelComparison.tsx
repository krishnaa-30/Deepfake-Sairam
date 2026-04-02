import { GlassCard } from "./GlassCard";
import { getModelComparison } from "@/lib/prediction-engine";
import { Layers, Trophy } from "lucide-react";
import { useMemo } from "react";

export function ModelComparison() {
  const models = useMemo(() => getModelComparison(), []);

  return (
    <GlassCard className="p-5" delay={0.6}>
      <div className="flex items-center gap-2 mb-4">
        <Layers className="w-4 h-4 text-secondary" />
        <h3 className="text-sm font-semibold">Model Comparison</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-glass-border">
              <th className="text-left py-2.5 px-3 text-muted-foreground font-medium text-xs">Model</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Accuracy</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">F1</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">AUC</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Params</th>
              <th className="text-right py-2.5 px-3 text-muted-foreground font-medium text-xs">Time</th>
            </tr>
          </thead>
          <tbody>
            {models.map((m, i) => (
              <tr key={m.model} className="border-b border-glass-border/50 hover:bg-muted/20 transition-colors">
                <td className="py-2.5 px-3 font-medium flex items-center gap-2">
                  {i === models.length - 1 && <Trophy className="w-3.5 h-3.5 text-warning" />}
                  {m.model}
                </td>
                <td className="text-right py-2.5 px-3">{m.accuracy}%</td>
                <td className="text-right py-2.5 px-3">{m.f1}%</td>
                <td className="text-right py-2.5 px-3">{m.auc}%</td>
                <td className="text-right py-2.5 px-3 text-muted-foreground">{m.params}</td>
                <td className="text-right py-2.5 px-3 text-muted-foreground">{m.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}
