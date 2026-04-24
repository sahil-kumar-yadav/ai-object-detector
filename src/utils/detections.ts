import { throttle } from "lodash";

export const playAlertSound = throttle(
  (src: string = "/public_pols-aagyi-pols.mp3") => {
    const audio = new Audio(src);
    audio.volume = 0.4;
    audio.play().catch(() => {
      // Autoplay policy may block — silently ignore
    });
  },
  2000
);

export function takeScreenshot(
  canvas: HTMLCanvasElement,
  filename: string = "detection-capture.png"
) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

