# AI Object Detector

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-4.17-orange?logo=tensorflow)](https://www.tensorflow.org/js)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A production-grade, real-time object detection web application that runs entirely in the browser using **TensorFlow.js COCO-SSD**. Built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

No backend required — all ML inference happens locally on the client GPU via WebGL.

![Demo Screenshot](./public/screenshot.png)

## Features

- **Real-Time Detection** — 30+ FPS object detection directly in the browser using your webcam
- **GPU Acceleration** — Automatic WebGL backend with CPU fallback
- **Interactive Controls** — Toggle mirror, labels, bounding boxes, audio alerts, and fun mode
- **Confidence Threshold** — Adjustable slider to filter detections by confidence score
- **Screenshot Capture** — Save frames with detection overlays as PNG
- **Live Stats Dashboard** — FPS counter, inference latency, object counts, and unique class tracking
- **Responsive Design** — Optimized for desktop, tablet, and mobile
- **Keyboard Shortcuts** — Space to capture, M to toggle audio
- **Dark Glassmorphism UI** — Modern aesthetic with backdrop blur and neon accents

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Icons | [Lucide React](https://lucide.dev/) |
| ML Model | [TensorFlow.js](https://www.tensorflow.org/js) + [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) |
| Webcam | [react-webcam](https://github.com/mozmorris/react-webcam) |
| Utilities | [Lodash](https://lodash.com/) (throttle) |

## Architecture

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles & theme
├── components/
│   ├── ObjectDetection.tsx  # Main orchestrator component
│   ├── LoadingScreen.tsx    # Animated loading state
│   ├── ControlBar.tsx       # Settings & controls toolbar
│   ├── StatsPanel.tsx       # FPS / latency / object stats
│   └── DetectionCanvas.tsx  # Canvas overlay renderer
├── hooks/
│   ├── useTFModel.ts        # TensorFlow model loading
│   ├── useObjectDetection.ts # Detection loop with rAF
│   └── useWebcam.ts         # Webcam permission & stream
├── utils/
│   ├── render-predictions.ts # Canvas drawing engine
│   └── detections.ts        # Audio & screenshot helpers
├── types/
│   └── index.ts             # Shared TypeScript interfaces
└── lib/
    └── utils.ts             # cn() helper (clsx + tailwind-merge)
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-object-detector.git
cd ai-object-detector

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Controls & Shortcuts

| Control | Action |
|---------|--------|
| **Mirror** | Flip the video horizontally |
| **Labels** | Show/hide class name labels on bounding boxes |
| **Boxes** | Show/hide bounding boxes |
| **Audio** | Enable/disable audio alerts when a person is detected |
| **Fun** | Toggle between professional alert and meme sound |
| **Capture** | Download a screenshot of the current frame |
| **Conf Slider** | Adjust minimum confidence threshold (10% — 90%) |

## Performance

- **Inference Time**: ~15-40ms per frame (depending on device)
- **Target FPS**: 30+ on modern laptops with WebGL acceleration
- **Model Size**: ~90MB (downloaded once on first load)

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full (WebGL 2.0 recommended) |
| Firefox | ✅ Full |
| Safari | ✅ Full (macOS 12+) |
| Edge | ✅ Full |

## Roadmap

- [ ] Image upload mode (detect on static images)
- [ ] Record video with detection overlay
- [ ] Export detection logs as JSON/CSV
- [ ] Support for additional TF.js models (MobileNet, PoseNet)
- [ ] PWA support for offline usage

## Contributing

Contributions are welcome! Please open an issue or pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with curiosity and caffeine.

