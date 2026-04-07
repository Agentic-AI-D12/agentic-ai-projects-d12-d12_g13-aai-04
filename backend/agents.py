"""
Multi-Agent Education System
Researcher Agent + Writer Agent with LangChain & Groq
"""

from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from typing import TypedDict
import json


class EducationState(TypedDict):
    topic: str
    depth: str
    raw_research: str
    structured_content: str
    final_output: str
    handoff_log: list


class BaseAgent:
    def __init__(self, llm: ChatGroq, name: str):
        self.llm = llm
        self.name = name

    def _log(self, msg: str) -> str:
        entry = f"[{self.name}] {msg}"
        print(entry)
        return entry


class ResearcherAgent(BaseAgent):
    SYSTEM_PROMPT = """You are an expert educational researcher. Your job is to:
1. Find comprehensive study resources and information on any topic
2. Identify key concepts, sub-topics, and learning pathways
3. Suggest books, courses, websites, papers, and tools
4. Organize findings by difficulty level and category
5. Note prerequisites and related topics

Always respond in structured JSON with keys:
- overview: brief topic summary
- key_concepts: list of core concepts to learn
- learning_path: ordered steps from basics to advanced
- resources: dict with keys books, online_courses, websites, youtube_channels, tools
- prerequisites: list of prior knowledge needed
- related_topics: list of related fields
- estimated_time: rough learning time estimate
- pro_tips: expert advice for learning this topic

Return ONLY valid JSON, no markdown fences."""

    def research(self, state: EducationState) -> EducationState:
        log = self._log(f"Starting research on: '{state['topic']}' (Level: {state['depth']})")
        state["handoff_log"].append(log)

        prompt = f"""Research the topic: **{state['topic']}**
Target audience level: {state['depth']}
Provide thorough study resources and a complete learning guide.
Return ONLY valid JSON, no markdown fences."""

        messages = [
            SystemMessage(content=self.SYSTEM_PROMPT),
            HumanMessage(content=prompt)
        ]

        response = self.llm.invoke(messages)
        raw = response.content.strip()

        try:
            parsed = json.loads(raw)
            state["raw_research"] = json.dumps(parsed, indent=2)
        except json.JSONDecodeError:
            state["raw_research"] = raw

        log = self._log("Research complete. Handing off to Writer Agent.")
        state["handoff_log"].append(log)
        return state


class WriterAgent(BaseAgent):
    SYSTEM_PROMPT = """You are an expert educational content writer and curriculum designer. Your job is to:
1. Transform raw research data into beautifully structured study guides
2. Create clear, engaging, and pedagogically sound content
3. Use markdown formatting with headers, tables, emojis, and callouts
4. Adapt content complexity to the target audience level
5. Add motivational elements and practical study tips

Format your output as a complete, professional study guide in Markdown with:
- An engaging title and introduction
- Visual hierarchy with headers (##, ###)
- Tables for comparing resources
- Emoji icons for visual appeal
- Blockquotes for tips and callouts
- A structured phase-by-phase study plan
- Clear action items and milestones"""

    def write(self, state: EducationState) -> EducationState:
        log = self._log("Received research. Synthesizing into study guide...")
        state["handoff_log"].append(log)

        prompt = f"""Using the following research data, create a comprehensive, 
beautifully formatted study guide for: **{state['topic']}**
Audience level: **{state['depth']}**

Raw Research Data:
{state['raw_research']}

Create a complete, professional Markdown study guide. Make it engaging, thorough, and actionable."""

        messages = [
            SystemMessage(content=self.SYSTEM_PROMPT),
            HumanMessage(content=prompt)
        ]

        response = self.llm.invoke(messages)
        state["structured_content"] = response.content.strip()

        log = self._log("Study guide written. Performing final quality check...")
        state["handoff_log"].append(log)
        return state


class EducationOrchestrator:
    def __init__(self, groq_api_key: str, model: str = "llama-3.3-70b-versatile"):
        self.llm = ChatGroq(
            api_key=groq_api_key,
            model_name=model,
            temperature=0.7,
            max_tokens=4096,
        )
        self.researcher = ResearcherAgent(self.llm, "ResearcherAgent")
        self.writer = WriterAgent(self.llm, "WriterAgent")

    def run(self, topic: str, depth: str = "intermediate") -> EducationState:
        state: EducationState = {
            "topic": topic,
            "depth": depth,
            "raw_research": "",
            "structured_content": "",
            "final_output": "",
            "handoff_log": ["[Orchestrator] Pipeline initialized."],
        }
        state = self.researcher.research(state)
        state = self.writer.write(state)
        state["final_output"] = state["structured_content"]
        state["handoff_log"].append("[Orchestrator] Pipeline complete.")
        return state