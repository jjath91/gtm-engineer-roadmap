import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

const PHASES = [
  {
    id: 1,
    title: "First Principles",
    subtitle: "Strip to Foundations, Rebuild From Zero",
    time: "1 week",
    icon: "◆",
    color: "#C79B9B",
    intro: "First-principles thinking is the practice of refusing to reason by analogy. Instead of copying a solution because it worked somewhere else, you break a problem down to the facts you're certain are true and rebuild from there. It is the single most valuable habit for anyone who wants to engineer things rather than assemble them. This phase is short on theory and long on drills — by the end, you should be able to take any design decision and surface its hidden assumptions in five minutes.",
    sections: [
      {
        name: "What It Actually Is",
        items: [
          "Reasoning by analogy = 'we're doing it this way because everyone else does it this way.' Fast, comfortable, and the reason most products look the same",
          "Reasoning from first principles = 'what do I actually know is true, and what's the simplest thing that follows from those truths?' Slower, uncomfortable, and the only way to get to a non-obvious answer",
          "Famous example: Elon Musk on battery cost. Industry said $600/kWh. He asked what the raw materials cost on the commodity market and found the physical floor was closer to $80/kWh. The gap was the opportunity",
          "You don't need to be revolutionary to use this. Every time you catch yourself saying 'because that's how we've always done it,' you have a first-principles opportunity"
        ]
      },
      {
        name: "The Drill",
        items: [
          "Take any belief you hold about a system ('we need a Kafka queue here', 'this API should be REST', 'we need a separate staging environment'). Write it down",
          "Under it, write the assumptions that belief depends on. Be exhaustive — list everything, even the ones that feel too obvious to name",
          "For each assumption, ask: 'how do I actually know this is true in MY situation, not the general case?' Most will dissolve",
          "Now rebuild your design using only the assumptions that survived. It will look different — usually simpler",
          "Do this twice a week on real decisions for a month. It becomes automatic"
        ]
      },
      {
        name: "Failure Modes",
        items: [
          "Over-applying it. Some conventions exist for good reasons (e.g. REST on public APIs). First principles says 'understand the reason', not 'always throw out convention'",
          "Ignoring domain expertise. Asking 'what do I know is true' doesn't mean ignoring that a senior engineer has seen 100 systems break the same way. Their experience IS a first-principles fact about how systems fail",
          "Using it to justify what you already wanted. The honest version of this tool is uncomfortable. If your first-principles analysis always produces the answer you started with, you're not doing it right",
          "Performance. You can't first-principles every decision every day. Reserve it for decisions that are expensive to reverse"
        ]
      }
    ],
    resources: [
      { name: "First Principles: Elon Musk & the Power of Thinking for Yourself", url: "https://jamesclear.com/first-principles", note: "James Clear's accessible breakdown" },
      { name: "The First Principles Method Explained by Elon Musk", url: "https://www.youtube.com/watch?v=NV3sBlRgzTI", note: "The 3-minute origin clip" },
      { name: "Richard Feynman on the Scientific Method", url: "https://www.youtube.com/watch?v=EYPapE-3FRw", note: "The purest articulation of first-principles thinking in under a minute" }
    ],
    deeper: "Read the first 40 pages of Aristotle's Posterior Analytics — it's the original articulation of reasoning from 'things better known than the conclusion,' i.e. first principles. Dense but startlingly modern. Then read Thomas Kuhn's The Structure of Scientific Revolutions (1962) for the opposite lesson: entire scientific communities can operate on shared assumptions that later turn out to be wrong. First principles is the antidote to the paradigm."
  },
  {
    id: 2,
    title: "Systems Thinking",
    subtitle: "See the Whole, Not Just the Parts",
    time: "1 week",
    icon: "◎",
    color: "#C79B9B",
    intro: "A system is a set of things connected in a way that produces a behavior that no single thing produces on its own. Traffic jams, org culture, production outages, and climate change are all systems. Systems thinking is the discipline of looking at the whole pattern instead of the individual components, and asking 'what's producing this behavior?' rather than 'whose fault is it?' For engineers, this is the mindset shift from debugging code to debugging the environment the code lives in.",
    sections: [
      {
        name: "The Core Vocabulary",
        items: [
          "Stock = something that accumulates. A database, a backlog, your team's trust, a bank balance. Stocks change slowly",
          "Flow = the rate at which a stock changes. Inbound tickets per day, commits per week, calories in/out. Flows can change instantly",
          "Feedback loop = when a flow changes based on the current level of a stock. 'More users → more bug reports → more fixes → better product → more users' is a reinforcing loop",
          "Delay = the time between a change in one part of the system and the effect showing up somewhere else. Delays are where most system failures hide",
          "Boundary = the line you draw around what's 'in' your system and what's 'outside.' Change the boundary and you change the answer"
        ]
      },
      {
        name: "Drawing a System",
        items: [
          "Pick a behavior you don't understand. 'Why does our deploy pipeline get slower every quarter?' is a good one",
          "Write the main stocks in boxes: 'tests in suite', 'engineers on the team', 'flaky tests being tolerated'",
          "Draw arrows for flows between them: 'engineers add tests' (flow into tests in suite), 'engineers ignore flakes' (flow into flaky tests being tolerated)",
          "Look for loops. 'More tests → slower pipeline → more flakes ignored → more undetected bugs → more tests added to catch them' is a vicious loop",
          "Find the leverage point: usually NOT the place that hurts most, but the place with the biggest loop gain. In the example above, it's 'flakes being tolerated' — not 'too many tests'"
        ]
      },
      {
        name: "How Systems Fail",
        items: [
          "Policy resistance: the system 'pushes back' on any intervention that doesn't address the structure. Hiring more engineers to ship faster often slows things down because it increases coordination cost. The structure wanted equilibrium",
          "Shifting the burden: solving a symptom makes the real problem worse. Painkillers for a broken bone. Feature flags for an untested release. The short-term relief destroys the pressure that would have fixed the cause",
          "Tragedy of the commons: when many agents share a resource that no one owns. Noisy-neighbor problems on shared clusters. Shared Slack channels that become unsearchable. Requires a boundary change, not individual restraint",
          "Drift to low performance: when the standard slowly slides to match reality instead of the other way around. 'p99 was 200ms, now 2s, we've adjusted our SLO to 2s.' Classic"
        ]
      },
      {
        name: "Five Questions To Ask Before Touching Anything",
        items: [
          "What's the actual behavior I'm trying to change — not the symptom?",
          "What's upstream of the thing I want to change? (Hint: it's usually where the leverage is)",
          "What delays are in this system? (Hint: your intervention won't show results as fast as you expect)",
          "What loops does my change interact with — and will it accidentally strengthen a vicious one?",
          "Where is the boundary of my system, and what am I excluding by drawing it there?"
        ]
      }
    ],
    resources: [
      { name: "Thinking in Systems (Donella Meadows)", url: "https://www.chelseagreen.com/product/thinking-in-systems/", note: "The best book on systems thinking, period" },
      { name: "Leverage Points: Places to Intervene in a System", url: "https://donellameadows.org/archives/leverage-points-places-to-intervene-in-a-system/", note: "Meadows's classic 12-point essay, free online" },
      { name: "How Complex Systems Fail (Richard Cook)", url: "https://how.complexsystems.fail/", note: "18 short observations. Read it twice. Read it every year" }
    ],
    deeper: "If you want to go deeper on the mathematical side, read the first four chapters of Sterman's Business Dynamics — it's the standard graduate text on system dynamics and covers stocks, flows, and loop modeling rigorously. For the humanistic side, read Peter Senge's The Fifth Discipline, which applies systems thinking to organizations. And for the 'oh god, everything is a system' epiphany, watch the World3 model in action — the original 1972 Limits to Growth simulation, now re-runnable in a browser."
  },
  {
    id: 3,
    title: "Abstraction & Decomposition",
    subtitle: "Layers and Pieces",
    time: "1 week",
    icon: "⊞",
    color: "#C79B9B",
    intro: "Abstraction is how you hide complexity behind a simple interface. Decomposition is how you take a problem too big to hold in your head and split it into pieces that fit. These are the two fundamental moves of all engineering. Everything you admire in a well-built system is, at bottom, someone being disciplined about one of these two things. This phase trains you to do both on command.",
    sections: [
      {
        name: "Abstraction — The Core Idea",
        items: [
          "An abstraction is a lie that's useful. A steering wheel is a lie about how cars work — you can drive a car without knowing anything about the drivetrain. The lie is useful because it's true enough at the level you care about",
          "A good abstraction exposes what you need and hides what you don't. A function named `send_email(to, subject, body)` is a good abstraction. A function named `open_smtp_connection_and_write_headers_then_body_then_close` is a bad one",
          "The test for a good abstraction: can you describe WHAT it does in one sentence without mentioning HOW? 'It sends an email' passes. 'It authenticates to SMTP, formats MIME, and pipes bytes' fails",
          "All abstractions leak. The 'leaky abstractions' essay by Joel Spolsky is required reading — every abstraction eventually forces you to understand a layer below, usually at 2am"
        ]
      },
      {
        name: "Decomposition — The Core Idea",
        items: [
          "The test for a good decomposition: can you hold each piece in your head independently without needing to think about the others? If yes, you're done. If no, decompose further",
          "Vertical decomposition: slice by layer (database → API → business logic → UI). Each layer has a narrow interface to the next",
          "Horizontal decomposition: slice by feature (user service, billing service, notification service). Each piece owns its data and exposes a contract",
          "The art is knowing which slice to use. Vertical slicing optimizes for cohesion within a layer. Horizontal slicing optimizes for independent deployment. Hybrid is usually right",
          "The wrong decomposition is worse than no decomposition. Splitting a system along the wrong lines creates a fractal of coupling you can't undo cheaply"
        ]
      },
      {
        name: "Abstraction Ladders",
        items: [
          "Every system has a ladder from most-abstract (what the user wants) to most-concrete (what the CPU does). A great engineer can stand on any rung and describe what's true from that rung",
          "Exercise: pick a system you work on. Write the ladder in 5 levels. Example for a chatbot: 1) 'user asks a question and gets a helpful answer' 2) 'frontend collects text, sends to API, renders response' 3) 'API routes to LLM, retrieves context, formats prompt, parses output' 4) 'LLM client sends HTTP POST with JSON body to provider endpoint' 5) 'OS writes bytes to TCP socket'",
          "When you're stuck on a problem, climb the ladder to see where the real issue lives. Most 'AI doesn't work' problems are actually at level 3 (prompt or retrieval), not level 4 (model call)",
          "When you're explaining something, start two rungs higher than your audience expects. They'll meet you there"
        ]
      },
      {
        name: "Decomposition Rules",
        items: [
          "Rule 1: if you can't name a piece in one short noun phrase, it's the wrong piece. 'UserAuthAndBillingAndNotification' is four things pretending to be one",
          "Rule 2: every piece should have exactly one reason to change. This is the Single Responsibility Principle in its honest form",
          "Rule 3: the interface should be narrower than the implementation. A piece that exposes 40 methods and has 50 internally is not really decomposed — it's just relocated",
          "Rule 4: you should be able to replace a piece without the others noticing. If you can't, the contract isn't clean enough",
          "Rule 5: when in doubt, don't decompose yet. Premature decomposition locks in the wrong cut lines and is harder to undo than premature abstraction"
        ]
      }
    ],
    resources: [
      { name: "The Law of Leaky Abstractions (Joel Spolsky)", url: "https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/", note: "Required reading for anyone building layered systems" },
      { name: "A Philosophy of Software Design (John Ousterhout)", url: "https://web.stanford.edu/~ouster/cgi-bin/book.php", note: "The clearest modern treatment of abstraction depth" },
      { name: "Out of the Tar Pit (Moseley & Marks)", url: "http://curtclifton.net/papers/MoseleyMarks06a.pdf", note: "A brutal, brilliant paper on why most complexity is self-inflicted" }
    ],
    deeper: "After Ousterhout, go back and read David Parnas's 1972 paper 'On the Criteria To Be Used in Decomposing Systems into Modules.' It invented information hiding and is still one of the most important papers ever written in computer science. Then read Rich Hickey's talk 'Simple Made Easy' for the distinction between simple (one role) and easy (familiar) — it'll reframe how you pick decomposition lines forever."
  },
  {
    id: 4,
    title: "Root Cause Analysis",
    subtitle: "5 Whys, Not 5 Patches",
    time: "1 week",
    icon: "⚡",
    color: "#C79B9B",
    intro: "When something breaks, the tempting move is to patch the symptom and move on. Root cause analysis is the discipline of refusing that move. You keep asking 'why' until you've reached a cause that, if fixed, would prevent the entire class of failure — not just this instance. It is the single biggest differentiator between engineers who keep shipping the same bug and engineers who don't.",
    sections: [
      {
        name: "The 5 Whys, Done Honestly",
        items: [
          "Start with the observable failure: 'the deploy failed at 3:47pm'",
          "Why? The CI pipeline couldn't install a dependency",
          "Why? The package was missing from the lockfile",
          "Why? A developer installed it globally instead of locally",
          "Why? The onboarding doc said 'install X' without specifying how",
          "Why? Nobody owns the onboarding doc",
          "Stop. The last answer is structural, not personal. THAT is your root cause. 'We don't have an owner for onboarding docs' is the fix target, not 'developer should have known better'"
        ]
      },
      {
        name: "Where 5 Whys Goes Wrong",
        items: [
          "Stopping too early. 'The test failed because the test was flaky' is a symptom, not a cause. Keep going: why was it flaky? What else is flaky for the same reason?",
          "Stopping too late. Once you reach 'because humans exist' or 'because entropy' you've gone past the usable layer. The right stopping point is the highest-leverage intervention you can actually make",
          "Personalizing the cause. 'Because Alex made a mistake' is never a root cause. Alex is a smart person working in a system that allowed the mistake. Fix the system",
          "Assuming a single cause. Many real failures have 2-3 contributing causes that ALL had to line up. The Swiss-cheese model (James Reason) is the honest picture: every layer has holes, failures happen when holes align"
        ]
      },
      {
        name: "Other Tools In The Kit",
        items: [
          "Ishikawa / fishbone diagram: when you suspect multiple contributing factors, draw a fish where each rib is a category (people, process, tools, environment, inputs, measurements). Brainstorm causes into each rib. Useful for factors that don't form a clean chain",
          "Blameless post-mortem: a written narrative of what happened, why, and what's changing. Blameless means you can freely write 'we believed X but X was false' without anyone getting in trouble. Google's SRE book is the canonical reference",
          "Pre-mortem: the inverse. Before you ship something risky, sit down and imagine it has already failed in production. What went wrong? Why? Address those now",
          "The 'change-cause' principle: when a previously-working system starts failing, the cause is almost always a recent change. Start with what changed. Git log is your friend"
        ]
      },
      {
        name: "Writing The Post-Mortem",
        items: [
          "Timeline: minute-by-minute. What happened, when, and who knew. Be boring and precise",
          "Root cause: written in system terms, not human terms. 'The canary gate did not detect the regression because it wasn't running' — not 'Alex forgot to enable the canary'",
          "Contributing factors: the other holes in the Swiss cheese. What else had to be true for this to happen?",
          "What we're changing: concrete, dated, owned. 'Add a test for X by next Friday, owned by Jamie.' Vague action items are how the same incident recurs",
          "What we're NOT changing: equally important. List the things that felt tempting but aren't the real fix. Prevents cargo-cult responses"
        ]
      }
    ],
    resources: [
      { name: "Google SRE Book — Postmortem Culture", url: "https://sre.google/sre-book/postmortem-culture/", note: "The gold standard for blameless post-mortems, free online" },
      { name: "How Complex Systems Fail (Richard Cook)", url: "https://how.complexsystems.fail/", note: "Same paper as Phase 2 — worth re-reading with RCA in mind" },
      { name: "5 Whys — Toyota Production System origin", url: "https://en.wikipedia.org/wiki/Five_whys", note: "Origin story plus the classic examples" }
    ],
    deeper: "Read 'The Field Guide to Understanding Human Error' by Sidney Dekker. It's a short, dense book that will permanently change how you think about 'human error' in complex systems — specifically, it argues that 'human error' is never a cause, only a symptom of deeper systemic issues. After that, read John Allspaw's essay 'The Infinite Hows' for a modern take on why asking 'why' 5 times is actually less useful than asking 'how' to open up the possibility space."
  },
  {
    id: 5,
    title: "Feedback Loops",
    subtitle: "Outputs Become Inputs",
    time: "1 week",
    icon: "↻",
    color: "#C79B9B",
    intro: "A feedback loop is any situation where the output of a process becomes an input to the same process. Every non-trivial system has them. Most of the interesting behavior you see — compounding growth, runaway failures, stable equilibria, oscillation — comes from loops, not from individual parts. Once you can spot loops, you can predict behavior that looks magical to people who can't. This is the most underrated mental tool in this entire curriculum.",
    sections: [
      {
        name: "The Two Flavors",
        items: [
          "Reinforcing (positive) loop: output amplifies itself. More users → more data → better product → more users. These produce exponential behavior — either growth (compound interest) or collapse (bank run). There's no middle speed",
          "Balancing (negative) loop: output dampens itself. Thermostat: room gets hot → AC turns on → room cools → AC turns off. These produce stability (at a target) or oscillation (if delays are bad)",
          "Every stable system has at least one balancing loop holding it at a level. Every growing or collapsing system has at least one reinforcing loop driving it. If you can't find either, you don't understand the system yet",
          "Real systems have MANY loops running simultaneously. The dominant loop can shift — a growing startup is reinforcing (more users → more investment → more hiring → more users) until it hits a balancing loop (more hires → coordination cost → slower shipping → fewer users)"
        ]
      },
      {
        name: "How Delays Wreck Everything",
        items: [
          "A loop with zero delay converges cleanly. A loop with a delay oscillates. A loop with a big delay can oscillate catastrophically",
          "Classic example: the shower knob in a bad hotel. You turn the handle, nothing happens, you turn it more, nothing, you turn it more, then suddenly scalding, you crank cold, freezing, you crank hot, scalding. The water temp and your hand are in a balancing loop, but the pipe delay means you're always correcting what was true five seconds ago",
          "Same pattern in engineering: CPU autoscalers that react to 5-minute averages and over-provision for spikes. Code review cycles where feedback arrives 2 days after the PR was written and is no longer actionable. Sales compensation changes that don't show up in behavior until Q+2",
          "Fix: either reduce the delay or slow down your control input. You cannot ignore the delay — it will ignore you back"
        ]
      },
      {
        name: "Loops In Software",
        items: [
          "Error → retry → more load → more errors. Classic reinforcing loop. This is why exponential backoff + jitter exists. Without it, the first failure takes down the system",
          "Slow query → timeout → retry → queue builds → slower queries → more timeouts. Same loop, different stock. Fix: circuit breakers that detect the loop and cut the flow",
          "Test flakes → people stop trusting CI → people skip failing tests → more bugs reach production → more tests added → more flakes. Vicious reinforcing loop — the 'fix more tests' response STRENGTHENS it",
          "Logging too much → disk fills → logs rotate → lose the logs you needed → add more logging → disk fills faster. Fix: ask whether the new logs serve a specific question, not 'just in case'",
          "Cache miss → DB query → DB slow → cache rebuild slow → cache miss again. 'Thundering herd.' Fix: request coalescing and stampede protection"
        ]
      },
      {
        name: "Loops In Careers And Teams",
        items: [
          "Trust loop (reinforcing): a teammate delivers → you delegate more → they grow → they deliver more. Conversely, someone drops a ball → you delegate less → they get less practice → they drop more. Small events compound",
          "Writing loop: you write more → you think more clearly → your work gets more leverage → you have more to write about. The reason every senior engineer eventually writes",
          "Bad meeting loop (balancing but stuck): meetings get long → people tune out → decisions get made in side channels → the meeting tries to re-litigate them → meetings get longer. The meeting is holding itself at a dysfunctional equilibrium",
          "Your job, when you see a loop, is to decide: is this a loop I want to strengthen, weaken, or break? Then intervene at the highest-leverage point — usually the delay or the gain, not the stocks themselves"
        ]
      }
    ],
    resources: [
      { name: "Systems Thinking Primer — Causal Loop Diagrams", url: "https://thesystemsthinker.com/causal-loop-construction-the-basics/", note: "How to actually draw a loop diagram" },
      { name: "Tail at Scale (Dean & Barroso)", url: "https://research.google/pubs/the-tail-at-scale/", note: "The canonical paper on how feedback loops cause latency tail issues at scale" },
      { name: "Release It! (Michael Nygard)", url: "https://pragprog.com/titles/mnee2/release-it-second-edition/", note: "A whole book of reinforcing loops in production systems and how to break them" }
    ],
    deeper: "Read Donella Meadows's essay 'Places to Intervene in a System' (linked in Phase 2) with a specific focus on the parameter / delay / feedback-loop-strength hierarchy. It argues that most interventions happen at the wrong leverage point — people tweak parameters when they should be changing loops, and change loops when they should be changing the paradigm. Then read the chapter on 'stability and resilience' in Holling's adaptive management work — it's the ecology version of the same ideas and it rewires how you think about systems that have to survive shocks."
  },
  {
    id: 6,
    title: "The Lattice of Mental Models",
    subtitle: "Synthesis: Building Your Own Toolkit",
    time: "1–2 weeks",
    icon: "◇",
    color: "#C79B9B",
    intro: "The first five phases gave you five tools. This phase is about treating mental models as a collection — a 'latticework,' in Charlie Munger's phrase — and learning to reach for the right tool when the situation calls for it. The goal isn't to memorize every model in existence. The goal is to have a small set you use constantly, know when each fails, and add new ones deliberately as you encounter problems the current set can't handle.",
    sections: [
      {
        name: "Munger's Core Insight",
        items: [
          "Munger's claim: if you only have one mental model, you'll force every problem to fit it. 'To a man with a hammer, every problem looks like a nail.' Having several models lets you pattern-match faster and fail less",
          "His second claim: the best models come from multiple disciplines, not one. Engineers who only use engineering models miss the psychology of their users. Psychologists who only use psychology models miss the incentives that shape behavior. The lattice is cross-disciplinary on purpose",
          "His third claim: you don't need to master each discipline, only the 'big ideas' — the 2-3 models per field that do 80% of the work. Total toolkit: 50-100 models, not 10,000",
          "The point is not scholarship. The point is better decisions. If a model doesn't change what you'd do, you don't need it yet"
        ]
      },
      {
        name: "A Starter Lattice (Beyond These 5)",
        items: [
          "From economics: opportunity cost, margin vs average, sunk cost fallacy, comparative advantage. 'Every choice is a choice against something else.' The single most underused model in engineering prioritization",
          "From psychology: confirmation bias, availability heuristic, social proof, loss aversion. You cannot debug your own thinking without knowing the specific failure modes of human cognition",
          "From biology: evolution, selection pressure, ecological niches. The best framework for understanding why successful products look the way they do — they're the ones that survived",
          "From statistics: base rates, regression to the mean, survivorship bias, conditional probability. Protect you from the most common forms of bad-data reasoning",
          "From physics: equilibrium, conservation laws, entropy. Most useful as metaphors — 'what is conserved here?' and 'what direction does disorder flow?' are genuinely clarifying questions about software systems too"
        ]
      },
      {
        name: "How To Add A Model To Your Lattice",
        items: [
          "Step 1: notice a class of problems you keep getting wrong. Not a single failure — a pattern. 'I keep over-estimating how fast features ship.' That's a signal you need a new model",
          "Step 2: find the model. In the above case, it's the 'planning fallacy' from Kahneman — people systematically underestimate their own task times while correctly estimating others'. Now you know the shape of your error",
          "Step 3: use the model on three real decisions in the next week. Not hypothetically — actually. If it doesn't change what you'd do, you haven't internalized it yet",
          "Step 4: write down the model, its failure modes, and one example of it in action. A paragraph. Keep the file. This is your personal lattice, growing over time",
          "Step 5: revisit the file monthly. Prune models you never use. Promote models you use constantly to 'top of mind.' Treat it like a working garden, not a library"
        ]
      },
      {
        name: "When Models Fight",
        items: [
          "Two models will sometimes give you opposite answers. Occam's razor says 'pick the simpler explanation.' Chesterton's fence says 'don't remove a thing until you understand why it was there.' These can conflict",
          "The right move is not to pick a favorite. It's to notice you're in a zone where both models apply, and recognize that this is exactly the moment where judgment matters. The lattice surfaces the tension — it doesn't resolve it for you",
          "Senior engineers and senior leaders look like they have 'good judgment' partly because they have enough models to see the tradeoffs. What looks like instinct is actually a fast search across a large lattice",
          "Train this deliberately: next time you face a hard call, name 3 mental models that apply, say what each would predict, then decide which prediction you trust more and why. Do this in writing. It gets faster with practice"
        ]
      },
      {
        name: "The Meta-Model",
        items: [
          "All models are wrong; some are useful. (George Box, 1976.) The whole enterprise is pragmatic, not ideological",
          "Your models are quietly shaping what you even see. The phrase 'I had no choice' almost always means 'my models made other options invisible to me.' Add a model and the option space widens",
          "The ultimate exam: can you argue the other side? If you can't state the strongest version of a view you disagree with, you don't have a model of that view — you have a caricature",
          "This is where the thinking-tools curriculum meets everything else. Every other curriculum you take is downstream of this one. You don't use mental models INSTEAD of learning Python or RAG or credit spreads — you use them TO learn those things faster and apply them more wisely"
        ]
      }
    ],
    resources: [
      { name: "Poor Charlie's Almanack — Charlie Munger", url: "https://www.stripe.press/poor-charlies-almanack", note: "Stripe Press edition, free online. The source of the 'latticework' concept" },
      { name: "Farnam Street — Mental Models", url: "https://fs.blog/mental-models/", note: "Shane Parrish's running catalog. Great index, shallow on any one entry — use it as a map" },
      { name: "Thinking, Fast and Slow (Kahneman)", url: "https://us.macmillan.com/books/9780374533557/thinkingfastandslow", note: "The single best book on the psychology models every decision-maker should know" },
      { name: "Super Thinking (Weinberg & McCann)", url: "https://superthinking.com/", note: "A modern, engineer-friendly tour of ~300 mental models, organized by use case" }
    ],
    deeper: "Once you have a working lattice, the next level up is learning how models are BUILT, not just used. Read George Box's paper 'Science and Statistics' (1976) for the 'all models are wrong' frame in its original context. Then read Scott Page's The Model Thinker, which is a rigorous survey of 40+ formal models from social science, with the math. Finally, read the first half of Judea Pearl's The Book of Why — it makes the case that causal models are fundamentally different from correlational ones and gives you the vocabulary to tell when you need each. After that, you're effectively doing philosophy of science, and that's the right rabbit hole to be in."
  }
];

const PRIORITY_MAP = {
  "Debugging mindset": [4, 2, 5],
  "Building from scratch": [1, 3, 6],
  "Complex systems": [2, 5, 6],
  "Learning fast": [1, 3, 6],
  "Better decisions": [1, 6]
};

function CodeBlock({ code }) {
  return (
    <pre style={{
      background: "#0A0606",
      border: "1px solid rgba(199,155,155,0.1)",
      borderRadius: 8,
      padding: "16px 20px",
      overflowX: "auto",
      fontSize: 13,
      lineHeight: 1.65,
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      color: "#D7C5C5",
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
      background: "rgba(199,155,155,0.03)",
      border: "1px solid rgba(199,155,155,0.08)",
      borderRadius: 8,
      textDecoration: "none",
      color: "#D7C5C5",
      transition: "all 0.2s",
      marginBottom: 6,
      fontSize: 13
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(226,184,184,0.3)"; e.currentTarget.style.background = "rgba(199,155,155,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(199,155,155,0.08)"; e.currentTarget.style.background = "rgba(199,155,155,0.03)"; }}>
      <span style={{ flexShrink: 0, color: "#E2B8B8" }}>↗</span>
      <span style={{ flex: 1 }}>
        <strong style={{ color: "#EFD9D9", fontWeight: 500 }}>{r.name}</strong>
        {r.note && <span style={{ color: "#8C7474", marginLeft: 6, fontStyle: "italic" }}>— {r.note}</span>}
      </span>
    </a>
  );
}

function PhaseContent({ phase }) {
  const [showDeeper, setShowDeeper] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: "#D7C5C5", margin: 0 }}>{phase.intro}</p>
      {phase.sections?.map((section, si) => (
        <div key={si}>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 14px", fontWeight: 600, paddingBottom: 8, borderBottom: `1px solid ${phase.color}22` }}>{section.name}</h4>
          {section.items.map((item, ii) => (
            <div key={ii} style={{ padding: "10px 0", borderBottom: "1px solid rgba(199,155,155,0.05)", fontSize: 14, color: "#D7C5C5", lineHeight: 1.7 }}>{item}</div>
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
          <button onClick={() => setShowDeeper(!showDeeper)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px dashed rgba(199,155,155,0.15)", color: "#8C7474", fontSize: 13, padding: "10px 16px", borderRadius: 8, cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color; e.currentTarget.style.color = phase.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(199,155,155,0.15)"; e.currentTarget.style.color = "#8C7474"; }}>
            <span style={{ transform: showDeeper ? "rotate(90deg)" : "none", transition: "transform 0.2s", fontSize: 10 }}>▶</span>
            Want to go deeper?
          </button>
          {showDeeper && <p style={{ fontSize: 13, color: "#8C7474", lineHeight: 1.75, padding: "14px 16px", margin: "8px 0 0", background: "rgba(199,155,155,0.03)", borderRadius: 8, fontStyle: "italic", borderLeft: `2px solid ${phase.color}33` }}>{phase.deeper}</p>}
        </div>
      )}
    </div>
  );
}

export default function ThinkingToolsRoadmap({ onBack }) {
  const [activePhase, setActivePhase] = useState(1);
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('thinking-tools-roadmap-progress');
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
      .eq('curriculum', 'thinking-tools')
      .single();
    if (data?.completed_phases) {
      skipSync.current = true;
      setCompleted(new Set(data.completed_phases));
      localStorage.setItem('thinking-tools-roadmap-progress', JSON.stringify(data.completed_phases));
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
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  useEffect(() => {
    const arr = [...completed];
    try { localStorage.setItem('thinking-tools-roadmap-progress', JSON.stringify(arr)); } catch {}
    if (skipSync.current) { skipSync.current = false; return; }
    if (!supabase || !user) return;
    supabase.from('user_progress').upsert({
      user_id: user.id,
      curriculum: 'thinking-tools',
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
    <div style={{ fontFamily: "'Newsreader', Georgia, serif", background: "#120C0C", color: "#EFD9D9", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <header style={{ padding: "14px 24px", borderBottom: "1px solid rgba(199,155,155,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#120C0C", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#8C7474", fontSize: 13, cursor: "pointer", padding: "4px 8px", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          )}
          <button onClick={() => setShowNav(!showNav)} style={{ background: "none", border: "none", color: "#EFD9D9", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>{showNav ? "✕" : "☰"}</button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: -0.3, fontFamily: "'DM Sans', sans-serif" }}>Thinking <span style={{ color: "#C79B9B" }}>Tools</span></h1>
            <p style={{ fontSize: 10, color: "#8C7474", margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>Mental models for builders</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#8C7474", fontFamily: "'IBM Plex Mono', monospace" }}>{completed.size}/{PHASES.length}</span>
          <div style={{ width: 80, height: 4, background: "rgba(199,155,155,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #C79B9B, #E2B8B8)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          {supabase && !authLoading && (
            user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                <span style={{ fontSize: 12, color: "#8C7474", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(199,155,155,0.15)", color: "#8C7474", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>Sign out</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setAuthMode('signin'); setAuthError(''); }} style={{ background: "rgba(199,155,155,0.1)", border: "1px solid rgba(199,155,155,0.2)", color: "#C79B9B", fontSize: 11, padding: "4px 12px", borderRadius: 6, cursor: "pointer", marginLeft: 8 }}>Sign in</button>
            )
          )}
        </div>
      </header>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <nav style={{ width: showNav ? 300 : 0, minWidth: showNav ? 300 : 0, borderRight: showNav ? "1px solid rgba(199,155,155,0.08)" : "none", overflow: "hidden", transition: "all 0.3s ease", background: "#0C0808", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {PHASES.map(p => (
              <button key={p.id} onClick={() => { setActivePhase(p.id); setShowNav(false); }}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", background: activePhase === p.id ? `${p.color}0D` : "transparent", border: activePhase === p.id ? `1px solid ${p.color}1A` : "1px solid transparent", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                <span onClick={(e) => { e.stopPropagation(); toggleComplete(p.id); }}
                  style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: completed.has(p.id) ? `2px solid ${p.color}` : "2px solid rgba(199,155,155,0.15)", background: completed.has(p.id) ? `${p.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: p.color, cursor: "pointer", transition: "all 0.2s" }}>
                  {completed.has(p.id) ? "✓" : ""}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: activePhase === p.id ? 600 : 400, color: activePhase === p.id ? "#EFD9D9" : "#8C7474", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: p.color, marginRight: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{String(p.id).padStart(2, "0")}</span>{p.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#5C4444", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.subtitle}</div>
                </div>
                <span style={{ fontSize: 10, color: "#5C4444", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>{p.time}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: "1px solid rgba(199,155,155,0.08)" }}>
            <h4 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#5C4444", margin: "0 0 10px", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>Focus Tracks</h4>
            {Object.entries(PRIORITY_MAP).map(([activity, ids]) => (
              <button key={activity} onClick={() => { setActivePhase(ids[0]); setShowNav(false); }}
                style={{ display: "block", width: "100%", padding: "6px 0", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, color: "#8C7474", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#C79B9B"}
                onMouseLeave={e => e.currentTarget.style.color = "#8C7474"}>
                {activity} → {ids.map(id => String(id).padStart(2, "0")).join(", ")}
              </button>
            ))}
          </div>
        </nav>
        <main ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "40px 32px 80px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: phase.color, fontWeight: 600 }}>Phase {String(phase.id).padStart(2, "0")}</span>
              <span style={{ fontSize: 12, color: "#5C4444", fontFamily: "'IBM Plex Mono', monospace" }}>{phase.time}</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: phase.color, marginRight: 8 }}>{phase.icon}</span>{phase.title}
            </h2>
            <p style={{ fontSize: 17, color: "#8C7474", margin: 0, fontWeight: 300 }}>{phase.subtitle}</p>
          </div>
          <button onClick={() => toggleComplete(phase.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", background: completed.has(phase.id) ? `${phase.color}0D` : "rgba(199,155,155,0.03)", border: `1px solid ${completed.has(phase.id) ? phase.color + "33" : "rgba(199,155,155,0.08)"}`, borderRadius: 8, cursor: "pointer", color: completed.has(phase.id) ? phase.color : "#8C7474", fontSize: 13, fontWeight: 500, marginBottom: 32, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${completed.has(phase.id) ? phase.color : "rgba(199,155,155,0.2)"}`, background: completed.has(phase.id) ? `${phase.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, transition: "all 0.2s" }}>
              {completed.has(phase.id) ? "✓" : ""}
            </span>
            {completed.has(phase.id) ? "Completed" : "Mark as completed"}
          </button>
          <PhaseContent phase={phase} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(199,155,155,0.08)" }}>
            <button onClick={() => activePhase > 1 && setActivePhase(activePhase - 1)} disabled={activePhase === 1}
              style={{ padding: "10px 20px", background: activePhase === 1 ? "transparent" : "rgba(199,155,155,0.03)", border: `1px solid ${activePhase === 1 ? "transparent" : "rgba(199,155,155,0.08)"}`, borderRadius: 8, color: activePhase === 1 ? "#3A2828" : "#8C7474", cursor: activePhase === 1 ? "default" : "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              ← Previous
            </button>
            <button onClick={() => activePhase < PHASES.length && setActivePhase(activePhase + 1)} disabled={activePhase === PHASES.length}
              style={{ padding: "10px 20px", background: activePhase === PHASES.length ? "transparent" : `${PHASES[activePhase]?.color || phase.color}0D`, border: `1px solid ${activePhase === PHASES.length ? "transparent" : (PHASES[activePhase]?.color || phase.color) + "22"}`, borderRadius: 8, color: activePhase === PHASES.length ? "#3A2828" : PHASES[activePhase]?.color || phase.color, cursor: activePhase === PHASES.length ? "default" : "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
              Next: {PHASES[activePhase]?.title || "Done"} →
            </button>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div onClick={() => setShowAuthModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1F1414", border: "1px solid rgba(199,155,155,0.15)", borderRadius: 12, padding: 32, width: 340, maxWidth: "90vw" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{authMode === 'signin' ? 'Sign in' : 'Create account'}</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#8C7474" }}>Sync your progress across devices</p>
            <form onSubmit={handleAuth}>
              <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px 12px", background: "rgba(199,155,155,0.05)", border: "1px solid rgba(199,155,155,0.15)", borderRadius: 6, color: "#EFD9D9", fontSize: 13, marginBottom: 8, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(199,155,155,0.05)", border: "1px solid rgba(199,155,155,0.15)", borderRadius: 6, color: "#EFD9D9", fontSize: 13, marginBottom: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              {authError && <p style={{ fontSize: 12, color: authError.includes('Check your email') ? '#E2B8B8' : '#C79B9B', margin: "0 0 12px" }}>{authError}</p>}
              <button type="submit" disabled={authSubmitting}
                style={{ width: "100%", padding: "10px", background: "#C79B9B", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: authSubmitting ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: authSubmitting ? 0.7 : 1 }}>
                {authSubmitting ? '...' : authMode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </form>
            <p style={{ margin: "16px 0 0", fontSize: 12, color: "#8C7474", textAlign: "center" }}>
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(''); }} style={{ color: "#C79B9B", cursor: "pointer" }}>
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
