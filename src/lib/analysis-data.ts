// Data generators for false-positive reduction analysis panels

export interface ThresholdPoint {
  threshold: number;
  fpr: number;
  tpr: number;
  precision: number;
  recall: number;
  f1: number;
  falsePositives: number;
  falseNegatives: number;
}

export function getThresholdAnalysis(): ThresholdPoint[] {
  const points: ThresholdPoint[] = [];
  for (let t = 0; t <= 100; t += 2) {
    const threshold = t / 100;
    // Simulate realistic metrics across thresholds
    const tpr = 1 / (1 + Math.exp(8 * (threshold - 0.55)));
    const fpr = 1 / (1 + Math.exp(10 * (threshold - 0.4)));
    const precision = tpr / (tpr + fpr + 0.01);
    const recall = tpr;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    const total = 1000;
    points.push({
      threshold: Math.round(threshold * 100) / 100,
      fpr: Math.round(fpr * 1000) / 1000,
      tpr: Math.round(tpr * 1000) / 1000,
      precision: Math.round(precision * 1000) / 1000,
      recall: Math.round(recall * 1000) / 1000,
      f1: Math.round(f1 * 1000) / 1000,
      falsePositives: Math.round(fpr * total * 0.5),
      falseNegatives: Math.round((1 - tpr) * total * 0.5),
    });
  }
  return points;
}

export function getOptimalThreshold(): { threshold: number; f1: number } {
  const points = getThresholdAnalysis();
  let best = points[0];
  for (const p of points) {
    if (p.f1 > best.f1) best = p;
  }
  return { threshold: best.threshold, f1: best.f1 };
}

export interface MisclassifiedSample {
  id: number;
  trueLabel: "Real" | "Fake";
  predictedLabel: "Real" | "Fake";
  confidence: number;
  reason: string;
  suggestion: string;
}

export function getMisclassifiedSamples(): MisclassifiedSample[] {
  return [
    { id: 1, trueLabel: "Real", predictedLabel: "Fake", confidence: 72.3, reason: "High compression artifacts mimicking deepfake patterns", suggestion: "Add more compressed real images to training set" },
    { id: 2, trueLabel: "Real", predictedLabel: "Fake", confidence: 65.8, reason: "Heavy makeup altering skin texture features", suggestion: "Include diverse makeup styles in real image augmentation" },
    { id: 3, trueLabel: "Real", predictedLabel: "Fake", confidence: 81.2, reason: "Unusual lighting creating unnatural skin tones", suggestion: "Apply brightness/contrast augmentation to real samples" },
    { id: 4, trueLabel: "Real", predictedLabel: "Fake", confidence: 58.4, reason: "Low resolution causing blurry facial boundaries", suggestion: "Train with multi-resolution real face images" },
    { id: 5, trueLabel: "Real", predictedLabel: "Fake", confidence: 69.1, reason: "Instagram filter modifying color distribution", suggestion: "Add social-media filtered real images to dataset" },
    { id: 6, trueLabel: "Fake", predictedLabel: "Real", confidence: 54.2, reason: "High-quality GAN output with minimal artifacts", suggestion: "Include latest GAN outputs in fake training data" },
    { id: 7, trueLabel: "Real", predictedLabel: "Fake", confidence: 63.7, reason: "Facial occlusion confusing boundary detection", suggestion: "Augment with partially occluded real faces" },
    { id: 8, trueLabel: "Real", predictedLabel: "Fake", confidence: 77.5, reason: "Professional retouching smoothing skin texture", suggestion: "Include retouched portrait photography in real set" },
  ];
}

export interface CalibrationBin {
  binMidpoint: number;
  avgConfidence: number;
  accuracy: number;
  count: number;
}

export function getCalibrationData(temperature: number = 1.0): CalibrationBin[] {
  const bins: CalibrationBin[] = [];
  for (let i = 0; i < 10; i++) {
    const mid = (i + 0.5) / 10;
    // Simulate overconfident model — accuracy < confidence at high bins
    const rawAccuracy = mid < 0.5
      ? mid + 0.05 + Math.random() * 0.03
      : mid - (mid - 0.5) * 0.25 + Math.random() * 0.03;
    // Temperature scaling shifts confidence toward center
    const scaledConfidence = 1 / (1 + Math.exp(-Math.log(mid / (1 - mid + 0.001)) / temperature));
    bins.push({
      binMidpoint: Math.round(mid * 100) / 100,
      avgConfidence: Math.round(scaledConfidence * 1000) / 1000,
      accuracy: Math.round(Math.min(1, Math.max(0, rawAccuracy)) * 1000) / 1000,
      count: Math.round(40 + Math.random() * 60),
    });
  }
  return bins;
}

export interface EnsembleResult {
  model: string;
  accuracy: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  f1: number;
}

export function getEnsembleComparison(): EnsembleResult[] {
  return [
    { model: "EfficientNetB4", accuracy: 96.4, falsePositiveRate: 4.2, falseNegativeRate: 3.1, f1: 96.4 },
    { model: "Xception", accuracy: 95.1, falsePositiveRate: 5.8, falseNegativeRate: 3.5, f1: 94.9 },
    { model: "Ensemble (Avg)", accuracy: 97.8, falsePositiveRate: 2.1, falseNegativeRate: 2.8, f1: 97.6 },
    { model: "Ensemble + Thresh", accuracy: 98.1, falsePositiveRate: 1.3, falseNegativeRate: 3.2, f1: 97.9 },
  ];
}

export function getDiagnosisData() {
  return [
    { issue: "Overfitting", detected: true, severity: "high" as const, metric: "Train-Val gap: 4.2%", fix: "Add dropout (0.5), data augmentation, early stopping" },
    { issue: "Class Imbalance", detected: true, severity: "medium" as const, metric: "Real:Fake = 1:1.3", fix: "Apply class weights or SMOTE oversampling" },
    { issue: "Poor Threshold", detected: true, severity: "high" as const, metric: "Default 0.5 → Optimal 0.62", fix: "Use ROC-optimized threshold via Youden's J" },
    { issue: "Dataset Bias", detected: true, severity: "medium" as const, metric: "85% studio lighting in real set", fix: "Diversify real images: outdoor, low-light, filters" },
    { issue: "Overconfident Predictions", detected: true, severity: "high" as const, metric: "ECE: 0.12 (uncalibrated)", fix: "Apply temperature scaling (T=1.8)" },
    { issue: "Compression Sensitivity", detected: false, severity: "low" as const, metric: "JPEG quality robust above Q40", fix: "Add Gaussian noise augmentation" },
  ];
}
