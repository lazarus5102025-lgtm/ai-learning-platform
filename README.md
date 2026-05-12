# 🎓 AI-Powered Enterprise Knowledge & Learning Platform

A full-stack, production-ready learning management system with AI tutoring, quiz generation, semantic search (RAG), real-time chat, and enterprise analytics.

---

## 🏗️ Architecture Overview

```
ai-learning-platform/
├── frontend/          # React.js + Tailwind CSS (deploy: Vercel)
├── backend/           # Node.js + Express.js (deploy: Render)
└── ai-service/        # Python FastAPI  (deploy: Railway/Render)
```

---

## 🚀 Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | React.js, React Router, Tailwind CSS     |
| Backend     | Node.js, Express.js, JWT                 |
| AI Service  | Python, FastAPI, LangChain               |
| Database    | MongoDB Atlas                            |
| AI APIs     | OpenAI API / Gemini API                  |
| Real-time   | Socket.io                                |
| Deployment  | Vercel, Render, Railway                  |

---

## 📦 Modules

- **Authentication** — Register, Login, JWT, Role-based access (Admin / Instructor / Student)
- **Course Management** — Create courses, upload lessons, enrollment, progress tracking
- **AI Tutor** — Context-aware chatbot with course-specific doubt solving
- **AI Quiz Generation** — MCQ generation from PDFs/notes, auto evaluation
- **Analytics** — Student performance, course analytics dashboard
- **Real-time Chat** — Student-instructor messaging, group discussions
- **RAG Search** — Document upload, semantic search, AI-generated answers
- **Admin Panel** — User management, analytics monitoring, course oversight

---

## ⚙️ Getting Started

### Prerequisites
- Node.js >= 18
- Python >= 3.10
- MongoDB Atlas account
- OpenAI or Gemini API key

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/ai-learning-platform.git
cd ai-learning-platform
```

### 2. Setup Environment Variables

Copy `.env.example` files in each service:
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env
```

Fill in your secrets (MongoDB URI, JWT Secret, API keys).

### 3. Install & Run Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Install & Run Backend
```bash
cd backend
npm install
npm run dev
```

### 5. Install & Run AI Service
```bash
cd ai-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 🌐 Deployment

| Service    | Platform       |
|------------|----------------|
| Frontend   | Vercel          |
| Backend    | Render          |
| AI Service | Railway / Render|
| Database   | MongoDB Atlas   |

---

## 🔮 Future Enhancements

- [ ] Voice AI Tutor
- [ ] AI Notes Summarizer
- [ ] Recommendation System
- [ ] Multi-language Support
- [ ] Docker Deployment

---

## 📄 License

MIT
