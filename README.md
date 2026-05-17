# ◈ Generative Brand Studio

An advanced AI Creative Pipeline designed to streamline the creation of high-quality brand visuals and synchronized voiceovers. Built for creators, designers, and brand managers, Genai Studio leverages state-of-the-art generative models to transform simple text prompts into professional-grade marketing assets.

---

## 📺 Demo

### Visual Generation
The core of Genai Studio is its ability to generate high-fidelity brand imagery.
![Lone Figure Standing](./media/lone-figure-standing.jpg)

### Voiceover Demo
Experience the seamless integration of AI voice synthesis. This demo showcases a synchronized voiceover generated directly from the visual context.
<video src="./media/elevenlabs-voiceover.mp4" width="600"></video>

### Brand Voice Showcase
This demo highlights the clarity and tonal range of the neural voices available in Genai Studio.
<video src="./media/elevenlabs-3.mp4" width="600"></video>

### More Examples
Explore further creative outputs and portfolio samples.
<video src="./media/elevenlabs-portfolio-1.mp4" width="600"></video>

---

## 🚀 Overview

Genai Studio is a web-based application that integrates the power of **fal.ai** for image generation and **ElevenLabs** for neural voice synthesis. It allows users to:
1.  **Generate Visuals**: Use models like FLUX Schnell, FLUX Dev, Aura Flow, and SDXL to create cinematic, high-resolution brand images.
2.  **Add Voiceovers**: Seamlessly overlay high-quality AI-generated voices onto the visuals with custom captions.
3.  **Rapid Prototyping**: Use built-in presets for Luxury Brands, Tech Startups, Wellness, and Fashion to jumpstart the creative process.

---

## ✨ Features

- **Multi-Model Support**: Choose from various image generation models optimized for speed or creative quality.
- **Dynamic Pipeline**: A live visualization of the data flow from prompt to final output.
- **Voice Synthesis**: Integration with ElevenLabs for professional-grade voiceovers with multiple voice profiles (Sarah, Liam, Lily, Daniel).
- **Interactive UI**: Modern, responsive interface with real-time feedback and state management.
- **API Key Management**: Securely store your fal.ai and ElevenLabs keys locally.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling**: Vanilla CSS (Custom modern aesthetic)
- **AI Infrastructure**: [fal.ai](https://fal.ai/) (Image Generation SDK)
- **Audio**: [ElevenLabs API](https://elevenlabs.io/) (Text-to-Speech)
- **Deployment**: Optimized for [Railway](https://railway.app/) and [Vercel](https://vercel.com/)

---

## 🛠️ Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- A [fal.ai](https://fal.ai/dashboard/keys) API Key
- An [ElevenLabs](https://elevenlabs.io) API Key (optional, for voiceovers)

### Steps

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/ShivaShanmukh/Genai_Studio.git
    cd Genai_Studio
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Variables (Optional)**
    Create a `.env` file in the root directory:
    ```env
    VITE_FAL_KEY=your_fal_ai_key_here
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```

---

## ⚙️ How it Works

The application follows a linear creative pipeline:

1.  **Input**: User enters a visual prompt and an optional voiceover caption.
2.  **Image Generation**: The visual prompt is sent to `fal.ai` using the selected model.
3.  **Voice Synthesis**: If an ElevenLabs key and caption are provided, the text is sent to ElevenLabs to generate an MP3 stream.
4.  **Assembly**: The React UI renders the generated image and provides an audio player for the voiceover.

---

## 👤 Author

**Siva. I**
- GitHub: [@ShivaShanmukh](https://github.com/ShivaShanmukh)

---

## 📄 License

This project is for demonstration purposes. Refer to `fal.ai` and `ElevenLabs` for their respective usage terms.
