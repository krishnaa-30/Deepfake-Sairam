import { GlassCard } from "./GlassCard";
import { getEvaluationMetrics } from "@/lib/prediction-engine";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Target, BarChart3 } from "lucide-react";
import { useMemo } from "react";

export function EvaluationPanel() {
  const metrics = useMemo(() => getEvaluationMetrics(), []);
  const cm = metrics.confusionMatrix;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Confusion Matrix */}
      <GlassCard className="p-5" delay={0.4}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-semibold">Confusion Matrix</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-[240px] mx-auto">
          <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
            <p className="text-2xl font-bold text-success">{cm.truePositive}</p>
            <p className="text-[10px] text-muted-foreground mt-1">True Positive</p>
          </div>
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-2xl font-bold text-destructive">{cm.falsePositive}</p>
            <p className="text-[10px] text-muted-foreground mt-1">False Positive</p>
          </div>
          <div className="p-4 rounded-xl bg-warning/10 border border-warning/20 text-center">
            <p className="text-2xl font-bold text-warning">{cm.falseNegative}</p>
            <p className="text-[10px] text-muted-foreground mt-1">False Negative</p>
          </div>
          <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-center">
            <p className="text-2xl font-bold text-success">{cm.trueNegative}</p>
            <p className="text-[10px] text-muted-foreground mt-1">True Negative</p>
          </div>
        </div>
        <div className="flex justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <span>Predicted →</span>
          <span>Actual ↓</span>
        </div>
      </GlassCard>

      {/* ROC Curve */}
      <GlassCard className="p-5" delay={0.5}>
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold">ROC Curve (AUC: {metrics.rocAuc}%)</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={metrics.rocCurve}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 20%)" />
            <XAxis dataKey="fpr" label={{ value: "FPR", position: "bottom", fontSize: 10, fill: "hsl(215 20% 55%)" }} tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} />
            <YAxis label={{ value: "TPR", angle: -90, position: "left", fontSize: 10, fill: "hsl(215 20% 55%)" }} tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(225 20% 12% / 0.9)",
                border: "1px solid hsl(225 15% 25%)",
                borderRadius: "0.75rem",
              }}
            />
            <Area type="monotone" dataKey="tpr" stroke="hsl(320 70% 55%)" fill="hsl(320 70% 55% / 0.15)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}
