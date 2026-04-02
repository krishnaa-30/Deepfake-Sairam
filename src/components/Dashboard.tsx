import { motion } from "framer-motion";
import { Shield, Activity, Brain, Zap, Target, Database, Code, FlaskConical } from "lucide-react";
import { StatCard } from "./StatCard";
import { PredictionPanel } from "./PredictionPanel";
import { TrainingCharts } from "./TrainingCharts";
import { EvaluationPanel } from "./EvaluationPanel";
import { ModelComparison } from "./ModelComparison";
import { DatasetOverview } from "./DatasetOverview";
import { ArchitecturePanel } from "./ArchitecturePanel";
import { useState } from "react";

const tabs = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "predict", label: "Predict", icon: Brain },
  { id: "training", label: "Training", icon: FlaskConical },
  { id: "evaluate", label: "Evaluate", icon: Target },
] as const;

type TabId = typeof tabs[number]["id"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  return (
    <div className="min-h-screen mesh-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold gradient-text">DeepFake Sentinel</h1>
              <p className="text-[10px] text-muted-foreground">CNN-based Detection with Explainability</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/30 border border-glass-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: "var(--gradient-primary)" }}
                    transition={{ type: "spring", duration: 0.4 }}
                  />
                )}
                <tab.icon className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10 hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Target} label="Accuracy" value="96.4%" subtitle="EfficientNetB4" accentClass="text-primary" delay={0} />
              <StatCard icon={Zap} label="F1 Score" value="96.4%" subtitle="Precision-Recall balanced" accentClass="text-success" delay={0.05} />
              <StatCard icon={Database} label="Dataset" value="140K" subtitle="70K Real / 70K Fake" accentClass="text-secondary" delay={0.1} />
              <StatCard icon={Code} label="ROC-AUC" value="98.7%" subtitle="Near perfect discrimination" accentClass="text-accent" delay={0.15} />
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                <TrainingCharts />
                <ModelComparison />
              </div>
              <div className="space-y-5">
                <DatasetOverview />
                <ArchitecturePanel />
              </div>
            </div>
          </>
        )}

        {activeTab === "predict" && (
          <div className="max-w-2xl mx-auto">
            <PredictionPanel />
          </div>
        )}

        {activeTab === "training" && <TrainingCharts />}

        {activeTab === "evaluate" && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Target} label="Accuracy" value="96.4%" accentClass="text-primary" delay={0} />
              <StatCard icon={Zap} label="Precision" value="95.8%" accentClass="text-success" delay={0.05} />
              <StatCard icon={Activity} label="Recall" value="97.1%" accentClass="text-secondary" delay={0.1} />
              <StatCard icon={Brain} label="F1 Score" value="96.4%" accentClass="text-accent" delay={0.15} />
            </div>
            <EvaluationPanel />
            <ModelComparison />
          </>
        )}
      </main>
    </div>
  );
}
