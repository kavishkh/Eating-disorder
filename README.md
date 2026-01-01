# AI Recovery Companion 🌿

A supportive, non-judgmental AI assistant designed to help users navigate eating disorder recovery, reduce urges, and manage difficult emotions in real-time.

## 🧠 Intelligence Architecture

### Core Logic: Validate & Guide
The AI follows a strict clinical support framework:
1.  **Detection**: Sentiment analysis identifies emotion (Anxiety, Guilt, Sadness, Binge Urges) and intensity (Low, Medium, High).
2.  **Validation**: Every response begins with empathetic validation (e.g., "I hear how heavy this feels. You're not alone.").
3.  **Guidance**: Provides context-aware actions, such as guided breathing for anxiety or distraction tasks for urges.
4.  **Memory**: Tracks `lastReply` and `lastFollowUp` to avoid repetitive loops and ensure a natural conversation flow.

### Safety First (Crisis Mode)
- **Keyword Detection**: Monitored for high-risk phrases.
- **Crisis mode lock**: When a crisis is detected, the AI locks into a safety state, prioritizing international/local helplines.
- **Resolution Path**: The AI remains in safety mode until the user confirms they have reached out to a trusted person or are safe.

## 🎧 Multimodal Support

- **Calming Audio**: Intelligent selection of breathing exercises, nature sounds, or ambient meditation tracks based on emotion.
- **Vetted Videos**: curated library of recovery-focused content to prevent trigger exposure.
- **Reflective Journaling**: Integrated writing prompts for grounding.

## 🛠️ Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion (Aesthetics)
- **Backend**: Node.js, Express, MongoDB
- **Security**: JWT Authentication, Bcrypt Password Hashing
- **Aesthetics**: Premium Glassmorphism UI with healing color palettes (HSLA).

## 🚀 Setup & Testing

1.  **Clone the repository**
2.  **Environment Variables**: Create a `.env` in `server/` with `JWT_SECRET` and `MONGODB_URI`.
3.  **Install dependencies**: `npm install` (Root, Frontend, Backend).
4.  **Run Locally**: `npm run dev` (Starts concurrently).

---
*Disclaimer: This tool is a supportive companion and not a replacement for professional medical treatment.*
