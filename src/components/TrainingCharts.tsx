import { GlassCard } from "./GlassCard";
import { getTrainingMetrics } from "@/lib/prediction-engine";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { useMemo } from "react";

export function TrainingCharts() {
  const metrics = useMemo(() => getTrainingMetrics(), []);

  const lossData = metrics.epochs.map((epoch, i) => ({
    epoch,
    "Train Loss": Math.round(metrics.trainLoss[i] * 1000) / 1000,
    "Val Loss": Math.round(metrics.valLoss[i] * 1000) / 1000,
  }));

  const accData = metrics.epochs.map((epoch, i) => ({
    epoch,
    "Train Acc": Math.round(metrics.trainAcc[i] * 1000) / 10,
    "Val Acc": Math.round(metrics.valAcc[i] * 1000) / 10,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <GlassCard className="p-5" delay={0.2}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Training Loss</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={lossData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 20%)" />
            <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} />
            <Tooltip
              contentStyle={{
                background: "hsl(225 20% 12% / 0.9)",
                border: "1px solid hsl(225 15% 25%)",
                borderRadius: "0.75rem",
                backdropFilter: "blur(10px)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="Train Loss" stroke="hsl(190 90% 50%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Val Loss" stroke="hsl(260 60% 60%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>

      <GlassCard className="p-5" delay={0.3}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-success" />
          <h3 className="text-sm font-semibold">Training Accuracy</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={accData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 20%)" />
            <XAxis dataKey="epoch" tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(215 20% 55%)" }} domain={[40, 100]} />
            <Tooltip
              contentStyle={{
                background: "hsl(225 20% 12% / 0.9)",
                border: "1px solid hsl(225 15% 25%)",
                borderRadius: "0.75rem",
                backdropFilter: "blur(10px)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="Train Acc" stroke="hsl(160 70% 45%)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Val Acc" stroke="hsl(38 90% 55%)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
}
