import { useRef, useEffect } from "react";

interface GradCAMProps {
  heatmapData: number[][];
  imageUrl: string;
  className?: string;
}

export function GradCAMOverlay({ heatmapData, imageUrl, className = "" }: GradCAMProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = 280;
      const h = 280;
      canvas.width = w;
      canvas.height = h;

      ctx.drawImage(img, 0, 0, w, h);

      const rows = heatmapData.length;
      const cols = heatmapData[0].length;
      const cellW = w / cols;
      const cellH = h / rows;

      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const val = heatmapData[i][j];
          const r = Math.round(255 * Math.min(1, val * 2));
          const g = Math.round(255 * Math.max(0, 1 - val * 2));
          const b = 0;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${val * 0.6})`;
          ctx.fillRect(j * cellW, i * cellH, cellW + 1, cellH + 1);
        }
      }
    };
    img.src = imageUrl;
  }, [heatmapData, imageUrl]);

  return (
    <canvas
      ref={canvasRef}
      className={`rounded-xl ${className}`}
      style={{ width: 280, height: 280 }}
    />
  );
}
