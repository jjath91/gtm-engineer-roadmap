import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

const PHASES = [
  {
    id: 1,
    title: "LLM Fundamentals for Builders",
    subtitle: "Just Enough Theory to Ship",
    time: "1–2 weeks",
    icon: "◇",
    color: "#3FA9A3",
    intro: "Before you build anything, you need a working mental model of what an LLM actually is from a builder's perspective — not from a researcher's. This phase is the bare minimum theory required so you stop treating the model as magic and start treating it as a probabilistic function with predictable failure modes. Skip the math derivations, learn the levers you can actually pull, and move on quickly.",
    sections: [
      {
        name: "What An LLM Actually Is",
        items: [
          "An LLM is a function: tokens in, probability distribution over next token out. Sampling from that distribution repeatedly is how text gets generated. That's it. Everything else is wrapping",
          "Tokens, not words. Learn what BPE tokenization does and why 'antidisestablishmentarianism' might be 1 token in one model and 8 in another. Use the OpenAI tokenizer playground to develop intuition",
          "Context window: the total tokens the model can attend to in a single call (input + output). GPT-4o has 128k, Claude has 200k, Gemini has 1M+. Bigger isn't always better — attention degrades over distance",
          "Base models vs instruction-tuned vs RLHF-tuned. You will only ever use the third in production. Knowing what each step does explains why models are 'helpful' instead of just 'continuing your text'",
          "The model has no memory between calls. Every API call is stateless. 'Memory' in any chatbot is just appending old messages to the new prompt"
        ]
      },
      {
        name: "The API Surface",
        items: [
          "OpenAI Chat Completions API as the canonical interface. Learn the message roles (system, user, assistant) and how multi-turn conversation is just an array of messages",
          "Temperature, top_p, top_k, frequency_penalty, presence_penalty — what each lever actually does. Default to temperature 0 for anything that needs reliability, 0.7+ for creative",
          "Max_tokens controls output length, NOT cost. Cost is input + output tokens billed separately at different rates",
          "Streaming responses for UX. Server-sent events (SSE) are how 'typing' UIs work. Learn this early because it changes how you design product flows",
          "Stop sequences and how to use them to terminate generation cleanly when building structured outputs"
        ]
      },
      {
        name: "The Big Three Providers",
        items: [
          "OpenAI: GPT-4o, GPT-4o-mini, o1, o3. Most mature ecosystem, best tool calling, best structured output enforcement. Start here",
          "Anthropic Claude: Sonnet 4.5, Opus 4.6, Haiku 4.5. Often best at long-context reasoning, instruction following, and coding. The Messages API differs slightly from OpenAI's — learn both",
          "Google Gemini: 1.5 Pro, 2.0 Flash, 2.5 Pro. Massive context windows, strong on multi-modal, native Google integrations. Important for enterprise deals",
          "Open-weights: Llama 3.x, Mistral, Qwen. Useful when you need data residency, on-prem, or fine-tuning. Hosted via Together, Fireworks, Groq, or self-hosted",
          "Build a habit of testing the same prompt across at least two providers. Vendor diversity is a real production risk consideration"
        ]
      },
      {
        name: "Cost & Latency Math",
        items: [
          "Memorize the order of magnitude: GPT-4o-mini is roughly $0.15/1M input tokens and $0.60/1M output. GPT-4o is ~10x that. Claude Opus is ~30x that. Numbers shift, ratios stay roughly stable",
          "Latency: time to first token (TTFT) matters for chat UX, total time matters for batch jobs. Bigger models are slower. Streaming hides latency from users",
          "A typical RAG call sends 2–10k input tokens and gets 200–1000 output tokens. Practice estimating cost per call before you ship anything",
          "Caching: prompt caching (Anthropic, OpenAI, Gemini all support some form) can drop input cost by 50–90% on repeated prefixes. Architect prompts so the cacheable prefix is at the start",
          "Batch APIs: OpenAI and Anthropic both offer ~50% discount for non-realtime workloads with 24-hour SLA. Use them aggressively for offline evals and backfill"
        ]
      },
      {
        name: "Set Up Your Builder Environment",
        items: [
          "Get API keys for OpenAI, Anthropic, and one hosted open-weights provider (Together or Fireworks). $20 of credits each is enough to learn",
          "Use Python with the official SDKs: openai, anthropic, google-generativeai. Don't reach for LangChain on day one — build with raw SDKs first to understand what's actually happening",
          "Use a notebook environment (Jupyter, Cursor, or Claude Code's REPL) for fast iteration. The feedback loop matters more than the framework",
          "Set up dotenv for keys. Never commit a key. Set up rotation reminders",
          "Keep a 'prompts.md' scratchpad from day one. Every interesting prompt you write goes in it. This becomes your personal eval set later"
        ]
      }
    ],
    code: `# Bare-bones first call to each of the big three providers
import os
from openai import OpenAI
from anthropic import Anthropic

oai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
ant = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

prompt = "In one sentence, explain what an LLM token is."

# OpenAI
r = oai.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": prompt}],
    temperature=0
)
print("OpenAI:", r.choices[0].message.content)

# Anthropic
r = ant.messages.create(
    model="claude-haiku-4-5-20251001",
    max_tokens=200,
    messages=[{"role": "user", "content": prompt}]
)
print("Claude:", r.content[0].text)`,
    resources: [
      { name: "OpenAI Tokenizer Playground", url: "https://platform.openai.com/tokenizer", note: "Build token intuition" },
      { name: "Anthropic API Docs", url: "https://docs.anthropic.com/", note: "Best-written API docs in the space" },
      { name: "Simon Willison's Blog", url: "https://simonwillison.net/", note: "The essential ongoing pulse on practical LLM use" },
      { name: "Karpathy: Intro to LLMs (1hr video)", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", note: "The best 1-hour mental model" }
    ],
    deeper: "If you want a slightly deeper but still practitioner-focused view of how the model works under the hood, watch Karpathy's 'Let's build GPT from scratch' tutorial. You don't need to understand backprop to ship — but understanding why attention exists explains 90% of the model's failure modes (long-context degradation, lost-in-the-middle, prompt injection susceptibility). One hour invested here pays for itself the first time a production prompt mysteriously breaks."
  },
  {
    id: 2,
    title: "Prompt Engineering as Engineering",
    subtitle: "Stop Vibing, Start Testing",
    time: "1–2 weeks",
    icon: "◈",
    color: "#3FA9A3",
    intro: "'Prompt engineering' is the most maligned term in AI because most people doing it are guessing. The skill you actually need is treating prompts as code: versioned, tested against fixed inputs, with measurable success criteria. This phase is about replacing the 'tweak it until it looks better' loop with something rigorous. The mindset shift here is the single biggest separator between hobbyist and shippable.",
    sections: [
      {
        name: "Anatomy of a Production Prompt",
        items: [
          "System prompt vs user prompt: system sets persona, constraints, output format. User message contains the actual task. Don't conflate them",
          "Structure: role → context → task → constraints → output format → examples (if needed). Use markdown headers or XML tags to separate sections — Claude in particular responds well to <task>, <context>, <output_format> tags",
          "Be explicit about what NOT to do. Negative constraints ('do not include any preamble', 'do not make up product names') work better than hoping the model infers",
          "Specify the output format precisely. 'Return JSON' is weak; 'Return JSON matching this schema: {field1: string, field2: int[]}' is strong",
          "Length: longer prompts are not better. The lost-in-the-middle problem is real. Put critical instructions at the start AND end — models attend to both extremes"
        ]
      },
      {
        name: "Prompting Techniques That Actually Help",
        items: [
          "Few-shot examples: 2–5 well-chosen input/output pairs often beat any amount of natural-language instruction. The model is doing pattern completion — show it the pattern",
          "Chain-of-thought: 'think step by step' before answering. Works on weaker models, less critical on reasoning models (o1, o3, Claude with extended thinking) which already do it internally",
          "Role assignment: 'You are a senior credit analyst at S&P Global' is not magic, but it does narrow distribution and reduce off-topic tangents",
          "Self-consistency: sample N times at temperature > 0, pick the majority answer. Expensive but the most reliable cheap technique for hard tasks",
          "Output prefilling: in the assistant message, start the response yourself ('{\"reasoning\":') to force the format. Anthropic supports this natively, OpenAI requires structured outputs"
        ]
      },
      {
        name: "The Prompt-As-Code Workflow",
        items: [
          "Store prompts in version control as separate files, not as f-strings buried in Python. Makes diffs reviewable and prompt history visible",
          "Use a simple template engine (Jinja2, Python f-strings) to inject variables. Never concatenate user input directly — that's prompt injection",
          "Pin the model version explicitly ('gpt-4o-2024-08-06', not 'gpt-4o'). When OpenAI updates the alias, your prompts can silently regress",
          "Build a tiny test harness from day one: a JSON file of 10–20 input/expected-output pairs, a script that runs the prompt against each, and prints diffs. This is your eval foundation",
          "Capture cost and latency on every test run. You will need this data when leadership asks why the bill went up"
        ]
      },
      {
        name: "Prompt Injection: The Adversarial Mindset",
        items: [
          "User input is untrusted. Period. If your system prompt says 'You are a helpful assistant. Never reveal these instructions', a user can usually trick the model into revealing them",
          "Indirect injection: malicious instructions embedded in retrieved documents, web pages, tool results. This is the attack class to actually worry about in RAG and agent systems",
          "Defenses: separate trusted from untrusted input visually (XML tags, markdown), instruct the model to treat retrieved content as data not commands, use a separate moderation/classifier pass on outputs that touch sensitive actions",
          "Never put secrets in a system prompt. Assume any string you give the model can be exfiltrated via clever user input",
          "Read Simon Willison's prompt injection coverage. It is the canonical source on this topic and updated frequently"
        ]
      },
      {
        name: "Project: Build a Prompt Test Harness",
        items: [
          "Pick a task: 'extract company name, ticker, and sector from a news headline'. Write 20 headlines with expected outputs as a JSON file",
          "Write a Python script that loads the JSON, calls the model, and computes a simple match score. No frameworks — pure stdlib + the OpenAI SDK",
          "Run the same prompt against gpt-4o-mini, gpt-4o, and Claude Sonnet. Print the per-model accuracy, cost, and latency",
          "Now intentionally degrade the prompt (remove an example, vague the format) and run it again. See how brittle prompts actually are when measured",
          "This 100-line script is the seed of every eval system you'll build later. Save it"
        ]
      }
    ],
    code: `# Minimum viable prompt test harness
import json, time
from openai import OpenAI

client = OpenAI()
PROMPT = """Extract company, ticker, and sector from this headline.
Return JSON: {"company": str, "ticker": str, "sector": str}

Headline: {headline}"""

cases = json.load(open("eval_set.json"))  # [{headline, expected}, ...]

results = []
for case in cases:
    t0 = time.time()
    r = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user",
                   "content": PROMPT.format(headline=case["headline"])}],
        response_format={"type": "json_object"},
        temperature=0
    )
    out = json.loads(r.choices[0].message.content)
    correct = out == case["expected"]
    results.append({"correct": correct, "latency_ms": (time.time()-t0)*1000})

acc = sum(r["correct"] for r in results) / len(results)
avg_lat = sum(r["latency_ms"] for r in results) / len(results)
print(f"Accuracy: {acc:.0%}  |  Avg latency: {avg_lat:.0f}ms")`,
    resources: [
      { name: "Anthropic Prompt Engineering Guide", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", note: "The best official guide" },
      { name: "OpenAI Prompt Engineering Guide", url: "https://platform.openai.com/docs/guides/prompt-engineering", note: "Provider-canonical patterns" },
      { name: "Simon Willison: Prompt Injection", url: "https://simonwillison.net/series/prompt-injection/", note: "The defining series on the attack class" },
      { name: "Prompt Engineering Guide (Brex)", url: "https://github.com/brexhq/prompt-engineering", note: "Unusually concrete real-world prompting patterns" }
    ],
    deeper: "The reasoning models (o1, o3, Claude with extended thinking, Gemini 2.5 Pro thinking) collapse much of classic prompt engineering. Chain-of-thought tricks become unnecessary, few-shot becomes less impactful, and the cost calculus flips because you're paying for invisible reasoning tokens. If you're targeting reasoning models, the prompting style is closer to 'be clear and trust the model' than 'guide it through every step.' The skill of writing crisp specifications matters more than ever."
  },
  {
    id: 3,
    title: "Structured Outputs & Tool Use",
    subtitle: "Make The Model Talk To Your Code",
    time: "1–2 weeks",
    icon: "⊞",
    color: "#3FA9A3",
    intro: "The bridge between LLMs and real software is structured output. A model that returns prose is a chat toy. A model that reliably returns parseable JSON matching a schema is a building block you can compose. This phase is short but it's the moment LLMs start feeling like programmable infrastructure instead of a magic 8-ball.",
    sections: [
      {
        name: "Structured Outputs: Schemas, Not Prompts",
        items: [
          "OpenAI's structured outputs (response_format with json_schema) constrains the decoder to only emit tokens that satisfy your JSON Schema. Not 'usually returns valid JSON' — guaranteed valid JSON. Use this for any production parsing",
          "Anthropic's tool use system is the equivalent: define a tool with an input schema, and the model emits a tool_use block with arguments matching the schema. Even if you're not calling a real tool, this is how you get reliable structured output from Claude",
          "Pydantic is the lingua franca on the Python side. Define your output as a BaseModel, generate the JSON schema with .model_json_schema(), pass it to the API, parse the response back into the BaseModel. Round-trip safety in 5 lines",
          "Prefer flat schemas over deeply nested ones. Models hallucinate field names less when the structure is shallow. Avoid required fields with no clear value source",
          "Always include a 'reasoning' or 'notes' field in structured outputs even if you don't use it downstream. It gives the model somewhere to put thinking that would otherwise leak into the actual fields"
        ]
      },
      {
        name: "Tool Use: Letting the Model Call Functions",
        items: [
          "The pattern: you define functions with name, description, and input schema. The model decides when to call which function and emits the call. Your code executes it and returns the result. The model continues with the result in context",
          "Tool descriptions are prompt engineering. The model decides whether to call your tool based primarily on the description string. Spend real effort writing it. Bad description = tool never called or called wrong",
          "Multi-tool: the model picks from N tools and can chain calls. This is the foundation of agents but works perfectly well in non-agentic single-turn settings too",
          "Parallel tool calls: modern models can emit multiple tool calls in one response when they're independent. Implement parallel execution server-side or you waste latency",
          "Forced tool use: most APIs let you force the model to call a specific tool ('tool_choice'). Useful when you want guaranteed structured output via the tool schema route"
        ]
      },
      {
        name: "Common Tool Patterns",
        items: [
          "Database query tool: model writes SQL, you execute against a sandboxed read-only connection, return results. The trick is making the schema small enough to fit in the tool description",
          "Web search tool: thin wrapper around Tavily, Exa, Brave Search, or Bing API. Returns top N results with snippets. The next phase covers RAG which is the better option when you have a known corpus",
          "Calculator tool: trivial but eliminates the entire class of arithmetic hallucinations. Always include a calculator if numbers matter",
          "Code execution tool: sandboxed Python (use a service like E2B or a Docker container). Powerful but a security minefield — never run model-generated code with access to anything sensitive",
          "Internal API wrapper: most enterprise AI products are 'LLM + 5 tools that wrap our existing APIs'. This is probably what you'll build at Kensho"
        ]
      },
      {
        name: "Reliability: When Structured Outputs Aren't Enough",
        items: [
          "Validation layer: always re-parse the output through Pydantic or zod even when using guaranteed-schema APIs. Belt and suspenders. The schema enforcement isn't perfect on edge cases",
          "Retry-with-feedback: if validation fails, append the error message to the conversation and ask the model to fix it. Usually works within 1 retry",
          "Constrained decoding alternatives: for open-weights models, use Outlines, Guidance, or LM Studio's structured generation. Same result, different mechanism",
          "Semantic validation: after schema validation, check the values make sense (numbers in expected ranges, dates not in the future, IDs that exist in your DB). LLMs will produce schema-valid garbage",
          "Logging: log every structured output AND its validation result. You will need this data when debugging the inevitable production drift"
        ]
      },
      {
        name: "Project: A Mini Tool-Using Assistant",
        items: [
          "Build a small CLI assistant that has 3 tools: get_stock_price(ticker), get_company_news(ticker, limit), and calculate(expression)",
          "Mock the data sources — use fake price data and a list of canned news headlines. The point is the orchestration loop, not real APIs",
          "Implement the conversation loop yourself: send messages, get response, if tool_use → execute → append result → re-send, until the model returns a plain text answer",
          "Test queries: 'What's AAPL trading at?', 'Why did MSFT drop today?', 'If AAPL goes up 5%, what's the new price?'. The third should chain a price call and a calculator call",
          "Add a system prompt that instructs the model to always cite which tool it used in its final answer. This is the foundation of trust UX you'll build in Phase 7"
        ]
      }
    ],
    code: `# Tool use loop with the OpenAI API
from openai import OpenAI
client = OpenAI()

tools = [{
    "type": "function",
    "function": {
        "name": "get_stock_price",
        "description": "Get the current price of a stock by ticker symbol.",
        "parameters": {
            "type": "object",
            "properties": {
                "ticker": {"type": "string", "description": "Stock ticker, e.g. AAPL"}
            },
            "required": ["ticker"]
        }
    }
}]

def get_stock_price(ticker):
    # Mock data
    return {"AAPL": 187.32, "MSFT": 412.10, "GOOG": 168.45}.get(ticker, 0.0)

messages = [{"role": "user", "content": "What is AAPL trading at?"}]

while True:
    r = client.chat.completions.create(
        model="gpt-4o-mini", messages=messages, tools=tools
    )
    msg = r.choices[0].message
    messages.append(msg)
    if not msg.tool_calls:
        print(msg.content)
        break
    for tc in msg.tool_calls:
        args = json.loads(tc.function.arguments)
        result = get_stock_price(args["ticker"])
        messages.append({
            "role": "tool",
            "tool_call_id": tc.id,
            "content": str(result)
        })`,
    resources: [
      { name: "OpenAI Structured Outputs", url: "https://platform.openai.com/docs/guides/structured-outputs", note: "The canonical guide" },
      { name: "Anthropic Tool Use Docs", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", note: "Claude's approach, slightly different" },
      { name: "Pydantic Docs", url: "https://docs.pydantic.dev/", note: "The Python type system that pairs with LLM outputs" },
      { name: "Instructor library", url: "https://python.useinstructor.com/", note: "Pydantic-first wrapper that makes structured outputs trivial across providers" }
    ],
    deeper: "The deepest version of this skill is designing your application's data model so that it maps cleanly onto LLM-friendly schemas. Most teams retrofit LLMs onto existing object models and suffer; the teams that win design new schemas with LLM-fitness in mind from the start: flat, well-named, with descriptions that double as field documentation AND prompting hints. Read the field descriptions in the Anthropic Computer Use sample app for an example of how thoughtful schema design encodes all the prompting you don't have to write."
  },
  {
    id: 4,
    title: "Retrieval-Augmented Generation (RAG)",
    subtitle: "Making The Model Read Your Documents",
    time: "3–4 weeks",
    icon: "⊕",
    color: "#3FA9A3",
    intro: "RAG is the most-asked-about and most-poorly-implemented pattern in applied AI. The good news: the basic pipeline is simple. The hard news: making it work well requires understanding chunking, embeddings, hybrid search, reranking, and evaluation as separate disciplines. This is the longest phase in the curriculum because it's where the most teams get stuck and where Kensho's actual competitive advantage lives.",
    sections: [
      {
        name: "The RAG Mental Model",
        items: [
          "RAG = Retrieve relevant documents from your corpus, then Augment the prompt with those documents, then Generate. You're not training the model, you're feeding it context at query time",
          "The naive pipeline: chunk documents → embed each chunk → store in vector DB → at query time embed the query → find top-k nearest chunks → stuff them in the prompt. This works for demos and fails for production",
          "Why RAG instead of fine-tuning: corpus changes constantly, citations matter, you need fresh data, hallucination control. Fine-tuning is for behavior/style/format, RAG is for knowledge",
          "Why RAG instead of huge context windows: cost (10k tokens × every query × every user), latency, attention degradation across long contexts, and the model can't tell you which source it used",
          "The hard parts are NOT the retrieval algorithm. They are: document parsing, chunking strategy, query rewriting, reranking, eval. The vector DB is the easy part"
        ]
      },
      {
        name: "Document Parsing & Chunking",
        items: [
          "PDFs are the enemy. Layout-aware parsing matters: a 2-column research paper or a financial table is destroyed by naive text extraction. Use Unstructured, Docling, LlamaParse, or Anthropic's PDF beta for anything non-trivial",
          "Chunking strategies in order of sophistication: fixed-size (bad), recursive splitter on natural boundaries (decent default), semantic chunking via embeddings (better for prose), structure-aware (best — preserve sections, headers, table integrity)",
          "Chunk size tradeoff: small chunks → precise retrieval but missing context; large chunks → context preserved but irrelevant content floods the prompt. Default to 500–1000 tokens with 10–20% overlap and tune from there",
          "Metadata is everything. Each chunk should carry: source document ID, section heading, page number, document date, document type, any tags. You'll filter on this later",
          "Tables and structured data: do NOT chunk them as prose. Convert to markdown, store the entire table as one chunk, optionally summarize the table separately for the embedding"
        ]
      },
      {
        name: "Embeddings & Vector Stores",
        items: [
          "Embedding models: OpenAI text-embedding-3-large or text-embedding-3-small (cheap, good baseline), Voyage AI's voyage-3 (best general-purpose), Cohere embed-v3, BGE-large for self-hosted. Test on YOUR data, defaults lie",
          "Dimensions: 1024–3072 typical. Higher dimensions ≠ better quality. The Matryoshka trick (truncate high-dim embeddings to lower dim) lets you trade quality for speed cheaply",
          "Vector DBs: Postgres + pgvector for almost everything (it's enough), Qdrant if you need lots of features, Pinecone if you want zero ops, Turbopuffer for serverless+cheap. Don't pick the fancy option unless you have a real reason",
          "Hybrid search is mandatory in production: combine vector similarity (semantic) with BM25 (keyword). Pure vector search misses exact-match queries like ticker symbols, product codes, error messages",
          "Pre-filter on metadata before vector search whenever possible. 'Find policy documents from 2024 about claims processing' should filter to year=2024 AND type=policy AND topic=claims BEFORE running vector search. Massive speed and quality wins"
        ]
      },
      {
        name: "Reranking, Query Rewriting, Reasoning",
        items: [
          "Reranking: retrieve top 50, pass to a smaller cross-encoder model that re-scores them, take top 5. Cohere Rerank, Voyage rerank-2, Jina reranker. This is the single biggest quality win after hybrid search",
          "Query rewriting: user queries are short, ambiguous, full of pronouns. Use a small fast LLM call to expand the query, decompose it into sub-questions, or generate hypothetical answers (HyDE) before retrieving",
          "Multi-hop retrieval: some questions require chaining lookups ('which company that S&P upgraded last quarter has the highest debt-to-equity?'). This is where you start needing agent-like behavior — see Phase 6",
          "Contextual retrieval (Anthropic): prefix each chunk with a 1-sentence summary of where it sits in the document, generated by an LLM at ingest time. Improves retrieval accuracy ~35% in published benchmarks",
          "Late chunking: embed the WHOLE document, then derive chunk embeddings from the document embedding's per-token vectors. Preserves global context. Newer technique, worth knowing"
        ]
      },
      {
        name: "RAG Eval (Where Most Teams Fail)",
        items: [
          "Two things to evaluate separately: (1) did retrieval find the right chunks? and (2) did generation use them correctly? Conflating these makes debugging impossible",
          "Build a labeled retrieval set: 50–200 query/relevant-document pairs. Compute recall@k, MRR, nDCG. These are search metrics — learn them",
          "For generation eval: faithfulness (does the answer only use the retrieved sources), answer correctness (does it match ground truth), citation accuracy (does it cite the right chunk)",
          "RAGAS, Phoenix, and Ragas are the popular eval frameworks. Useful but not magic. Start with a hand-built test set in JSON and graduate to a framework only when needed",
          "The killer eval is: take your retrieval system, run it against your test set, plot recall@10 by query type. You'll find one type of query (often numerical or comparative) where recall is 30%. Fix that one type and overall accuracy jumps"
        ]
      },
      {
        name: "Project: A Document QA System",
        items: [
          "Pick a corpus you actually care about: S&P Global press releases, Kensho documentation, Federal Reserve FOMC minutes — 50-200 documents",
          "Build the pipeline: ingestion script (parse → chunk → embed → store in pgvector), query script (embed query → retrieve → rerank → generate), and a cli/UI to ask questions",
          "Use Postgres + pgvector + the OpenAI embeddings API for the baseline. Aim for the whole thing to be <300 lines of Python",
          "Build a 30-question eval set with expected sources. Measure baseline retrieval recall@5 and answer accuracy. Write the numbers down",
          "Now improve it: add hybrid search, add a reranker, add query rewriting, add metadata filtering. Re-run eval after each change. Keep a chart of which improvements actually moved the metric. This habit is the entire skill"
        ]
      }
    ],
    code: `# Hybrid retrieval with pgvector and a reranker
import psycopg2
from openai import OpenAI
import cohere

client = OpenAI()
co = cohere.Client()
conn = psycopg2.connect("postgresql://...")

def hybrid_search(query, k=50):
    qvec = client.embeddings.create(
        model="text-embedding-3-small", input=query
    ).data[0].embedding

    cur = conn.cursor()
    # Hybrid: vector similarity + BM25-style full-text rank
    cur.execute("""
        SELECT chunk_id, content,
               (1 - (embedding <=> %s::vector)) AS vec_sim,
               ts_rank(tsv, plainto_tsquery('english', %s)) AS text_sim
        FROM chunks
        ORDER BY (1 - (embedding <=> %s::vector)) * 0.7
                + ts_rank(tsv, plainto_tsquery('english', %s)) * 0.3 DESC
        LIMIT %s
    """, (qvec, query, qvec, query, k))
    return cur.fetchall()

def retrieve(query, top_k=5):
    candidates = hybrid_search(query, k=50)
    # Rerank with Cohere
    rerank = co.rerank(
        query=query,
        documents=[c[1] for c in candidates],
        top_n=top_k,
        model="rerank-english-v3.0"
    )
    return [candidates[r.index] for r in rerank.results]`,
    resources: [
      { name: "Anthropic: Contextual Retrieval", url: "https://www.anthropic.com/news/contextual-retrieval", note: "The technique that bumps RAG accuracy ~35%" },
      { name: "Pinecone Learning Center", url: "https://www.pinecone.io/learn/", note: "Excellent free RAG fundamentals" },
      { name: "LlamaIndex Docs", url: "https://docs.llamaindex.ai/", note: "Reference for advanced RAG patterns even if you don't use the framework" },
      { name: "Hamel Husain: Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/", note: "Required reading on RAG eval" }
    ],
    deeper: "The frontier of RAG right now is two things. First: late-interaction models like ColBERT and ColPali (vision variant) — they retrieve by comparing token embeddings instead of document embeddings, which is dramatically more accurate but more expensive. Second: 'agentic RAG', where the model decides retrieval strategy, issues multiple queries, evaluates results, and iterates — this is where retrieval and agents merge, and where GraphRAG (knowledge graph + RAG) lives. Both are beyond what most production systems need, but worth knowing for forward-looking architectural choices."
  },
  {
    id: 5,
    title: "Evals: The First-Class Discipline",
    subtitle: "The Single Skill That Separates Hobbyists From Builders",
    time: "3–4 weeks",
    icon: "⚖",
    color: "#3FA9A3",
    intro: "If there is one skill in this curriculum that will 10x your career inside Kensho, it's evals. Most teams shipping AI features have no rigorous way to know if a change made things better or worse. The teams that do are the ones that ship reliably. Evals are not a side concern — they are the engineering. This phase is long and unsexy by design.",
    sections: [
      {
        name: "Why Evals Are The Core Discipline",
        items: [
          "Without evals, every prompt change is vibes. Every model upgrade is vibes. Every framework swap is vibes. You are flying blind in a system whose behavior changes with every weight update upstream",
          "The asymmetry: a regression in an LLM system can be silent. Unit tests don't catch 'the answer is plausible but wrong.' Only evals do",
          "The cost of NOT having evals: every release becomes a slow-motion gamble, every customer complaint becomes a guessing game, every model version bump is a project",
          "The teams that win with AI at any company you'll work at are the ones that built an eval pipeline first and a feature second. Internalize this",
          "Hamel Husain's 'Your AI product needs evals' is the canonical essay. Read it three times. It is more important than any framework you'll learn"
        ]
      },
      {
        name: "Building An Eval Set (The Hardest Part)",
        items: [
          "Start with 20 examples handwritten by you. Not 200. Not auto-generated. Twenty. Hand-curated examples are 100x more useful than 1000 synthetic ones",
          "Source examples from real user logs once you have them. Errors and edge cases > happy-path queries. Aim for distribution coverage of failure modes, not query frequency",
          "Each example needs: input, expected output (or rubric for graded outputs), category/tag for slicing, ideally a brief reason why it matters. Store as JSON or YAML in version control",
          "Add new examples every time you find a bug in production. Every. Single. Time. The eval set grows from incidents — this is its job",
          "Resist the temptation to make eval sets large for the sake of size. Quality, coverage, and maintenance discipline matter more. 100 well-curated examples will outperform 10,000 noisy ones"
        ]
      },
      {
        name: "Scoring: Exact, Fuzzy, And LLM-As-Judge",
        items: [
          "Exact match: the gold standard when applicable. Use for structured outputs, classifications, extractions. If you can phrase the eval as 'output equals X', do",
          "Substring/regex match: the next-best. 'Did the answer mention the ticker AAPL?' is 95% as informative as full grading and 1000x cheaper",
          "Embedding similarity: cosine similarity between expected and actual. Decent for paraphrase checks, terrible for factual eval. Use sparingly",
          "LLM-as-judge: a different LLM grades the output against a rubric. The most flexible technique and the most dangerous — judge models have biases (length, style, sycophancy)",
          "Always validate LLM-as-judge against human grades on a calibration set first. If human and LLM judge agree on 50 examples, you can probably trust the LLM judge for the rest. If not, fix the rubric"
        ]
      },
      {
        name: "LLM-As-Judge Patterns",
        items: [
          "Use a stronger model than the one you're evaluating. GPT-4o-mini judging GPT-4o output is unreliable. GPT-4o or Claude Opus judging gpt-4o-mini output is fine",
          "Pairwise comparison > absolute scoring. 'Which of these two answers is better?' is more reliable than 'Score this answer 1–5'. The rank-only metric is what you actually care about anyway",
          "Force the judge to explain its reasoning before giving a verdict. This both improves reliability and gives you debugging signal when scores look weird",
          "Specific rubrics, not vague ones. 'Is the answer factually grounded in the provided context?' beats 'Is the answer good?'",
          "Write the rubric AS IF a junior analyst were grading. The rubric is also a spec for what 'good' means — it's a forcing function on you"
        ]
      },
      {
        name: "Online vs Offline Evals",
        items: [
          "Offline evals: run on a fixed set, used for regression testing and CI. Run on every prompt or model change. Should take <5 minutes to give you a thumbs up/down",
          "Online evals: run on real production traffic. Sample N% of requests, run an LLM judge, compute aggregate quality scores per day/week. This catches drift that offline misses",
          "User feedback signals: explicit (thumbs up/down, ratings) and implicit (did the user retry, edit, abandon). These are the most expensive and most valuable signals",
          "A/B testing at the prompt or model level: route 5% of traffic to a new variant, compare quality scores, ship if win, kill if not. This is how mature teams roll out changes",
          "Build the offline pipeline first (CI-blocking) then the online sampling (dashboarding) then user feedback. In that order"
        ]
      },
      {
        name: "Project: Add Evals To Your Phase 4 RAG System",
        items: [
          "Take the document QA system from Phase 4. Build a 30-example eval set with: input query, expected answer, expected source documents, category tag",
          "Implement two scorers: retrieval recall@5 (did the right docs come back) and answer faithfulness via LLM-as-judge with Claude Sonnet as the judge",
          "Wrap the whole pipeline in a script that takes a config (model, prompt version, retrieval params), runs the eval, and outputs a single JSON summary with per-category scores",
          "Now make ONE change to your RAG system (e.g. add reranking) and re-run. Compare. The comparison should print a diff, not just two numbers",
          "Bonus: hook this into a GitHub Action so every PR runs the eval and posts results as a comment. This is what 'evals as CI' looks like in practice"
        ]
      }
    ],
    code: `# A minimal but real eval harness
import json
from openai import OpenAI

client = OpenAI()
JUDGE_MODEL = "gpt-4o"

JUDGE_PROMPT = """You are grading an AI answer for faithfulness to source material.

Question: {question}
Sources used: {sources}
Generated answer: {answer}

Score: PASS if every factual claim in the answer is supported by the sources.
       FAIL if any claim is unsupported or contradicted.

Respond with JSON: {{"score": "PASS"|"FAIL", "reasoning": "..."}}"""

def judge(question, sources, answer):
    r = client.chat.completions.create(
        model=JUDGE_MODEL,
        messages=[{"role": "user", "content": JUDGE_PROMPT.format(
            question=question, sources=sources, answer=answer)}],
        response_format={"type": "json_object"},
        temperature=0
    )
    return json.loads(r.choices[0].message.content)

def run_eval(eval_set, system_under_test):
    results = []
    for case in eval_set:
        answer, sources = system_under_test(case["question"])
        verdict = judge(case["question"], sources, answer)
        results.append({**case, "answer": answer,
                        "score": verdict["score"], "reasoning": verdict["reasoning"]})
    pass_rate = sum(1 for r in results if r["score"] == "PASS") / len(results)
    print(f"Pass rate: {pass_rate:.0%}")
    return results`,
    resources: [
      { name: "Hamel Husain: Your AI Product Needs Evals", url: "https://hamel.dev/blog/posts/evals/", note: "THE essential read on this topic" },
      { name: "Eugene Yan: Patterns for Building LLM Systems", url: "https://eugeneyan.com/writing/llm-patterns/", note: "Comprehensive eval and pattern catalog" },
      { name: "Braintrust", url: "https://www.braintrust.dev/", note: "Best-in-class commercial eval platform — at least try the free tier" },
      { name: "OpenAI Evals (GitHub)", url: "https://github.com/openai/evals", note: "Open-source eval framework with examples" }
    ],
    deeper: "Evals at scale become their own engineering discipline. The hard problems are: keeping eval sets fresh as the product evolves (drift), preventing eval set contamination (don't put production examples in your eval set then train on them — yes, even with prompts), eval-set bias (only easy examples get labeled, hard ones get skipped), and the tension between what's easy to measure and what users actually want. The teams that solve these problems are the ones that hire dedicated 'AI quality engineers' or 'eval engineers' — a job title that didn't exist 18 months ago and is now one of the highest-leverage roles in any AI org. Worth knowing exists."
  },
  {
    id: 6,
    title: "Agents: Planning, Memory, Tools",
    subtitle: "Looping LLMs Until They Get It Right",
    time: "3–4 weeks",
    icon: "↻",
    color: "#3FA9A3",
    intro: "An agent is just an LLM in a loop with tools and a stopping condition. Everything else is detail. The hype around agents has badly distorted the field — most 'agent frameworks' are over-engineered abstractions hiding very simple loops. In this phase you'll build agents from scratch (so you actually understand them) and learn the failure modes that frameworks paper over.",
    sections: [
      {
        name: "What An Agent Actually Is",
        items: [
          "Loop: send messages → model responds with tool call → execute tool → send result back → repeat until model returns final answer or hits max iterations. That's an agent. The whole thing is 30 lines",
          "The 'planning' isn't a separate step. The model does planning implicitly via chain-of-thought in the response before the tool call. You don't need a planner module unless you want explicit observability",
          "Memory is just managing the message list across iterations. Short-term = full conversation in context. Long-term = retrieving past conversation chunks via RAG (which means agents and RAG are the same thing at the limit)",
          "The defining choice in agent design: how much autonomy. A 'workflow' is a fixed graph of LLM calls (high control, low flexibility). An 'agent' is a model freely choosing tools (low control, high flexibility). Pick the simplest thing that works",
          "Anthropic's 'Building Effective Agents' essay is the canonical demystification of this whole topic. Read it before any framework"
        ]
      },
      {
        name: "When To Use An Agent (And When Not)",
        items: [
          "Use an agent when: the task requires variable steps depending on intermediate results, the task needs to react to errors or new info, you can't predict the call sequence in advance",
          "Use a workflow when: the steps are known in advance, the failure modes are known, you need predictable cost and latency. This is most production use cases",
          "Most things called 'agents' should be workflows. The 'agent' framing sells better but the workflow framing ships better. Resist the hype for things like 'extract these 5 fields from a doc' (that's a single LLM call, not an agent)",
          "Real agent territory: research tasks, coding tasks (Claude Code is a real agent), data exploration, multi-step debugging, anything where the human couldn't write the steps in advance",
          "Even in real agent territory, the cost and latency are 10–100x a single call. Make sure the value justifies it"
        ]
      },
      {
        name: "Patterns: Workflow > Agent For Most Things",
        items: [
          "Prompt chaining: output of LLM call A becomes input to LLM call B. Most useful when you can decompose a complex task into ordered subtasks",
          "Routing: a small classifier LLM picks which downstream prompt or model handles the request. Cheap, predictable, hugely effective for product surfaces with multiple intents",
          "Parallelization: run N independent LLM calls in parallel and aggregate results (voting, ranking, summing). Self-consistency is the simplest version",
          "Orchestrator-worker: an orchestrator LLM breaks a task into subtasks, each handled by a worker LLM. More flexible than fixed chaining, less chaotic than full agents",
          "Evaluator-optimizer: one LLM generates, another critiques, the first revises. Great for high-quality content generation. Slow and expensive but real quality wins"
        ]
      },
      {
        name: "Real Agent Patterns",
        items: [
          "ReAct (Reason-Act-Observe): the original agent loop. The model thinks out loud, acts, observes the result, thinks again. Most modern agent loops are ReAct under the hood",
          "Tool-use loops with reflection: after each tool call, the model is asked to evaluate whether the result moves it closer to the goal. Catches cases where a tool returned junk and the agent would otherwise have happily continued",
          "Subagent delegation: a top-level agent spawns specialized subagents (a 'researcher' agent, a 'coder' agent). Each has its own context window. Useful for parallelization and context isolation",
          "Human-in-the-loop checkpoints: the agent pauses at defined points to request user approval. Mandatory for any agent that takes irreversible actions (sending emails, executing trades, deleting data)",
          "Bounded autonomy: hard limits on max iterations, max cost, max tool calls per session. Without these, an agent in a loop will burn through your API budget at machine speed"
        ]
      },
      {
        name: "The Failure Modes Nobody Mentions",
        items: [
          "Context bloat: every iteration accumulates tool outputs in the context. By turn 20 you're spending $5/turn and the model is lost in noise. Aggressively summarize old turns",
          "Tool selection errors: model picks wrong tool or wrong arguments. Mitigate with crisp tool descriptions, examples in tool docs, and validation that gives helpful error messages back to the model",
          "Goal drift: agent forgets the original goal halfway through. Re-inject the goal in the system prompt every N turns, or use a separate 'progress check' LLM call",
          "Infinite loops: agent calls the same failing tool over and over. Add a 'have I tried this exact action before' check, force diverse retries",
          "Silent partial success: agent claims it did the task but actually only did 80% of it. Best mitigation is a separate verification pass with a different prompt"
        ]
      },
      {
        name: "Frameworks: Use Sparingly",
        items: [
          "LangGraph: explicit graph-based agent orchestration. Most production-ready of the agent frameworks. Use when you need observability and complex flows",
          "LangChain: avoid for new projects. Massive surface area, leaky abstractions, debugging hell. Many teams have rewritten away from it",
          "LlamaIndex: shines for RAG, less so for general agents. The ecosystem is solid",
          "CrewAI, AutoGen: multi-agent frameworks. Useful for prototyping novel architectures, harder to make production-grade",
          "Anthropic's Claude Code SDK and OpenAI's Agents SDK: provider-native, lighter weight than third-party frameworks, and increasingly the path of least resistance",
          "Default position: write the loop yourself. ~50 lines of Python. Reach for a framework only when you can name a specific feature you need that you don't want to build"
        ]
      },
      {
        name: "Project: A Research Agent",
        items: [
          "Build an agent that takes a research question ('What were Apple's last three earnings call themes?') and returns a structured summary",
          "Tools: web_search (Tavily or Exa), fetch_url (downloads and extracts text), summarize (LLM call), write_to_memory (stores findings)",
          "Implement the loop yourself. Max 10 iterations. Streaming output of each step so you can watch the agent think",
          "Add a verification pass at the end: a separate LLM call that checks the final summary against the collected sources and flags any unsupported claims",
          "Add bounded autonomy: hard cap on cost ($1 per query), tool call count (15), and an explicit goal check every 3 turns. Now it's safe to run on real questions"
        ]
      }
    ],
    code: `# A minimal agent loop you can actually use in production
from openai import OpenAI
import json

client = OpenAI()

def run_agent(initial_message, tools, tool_handlers, max_iters=10):
    messages = [
        {"role": "system", "content": "Use tools as needed to answer. Stop when you have a complete answer."},
        {"role": "user", "content": initial_message}
    ]
    for i in range(max_iters):
        r = client.chat.completions.create(
            model="gpt-4o", messages=messages, tools=tools
        )
        msg = r.choices[0].message
        messages.append(msg)
        if not msg.tool_calls:
            return msg.content
        for tc in msg.tool_calls:
            args = json.loads(tc.function.arguments)
            try:
                result = tool_handlers[tc.function.name](**args)
            except Exception as e:
                result = f"ERROR: {e}"
            messages.append({
                "role": "tool",
                "tool_call_id": tc.id,
                "content": json.dumps(result)[:4000]  # cap to prevent context bloat
            })
    return "Hit max iterations without final answer."`,
    resources: [
      { name: "Anthropic: Building Effective Agents", url: "https://www.anthropic.com/research/building-effective-agents", note: "The clearest demystification of agent patterns" },
      { name: "Claude Code SDK Docs", url: "https://docs.claude.com/claude-code", note: "A real production agent you can study" },
      { name: "LangGraph Docs", url: "https://langchain-ai.github.io/langgraph/", note: "If you must use a framework, this is the one" },
      { name: "OpenAI Cookbook: Agents", url: "https://cookbook.openai.com/", note: "Practical recipes from OpenAI's own staff" }
    ],
    deeper: "The frontier of agents right now is computer-use models (Claude Computer Use, OpenAI Operator) — models that can see a screen and click, type, and navigate UIs. This unlocks 'use any software' as a tool, which is qualitatively different from 'call this API'. The reliability is still rough (60–80% on benchmark tasks), the cost is high, and the safety/permission model is unsolved, but this is where agents become genuinely transformative. Worth tracking. For Kensho specifically, the more interesting frontier is agents that work over financial data — multi-source reasoning with citations, tool-using analysts that can be audited. That's a much shorter path to production value."
  },
  {
    id: 7,
    title: "AI Product Design Patterns",
    subtitle: "Building Trust In A Probabilistic Interface",
    time: "2 weeks",
    icon: "◐",
    color: "#3FA9A3",
    intro: "AI products fail more often from bad UX than bad models. The model can be technically correct and the product still useless if users can't tell when to trust it, when to double-check, or how to fix mistakes. This phase is the design language for AI features — assistive vs autonomous, transparency, error UX, and the patterns that have crystallized over the past two years.",
    sections: [
      {
        name: "The Assistive-Autonomous Spectrum",
        items: [
          "Assistive: the AI suggests, the human decides. Autocomplete, suggested replies, draft generation. Lowest risk, highest adoption, lowest 'wow'. Almost always the right starting point",
          "Augmented: AI does a chunk of work that the user reviews and edits. Summarization, structured extraction with editable fields, code generation in IDE",
          "Collaborative: AI and user work in tight loops (back-and-forth chat). Most LLM products today",
          "Autonomous: AI runs end-to-end without per-step human approval. Highest risk, hardest to ship, requires the most evals and trust",
          "Default to the leftmost (least autonomous) version that solves the problem. Move right only when users demand it AND your evals support it. Most teams do the opposite and burn user trust"
        ]
      },
      {
        name: "Trust UX Patterns",
        items: [
          "Citations: every factual claim should link to a source the user can click. This is the single biggest trust-builder in AI products. Without it, users either over-trust or refuse to use the product",
          "Confidence indicators: don't show fake numerical confidence (the model doesn't know its own confidence). DO show whether the answer was based on retrieved sources, the model's own reasoning, or unable to find information",
          "Show your work: collapsible 'reasoning' or 'how I got this' panels. Users rarely open them but their existence builds trust. Power users actually use them",
          "Fallback transparency: if the AI couldn't answer, say so explicitly. 'I don't know' is more trustworthy than a confident wrong answer. This is a UX choice as much as a model choice",
          "Provenance: 'This answer was generated by GPT-4o on Apr 11 from these 4 sources.' Sounds bureaucratic. Users in regulated industries (Kensho's customers) demand it"
        ]
      },
      {
        name: "Error & Edge Case UX",
        items: [
          "Latency UX: streaming token-by-token is mandatory for any chat UI. For non-chat, show progress: 'Searching documents... reading sources... generating answer...' Don't make users stare at a spinner",
          "Recovery UX: when the AI is wrong, the user needs an obvious way to fix or report. 'This isn't right' button → captured as eval data, fed back into improvement loop",
          "Edit-then-resubmit: let users edit the AI's draft and re-run. The hybrid 'human edit, AI re-do' pattern is dramatically more useful than pure regenerate",
          "Refusal UX: when the model declines, explain why and offer alternatives. Bare refusals destroy trust",
          "Long-context fails: if the user's query/document is too big, fail gracefully — chunk it, summarize, or explain the limit. Don't return a cryptic API error"
        ]
      },
      {
        name: "The Patterns That Have Crystallized",
        items: [
          "Inline AI in the editor (Notion AI, Cursor, Linear): summon AI with a keystroke, get suggestions in-place, accept or reject. Lowest-friction adoption pattern",
          "Side-panel chat with shared context: chat with an assistant that can see what the user is looking at. Most enterprise SaaS now has one",
          "Generated drafts with review checkboxes: AI generates a multi-section output, user reviews each section with approve/reject toggles. Used in compliance workflows",
          "Autocomplete with multi-suggestion: show 3 alternative completions, user picks. Gives users agency without making them write",
          "Async review queues: AI does the work, queues results for human review. The pattern for high-stakes / high-volume / non-realtime tasks. This is most of what Kensho actually needs"
        ]
      },
      {
        name: "Anti-Patterns",
        items: [
          "Surprise actions: AI takes an action without warning. Sending an email, modifying data, calling an API. Always preview, always confirm",
          "Hidden costs: AI calls cost money. Hiding usage from users invites bill shock and erodes trust. Show 'X queries used / Y limit' for paid tiers",
          "Generic chatbot: dropping a chat window into a product without thinking about jobs-to-be-done. 'Chat with AI' is not a feature; the underlying job is",
          "Over-scoping autonomy: an agent that 'just figures it out' when the user wanted explicit control. Match autonomy to user expectations",
          "Pretending to be human: AI personas that don't disclose they're AI. Legal landmine in many jurisdictions, ethical landmine everywhere"
        ]
      },
      {
        name: "Project: Redesign An Existing Internal Tool",
        items: [
          "Pick an existing manual workflow at Kensho or in your team. Something with text/document review, data extraction, or repeated analysis",
          "Sketch (paper or Figma) three versions: assistive (suggestions in-line), augmented (AI draft + edit), and collaborative (chat sidebar). Don't build, just sketch",
          "Pick the version that gives the user the most agency while still saving meaningful time. Defend the choice in writing",
          "Identify 5 trust UX requirements: how does the user verify, how do they recover from mistakes, how do they report issues. Write them down before any code",
          "Optional: build a clickable Figma prototype. The PM/design layer of AI engineering is shockingly underdeveloped — being good at this is a differentiator inside a TPM role"
        ]
      }
    ],
    resources: [
      { name: "Apple HIG: Machine Learning", url: "https://developer.apple.com/design/human-interface-guidelines/machine-learning", note: "The most thoughtful design guidelines on AI UX" },
      { name: "Microsoft HAX Guidelines", url: "https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/", note: "Research-backed AI UX heuristics" },
      { name: "Maggie Appleton: Squish Meets Structure", url: "https://maggieappleton.com/squish-structure", note: "Beautiful essay on AI interface design" },
      { name: "Linus Lee's blog", url: "https://thesephist.com/", note: "The most thought-provoking ongoing writing on AI UX" }
    ],
    deeper: "The next frontier of AI UX is not visual interfaces — it's voice and ambient interfaces. Multimodal models that can see your screen and hear your context will collapse the 'open the chat window, type a query, read the answer' loop into something more like a helpful coworker watching over your shoulder. The design language for this is unwritten. Worth thinking about now: what does 'trust UX' look like when there's no visible message history? What does 'provenance' look like when output is spoken? These will become real product questions inside 18 months."
  },
  {
    id: 8,
    title: "LLMOps: Production Systems",
    subtitle: "Observability, Cost, Latency, Drift",
    time: "2–3 weeks",
    icon: "⚙",
    color: "#3FA9A3",
    intro: "Putting an LLM feature in production means owning a system whose behavior changes when the upstream model changes, whose cost can 10x silently, whose latency can spike unpredictably, and whose quality can drift. LLMOps is the discipline of making this manageable. It's mostly familiar SRE/observability work with a few LLM-specific twists.",
    sections: [
      {
        name: "Observability: Tracing Every Call",
        items: [
          "Capture every LLM call with: input messages, output, model used, parameters, latency, token counts, cost, user ID, request ID, parent trace ID. This is non-negotiable",
          "Use a tracing tool: LangSmith, Phoenix (Arize), Braintrust, Helicone, or build your own with OpenTelemetry. The DIY route is fine for small scale but you'll graduate quickly",
          "Trace structure: the top-level user request is one trace, each LLM/tool/retrieval call is a span. This lets you see the full causal chain when debugging",
          "Tag everything: feature name, prompt version, model version, customer tier. Filtering by tags is how you find 'all calls for feature X using prompt v3 in the last 24 hours'",
          "Sampling: at scale you can't keep every trace. Sample 100% of failures and slow requests, 1–10% of successful fast ones"
        ]
      },
      {
        name: "Cost Tracking & Optimization",
        items: [
          "Cost per request, per feature, per user, per day. Build a dashboard with these dimensions on day one. Cost surprises kill AI features faster than quality issues",
          "Set per-feature budgets and alert when burn rate exceeds. Automate suspension if a runaway loop or DDoS sends the bill exponential",
          "The cost levers in order of effort: (1) use a smaller model where it's good enough (50–90% wins), (2) prompt caching for repeated prefixes (50% wins), (3) batch API for non-realtime (50% wins), (4) reduce input token count via compression/summarization, (5) reduce output via stop sequences, (6) cache final answers via semantic cache",
          "Measure cost per successful task, not cost per request. A cheap model that fails half the time and triggers retries is more expensive than a smarter model",
          "Cost amortization: cache hits across users (when safe — be careful about user data leakage). A single computed answer can serve thousands of queries"
        ]
      },
      {
        name: "Latency Optimization",
        items: [
          "TTFT (time to first token) matters for streaming chat UX. Reduce by: warming the connection, using a closer region, using a faster model, prefilling cacheable prefix",
          "Total latency matters for batch and tool-using workflows. Reduce by: parallel tool calls, parallel sub-agents, smaller models for sub-tasks, async where possible",
          "Speculative decoding (Anthropic, Groq, others): a small fast model drafts, the big model verifies. Often 2x faster at no quality loss. Ask if your provider supports it",
          "Inference providers like Groq and Cerebras run open-weights models at 10x the throughput of standard providers. Worth knowing exists for latency-critical use cases",
          "Latency budgets: define p50 and p99 targets per feature, alert when violated. p50 < 2s and p99 < 10s is a reasonable starting target for chat UX"
        ]
      },
      {
        name: "Drift, Monitoring & Quality In Production",
        items: [
          "Model version drift: providers update models silently when you use the alias. Pin specific versions ('gpt-4o-2024-08-06') and upgrade deliberately",
          "Quality drift via online evals: sample N% of production traffic, run an LLM judge on each, plot quality score over time. This catches drift that offline evals miss because it tests on real traffic",
          "User feedback as a quality signal: thumbs-down rate, retry rate, abandonment rate. These are the canaries",
          "Drift sources: upstream model changes, your prompt changes, your retrieval corpus changes, user query distribution shift, embedded jailbreaks in retrieved docs. Each requires different mitigations",
          "When you detect drift, the playbook is: identify which slice (per-tag dashboards), reproduce on a small set, root-cause to one of the sources above, fix or roll back"
        ]
      },
      {
        name: "Caching & Semantic Cache",
        items: [
          "Prompt caching (provider-side): Anthropic, OpenAI, Gemini all support caching long stable prefixes. Architect prompts so the system message + tools + shared context come first. Free 50–90% cost reduction on repeated calls",
          "Application-level cache: hash (model + prompt + parameters), look up exact hits. Trivial, surprisingly effective for repetitive workloads",
          "Semantic cache: embed the query, look up similar past queries, return cached answer if similarity > threshold. Use sparingly — false hits are bad and the threshold tuning is non-trivial",
          "Cache invalidation: when the underlying data or prompt changes, invalidate. Easy to forget. Tag cache entries with prompt version + data version",
          "Don't cache anything user-specific or anything where freshness matters. Stale answers in a financial product are a liability"
        ]
      },
      {
        name: "Project: Add Observability To Your Phase 4 RAG System",
        items: [
          "Wrap every LLM and embedding call with a tracing decorator that logs: timestamp, model, input (truncated), output (truncated), tokens, cost, latency, user ID",
          "Send traces to Phoenix or Braintrust (both have free tiers) OR write to a Postgres table you own. Either is fine for learning",
          "Build a simple dashboard (Metabase, Grafana, or a Streamlit app) showing: requests per day, p50/p99 latency, cost per day, top 10 slowest queries, top 10 most expensive queries",
          "Add prompt caching to the system prompt. Re-run your eval set and confirm cost dropped without quality dropping",
          "Add a 'kill switch' env var that disables the LLM feature instantly. Test that pulling the switch returns a graceful 'feature unavailable' message. This is the most important production safety lever you'll add"
        ]
      }
    ],
    resources: [
      { name: "Phoenix (Arize) Docs", url: "https://docs.arize.com/phoenix", note: "Open-source LLM observability" },
      { name: "Braintrust Docs", url: "https://www.braintrust.dev/docs", note: "Best commercial eval+observability platform" },
      { name: "LangSmith Docs", url: "https://docs.smith.langchain.com/", note: "Even if you don't use LangChain, the tracing is good" },
      { name: "Helicone", url: "https://www.helicone.ai/", note: "Drop-in proxy for OpenAI/Anthropic with logging" }
    ],
    deeper: "The frontier of LLMOps is online learning and active learning loops: production traces become eval examples, eval examples become fine-tuning data, fine-tuning data becomes specialized smaller models that replace the big general one for specific tasks. The full loop turns production usage into a continuously improving system. This is hard to do well and most teams skip it, but the teams that do it pull ahead dramatically. Worth knowing exists. For Kensho specifically, the high-leverage version of this is: collect financial-domain queries from internal usage, label 1000 of them, use them to evaluate provider models against each other, eventually distill into a smaller specialized model. This is a 6-12 month roadmap, not a sprint."
  },
  {
    id: 9,
    title: "Multi-modal & Vision",
    subtitle: "When The Input Isn't Text",
    time: "1–2 weeks",
    icon: "◉",
    color: "#3FA9A3",
    intro: "Most production AI work is text. But a growing share of valuable applications involve images, PDFs, screenshots, charts, and tables — exactly the kind of content financial services drowns in. This phase is short but covers the patterns that show up the moment you need to do anything beyond pure text.",
    sections: [
      {
        name: "Vision Models In Production",
        items: [
          "GPT-4o, Claude Sonnet/Opus, Gemini 2.0 Flash all accept image input natively. The API surface is just 'add an image content block alongside the text' — same chat completion call",
          "Cost: images are typically billed as 'image tokens' computed from resolution. A high-res image can cost 1000+ tokens. Resize aggressively before sending if you don't need fine detail",
          "Capability comparison: Claude tends to be best at structured output from images (tables, forms). Gemini is best at video (it accepts video input directly). GPT-4o is the all-rounder",
          "Image input is asymmetric: the model can understand images but can't generate them in the same call. Image generation is a different model class (DALL-E 3, Imagen, Flux)",
          "OCR-as-vision: vision models will OCR text from images for free as a side effect. This is often more accurate than dedicated OCR libraries on messy real-world docs, especially for handwriting"
        ]
      },
      {
        name: "Document Understanding (The Big Use Case)",
        items: [
          "PDFs with mixed text/tables/figures are the canonical hard problem in enterprise AI. Native PDF input via Anthropic and Gemini handles many cases that pre-processing pipelines fail on",
          "Two strategies: (1) parse PDF to text+images first, embed text for retrieval, hand individual pages as images at query time, or (2) feed entire PDF directly to a long-context vision model and skip the pipeline. Option 2 is increasingly viable",
          "Tables: vision models extract tables to markdown remarkably well. Always validate the extraction against a few known-correct rows before trusting it",
          "Multi-page docs: send pages individually with context ('this is page 3 of a 10-K') OR use a model with native multi-page PDF support. The latter handles cross-page references better",
          "Citations from PDFs: ask the model to return bounding boxes or page numbers for its claims. Verifiable references are critical for any high-stakes domain"
        ]
      },
      {
        name: "Charts, Diagrams & Visual Reasoning",
        items: [
          "Vision models can read charts (line, bar, pie) and extract approximate values. Accuracy is decent for trends, weak for precise numbers. Always cross-check against structured data when available",
          "Schematic diagrams (org charts, system diagrams, financial flowcharts): vision models follow connections and infer hierarchy. Useful for ingesting pre-existing knowledge that lives in slides",
          "Screenshots of UIs: powerful for browser automation, computer-use agents, visual regression testing. Anthropic's Computer Use is the canonical example",
          "Failure modes: tiny text in screenshots, visually similar elements (model confuses two icons), images with text-as-image where the OCR matters",
          "Resolution vs cost: most providers downscale large images. Send pre-cropped regions for fine detail rather than the full image"
        ]
      },
      {
        name: "Audio & Other Modalities",
        items: [
          "Speech-to-text: OpenAI Whisper (open-weights or hosted), Deepgram, AssemblyAI. Hosted options are usually faster and more accurate for production",
          "Text-to-speech: ElevenLabs is the quality leader, OpenAI's TTS is cheap and good enough, Cartesia and PlayHT compete on latency",
          "Native audio input to LLMs: GPT-4o and Gemini accept audio directly. Eliminates the STT → LLM → TTS pipeline for chat use cases. Watch for cost",
          "Embeddings for non-text: image embeddings (CLIP, SigLIP), audio embeddings (CLAP). Useful for semantic search over non-text data",
          "Video: Gemini accepts video natively and is currently the only major model that handles long video well. Niche but growing fast"
        ]
      },
      {
        name: "Project: A PDF Analyst",
        items: [
          "Pick 5 real financial PDFs: an annual report, a credit ratings report, an earnings call transcript, a sell-side research note, and a regulatory filing",
          "Build a tool that takes any PDF and a question, sends both to Claude or Gemini, returns the answer + page citations",
          "Test on questions that require: (1) reading a table, (2) summarizing a section, (3) extracting a specific number, (4) comparing two sections, (5) finding an unusual disclosure",
          "Compare against your Phase 4 RAG system on the same questions. Note where each approach wins and loses. Long-context vs RAG is a real tradeoff",
          "Bonus: build a UI that highlights the cited region of the PDF when the user clicks on a claim. This is the kind of trust UX that wins enterprise deals"
        ]
      }
    ],
    code: `# Sending a PDF to Claude with citations
import anthropic, base64

client = anthropic.Anthropic()
pdf_data = base64.standard_b64encode(open("10k.pdf", "rb").read()).decode()

r = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=2000,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": pdf_data
                },
                "citations": {"enabled": True}
            },
            {
                "type": "text",
                "text": "What was total revenue in fiscal 2023? Cite the page."
            }
        ]
    }]
)
for block in r.content:
    if block.type == "text":
        print(block.text)
        if hasattr(block, "citations"):
            for c in block.citations:
                print(f"  cited page {c.page_number}")`,
    resources: [
      { name: "Anthropic Vision Docs", url: "https://docs.anthropic.com/en/docs/build-with-claude/vision", note: "Best provider docs for image handling" },
      { name: "OpenAI Vision Cookbook", url: "https://cookbook.openai.com/examples/gpt_with_vision_for_video_understanding", note: "Worked examples" },
      { name: "Gemini Multimodal Docs", url: "https://ai.google.dev/gemini-api/docs/vision", note: "Especially strong for video" },
      { name: "Anthropic PDF Beta", url: "https://docs.anthropic.com/en/docs/build-with-claude/pdf-support", note: "Native PDF + citations support" }
    ],
    deeper: "ColPali and ColBERT-style vision retrieval are the most interesting frontier here: instead of converting PDFs to text and embedding the text, you embed the visual layout directly and retrieve at the page-image level. For documents where layout carries meaning (financial reports, scientific papers, schematics), this dramatically beats text-based RAG. The cost is higher and the tooling is younger, but for Kensho-relevant document types this is worth piloting in 2026."
  },
  {
    id: 10,
    title: "When NOT to Use an LLM",
    subtitle: "The Most Underrated Skill",
    time: "1 week",
    icon: "⊘",
    color: "#3FA9A3",
    intro: "The temptation to solve every problem with an LLM is the single biggest source of wasted budget, latency, and unreliability in AI products today. Knowing when NOT to reach for an LLM is the mark of a senior practitioner. This phase is the shortest but possibly the highest-leverage in the curriculum.",
    sections: [
      {
        name: "Tasks Where LLMs Are Actively Worse",
        items: [
          "Exact arithmetic: LLMs hallucinate numbers. Use Python, a calculator tool, or a spreadsheet. Exception: reasoning models with code execution",
          "Deterministic transformations: regex, string formatting, date parsing, currency conversion. A 5-line function is faster, cheaper, and 100% reliable",
          "Strict business logic: 'if X and Y then Z' rules that must be enforced exactly. LLMs will violate the rules under pressure. Use code",
          "High-volume classification with stable categories: train a small classifier (logistic regression, XGBoost, fine-tuned BERT) once. 100x cheaper at inference, more accurate, easier to debug",
          "Anything where the answer is in a database: just query the database. Don't ask an LLM to recall facts when you have the source of truth one SQL call away"
        ]
      },
      {
        name: "Cost-Quality Calculation",
        items: [
          "If the task happens 100,000 times per day, every cost optimization compounds. A 10-cent task done a million times is $100,000 a year. Run the math before architecting",
          "Compute the unit economics: cost per task, value per task. If cost per task > 10% of value per task, the feature isn't sustainable",
          "For high-volume cheap tasks, prefer: rule-based first → small classifier → small LLM → big LLM. Escalate up the chain only when needed",
          "For low-volume expensive tasks, prefer: big LLM with extensive verification, possibly multiple model votes, human review",
          "The mid-volume mid-value cases are the trap. They're the ones that look 'easy' for an LLM and end up costing more than they're worth"
        ]
      },
      {
        name: "Hybrid Systems: The Real Production Pattern",
        items: [
          "Most production systems are: rules + classical ML + LLM, in that order, with each layer handling what it's best at",
          "Rules handle: known patterns, deterministic transformations, regulatory constraints, fast paths",
          "Classical ML handles: high-volume scoring, classification, ranking, recommendations. Anything where you have labeled training data",
          "LLMs handle: open-ended reasoning, natural-language interfaces, novel inputs, content generation. The 'long tail' of the distribution",
          "The architectural skill is choosing where the boundary lives. A common pattern: LLM as the orchestrator that decides which deterministic tool to call, with the deterministic tools doing the actual work"
        ]
      },
      {
        name: "When LLMs Win Decisively",
        items: [
          "Open-ended natural language understanding: question answering, summarization, paraphrasing. Anything where the input space is unbounded",
          "Tasks with implicit common sense: 'is this complaint about billing or product quality?' classifies trivially with an LLM and requires expensive labeling otherwise",
          "Few-shot generalization: when you need to handle a new category with 5 examples instead of 5000, LLMs win",
          "Generation: drafting text, code, summaries, structured outputs from unstructured input. Pre-LLM approaches to text generation were terrible",
          "Tool orchestration: making calls to multiple APIs based on natural-language input. The agent loop in Phase 6 is the canonical case"
        ]
      },
      {
        name: "Project: The Hybrid Audit",
        items: [
          "Take any AI feature you've built or seen at Kensho. List every LLM call",
          "For each call, ask: could this be a regex? a SQL query? a 50-line classifier? a deterministic function? Force yourself to defend each LLM call",
          "Estimate the cost and latency savings if you replaced the replaceable ones. The exercise alone usually finds 30%+ savings",
          "Now ask the inverse: are there places where you're using rigid rules where an LLM would handle edge cases better? Update the architecture",
          "Write up the audit as a 1-page memo with before/after architecture. This is a portfolio artifact. PMs and TPMs who can do this exercise are extremely valuable"
        ]
      }
    ],
    resources: [
      { name: "Eugene Yan: Don't Use LLM for Everything", url: "https://eugeneyan.com/writing/text-to-sql/", note: "Pragmatic text-to-SQL essay that's really an essay on hybrid systems" },
      { name: "Hamel: Fuck You Show Me The Prompt", url: "https://hamel.dev/blog/posts/prompt/", note: "On observability and the value of seeing actual LLM calls" },
      { name: "Latent Space: 'AI Engineer' definition", url: "https://www.latent.space/p/ai-engineer", note: "The frame for the discipline this curriculum teaches" }
    ],
    deeper: "There's an emerging category of 'small specialized models' — fine-tuned 7B to 70B open-weights models that beat GPT-4o on a narrow task at 1/100th the cost. The catch is the engineering investment to fine-tune, host, and maintain them. The break-even point is around 100M+ tokens per day for a single task. Most companies don't reach that volume, which is why API providers continue to dominate. But the teams that do reach that volume and invest in fine-tuning unlock a permanent cost advantage. For Kensho specifically, fine-tuning a small model on financial-document classification or extraction tasks could be a 6-month project worth millions of dollars in avoided API spend, but only after volumes justify it."
  },
  {
    id: 11,
    title: "Domain Patterns: Finance & Structured Data",
    subtitle: "Where Hallucinations Are Lawsuits",
    time: "2 weeks",
    icon: "$",
    color: "#3FA9A3",
    intro: "Generic AI techniques meet financial-services constraints in this phase. The patterns are different when wrong answers cause regulatory violations, when sources must be auditable, and when the underlying data is heavily structured. Almost no public AI engineering content covers these patterns — they're the things you only learn shipping inside a company like Kensho.",
    sections: [
      {
        name: "Working With Tabular & Structured Data",
        items: [
          "Don't paste tables as raw text. Convert to markdown, or better, send them as structured data the LLM can iterate over (JSON list of records). Models reason about tables much better when they're not pretending to be prose",
          "For wide tables, transpose: each row becomes its own little context block. Avoids the 'lost in the middle of a 50-column row' failure",
          "For very large tables, don't send the whole table. Send the schema + sample rows + the user's question, and ask the model to write a SQL or pandas query. Then execute the query, return results, and have the model interpret",
          "Time series: never paste long time series as text. Summarize statistically (mean, std, key turning points) or send a chart as an image. Models cannot 'see' temporal patterns in raw numbers",
          "Hierarchical data (nested categories, org charts): models handle nested JSON well if the structure is clean. Flatten where you can"
        ]
      },
      {
        name: "Citations & Provenance For Regulated Output",
        items: [
          "Every factual claim must be traceable to a source. This is non-negotiable in regulated industries. Build it in from day one, not as a feature later",
          "Citations should include: document ID, page number, paragraph or section identifier, ideally a quoted span. The user must be able to verify the claim in seconds",
          "Use Anthropic's native citations API or implement your own: tag each retrieved chunk with an ID, instruct the model to cite IDs inline, post-process to render as links",
          "Never let the model fabricate URLs or document names. Strictly map citations to documents that were actually retrieved. Validate this in a post-processing step",
          "Audit log: every generated answer + its sources should be logged immutably. In some regulated workflows you'll need this retrievable years later. Plan for it"
        ]
      },
      {
        name: "Hallucination Minimization For High-Stakes Domains",
        items: [
          "Force grounding: instructions like 'Only answer using the provided sources. If the answer is not in the sources, respond with NOT FOUND.' Catches hallucinations at the source",
          "Refuse-rather-than-guess: tune prompts and evals to prefer 'I don't know' over plausible-sounding wrong answers. A wrong answer is worse than no answer in finance",
          "Numerical claims: cross-check every number in the output against the source via a separate verification pass. LLMs especially hallucinate numbers within plausible ranges",
          "Use temperature 0 for any high-stakes generation. The 'creative' settings introduce unnecessary variance",
          "Self-consistency for high-stakes: generate the answer 3–5 times, only return if all converge. Expensive but eliminates a class of variance-driven failures"
        ]
      },
      {
        name: "Compliance & Disclosure",
        items: [
          "Disclaimers: AI-generated financial output may need explicit disclosure. Check with legal at your company. Auto-prepend if required",
          "PII handling: customer-identifying info should not be sent to third-party LLM providers without contracts in place (BAA, DPA). Use enterprise tiers with data controls (OpenAI Enterprise, Anthropic Bedrock, Azure OpenAI)",
          "Data residency: some EU and APAC clients require data stays in-region. Pick model providers and infra accordingly. AWS Bedrock and Google Vertex make this easier than direct API calls",
          "Model card discipline: when you use a model in a regulated workflow, keep documentation of which model, version, parameters, prompts, and evals were used. This is the audit trail",
          "Right to explanation: under some regulations (EU AI Act, GDPR Article 22), users have the right to understand how an AI decision was made. Build the explanation surface as a first-class feature, not an afterthought"
        ]
      },
      {
        name: "Patterns Specific To Financial Documents",
        items: [
          "10-Ks and 10-Qs: highly structured but verbose. The Item 1 / Item 1A / MD&A / Risk Factors structure is consistent — exploit it via metadata-aware retrieval rather than naive chunking",
          "Earnings call transcripts: speaker turns and Q&A structure matter. Preserve speaker labels, distinguish prepared remarks from Q&A, treat analyst questions as a separate retrievable type",
          "Credit ratings reports: short, dense, technical. Often more useful as context for an LLM than as the corpus for RAG. They're better summarized than retrieved",
          "Sell-side research notes: paywalled, opinionated, often have charts and tables that matter. Vision-model PDF processing is the right tool",
          "Regulatory filings (8-K, S-1, prospectuses): each has distinct structure. Build per-type extractors rather than one general extractor"
        ]
      },
      {
        name: "Project: A Compliant Financial QA System",
        items: [
          "Take your Phase 4 RAG system. Add the following: enforced citations, refuse-when-uncertain prompting, numerical verification pass, audit logging of every query+answer+sources",
          "Add a disclaimer pre-pended to every answer ('This answer was generated by [model]. Verify all figures against original sources.')",
          "Test on adversarial queries designed to elicit hallucination: ask about a fake company, ask for a specific number that doesn't exist in your corpus, ask a leading question with a false premise",
          "Measure: refusal rate on out-of-corpus queries (should be high), hallucination rate on in-corpus numerical queries (should be near zero), citation accuracy (should be 100%)",
          "This is the kind of thing you can demo to leadership at Kensho. The patterns in this phase are the moat, not the model"
        ]
      }
    ],
    resources: [
      { name: "Anthropic Citations Docs", url: "https://docs.anthropic.com/en/docs/build-with-claude/citations", note: "Native citation support — use this" },
      { name: "EU AI Act overview", url: "https://artificialintelligenceact.eu/", note: "What 'high-risk AI' regulation looks like" },
      { name: "FINRA AI Notice", url: "https://www.finra.org/rules-guidance/notices/24-09", note: "US securities regulator's AI guidance" },
      { name: "Kensho Research Publications", url: "https://kensho.com/research", note: "Your own employer's published work — read these" }
    ],
    deeper: "The deepest version of this skill is designing the entire data lifecycle for AI use: how documents are ingested, what metadata gets attached, how versions are managed, how the audit trail is structured, how user feedback feeds back into eval sets. Most of this is data engineering, not AI engineering — and that's the point. The teams that win with AI in regulated industries are the ones with the cleanest data pipelines, not the fanciest models. Read 'Designing Data-Intensive Applications' by Martin Kleppmann if you want the foundational mental model — it's the most valuable book you can read for this kind of work, and 80% of it is non-AI."
  },
  {
    id: 12,
    title: "Capstone: Ship a Real Internal Tool",
    subtitle: "From Curriculum to Production",
    time: "4 weeks",
    icon: "◆",
    color: "#3FA9A3",
    intro: "The capstone is the entire point of this curriculum. Reading and toy projects are not enough — you need to ship one real, useful AI feature inside Kensho or your team and own it from idea to production. This phase is intentionally less prescriptive. The structure below is a template for the capstone project, not a sequence of topics.",
    sections: [
      {
        name: "Picking The Right Project",
        items: [
          "Criteria: solves a real recurring pain you or someone you know faces at work, takes manual minutes or hours per occurrence, has a clear 'done' definition, and crucially has clean source data already accessible",
          "Avoid: anything that requires new data acquisition, anything that needs sign-off from 5 stakeholders, anything that is 'cool demo' but unclear value. The capstone is about finishing, not impressing",
          "Ideal scope: 1 user (you, or a teammate), 1 task, 1 model. You can grow scope after shipping, never before",
          "Examples for a TPM at Kensho: a tool that drafts release-notes from PR descriptions, a tool that summarizes weekly team standups into a status report, a tool that extracts key metrics from prospect emails, a tool that finds related Jira tickets across teams",
          "Bias toward boring. The most valuable capstones are the ones where users say 'finally' not 'wow'"
        ]
      },
      {
        name: "Week 1: Build The Crap Version",
        items: [
          "Goal: end of week 1, you have something running locally that does the task end-to-end. It can be ugly. It can have rough edges. It must work",
          "Start with the simplest possible architecture: one LLM call, one prompt, one tool if absolutely needed. No frameworks. No vector DB unless the task literally requires retrieval",
          "Get one real example through the system. Show it to a real user (yourself or a teammate). Watch them use it. Note every friction point",
          "Resist the urge to architect. The first version exists to find out what you got wrong about the problem, not to be production-quality",
          "Hard constraint: do not move to week 2 without shipping the crap version to a real user. This is the point where 80% of capstones die"
        ]
      },
      {
        name: "Week 2: Build The Eval Set",
        items: [
          "Take the crap version and use it for a few days. Capture every input you sent, every output, and which outputs were good vs bad",
          "Build a 30-example eval set from real usage. Include the failures more than the successes — failures are the signal",
          "Build a tiny eval harness: script that runs the system against the eval set and prints pass rate, with categorized failures",
          "Run the harness. Note your baseline number. Write it down with a date. This is your 'before' for everything you'll improve",
          "Add an LLM-as-judge for any qualitative scoring you can't measure exactly. Validate the judge against your own ratings on 10 examples first"
        ]
      },
      {
        name: "Week 3: Improve, Measure, Improve",
        items: [
          "Pick the top 1–2 failure categories from week 2. For each, hypothesize a fix (better prompt, more examples, retrieval, reranking, different model)",
          "Implement ONE change. Re-run the eval. Did the metric move? By how much? In what categories? If yes, keep it. If no, revert it",
          "Repeat the loop. The discipline is: one change at a time, measured, kept-or-reverted. This is the entire skill of being good at AI engineering",
          "Add observability: log every production call with timestamp, input, output, latency, cost. Build a tiny dashboard (even a Streamlit page is fine)",
          "By end of week 3, you should have moved the eval metric meaningfully from baseline. Document what worked"
        ]
      },
      {
        name: "Week 4: Productionize & Hand Off",
        items: [
          "Add: graceful error handling, rate limits, a kill switch env var, basic auth if needed, a usage dashboard",
          "Add: a feedback button (thumbs up/down) that captures user reactions back into a log. This becomes your future eval set",
          "Write the README: what it does, who it's for, how to use it, known limitations, how to report issues",
          "Demo to your team. Capture their reactions. Add the top 3 friction points to a v2 backlog (do not address them in v1 — ship)",
          "Write a 1-page retrospective: what worked, what didn't, what you'd do differently. This artifact is what you'll show to leadership and recruiters. The capstone isn't done until the retrospective is written"
        ]
      },
      {
        name: "What Done Looks Like",
        items: [
          "A real tool, used by at least one real person, that saves measurable time on a real recurring task at Kensho",
          "An eval set you can run on demand to detect regression, with current pass rate documented",
          "Observability: you can see usage and cost in a dashboard",
          "A 1-page retrospective + a 1-page README, in your portfolio",
          "Most importantly: the confidence that comes from shipping. You are now an AI builder. The next curriculum starts on Monday"
        ]
      }
    ],
    resources: [
      { name: "Patrick Collison: Advice", url: "https://patrickcollison.com/advice", note: "On shipping vs perfecting" },
      { name: "Hamel Husain's blog", url: "https://hamel.dev/", note: "The single most useful ongoing source for shipping AI features" },
      { name: "Eugene Yan: Building LLM Apps", url: "https://eugeneyan.com/writing/llm-patterns/", note: "Patterns you'll use in your capstone" },
      { name: "Latent Space podcast", url: "https://www.latent.space/podcast", note: "Interviews with practitioners shipping real AI products" }
    ],
    deeper: "After your first capstone, the natural next step is your second capstone, then your third, increasingly ambitious. By your fifth shipped tool you will know more about applied AI than 95% of the people whose job title contains the word 'AI.' This isn't because the field is shallow — it's because so few people actually ship. The discipline of finishing is the differentiator. After Applied AI, the natural next curriculum is Financial Markets: pair the engineering skill with the domain depth and you become unusually valuable inside S&P Global. After that, GenAI Foundations becomes the curiosity-driven deep dive into the systems you've been shipping on top of."
  }
];

const PRIORITY_MAP = {
  "Get shipping fast": [1, 2, 3, 12],
  "RAG-heavy track": [1, 4, 5, 11],
  "Agents & autonomy": [3, 6, 7, 8],
  "Production reliability": [5, 8, 11],
  "Multimodal & docs": [9, 11]
};

function CodeBlock({ code }) {
  return (
    <pre style={{
      background: "#06121A",
      border: "1px solid rgba(63,169,163,0.1)",
      borderRadius: 8,
      padding: "16px 20px",
      overflowX: "auto",
      fontSize: 13,
      lineHeight: 1.65,
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      color: "#B8DAD7",
      margin: "12px 0"
    }}>
      <code>{code}</code>
    </pre>
  );
}

function ResourceLink({ r }) {
  return (
    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      padding: "10px 14px",
      background: "rgba(63,169,163,0.03)",
      border: "1px solid rgba(63,169,163,0.08)",
      borderRadius: 8,
      textDecoration: "none",
      color: "#B8DAD7",
      transition: "all 0.2s",
      marginBottom: 6,
      fontSize: 13
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(107,212,204,0.3)"; e.currentTarget.style.background = "rgba(63,169,163,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,169,163,0.08)"; e.currentTarget.style.background = "rgba(63,169,163,0.03)"; }}>
      <span style={{ flexShrink: 0, color: "#6BD4CC" }}>↗</span>
      <span style={{ flex: 1 }}>
        <strong style={{ color: "#D4ECEA", fontWeight: 500 }}>{r.name}</strong>
        {r.note && <span style={{ color: "#7B9C99", marginLeft: 6, fontStyle: "italic" }}>— {r.note}</span>}
      </span>
    </a>
  );
}

function PhaseContent({ phase }) {
  const [showDeeper, setShowDeeper] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: "#B8DAD7", margin: 0 }}>{phase.intro}</p>
      {phase.sections?.map((section, si) => (
        <div key={si}>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 14px", fontWeight: 600, paddingBottom: 8, borderBottom: `1px solid ${phase.color}22` }}>{section.name}</h4>
          {section.items.map((item, ii) => (
            <div key={ii} style={{ padding: "10px 0", borderBottom: "1px solid rgba(63,169,163,0.05)", fontSize: 14, color: "#B8DAD7", lineHeight: 1.7 }}>{item}</div>
          ))}
        </div>
      ))}
      {phase.code && <CodeBlock code={phase.code} />}
      {phase.resources && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Resources</h4>
          {phase.resources.map((r, i) => <ResourceLink key={i} r={r} />)}
        </div>
      )}
      {phase.deeper && (
        <div>
          <button onClick={() => setShowDeeper(!showDeeper)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px dashed rgba(63,169,163,0.15)", color: "#7B9C99", fontSize: 13, padding: "10px 16px", borderRadius: 8, cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color; e.currentTarget.style.color = phase.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(63,169,163,0.15)"; e.currentTarget.style.color = "#7B9C99"; }}>
            <span style={{ transform: showDeeper ? "rotate(90deg)" : "none", transition: "transform 0.2s", fontSize: 10 }}>▶</span>
            Want to go deeper?
          </button>
          {showDeeper && <p style={{ fontSize: 13, color: "#7B9C99", lineHeight: 1.75, padding: "14px 16px", margin: "8px 0 0", background: "rgba(63,169,163,0.03)", borderRadius: 8, fontStyle: "italic", borderLeft: `2px solid ${phase.color}33` }}>{phase.deeper}</p>}
        </div>
      )}
    </div>
  );
}

export default function AppliedAIRoadmap({ onBack }) {
  const [activePhase, setActivePhase] = useState(1);
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('applied-ai-roadmap-progress');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [showNav, setShowNav] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const contentRef = useRef(null);
  const skipSync = useRef(false);

  const phase = PHASES.find(p => p.id === activePhase);
  const progress = Math.round((completed.size / PHASES.length) * 100);

  const loadProgress = useCallback(async (userId) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('user_progress')
      .select('completed_phases')
      .eq('user_id', userId)
      .eq('curriculum', 'applied-ai')
      .single();
    if (data?.completed_phases) {
      skipSync.current = true;
      setCompleted(new Set(data.completed_phases));
      localStorage.setItem('applied-ai-roadmap-progress', JSON.stringify(data.completed_phases));
    }
  }, []);

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProgress(session.user.id);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProgress(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [loadProgress]);

  const toggleComplete = (id) => {
    setCompleted(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  useEffect(() => {
    const arr = [...completed];
    try { localStorage.setItem('applied-ai-roadmap-progress', JSON.stringify(arr)); } catch {}
    if (skipSync.current) { skipSync.current = false; return; }
    if (!supabase || !user) return;
    supabase.from('user_progress').upsert({
      user_id: user.id,
      curriculum: 'applied-ai',
      completed_phases: arr,
      updated_at: new Date().toISOString()
    });
  }, [completed, user]);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthError('');
    setAuthSubmitting(true);
    const { error } = authMode === 'signup'
      ? await supabase.auth.signUp({ email: authEmail, password: authPassword })
      : await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    setAuthSubmitting(false);
    if (error) { setAuthError(error.message); return; }
    if (authMode === 'signup') { setAuthError('Check your email to confirm your account.'); return; }
    setShowAuthModal(false);
    setAuthEmail('');
    setAuthPassword('');
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => { if (contentRef.current) contentRef.current.scrollTop = 0; }, [activePhase]);

  return (
    <div style={{ fontFamily: "'Newsreader', Georgia, serif", background: "#08141A", color: "#D4ECEA", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <header style={{ padding: "14px 24px", borderBottom: "1px solid rgba(63,169,163,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#08141A", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#7B9C99", fontSize: 13, cursor: "pointer", padding: "4px 8px", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          )}
          <button onClick={() => setShowNav(!showNav)} style={{ background: "none", border: "none", color: "#D4ECEA", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>{showNav ? "✕" : "☰"}</button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: -0.3, fontFamily: "'DM Sans', sans-serif" }}>Applied <span style={{ color: "#3FA9A3" }}>AI Engineering</span></h1>
            <p style={{ fontSize: 10, color: "#7B9C99", margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>From prompt to production</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#7B9C99", fontFamily: "'IBM Plex Mono', monospace" }}>{completed.size}/{PHASES.length}</span>
          <div style={{ width: 80, height: 4, background: "rgba(63,169,163,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #3FA9A3, #6BD4CC)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          {supabase && !authLoading && (
            user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                <span style={{ fontSize: 12, color: "#7B9C99", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(63,169,163,0.15)", color: "#7B9C99", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>Sign out</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setAuthMode('signin'); setAuthError(''); }} style={{ background: "rgba(63,169,163,0.1)", border: "1px solid rgba(63,169,163,0.2)", color: "#3FA9A3", fontSize: 11, padding: "4px 12px", borderRadius: 6, cursor: "pointer", marginLeft: 8 }}>Sign in</button>
            )
          )}
        </div>
      </header>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <nav style={{ width: showNav ? 300 : 0, minWidth: showNav ? 300 : 0, borderRight: showNav ? "1px solid rgba(63,169,163,0.08)" : "none", overflow: "hidden", transition: "all 0.3s ease", background: "#061218", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {PHASES.map(p => (
              <button key={p.id} onClick={() => { setActivePhase(p.id); setShowNav(false); }}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", background: activePhase === p.id ? `${p.color}0D` : "transparent", border: activePhase === p.id ? `1px solid ${p.color}1A` : "1px solid transparent", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                <span onClick={(e) => { e.stopPropagation(); toggleComplete(p.id); }}
                  style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: completed.has(p.id) ? `2px solid ${p.color}` : "2px solid rgba(63,169,163,0.15)", background: completed.has(p.id) ? `${p.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: p.color, cursor: "pointer", transition: "all 0.2s" }}>
                  {completed.has(p.id) ? "✓" : ""}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: activePhase === p.id ? 600 : 400, color: activePhase === p.id ? "#D4ECEA" : "#7B9C99", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: p.color, marginRight: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{String(p.id).padStart(2, "0")}</span>{p.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#4A6663", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.subtitle}</div>
                </div>
                <span style={{ fontSize: 10, color: "#4A6663", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>{p.time}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: "1px solid rgba(63,169,163,0.08)" }}>
            <h4 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#4A6663", margin: "0 0 10px", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>Focus Tracks</h4>
            {Object.entries(PRIORITY_MAP).map(([activity, ids]) => (
              <button key={activity} onClick={() => { setActivePhase(ids[0]); setShowNav(false); }}
                style={{ display: "block", width: "100%", padding: "6px 0", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, color: "#7B9C99", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#3FA9A3"}
                onMouseLeave={e => e.currentTarget.style.color = "#7B9C99"}>
                {activity} → {ids.map(id => String(id).padStart(2, "0")).join(", ")}
              </button>
            ))}
          </div>
        </nav>
        <main ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "40px 32px 80px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: phase.color, fontWeight: 600 }}>Phase {String(phase.id).padStart(2, "0")}</span>
              <span style={{ fontSize: 12, color: "#4A6663", fontFamily: "'IBM Plex Mono', monospace" }}>{phase.time}</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: phase.color, marginRight: 8 }}>{phase.icon}</span>{phase.title}
            </h2>
            <p style={{ fontSize: 17, color: "#7B9C99", margin: 0, fontWeight: 300 }}>{phase.subtitle}</p>
          </div>
          <button onClick={() => toggleComplete(phase.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", background: completed.has(phase.id) ? `${phase.color}0D` : "rgba(63,169,163,0.03)", border: `1px solid ${completed.has(phase.id) ? phase.color + "33" : "rgba(63,169,163,0.08)"}`, borderRadius: 8, cursor: "pointer", color: completed.has(phase.id) ? phase.color : "#7B9C99", fontSize: 13, fontWeight: 500, marginBottom: 32, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${completed.has(phase.id) ? phase.color : "rgba(63,169,163,0.2)"}`, background: completed.has(phase.id) ? `${phase.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, transition: "all 0.2s" }}>
              {completed.has(phase.id) ? "✓" : ""}
            </span>
            {completed.has(phase.id) ? "Completed" : "Mark as completed"}
          </button>
          <PhaseContent phase={phase} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(63,169,163,0.08)" }}>
            <button onClick={() => activePhase > 1 && setActivePhase(activePhase - 1)} disabled={activePhase === 1}
              style={{ padding: "10px 20px", background: activePhase === 1 ? "transparent" : "rgba(63,169,163,0.03)", border: `1px solid ${activePhase === 1 ? "transparent" : "rgba(63,169,163,0.08)"}`, borderRadius: 8, color: activePhase === 1 ? "#1F3A38" : "#7B9C99", cursor: activePhase === 1 ? "default" : "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              ← Previous
            </button>
            <button onClick={() => activePhase < PHASES.length && setActivePhase(activePhase + 1)} disabled={activePhase === PHASES.length}
              style={{ padding: "10px 20px", background: activePhase === PHASES.length ? "transparent" : `${PHASES[activePhase]?.color || phase.color}0D`, border: `1px solid ${activePhase === PHASES.length ? "transparent" : (PHASES[activePhase]?.color || phase.color) + "22"}`, borderRadius: 8, color: activePhase === PHASES.length ? "#1F3A38" : PHASES[activePhase]?.color || phase.color, cursor: activePhase === PHASES.length ? "default" : "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
              Next: {PHASES[activePhase]?.title || "Done"} →
            </button>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div onClick={() => setShowAuthModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#0F1F26", border: "1px solid rgba(63,169,163,0.15)", borderRadius: 12, padding: 32, width: 340, maxWidth: "90vw" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{authMode === 'signin' ? 'Sign in' : 'Create account'}</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#7B9C99" }}>Sync your progress across devices</p>
            <form onSubmit={handleAuth}>
              <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px 12px", background: "rgba(63,169,163,0.05)", border: "1px solid rgba(63,169,163,0.15)", borderRadius: 6, color: "#D4ECEA", fontSize: 13, marginBottom: 8, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(63,169,163,0.05)", border: "1px solid rgba(63,169,163,0.15)", borderRadius: 6, color: "#D4ECEA", fontSize: 13, marginBottom: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              {authError && <p style={{ fontSize: 12, color: authError.includes('Check your email') ? '#6BD4CC' : '#3FA9A3', margin: "0 0 12px" }}>{authError}</p>}
              <button type="submit" disabled={authSubmitting}
                style={{ width: "100%", padding: "10px", background: "#3FA9A3", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: authSubmitting ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: authSubmitting ? 0.7 : 1 }}>
                {authSubmitting ? '...' : authMode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </form>
            <p style={{ margin: "16px 0 0", fontSize: 12, color: "#7B9C99", textAlign: "center" }}>
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(''); }} style={{ color: "#3FA9A3", cursor: "pointer" }}>
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
