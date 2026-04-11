import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

const PHASES = [
  {
    id: 1,
    title: "Git",
    subtitle: "Think in Graphs, Not Commands",
    time: "1–2 weeks",
    icon: "◈",
    color: "#E8927C",
    intro: "Git is a graph of snapshots. Every commit is a snapshot of your entire project. A branch is just a sticky note pointing to one of those snapshots. That's it. Once you see it this way, everything else follows.",
    mentalModel: [
      "A commit = a save point with a unique ID",
      "A branch = a label that moves forward as you add commits",
      "Merging = combining two branches' histories",
      "A pull request = \"hey, review my branch before we merge it into main\"",
      "HEAD = \"where am I right now?\""
    ],
    workflow: [
      "Create a branch: git checkout -b my-feature",
      "Make changes, stage them (git add), commit with a message",
      "Push to remote (git push)",
      "Open a PR, get it merged",
      "Pull latest main (git pull)"
    ],
    survival: [
      "git status — run it constantly, it's your best friend",
      "git log --oneline --graph — see the actual graph",
      "git stash — hide your changes temporarily",
      "Scared? Make a backup branch: git checkout -b backup-just-in-case"
    ],
    resources: [
      { name: "Learn Git Branching", url: "https://learngitbranching.js.org/", note: "Visual, interactive — the single best resource" },
      { name: "Oh Shit, Git!?!", url: "https://ohshitgit.com/", note: "Bookmark this, you'll need it" }
    ],
    deeper: "Read Pro Git chapters 1–3 (free online at git-scm.com). Covers the internals — how git stores objects, what a SHA hash is, how the staging area actually works. Fascinating but not required."
  },
  {
    id: 2,
    title: "Terminal",
    subtitle: "Your Home Base",
    time: "1 week",
    icon: "▸",
    color: "#7CC6A0",
    intro: "The terminal is just a text-based way to talk to your computer. Every click you do in Finder/Explorer has a terminal equivalent. You need fluency with maybe 15 commands.",
    commands: [
      { cmd: "cd", desc: "Move between folders" },
      { cmd: "ls -la", desc: "See what's in a folder" },
      { cmd: "pwd", desc: "Where am I?" },
      { cmd: "cat file", desc: "Print a file's contents" },
      { cmd: "grep \"text\" file", desc: "Find text in files" },
      { cmd: "ctrl+C", desc: "Stop whatever's running" },
      { cmd: "ctrl+R", desc: "Search command history (game changer)" }
    ],
    concepts: [
      {
        name: "Environment Variables",
        desc: "Settings stored in your terminal session. When docs say \"set your API key as an environment variable,\" they mean: export SALESFORCE_API_KEY=\"abc123\". Your app reads these so secrets don't live in your code."
      },
      {
        name: "The PATH Variable",
        desc: "When you type python and it works, your computer looked through a list of folders (the PATH) to find the python program. When something \"isn't found,\" it's usually a PATH issue."
      }
    ],
    resources: [
      { name: "The Missing Semester (MIT)", url: "https://missing.csail.mit.edu/", note: "Lectures 1–2 cover shell basics brilliantly" }
    ],
    deeper: "Learn awk, sed, piping (|), and writing bash scripts. The Missing Semester lectures 3–5 cover this. Useful for automating repetitive tasks but not urgent."
  },
  {
    id: 3,
    title: "Internet",
    subtitle: "How It Actually Works",
    time: "1 week",
    icon: "◎",
    color: "#7CA8E8",
    intro: "When your Slack bot receives a message, a chain of things happen. You need a rough picture of this chain.",
    layers: [
      { name: "DNS", desc: "Translates \"api.salesforce.com\" into an IP address — a phone number for a server" },
      { name: "HTTP", desc: "The language browsers/apps use. GET = read, POST = create, PUT = update, DELETE = remove. Status codes: 200 ok, 401 unauthorized, 404 not found, 500 server broke" },
      { name: "APIs", desc: "A server exposing endpoints you can call. You already use these — deepen your understanding of headers, auth tokens, and rate limits" },
      { name: "JSON", desc: "The format data travels in. You know this from Python dicts — it's the same thing" },
      { name: "Webhooks", desc: "\"Don't call me, I'll call you.\" The service sends YOUR server a request when something happens. This is how your Slack bot receives messages" }
    ],
    auth: [
      { name: "API Key", desc: "Simplest — a secret string in a header" },
      { name: "OAuth 2.0", desc: "The \"Login with Google\" flow. Your app redirects to the provider, user approves, you get a token. Critical in GTM tooling" },
      { name: "JWT", desc: "A token that contains info about the user, encoded but not encrypted" }
    ],
    resources: [
      { name: "How DNS Works", url: "https://howdns.works/", note: "A delightful comic, takes 10 minutes" },
      { name: "Postman Learning Center", url: "https://learning.postman.com/docs/getting-started/introduction/", note: "Hands-on API exploration" }
    ],
    deeper: "Read High Performance Browser Networking (hpbn.co) chapters 1–4 (free online). Covers TCP, TLS, and how data actually moves across the internet."
  },
  {
    id: 4,
    title: "GTM Patterns",
    subtitle: "The Shapes You'll See Every Week",
    time: "½ week",
    icon: "⬡",
    color: "#D4A843",
    intro: "Before you learn Docker or CI/CD, recognize the recurring architecture patterns in GTM tooling. You don't need to build these from scratch yet — you need to see the shape.",
    patterns: [
      {
        name: "Reverse ETL",
        desc: "Data flows from your warehouse (Snowflake, BigQuery) back into GTM tools (Salesforce, HubSpot). Tools: Census, Hightouch, RudderStack. Stop treating the CRM as source of truth — the warehouse is the single source, the CRM is a downstream consumer."
      },
      {
        name: "Webhook → Queue → Worker",
        desc: "When Gong finishes a call or Slack gets a message: service sends webhook → system puts it in a queue (SQS, Redis) → worker picks it up. The queue absorbs bursts so 500 events at 5pm don't choke your service."
      },
      {
        name: "OAuth2 + Refresh Token Dance",
        desc: "Access token (expires in ~1hr) → use for API calls → expires → refresh token gets new access token. The killer: refresh token expires or gets revoked, your entire integration silently stops. Token lifecycle management is critical."
      },
      {
        name: "Rate Limits & Backoff",
        desc: "Every GTM API has limits. Hit 429? Exponential backoff: wait 1s, retry, wait 2s, retry, wait 4s, retry. Add jitter so 10 workers don't all retry at the same millisecond. This is the difference between 100 records and 100,000."
      },
      {
        name: "Browser Automation (Last Resort)",
        desc: "Some GTM tools have terrible APIs or none at all. Playwright/Puppeteer/Clay spin up a headless browser, navigate, extract data. It's fragile — site changes HTML, scraper breaks. Use only when no API alternative exists."
      }
    ],
    resources: [
      { name: "Designing Data-Intensive Applications", url: "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/", note: "Chapters 1–4 by Martin Kleppmann — best book on data systems" }
    ],
    deeper: "Enterprise Integration Patterns (enterpriseintegrationpatterns.com) is the classic reference for messaging patterns if you find yourself building a lot of webhook/queue/worker flows."
  },
  {
    id: 5,
    title: "Security",
    subtitle: "Don't Be the Reason Things Leak",
    time: "3–4 days",
    icon: "◆",
    color: "#E87C7C",
    intro: "GTM Engineers handle API keys, OAuth tokens, and PII constantly. Security hygiene isn't optional — it's what separates \"trusted to build in production\" from \"locked out of production.\"",
    rules: [
      "Never hardcode secrets in code. Git remembers everything — even deleted lines live in history",
      "Never commit .env files. Verify .gitignore on every new project",
      "Never paste secrets into Slack, email, or shared docs",
      "Never log secrets. If logging prints an API key, it's now in your log aggregator for anyone"
    ],
    ladder: [
      {
        level: "Level 1 — .env files",
        desc: "Fine for local development. App reads secrets from .env using python-dotenv. The .env never gets committed.",
        current: true
      },
      {
        level: "Level 2 — CI/CD Secrets",
        desc: "GitHub Actions Secrets, GitLab CI Variables. Pipeline injects them as environment variables at runtime. Probably what your SRE is setting up.",
        current: false
      },
      {
        level: "Level 3 — Cloud Secret Managers",
        desc: "AWS Secrets Manager, Google Secret Manager, HashiCorp Vault, Doppler, Infisical. Centralized rotation, audit logs, access control.",
        current: false
      }
    ],
    resources: [
      { name: "GitHub Secrets Docs", url: "https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions", note: "Practical for your CI/CD setup" },
      { name: "OWASP Secrets Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html", note: "Comprehensive reference" }
    ],
    deeper: "Learn about secret rotation, service-to-service auth (mTLS, service accounts), and infrastructure-level security. HashiCorp's Learn Vault tutorials are hands-on and well-structured."
  },
  {
    id: 6,
    title: "Docker",
    subtitle: "\"It Works on My Machine\" — Solved",
    time: "1–2 weeks",
    icon: "▣",
    color: "#7CC6E8",
    intro: "Docker solves one problem: making sure your app runs the same way everywhere. That's it.",
    mentalModel: [
      "Image = a recipe. \"Start with Python 3.11, install these packages, copy my code in\"",
      "Container = a running instance of that recipe. A lightweight virtual computer with only what your app needs",
      "Dockerfile = the recipe file. Just a text file with instructions",
      "docker-compose = run multiple containers together (your app + a database)"
    ],
    code: `FROM python:3.11-slim          # Start with Python
WORKDIR /app                   # Working directory
COPY requirements.txt .        # Copy dependency list
RUN pip install -r requirements.txt
COPY . .                       # Copy your code
CMD ["python", "app.py"]       # Run your app`,
    commands: [
      { cmd: "docker build -t my-app .", desc: "Build an image from your Dockerfile" },
      { cmd: "docker run my-app", desc: "Run a container from your image" },
      { cmd: "docker ps", desc: "See running containers" },
      { cmd: "docker logs container-name", desc: "See what your app is printing" }
    ],
    resources: [
      { name: "Docker Getting Started", url: "https://docs.docker.com/get-started/", note: "Official tutorial, well-paced" },
      { name: "Fireship Docker in 100s", url: "https://youtube.com/watch?v=Gjnup-PuquQ", note: "Watch first for the mental model" }
    ],
    deeper: "Learn Docker networking, volumes, multi-stage builds, and Kubernetes at a high level. Nana's Kubernetes Crash Course on YouTube is excellent."
  },
  {
    id: 7,
    title: "CI/CD",
    subtitle: "Robots That Deploy For You",
    time: "1 week",
    icon: "⟳",
    color: "#B87CE8",
    intro: "CI/CD is just automation triggered by git events. When you push code or merge a PR, a robot runs a script. That's the whole concept.",
    concepts: [
      {
        name: "CI — Continuous Integration",
        desc: "You push code → a server (GitHub Actions, Jenkins) automatically runs your tests → if tests fail, PR gets a red X. Prevents broken code from reaching main."
      },
      {
        name: "CD — Continuous Deployment",
        desc: "Code gets merged to main → automation builds your Docker image, pushes it, and deploys it → your app is updated without you SSHing into a server."
      }
    ],
    code: `name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt
      - run: python -m pytest
      - run: ./deploy.sh`,
    resources: [
      { name: "GitHub Actions Quickstart", url: "https://docs.github.com/en/actions/quickstart", note: "Hands-on in 10 minutes" },
      { name: "Fireship CI/CD in 100s", url: "https://youtube.com/watch?v=scEDHsr3APg", note: "Quick mental model" }
    ],
    deeper: "Learn deployment strategies (blue-green, canary, rolling) and infrastructure as code (Terraform). These matter at scale but are beyond what you need now."
  },
  {
    id: 8,
    title: "Infrastructure",
    subtitle: "Serverless vs. Containers",
    time: "3–4 days",
    icon: "☁",
    color: "#A0D4A0",
    intro: "You learned Docker. But for a lot of GTM work, a full container is overkill. You need to understand the two main options.",
    comparison: [
      {
        name: "Containers",
        tech: "ECS, Cloud Run, Kubernetes",
        desc: "Always on, waiting for requests. Good for your Slack bot, long-running syncs, persistent connections.",
        when: "Needs to be always listening"
      },
      {
        name: "Serverless",
        tech: "AWS Lambda, Cloud Functions, Vercel",
        desc: "Sleeps until triggered. Runs, does its job, goes back to sleep. Pay only for seconds it runs.",
        when: "Event-driven, finishes in <15 min"
      }
    ],
    insight: "Most GTM automation is event-driven and short-lived — serverless is often the more elegant choice. But your Slack bot needs a persistent connection, so a container makes sense there.",
    resources: [
      { name: "Fireship Serverless in 100s", url: "https://youtube.com/watch?v=W_VV2Fx32_Y", note: "Quick concept overview" },
      { name: "AWS Lambda Getting Started", url: "https://docs.aws.amazon.com/lambda/latest/dg/getting-started.html", note: "Concepts transfer to any cloud" }
    ],
    deeper: "Learn about event-driven architecture, message brokers (SQS, Pub/Sub, Kafka), and how to combine serverless and containers. The Serverless Framework docs are a practical starting point."
  },
  {
    id: 9,
    title: "Python",
    subtitle: "From Vibes to Confidence",
    time: "2–4 weeks",
    icon: "⟐",
    color: "#E8C87C",
    intro: "You know the basics. Here's what separates \"I can write a script\" from \"I can build and maintain a tool.\"",
    skills: [
      {
        name: "Error Handling",
        desc: "Stop letting scripts crash silently. Wrap API calls in try/except. Log what went wrong.",
        code: `try:
    response = requests.get(url)
    response.raise_for_status()
except requests.exceptions.HTTPError as e:
    logger.error(f"API error: {e}")
except requests.exceptions.ConnectionError:
    logger.error("Couldn't connect")`
      },
      {
        name: "JSON Fluency",
        desc: "APIs return nested data constantly. Use .get() with defaults to prevent crashes.",
        code: `deal = response.json()
owner = deal.get("owner", {}).get("email", "unknown")
# .get() with defaults prevents KeyError crashes`
      },
      {
        name: "Virtual Environments",
        desc: "Each project gets its own isolated Python. This is why packages \"disappear\" or conflict.",
        code: `python -m venv venv
source venv/bin/activate
pip install requests
pip freeze > requirements.txt`
      }
    ],
    coreLibs: ["requests — HTTP calls", "pandas — data manipulation", "python-dotenv — load .env files", "logging — proper logging, not print()", "pytest — even basic tests save hours"],
    gtmLibs: ["simple-salesforce — Salesforce API, auth, SOQL, CRUD", "hubspot-api-client — official HubSpot SDK", "pydantic — data validation (see Phase 10)", "Vendor SDKs for Gong, Outreach, Salesloft", "langchain / crewAI / autogen — for LLM-powered GTM workflows (future layer)"],
    resources: [
      { name: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com/", note: "Files, APIs, automation — your use case" },
      { name: "Real Python", url: "https://realpython.com/", note: "Best intermediate Python tutorials" }
    ],
    deeper: "Learn decorators, generators, type hints, and especially asyncio. Async is the unlock for scale — enriching 100K leads sequentially takes hours; async makes it 20 minutes. Fluent Python by Luciano Ramalho covers it all."
  },
  {
    id: 10,
    title: "Data Quality",
    subtitle: "Your Silent Reputation",
    time: "1 week",
    icon: "◇",
    color: "#E87CB8",
    intro: "In GTM engineering, your \"users\" are often downstream systems and teams. When your data is wrong, people make bad decisions and nobody knows why for weeks.",
    coreProblem: "Silent data corruption is worse than a crash. If your enrichment script writes null into Salesforce industry fields because an API changed its response format, nothing errors out. Your script \"works.\" But lead routing breaks, SDRs call into wrong segments, and nobody traces it back to your script for days.",
    code: `from pydantic import BaseModel, EmailStr
from typing import Optional

class EnrichedAccount(BaseModel):
    name: str
    domain: str
    industry: str          # Required — crashes loudly if missing
    employee_count: Optional[int] = None
    owner_email: EmailStr  # Must be valid email

# Raises ValidationError if data is wrong
account = EnrichedAccount(**api_response)`,
    assertion: `results = enrich_accounts(account_list)

assert len(results) > 0, "Enrichment returned no results"
assert sum(1 for r in results if r.industry) / len(results) > 0.7, \\
    "More than 30% missing industry — something is wrong"`,
    resources: [
      { name: "Pydantic Docs", url: "https://docs.pydantic.dev/", note: "Start here for Python data validation" },
      { name: "dbt Testing Docs", url: "https://docs.getdbt.com/docs/build/data-tests", note: "If you're doing warehouse work" }
    ],
    deeper: "Look into contract testing, Great Expectations, and schema registries. Fundamentals of Data Engineering (O'Reilly) covers data quality in modern data stacks."
  },
  {
    id: 11,
    title: "Observability",
    subtitle: "Catching Silent Failures",
    time: "1–2 weeks",
    icon: "◉",
    color: "#7CE8C6",
    intro: "This phase matters more than Docker for your day-to-day life. Your automations touch live customer data. When they break silently, consequences compound for days.",
    pillars: [
      { name: "Logs", desc: "Structured text your app emits. Use Python's logging module, not print(). Structured logs are searchable." },
      { name: "Metrics", desc: "Numbers over time. Records processed per run, API call duration, error rate, enrichment coverage percentage." },
      { name: "Alerts", desc: "\"Tell me when something's wrong.\" Not just crashes — the silent failures are the hard ones." }
    ],
    failures: [
      {
        name: "Enrichment Returns Nulls",
        scenario: "Clearbit/ZoomInfo still returns 200 OK, but response body is empty. Your script writes empty fields to Salesforce. Lead routing breaks.",
        alert: "Alert on: enrichment coverage dropping below threshold (e.g., <70% accounts have industry)"
      },
      {
        name: "Picklist Value Changed",
        scenario: "RevOps renamed \"Enterprise\" to \"Enterprise (500+)\" in Salesforce. Your routing logic checking account.segment == \"Enterprise\" matches nothing. Wrong queue for a week.",
        alert: "Alert on: unexpected values in key fields, routing rules matching zero records"
      },
      {
        name: "OAuth Token Expired Silently",
        scenario: "HubSpot refresh token expired after 6 months of inactivity. Sync job silently stops syncing. Nobody notices.",
        alert: "Alert on: any 401 response, and \"zero records synced\" — if sync touches nothing, something's wrong"
      },
      {
        name: "Queue Consumer Died",
        scenario: "Webhook receiver accepts events and returns 200 OK. But the worker processing the queue crashed. Events pile up. Everything looks green.",
        alert: "Alert on: queue depth growing beyond threshold, age of oldest unprocessed message"
      }
    ],
    resources: [
      { name: "Datadog Learning Center", url: "https://learn.datadoghq.com/", note: "If your company uses Datadog" }
    ],
    deeper: "Read Observability Engineering by Charity Majors. Core idea: observability isn't about dashboards — it's about asking new questions about your system without deploying new code."
  },
  {
    id: 12,
    title: "SQL",
    subtitle: "From Querying to Storytelling",
    time: "1–2 weeks",
    icon: "⊞",
    color: "#C6A0E8",
    intro: "You can SELECT, JOIN, and WHERE. Here's what unlocks the next level for GTM work.",
    context: "Your SQL will mostly live in a warehouse like Snowflake, BigQuery, or Redshift — not a local Postgres database. These have syntax quirks (Snowflake uses ILIKE, BigQuery uses backticks). You'll also encounter Salesforce's SOQL (no JOINs — uses relationship queries) and HubSpot's filter syntax (not SQL at all). Concepts transfer, syntax varies.",
    cte: `WITH active_deals AS (
    SELECT * FROM deals
    WHERE stage != 'Closed Lost'
    AND created_at > '2024-01-01'
),
deal_owners AS (
    SELECT owner_id,
           COUNT(*) as deal_count,
           SUM(amount) as pipeline
    FROM active_deals
    GROUP BY owner_id
)
SELECT u.name, d.deal_count, d.pipeline
FROM deal_owners d
JOIN users u ON u.id = d.owner_id
ORDER BY d.pipeline DESC;`,
    window: `SELECT
    rep_name,
    deal_name,
    amount,
    ROW_NUMBER() OVER (
        PARTITION BY rep_name
        ORDER BY amount DESC
    ) as rank
FROM deals;`,
    resources: [
      { name: "SQLBolt", url: "https://sqlbolt.com/", note: "Fast interactive review" },
      { name: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/", note: "Intermediate/advanced with real analysis" }
    ],
    deeper: "Learn EXPLAIN plans, indexing, and database design. Use The Index, Luke (use-the-index-luke.com) is a free deep dive. For Salesforce, the SOQL/SOSL Reference is definitive. Snowflake's docs are excellent for warehouse SQL."
  },
  {
    id: 13,
    title: "Translation",
    subtitle: "The API of You",
    time: "Ongoing",
    icon: "◈",
    color: "#E8A07C",
    intro: "You live closer to the business than most engineers. Your ability to translate technical constraints into business impact — and business requirements into technical specs — is disproportionately valuable.",
    trd: `## Lead Routing Automation

**What it does:** Assigns inbound leads to the right SDR
based on segment, territory, and open opportunities.

**Trigger:** New lead created in Salesforce (via webhook).

**Logic:**
1. Look up account by domain
2. Open opportunity? → Assign to opp owner's SDR
3. No opportunity → Assign by territory
4. Unknown territory → Round-robin queue

**Failure behavior:** Lead lands in "Unassigned" queue,
alert fires in #gtm-eng-alerts.

**Data touched:** Reads Lead + Opportunity.
Writes Lead.OwnerId.`,
    insight: "When a stakeholder asks for something, ask \"what decision are you trying to make?\" before jumping to the technical solution. Often what they asked for isn't what they actually need.",
    resources: [
      { name: "The Staff Engineer's Path", url: "https://www.oreilly.com/library/view/the-staff-engineers/9781098118730/", note: "Chapters on communication and influence" }
    ],
    deeper: "Writing for Engineers by Heinrich Hartmann is a great short essay on technical writing as an engineering skill."
  }
];

const PRIORITY_MAP = {
  "Building automations": [4, 9, 10],
  "Deploying things": [5, 6, 7, 8],
  "Analyzing data": [12, 9],
  "Supporting production": [11],
  "Working with stakeholders": [13]
};

function CodeBlock({ code, lang }) {
  return (
    <pre style={{
      background: "#1a1a2e",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 8,
      padding: "16px 20px",
      overflowX: "auto",
      fontSize: 13,
      lineHeight: 1.6,
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: "#c8d6e5",
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
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 8,
      textDecoration: "none",
      color: "#c8d6e5",
      transition: "all 0.2s",
      marginBottom: 6
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.03)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>↗ {r.name}</span>
      <span style={{ fontSize: 12, color: "#8899aa", fontStyle: "italic" }}>{r.note}</span>
    </a>
  );
}

function PhaseContent({ phase }) {
  const [showDeeper, setShowDeeper] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: "#c8d6e5", margin: 0 }}>{phase.intro}</p>

      {phase.mentalModel && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Mental Model</h4>
          {phase.mentalModel.map((m, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 14, color: "#c8d6e5", lineHeight: 1.6 }}>
              {m}
            </div>
          ))}
        </div>
      )}

      {phase.workflow && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Daily Workflow</h4>
          {phase.workflow.map((w, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 14, color: "#c8d6e5" }}>
              <span style={{ color: phase.color, fontWeight: 700, fontFamily: "monospace", minWidth: 20 }}>{i + 1}</span>
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}

      {phase.survival && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>When Things Go Wrong</h4>
          {phase.survival.map((s, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 14, color: "#c8d6e5", lineHeight: 1.6, fontFamily: "'JetBrains Mono', monospace", letterSpacing: -0.2 }}>{s}</div>
          ))}
        </div>
      )}

      {phase.commands && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Commands</h4>
          {phase.commands.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", alignItems: "baseline" }}>
              <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: phase.color, background: "rgba(255,255,255,0.04)", padding: "2px 8px", borderRadius: 4, whiteSpace: "nowrap" }}>{c.cmd}</code>
              <span style={{ fontSize: 14, color: "#8899aa" }}>{c.desc}</span>
            </div>
          ))}
        </div>
      )}

      {phase.concepts && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {phase.concepts.map((c, i) => (
            <div key={i} style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 6px" }}>{c.name}</h4>
              <p style={{ fontSize: 14, color: "#8899aa", margin: 0, lineHeight: 1.6 }}>{c.desc}</p>
            </div>
          ))}
        </div>
      )}

      {phase.layers && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>The Stack</h4>
          {phase.layers.map((l, i) => (
            <div key={i} style={{ display: "flex", gap: 16, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontWeight: 700, color: phase.color, fontSize: 14, minWidth: 80 }}>{l.name}</span>
              <span style={{ fontSize: 14, color: "#c8d6e5", lineHeight: 1.6 }}>{l.desc}</span>
            </div>
          ))}
        </div>
      )}

      {phase.auth && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Auth Patterns</h4>
          {phase.auth.map((a, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontWeight: 600, color: "#fff", fontSize: 14 }}>{a.name}</span>
              <span style={{ fontSize: 14, color: "#8899aa" }}> — {a.desc}</span>
            </div>
          ))}
        </div>
      )}

      {phase.patterns && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {phase.patterns.map((p, i) => (
            <div key={i} style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>{p.name}</h4>
              <p style={{ fontSize: 14, color: "#8899aa", margin: 0, lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      )}

      {phase.rules && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Never Violate</h4>
          {phase.rules.map((r, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", fontSize: 14, color: "#c8d6e5", lineHeight: 1.6 }}>
              <span style={{ color: "#E87C7C", fontWeight: 700 }}>✕</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}

      {phase.ladder && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Secrets Maturity</h4>
          {phase.ladder.map((l, i) => (
            <div key={i} style={{
              padding: 14,
              background: l.current ? `${phase.color}11` : "rgba(255,255,255,0.02)",
              borderRadius: 8,
              border: l.current ? `1px solid ${phase.color}33` : "1px solid rgba(255,255,255,0.05)",
              marginBottom: 8
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: l.current ? phase.color : "#fff" }}>{l.level}</span>
                {l.current && <span style={{ fontSize: 10, padding: "2px 8px", background: `${phase.color}22`, color: phase.color, borderRadius: 99, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>You are here</span>}
              </div>
              <p style={{ fontSize: 13, color: "#8899aa", margin: 0, lineHeight: 1.6 }}>{l.desc}</p>
            </div>
          ))}
        </div>
      )}

      {phase.code && <CodeBlock code={phase.code} />}

      {phase.comparison && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {phase.comparison.map((c, i) => (
            <div key={i} style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)" }}>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>{c.name}</h4>
              <div style={{ fontSize: 11, color: phase.color, fontFamily: "monospace", marginBottom: 8 }}>{c.tech}</div>
              <p style={{ fontSize: 13, color: "#8899aa", margin: "0 0 8px", lineHeight: 1.6 }}>{c.desc}</p>
              <div style={{ fontSize: 12, color: "#c8d6e5", fontStyle: "italic" }}>Best when: {c.when}</div>
            </div>
          ))}
        </div>
      )}

      {phase.insight && <p style={{ fontSize: 14, color: "#c8d6e5", lineHeight: 1.7, padding: "12px 16px", borderLeft: `3px solid ${phase.color}`, background: "rgba(255,255,255,0.02)", borderRadius: "0 8px 8px 0", margin: 0 }}>{phase.insight}</p>}

      {phase.skills && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {phase.skills.map((s, i) => (
            <div key={i}>
              <h4 style={{ fontSize: 14, fontWeight: 600, color: "#fff", margin: "0 0 4px" }}>{s.name}</h4>
              <p style={{ fontSize: 13, color: "#8899aa", margin: "0 0 8px", lineHeight: 1.6 }}>{s.desc}</p>
              {s.code && <CodeBlock code={s.code} />}
            </div>
          ))}
        </div>
      )}

      {phase.coreLibs && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Core Libraries</h4>
          {phase.coreLibs.map((l, i) => (
            <div key={i} style={{ padding: "6px 0", fontSize: 14, color: "#c8d6e5", fontFamily: "'JetBrains Mono', monospace", letterSpacing: -0.2 }}>{l}</div>
          ))}
        </div>
      )}

      {phase.gtmLibs && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>GTM-Specific (Next Layer)</h4>
          {phase.gtmLibs.map((l, i) => (
            <div key={i} style={{ padding: "6px 0", fontSize: 14, color: "#8899aa", fontFamily: "'JetBrains Mono', monospace", letterSpacing: -0.2 }}>{l}</div>
          ))}
        </div>
      )}

      {phase.coreProblem && <p style={{ fontSize: 14, color: "#E87CB8", lineHeight: 1.7, padding: "12px 16px", borderLeft: `3px solid ${phase.color}`, background: "rgba(232,124,184,0.05)", borderRadius: "0 8px 8px 0", margin: 0, fontStyle: "italic" }}>{phase.coreProblem}</p>}

      {phase.assertion && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 8px", fontWeight: 600 }}>Sanity Checks</h4>
          <CodeBlock code={phase.assertion} />
        </div>
      )}

      {phase.pillars && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {phase.pillars.map((p, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontWeight: 700, color: phase.color, minWidth: 70, fontSize: 14 }}>{p.name}</span>
              <span style={{ fontSize: 14, color: "#c8d6e5", lineHeight: 1.6 }}>{p.desc}</span>
            </div>
          ))}
        </div>
      )}

      {phase.failures && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>GTM Failure Modes</h4>
          {phase.failures.map((f, i) => (
            <div key={i} style={{ padding: 16, background: "rgba(255,255,255,0.02)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 10 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>{f.name}</h4>
              <p style={{ fontSize: 13, color: "#8899aa", margin: "0 0 8px", lineHeight: 1.6 }}>{f.scenario}</p>
              <div style={{ fontSize: 12, color: phase.color, fontWeight: 600, background: `${phase.color}11`, padding: "6px 10px", borderRadius: 6 }}>{f.alert}</div>
            </div>
          ))}
        </div>
      )}

      {phase.context && <p style={{ fontSize: 14, color: "#8899aa", lineHeight: 1.7, padding: "12px 16px", borderLeft: `3px solid ${phase.color}`, background: "rgba(255,255,255,0.02)", borderRadius: "0 8px 8px 0", margin: 0 }}>{phase.context}</p>}

      {phase.cte && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 8px", fontWeight: 600 }}>CTEs — Think in Steps</h4>
          <CodeBlock code={phase.cte} />
        </div>
      )}

      {phase.window && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 8px", fontWeight: 600 }}>Window Functions</h4>
          <CodeBlock code={phase.window} />
        </div>
      )}

      {phase.trd && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 8px", fontWeight: 600 }}>TRD Template</h4>
          <CodeBlock code={phase.trd} />
        </div>
      )}

      {/* Resources */}
      {phase.resources && (
        <div>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 12px", fontWeight: 600 }}>Resources</h4>
          {phase.resources.map((r, i) => <ResourceLink key={i} r={r} />)}
        </div>
      )}

      {/* Go Deeper */}
      {phase.deeper && (
        <div>
          <button
            onClick={() => setShowDeeper(!showDeeper)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "1px dashed rgba(255,255,255,0.12)",
              color: "#8899aa", fontSize: 13, padding: "10px 16px",
              borderRadius: 8, cursor: "pointer", width: "100%",
              textAlign: "left", transition: "all 0.2s", fontFamily: "inherit"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color; e.currentTarget.style.color = phase.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#8899aa"; }}
          >
            <span style={{ transform: showDeeper ? "rotate(90deg)" : "none", transition: "transform 0.2s", fontSize: 10 }}>▶</span>
            Want to go deeper?
          </button>
          {showDeeper && (
            <p style={{ fontSize: 13, color: "#8899aa", lineHeight: 1.7, padding: "12px 16px", margin: "8px 0 0", background: "rgba(255,255,255,0.02)", borderRadius: 8, fontStyle: "italic" }}>
              {phase.deeper}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function GTMRoadmap({ onBack }) {
  const [activePhase, setActivePhase] = useState(1);
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('gtm-roadmap-progress');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  const [showNav, setShowNav] = useState(false);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const contentRef = useRef(null);
  const skipSync = useRef(false);

  const phase = PHASES.find(p => p.id === activePhase);
  const progress = Math.round((completed.size / PHASES.length) * 100);

  // Load progress from Supabase
  const loadProgress = useCallback(async (userId) => {
    if (!supabase) return;
    const { data } = await supabase
      .from('user_progress')
      .select('completed_phases')
      .eq('user_id', userId)
      .eq('curriculum', 'gtm')
      .single();
    if (data?.completed_phases) {
      skipSync.current = true;
      setCompleted(new Set(data.completed_phases));
      localStorage.setItem('gtm-roadmap-progress', JSON.stringify(data.completed_phases));
    }
  }, []);

  // Auth listener
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
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Persist to localStorage + Supabase
  useEffect(() => {
    const arr = [...completed];
    try { localStorage.setItem('gtm-roadmap-progress', JSON.stringify(arr)); } catch {}
    if (skipSync.current) { skipSync.current = false; return; }
    if (!supabase || !user) return;
    supabase.from('user_progress').upsert({
      user_id: user.id,
      curriculum: 'gtm',
      completed_phases: arr,
      updated_at: new Date().toISOString()
    });
  }, [completed, user]);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

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

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [activePhase]);

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#0d0d14",
      color: "#fff",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <header style={{
        padding: "16px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        background: "#0d0d14",
        zIndex: 10
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#667788", fontSize: 13, cursor: "pointer", padding: "4px 8px" }}>← Back</button>
          )}
          <button
            onClick={() => setShowNav(!showNav)}
            style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", padding: "4px 8px", display: "flex", alignItems: "center" }}
          >
            {showNav ? "✕" : "☰"}
          </button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: -0.3 }}>GTM Engineer Roadmap</h1>
            <p style={{ fontSize: 11, color: "#667788", margin: 0, letterSpacing: 0.5, textTransform: "uppercase" }}>Engineering Fluency</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#667788", fontFamily: "'JetBrains Mono', monospace" }}>{completed.size}/{PHASES.length}</span>
          <div style={{ width: 80, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #E8927C, #7CC6A0)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          {supabase && !authLoading && (
            user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                <span style={{ fontSize: 12, color: "#99aabb", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </span>
                <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#667788", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>
                  Sign out
                </button>
              </div>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setAuthMode('signin'); setAuthError(''); }} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#ccc", fontSize: 11, padding: "4px 12px", borderRadius: 6, cursor: "pointer", marginLeft: 8 }}>
                Sign in
              </button>
            )
          )}
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Side Navigation */}
        <nav style={{
          width: showNav ? 280 : 0,
          minWidth: showNav ? 280 : 0,
          borderRight: showNav ? "1px solid rgba(255,255,255,0.06)" : "none",
          overflow: "hidden",
          transition: "all 0.3s ease",
          background: "#0a0a12",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {PHASES.map(p => (
              <button
                key={p.id}
                onClick={() => { setActivePhase(p.id); setShowNav(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  padding: "12px 14px",
                  background: activePhase === p.id ? `${p.color}11` : "transparent",
                  border: activePhase === p.id ? `1px solid ${p.color}22` : "1px solid transparent",
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  marginBottom: 2,
                  transition: "all 0.15s",
                  fontFamily: "inherit"
                }}
              >
                <span
                  onClick={(e) => { e.stopPropagation(); toggleComplete(p.id); }}
                  style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                    border: completed.has(p.id) ? `2px solid ${p.color}` : "2px solid rgba(255,255,255,0.15)",
                    background: completed.has(p.id) ? `${p.color}22` : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: p.color, cursor: "pointer", transition: "all 0.2s"
                  }}
                >
                  {completed.has(p.id) ? "✓" : ""}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: activePhase === p.id ? 600 : 400, color: activePhase === p.id ? "#fff" : "#8899aa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: p.color, marginRight: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}>{String(p.id).padStart(2, "0")}</span>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#556677", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.subtitle}</div>
                </div>
                <span style={{ fontSize: 10, color: "#556677", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>{p.time}</span>
              </button>
            ))}
          </div>

          {/* Priority Guide */}
          <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <h4 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#556677", margin: "0 0 10px", fontWeight: 600 }}>Priority by Activity</h4>
            {Object.entries(PRIORITY_MAP).map(([activity, ids]) => (
              <button
                key={activity}
                onClick={() => { setActivePhase(ids[0]); setShowNav(false); }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "6px 0",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#667788",
                  fontFamily: "inherit",
                  transition: "color 0.15s"
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#c8d6e5"}
                onMouseLeave={e => e.currentTarget.style.color = "#667788"}
              >
                {activity} → {ids.map(id => String(id).padStart(2, "0")).join(", ")}
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main ref={contentRef} style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px 32px 80px",
          maxWidth: 720,
          margin: "0 auto",
          width: "100%"
        }}>
          {/* Phase Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: phase.color, fontWeight: 600 }}>Phase {String(phase.id).padStart(2, "0")}</span>
              <span style={{ fontSize: 12, color: "#556677", fontFamily: "'JetBrains Mono', monospace" }}>{phase.time}</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.1 }}>
              <span style={{ color: phase.color }}>{phase.icon}</span> {phase.title}
            </h2>
            <p style={{ fontSize: 17, color: "#667788", margin: 0, fontWeight: 300 }}>{phase.subtitle}</p>
          </div>

          {/* Completion Toggle */}
          <button
            onClick={() => toggleComplete(phase.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 18px",
              background: completed.has(phase.id) ? `${phase.color}15` : "rgba(255,255,255,0.03)",
              border: `1px solid ${completed.has(phase.id) ? phase.color + "44" : "rgba(255,255,255,0.08)"}`,
              borderRadius: 8,
              cursor: "pointer",
              color: completed.has(phase.id) ? phase.color : "#8899aa",
              fontSize: 13,
              fontWeight: 500,
              marginBottom: 32,
              transition: "all 0.2s",
              fontFamily: "inherit"
            }}
          >
            <span style={{
              width: 18, height: 18, borderRadius: 5,
              border: `2px solid ${completed.has(phase.id) ? phase.color : "rgba(255,255,255,0.2)"}`,
              background: completed.has(phase.id) ? `${phase.color}22` : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, transition: "all 0.2s"
            }}>
              {completed.has(phase.id) ? "✓" : ""}
            </span>
            {completed.has(phase.id) ? "Completed" : "Mark as completed"}
          </button>

          {/* Phase Content */}
          <PhaseContent phase={phase} />

          {/* Nav Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <button
              onClick={() => activePhase > 1 && setActivePhase(activePhase - 1)}
              disabled={activePhase === 1}
              style={{
                padding: "10px 20px",
                background: activePhase === 1 ? "transparent" : "rgba(255,255,255,0.03)",
                border: `1px solid ${activePhase === 1 ? "transparent" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 8,
                color: activePhase === 1 ? "#333" : "#8899aa",
                cursor: activePhase === 1 ? "default" : "pointer",
                fontSize: 13,
                fontFamily: "inherit",
                transition: "all 0.2s"
              }}
            >
              ← Previous
            </button>
            <button
              onClick={() => activePhase < PHASES.length && setActivePhase(activePhase + 1)}
              disabled={activePhase === PHASES.length}
              style={{
                padding: "10px 20px",
                background: activePhase === PHASES.length ? "transparent" : `${PHASES[activePhase]?.color || phase.color}15`,
                border: `1px solid ${activePhase === PHASES.length ? "transparent" : (PHASES[activePhase]?.color || phase.color) + "33"}`,
                borderRadius: 8,
                color: activePhase === PHASES.length ? "#333" : PHASES[activePhase]?.color || phase.color,
                cursor: activePhase === PHASES.length ? "default" : "pointer",
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "inherit",
                transition: "all 0.2s"
              }}
            >
              Next: {PHASES[activePhase]?.title || "Done"} →
            </button>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div
          onClick={() => setShowAuthModal(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 12, padding: 32, width: 340, maxWidth: "90vw"
            }}
          >
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600 }}>
              {authMode === 'signin' ? 'Sign in' : 'Create account'}
            </h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#667788" }}>
              Sync your progress across devices
            </p>
            <form onSubmit={handleAuth}>
              <input
                type="email" placeholder="Email" value={authEmail}
                onChange={e => setAuthEmail(e.target.value)} required
                style={{
                  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff",
                  fontSize: 13, marginBottom: 8, outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
              <input
                type="password" placeholder="Password" value={authPassword}
                onChange={e => setAuthPassword(e.target.value)} required minLength={6}
                style={{
                  width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, color: "#fff",
                  fontSize: 13, marginBottom: 12, outline: "none", fontFamily: "inherit",
                  boxSizing: "border-box"
                }}
              />
              {authError && (
                <p style={{ fontSize: 12, color: authError.includes('Check your email') ? '#7CC6A0' : '#E8927C', margin: "0 0 12px" }}>
                  {authError}
                </p>
              )}
              <button
                type="submit" disabled={authSubmitting}
                style={{
                  width: "100%", padding: "10px", background: "#E8927C", border: "none",
                  borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600,
                  cursor: authSubmitting ? "wait" : "pointer", fontFamily: "inherit",
                  opacity: authSubmitting ? 0.7 : 1
                }}
              >
                {authSubmitting ? '...' : authMode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </form>
            <p style={{ margin: "16px 0 0", fontSize: 12, color: "#667788", textAlign: "center" }}>
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <span
                onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(''); }}
                style={{ color: "#E8927C", cursor: "pointer" }}
              >
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
