import { DetectedObject } from "@/types";

const COLORS: Record<string, string> = {
  person: "#FF4D4D",
  car: "#4D79FF",
  dog: "#FF9F40",
  cat: "#FF66B2",
  bird: "#66FFB2",
  bicycle: "#B266FF",
  motorcycle: "#FFD700",
  bus: "#00CED1",
  train: "#9370DB",
  truck: "#20B2AA",
  boat: "#1E90FF",
  "traffic light": "#FF4500",
  "fire hydrant": "#DC143C",
  "stop sign": "#8B0000",
  bench: "#A0522D",
};

function getColor(className: string): string {
  return COLORS[className] ?? "#00FFFF";
}

export function renderPredictions(
  predictions: DetectedObject[],
  ctx: CanvasRenderingContext2D,
  options: {
    showLabels?: boolean;
    showBoundingBoxes?: boolean;
    mirror?: boolean;
  } = {}
): { hasPerson: boolean; objects: string[] } {
  const { showLabels = true, showBoundingBoxes = true, mirror = false } = options;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  let hasPerson = false;
  const objects: string[] = [];

  if (!showBoundingBoxes) return { hasPerson, objects };

  const font = "600 14px Inter, system-ui, sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const color = getColor(prediction.class);
    const label = `${prediction.class} ${Math.round(prediction.score * 100)}%`;

    if (prediction.class === "person") hasPerson = true;
    objects.push(prediction.class);

    const drawX = mirror ? ctx.canvas.width - x - width : x;

    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    // Bounding box
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(drawX, y, width, height);

    ctx.shadowBlur = 0;

    // Fill
    ctx.fillStyle = `${color}20`;
    ctx.fillRect(drawX, y, width, height);

    if (showLabels) {
      const textWidth = ctx.measureText(label).width;
      const textHeight = 18;
      const padding = 6;

      // Label background
      ctx.fillStyle = color;
      ctx.fillRect(drawX, y - textHeight - padding, textWidth + padding * 2, textHeight + padding);

      // Label text
      ctx.fillStyle = "#000000";
      ctx.fillText(label, drawX + padding, y - textHeight - padding + 2);
    }
  });

  return { hasPerson, objects };
}

