# 🎓 Multi-Agent Education System

A **multi-agent AI system** built with **LangChain + Groq** featuring a **Researcher Agent** and **Writer Agent** that collaborate to generate comprehensive study guides on any topic.

---

## 🏗️ Architecture

```
User Input (Topic + Level)
        │
        ▼
┌──────────────────────────────────────────┐
│           ORCHESTRATOR                   │
│   (State Manager + Handoff Controller)   │
└──────────┬───────────────────────────────┘
           │
     ┌─────▼──────┐     Handoff     ┌──────────────┐
     │  RESEARCHER │ ─────────────► │    WRITER    │
     │    AGENT   │    (State +     │    AGENT     │
     │            │     JSON)       │              │
     └────────────┘                 └──────────────┘
     Finds resources,              Synthesizes &
     key concepts,                 formats into a
     learning paths                study guide (MD)
```

### Agents

| Agent | Role | Output |
|-------|------|--------|
| 🔍 **Researcher Agent** | Sources study materials, key concepts, resources | Structured JSON |
| ✍️ **Writer Agent** | Synthesizes research into formatted study guide | Markdown document |
| 🎛️ **Orchestrator** | Manages state, handoffs, workflow | Final study guide |

---

## 🚀 Setup

### 1. Install dependencies

```bash
pip install -r requirements.txt
```

### 2. Get a Groq API Key

- Visit [console.groq.com](https://console.groq.com)
- Create a free account → Generate API Key
- Key starts with `gsk_...`

---

## 💻 Usage

### Option A: Web UI (Streamlit) — Recommended

```bash
streamlit run app.py
```

Opens at `http://localhost:8501`. Enter your Groq API key in the sidebar.

### Option B: Command Line

```bash
# Interactive mode
python main.py

# With arguments
python main.py --api-key gsk_YOUR_KEY --topic "Machine Learning" --depth intermediate

# Save output to specific file
python main.py --api-key gsk_YOUR_KEY --topic "Python" --depth beginner --output python_guide.md
```

### Option C: Python API

```python
from agents import EducationOrchestrator

orchestrator = EducationOrchestrator(groq_api_key="gsk_YOUR_KEY")
state = orchestrator.run(topic="Deep Learning", depth="intermediate")

print(state["final_output"])    # The complete study guide
print(state["raw_research"])    # Raw JSON from Researcher Agent
print(state["handoff_log"])     # Agent communication log
```

---

## 📁 Project Structure

```
edu_agents/
├── agents.py           # Core: ResearcherAgent, WriterAgent, Orchestrator
├── app.py              # Streamlit Web UI
├── main.py             # CLI runner
├── requirements.txt    # Python dependencies
└── README.md           # This file
```

---

## 🔑 Environment Variable

You can also set your API key as an environment variable:

```bash
export GROQ_API_KEY=gsk_YOUR_KEY
python main.py --topic "Neural Networks"
```

Or create a `.env` file:
```
GROQ_API_KEY=gsk_YOUR_KEY
```

---

## 🤖 Supported Models (Groq)

| Model | Best For |
|-------|----------|
| `llama-3.3-70b-versatile` | Best quality (default) |
| `llama-3.1-8b-instant` | Fastest |
| `mixtral-8x7b-32768` | Long context |
| `gemma2-9b-it` | Balanced |

---

## 📊 State Management

The system uses a `TypedDict` state schema passed between agents:

```python
class EducationState(TypedDict):
    topic: str              # Input topic
    depth: str              # beginner/intermediate/advanced
    raw_research: str       # JSON from Researcher Agent
    structured_content: str # Markdown from Writer Agent
    final_output: str       # Final deliverable
    handoff_log: list[str]  # Inter-agent communication log
```

---

## 📚 Example Topics

- Machine Learning
- Web Development with React
- Quantum Computing
- Data Structures & Algorithms
- Blockchain Technology
- Natural Language Processing
- Cloud Architecture (AWS/GCP)
- Cybersecurity Fundamentals