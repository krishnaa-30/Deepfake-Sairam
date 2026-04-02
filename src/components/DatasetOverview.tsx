import { GlassCard } from "./GlassCard";
import { Database, FolderOpen, CheckCircle, AlertCircle, BarChart } from "lucide-react";

export function DatasetOverview() {
  const stats = {
    total: 140000,
    train: 100000,
    val: 20000,
    test: 20000,
    realCount: 70000,
    fakeCount: 70000,
    augmentations: ["Horizontal Flip", "Rotation ±15°", "Zoom 0.8-1.2x", "Brightness ±20%", "Gaussian Noise σ=0.01"],
    integrity: { passed: 139847, corrupted: 153, noFace: 312 },
  };

  return (
    <GlassCard className="p-5" delay={0.15}>
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Dataset Overview</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-xl bg-muted/30">
          <p className="text-lg font-bold text-primary">{(stats.train / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-muted-foreground">Train</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/30">
          <p className="text-lg font-bold text-secondary">{(stats.val / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-muted-foreground">Validation</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/30">
          <p className="text-lg font-bold text-accent">{(stats.test / 1000).toFixed(0)}K</p>
          <p className="text-[10px] text-muted-foreground">Test</p>
        </div>
      </div>

      {/* Class Balance */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
          <BarChart className="w-3 h-3" /> Class Distribution
        </p>
        <div className="flex h-3 rounded-full overflow-hidden">
          <div className="bg-success" style={{ width: "50%" }} />
          <div className="bg-destructive" style={{ width: "50%" }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>Real: {(stats.realCount / 1000).toFixed(0)}K</span>
          <span>Fake: {(stats.fakeCount / 1000).toFixed(0)}K</span>
        </div>
      </div>

      {/* Integrity */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
          <FolderOpen className="w-3 h-3" /> Integrity Check
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle className="w-3 h-3 text-success" />
            <span>{stats.integrity.passed.toLocaleString()} passed</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-3 h-3 text-warning" />
            <span>{stats.integrity.corrupted} corrupted (removed)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <AlertCircle className="w-3 h-3 text-muted-foreground" />
            <span>{stats.integrity.noFace} no face detected</span>
          </div>
        </div>
      </div>

      {/* Augmentations */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Augmentations</p>
        <div className="flex flex-wrap gap-1.5">
          {stats.augmentations.map((aug) => (
            <span key={aug} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
              {aug}
            </span>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
