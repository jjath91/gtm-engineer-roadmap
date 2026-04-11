import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

const PHASES = [
  {
    id: 1,
    title: "Foundational Knowledge",
    subtitle: "The Mental Model of Money",
    time: "1–2 months",
    icon: "◈",
    color: "#5B9AAE",
    intro: "Before you memorize tax rules and securities law, build a real mental model of how money, markets, and households actually work. This phase is curated reading, free courses, and podcasts — immersion, not memorization. Your goal is to think like a financial planner before you study like one.",
    sections: [
      {
        name: "Core Reading List",
        items: [
          "The Richest Man in Babylon (Clason) — the mindset foundation: pay yourself first, make your money work for you, the compounding principle behind every financial plan",
          "The Psychology of Money (Housel) — behavioral finance essentials. You will advise humans, not spreadsheets. This book is the shortest path to understanding why people make irrational money decisions",
          "A Random Walk Down Wall Street (Malkiel) — efficient markets, index investing, asset allocation. The theoretical foundation that justifies the fee-only fiduciary model",
          "The Bogleheads' Guide to Investing — the practical implementation of Malkiel's theory. The investment philosophy most fee-only planners actually use",
          "The Truth About Money (Edelman) — breadth across insurance, taxes, estate, retirement. A layperson-readable map of the whole planning landscape",
          "Financial Planning Fundamentals (Dalton) — textbook-level introduction to the CFP Body of Knowledge. Your bridge from reading to coursework"
        ]
      },
      {
        name: "Free Online Learning",
        items: [
          "Khan Academy: Finance and Capital Markets — time value of money, stocks, bonds, mutual funds, and economic principles, explained with whiteboard clarity",
          "Investopedia Financial Advisor Track — comprehensive guides on planning, vehicles, tax strategies, and insurance products. Reference-grade material, free",
          "CFP Board Principal Knowledge Topics — download the official scope of what you'll be tested on. Read it early so the shape of the field is familiar",
          "MIT OpenCourseWare: Finance Theory I (15.401) — free lectures from a top program. Optional but excellent if you want academic depth"
        ]
      },
      {
        name: "Podcasts for Immersion",
        items: [
          "Kitces & Carl — Michael Kitces and Carl Richards on the practice of financial planning. Industry insight and soft skills from the most respected voice in the field",
          "The Perfect RIA — Matthew Jarvis and Micah Shilanski on tactical practice management for independent advisors",
          "Animal Spirits — Batnick and Carlson on markets and behavioral finance in an accessible weekly format",
          "The Money Guy Show — broad personal finance topics relevant to everyday advising conversations"
        ]
      }
    ],
    resources: [
      { name: "Khan Academy — Finance & Capital Markets", url: "https://www.khanacademy.org/economics-finance-domain/core-finance", note: "Free foundational finance" },
      { name: "Investopedia Financial Advisor", url: "https://www.investopedia.com/financial-advisor-4427779", note: "Reference-grade guides" },
      { name: "CFP Board Principal Knowledge Topics", url: "https://www.cfp.net/", note: "Official scope of practice" },
      { name: "Kitces.com", url: "https://www.kitces.com/", note: "The industry blog to read daily" }
    ],
    deeper: "If you want a more rigorous academic base, work through Bodie, Kane, and Marcus's 'Investments' — the MBA-level textbook used in most university finance programs. Pair it with Robert Shiller's free Yale lectures on Financial Markets (available on YouTube) for a behavioral complement."
  },
  {
    id: 2,
    title: "Series 65 Exam",
    subtitle: "Your Fastest Path to Licensed",
    time: "8–12 weeks",
    icon: "§",
    color: "#C4A55E",
    intro: "The Series 65 (Uniform Investment Adviser Law Examination) is the single most important exam for your goal. Unlike the Series 7, it requires no sponsor — anyone can register and sit. Passing qualifies you to register as an Investment Adviser Representative (IAR) and legally charge fees for advice. This is the fastest path from zero to practicing.",
    sections: [
      {
        name: "Exam at a Glance",
        items: [
          "130 scored questions + 10 unscored pretest questions, 180 minutes, administered by FINRA at Prometric testing centers year-round",
          "Passing score: ~70.8% — you need at least 92 of 130 scored questions correct",
          "Exam fee: $187. No sponsor required. Estimated first-time pass rate: 65–70%",
          "Prerequisites: none. You can register and schedule as soon as you're ready"
        ]
      },
      {
        name: "Content Breakdown",
        items: [
          "Economic Factors and Business Information — 15% (~20 questions). Your revenue ops background makes this the easiest section",
          "Investment Vehicle Characteristics — 25% (~32 questions). New material: stocks, bonds, mutual funds, ETFs, options, alternatives",
          "Client Investment Recommendations and Strategies — 30% (~39 questions). The largest section. Suitability, risk tolerance, portfolio construction",
          "Laws, Regulations, and Guidelines (including Fiduciary) — 30% (~39 questions). The most unfamiliar material. Uniform Securities Act, registration, prohibited practices"
        ]
      },
      {
        name: "Prep Providers",
        items: [
          "Kaplan Financial ($300–$500) — industry standard. Textbook + practice exams + online Q-bank. The safe default",
          "ExamFX ($200–$350) — more affordable. Solid practice questions and simulated exams",
          "Pass Perfect ($200–$400) — strong question bank with detailed explanations",
          "Achievable ($99–$199) — app-based adaptive learning. Budget-friendly, great for supplementing a primary provider"
        ]
      },
      {
        name: "8–12 Week Study Plan",
        items: [
          "Weeks 1–2: Economic Factors and Investment Vehicles. Read textbook chapters 1–6, start Anki flashcards",
          "Weeks 3–4: Securities characteristics, portfolio theory, asset allocation, options basics",
          "Weeks 5–6: Client Recommendations and Fiduciary Duty. Suitability vs fiduciary, risk assessment, ethics",
          "Weeks 7–8: Laws and Regulations. Uniform Securities Act, registration, state vs federal jurisdiction — the hardest section, dedicate extra time",
          "Weeks 9–10: Full practice exams. Take 3–5 timed, analyze weak areas, re-do missed questions. Target 75%+ before scheduling",
          "Weeks 11–12: Light review, flashcard pass, schedule and take the exam. Confidence > cramming"
        ]
      },
      {
        name: "Ongoing IAR Continuing Education",
        items: [
          "Passing the Series 65 isn't a one-time requirement. NASAA has adopted a model rule requiring Investment Adviser Representatives to complete annual continuing education, and a growing number of states have adopted it",
          "The requirement: 12 CE credits per year, split between 6 credits of Products and Practice and 6 credits of Ethics and Professional Responsibility",
          "As soon as you register as an IAR, you're on the hook for this ongoing obligation. Budget roughly $100–$300/year for CE courses",
          "Check your state securities regulator's website to confirm current CE requirements before you register — adoption varies by state"
        ]
      },
      {
        name: "Alternative Path: Series 66 + Series 7",
        items: [
          "The Series 66 combined with the Series 7 is an alternative path you'll see mentioned. The 66 covers both state securities law and investment adviser law, but it assumes you already hold a Series 7 (which qualifies you to sell securities products for a broker-dealer)",
          "This path makes sense only for advisors who want to be dually registered — providing advice AND selling commission-based products",
          "Why this path is NOT recommended for a fee-only practice: the Series 7 requires employer sponsorship by a FINRA member firm, meaning you can't take it independently as a side hustler",
          "Fee-only practices don't require (and are actually incompatible with) commission-based product sales. Dual registration adds compliance complexity that's unnecessary for comprehensive planning",
          "The Series 65 path is faster, cheaper, and fits the fee-only RIA model you're building toward. Worth knowing the alternative exists, but stick with Series 65"
        ]
      }
    ],
    resources: [
      { name: "FINRA — Series 65 Exam", url: "https://www.finra.org/registration-exams-ce/qualification-exams/series65", note: "Official exam page" },
      { name: "Kaplan Series 65 Prep", url: "https://www.kaplanfinancial.com/securities/exam-prep/series-65", note: "Industry standard" },
      { name: "Achievable Series 65", url: "https://achievable.me/courses/finra-series-65", note: "Budget adaptive option" },
      { name: "NASAA Exam Information", url: "https://www.nasaa.org/exams/", note: "Uniform exam governance" }
    ],
    deeper: "For deeper grounding in the legal material, read the actual text of the Investment Advisers Act of 1940 and the Uniform Securities Act. The exam tests your understanding of these statutes, and reading the source makes the prep book material stick. Also study SEC Release IA-1092, which defines who counts as an investment adviser."
  },
  {
    id: 3,
    title: "Professional Conduct & Regulation",
    subtitle: "CFP Domain 1 — Ethics & Fiduciary Duty",
    time: "30–40 hours",
    icon: "⚖",
    color: "#8BB4C4",
    intro: "This domain is the ethical and regulatory spine of the profession. The CFP fiduciary standard is stricter than the broker-dealer suitability standard, and understanding the difference is what separates an advisor from a salesperson. Everything you do in practice will be governed by the principles in this domain.",
    sections: [
      {
        name: "The 4 Es of CFP Certification",
        items: [
          "Before diving into Domain 1, understand how all four CFP requirements fit together. The CFP Board calls them the '4 Es' — Education, Exam, Experience, and Ethics. All four are required",
          "Education (1st E): bachelor's degree + CFP Board-registered coursework covering the eight knowledge domains + a required capstone course. Your Poli Sci degree satisfies the bachelor's requirement",
          "Exam (2nd E): pass the 170-question CFP exam. Offered March, July, and November each year. ~63% first-time pass rate",
          "Experience (3rd E): 6,000 hours of qualifying financial planning experience (Standard Pathway) or 4,000 hours supervised (Apprenticeship Pathway). This is the biggest bottleneck for career changers — see Phase 14",
          "Ethics (4th E): sign an ethics declaration, pass a background check, and agree to the CFP Board's Code of Ethics and Standards of Conduct. Ongoing — fiduciary duty applies throughout your career",
          "Phases 3–10 cover the Education piece (the eight domains). Phase 14 covers Exam, Experience, and the capstone. Ethics is baked into this phase (Domain 1) and your daily practice"
        ]
      },
      {
        name: "Fiduciary Standards",
        items: [
          "Fiduciary duty = act in the client's best interest, disclose conflicts, avoid self-dealing. This is the highest legal standard in the profession",
          "Suitability standard (broker-dealers) vs. fiduciary standard (RIAs and CFPs) — suitability only requires that a recommendation fit the client, not that it be the best available option",
          "The CFP Board's Code of Ethics and Standards of Conduct applies any time you're giving 'financial advice' — broader than just planning engagements",
          "Duties of loyalty, care, and good faith. 'Sole interest' vs 'best interest' — subtle but testable distinction"
        ]
      },
      {
        name: "Regulatory Framework",
        items: [
          "Investment Advisers Act of 1940 — the federal law that defines investment advisers and establishes SEC oversight",
          "State vs. federal registration: under $100M AUM = state-registered (with your state's securities regulator); over $100M = SEC-registered",
          "Form ADV Parts 1, 2A, and 2B — the disclosure documents every RIA must file and deliver to clients",
          "Prohibited practices: misrepresentation, churning, front-running, unauthorized trading, commingling client funds with firm assets"
        ]
      },
      {
        name: "CFP Board Standards",
        items: [
          "The 7-step financial planning process: (1) understand circumstances, (2) identify goals, (3) analyze current situation, (4) develop recommendations, (5) present, (6) implement, (7) monitor and update",
          "Material conflicts of interest must be disclosed in writing. Compensation disclosure is mandatory",
          "Competency, diligence, and confidentiality — the pillars of the CFP Code of Ethics",
          "Disciplinary process: complaints go to the CFP Board's Disciplinary and Ethics Commission. Sanctions range from private censure to permanent revocation"
        ]
      }
    ],
    resources: [
      { name: "CFP Board Code of Ethics", url: "https://www.cfp.net/ethics/code-of-ethics-and-standards-of-conduct", note: "Read cover to cover" },
      { name: "SEC Investment Advisers Act Overview", url: "https://www.sec.gov/about/laws/iaa40.pdf", note: "The statute itself" },
      { name: "Form ADV Guide", url: "https://www.sec.gov/about/forms/formadv.pdf", note: "Understand what you'll file" }
    ],
    deeper: "Read Tamar Frankel's 'Fiduciary Law' for the scholarly theory of fiduciary duty across professions. For the recent regulatory evolution, read the SEC's 'Regulation Best Interest' (Reg BI) release and compare it to the CFP Board's higher standard — the gap is instructive."
  },
  {
    id: 4,
    title: "Planning Principles",
    subtitle: "CFP Domain 2 — The Planning Process",
    time: "40–50 hours",
    icon: "◐",
    color: "#6BB6A0",
    intro: "The mechanics of the financial planning process itself — how to gather data, frame goals, communicate with clients, and apply the time value of money. This is the domain where soft skills meet quantitative rigor. Your program management background at Google and S&P Global translates directly here.",
    sections: [
      {
        name: "The Planning Process",
        items: [
          "Data gathering: quantitative (balance sheet, cash flow, insurance, tax returns) and qualitative (goals, values, risk tolerance, family dynamics)",
          "Goal setting: SMART goals, prioritization, trade-offs. Clients rarely articulate goals well — your job is to surface them",
          "Monte Carlo simulation and scenario analysis: probabilistic modeling of financial outcomes, not deterministic forecasts",
          "The ongoing relationship: annual reviews, life-event-triggered updates, performance reporting"
        ]
      },
      {
        name: "Time Value of Money",
        items: [
          "Present value, future value, annuity, perpetuity, growing annuity — the five formulas that underlie every retirement, mortgage, and investment decision",
          "Compounding frequency matters: monthly vs annual compounding produces materially different results over decades",
          "The HP 12C or TI BA II Plus financial calculator — exam-required, memorize the keystrokes cold",
          "Nominal vs real returns: always model retirement goals in real (inflation-adjusted) terms"
        ]
      },
      {
        name: "Client Communication & Behavioral Finance",
        items: [
          "Anchoring, loss aversion, recency bias, overconfidence — the biases that derail client decisions. Your job is partly to protect them from themselves",
          "The 'financial therapy' layer: money is rarely about math; it's about family history, fear, shame, and identity",
          "Framing effects: how you present a recommendation changes whether the client accepts it. This is an ethical responsibility, not manipulation",
          "The discovery meeting: ask open-ended questions, listen 80% of the time, summarize back. Program management meeting discipline transfers directly"
        ]
      }
    ],
    resources: [
      { name: "Kitces: Financial Planning Process Articles", url: "https://www.kitces.com/category/financial-planning/", note: "Deep dives on every step" },
      { name: "Morningstar: Behavioral Finance", url: "https://www.morningstar.com/behavioral-finance", note: "Applied behavioral research" },
      { name: "TVM Calculator Tutorial (BA II Plus)", url: "https://www.tvmcalcs.com/calculators/baiiplus/baiiplus_page1", note: "Master the keystrokes" }
    ],
    deeper: "Read Daniel Kahneman's 'Thinking, Fast and Slow' for the cognitive science underpinning every behavioral finance concept. Then read Meir Statman's 'Finance for Normal People' for the direct application to investing. For the communication layer, Brad Klontz's work on financial psychology is the current gold standard."
  },
  {
    id: 5,
    title: "Education Planning",
    subtitle: "CFP Domain 3 — College & Dependents",
    time: "20–30 hours",
    icon: "⚲",
    color: "#B8C67A",
    intro: "The smallest CFP domain but one of the most common planning engagements. Parents want to know how to pay for college without destroying retirement. This is where tax-advantaged accounts, financial aid strategy, and long-term cash flow planning intersect.",
    sections: [
      {
        name: "Tax-Advantaged Accounts",
        items: [
          "529 plans: state-sponsored, tax-free growth and withdrawals for qualified education expenses. State tax deduction varies. New SECURE 2.0 rule allows up to $35k rollover to a Roth IRA under specific conditions",
          "Coverdell ESAs: $2,000/year contribution limit, more investment flexibility than 529s, can be used for K–12. Phased out at higher incomes",
          "UGMA/UTMA custodial accounts: no contribution limit or tax advantages, but assets become the child's at age of majority. Counted heavily against financial aid",
          "Roth IRAs as education funding: contributions can be withdrawn tax-free anytime; earnings withdrawn for education avoid the 10% penalty (but are still taxed)"
        ]
      },
      {
        name: "Financial Aid & Strategy",
        items: [
          "FAFSA vs CSS Profile: FAFSA is federal and most state aid; CSS Profile is required by ~200 private schools and digs deeper into family finances",
          "Expected Family Contribution (EFC), now Student Aid Index (SAI), determines need-based aid eligibility. Assets in the student's name weighted far more heavily than parental assets",
          "Merit vs need-based aid: merit scholarships have no income cap and are often the bigger lever for middle/upper-middle income families",
          "Order of operations for paying: scholarships → grants → work-study → subsidized loans → 529s → unsubsidized loans → parental resources"
        ]
      },
      {
        name: "Education Tax Benefits",
        items: [
          "American Opportunity Tax Credit: up to $2,500/year per student for first 4 years of undergrad. Phased out at higher AGI",
          "Lifetime Learning Credit: up to $2,000/year, no year limit, works for graduate school. Cannot be claimed in the same year as AOTC for the same student",
          "Student loan interest deduction: up to $2,500/year above-the-line, phased out at higher incomes",
          "Coordination rules: you cannot double-dip between 529 qualified withdrawals and education credits for the same expenses"
        ]
      }
    ],
    resources: [
      { name: "Savingforcollege.com", url: "https://www.savingforcollege.com/", note: "The definitive 529 comparison site" },
      { name: "FAFSA Simplification Act Overview", url: "https://studentaid.gov/announcements-events/fafsa-better", note: "SAI and new aid rules" },
      { name: "IRS Publication 970 — Tax Benefits for Education", url: "https://www.irs.gov/pub/irs-pdf/p970.pdf", note: "Authoritative tax reference" }
    ],
    deeper: "Read Mark Kantrowitz's work on financial aid — he's the most rigorous public analyst of college funding strategy. For a sharper edge, study the recent changes from the FAFSA Simplification Act and how the new SAI methodology has changed optimal 529 contribution strategies for grandparents."
  },
  {
    id: 6,
    title: "Risk Management & Insurance",
    subtitle: "CFP Domain 4 — Protecting the Plan",
    time: "40–50 hours",
    icon: "⛨",
    color: "#D4915E",
    intro: "Insurance is boring until someone needs it. Every financial plan you build assumes certain risks stay uninsured and others get transferred. Mastering this domain means understanding not just the products but the risk-transfer logic behind each one.",
    sections: [
      {
        name: "Life Insurance",
        items: [
          "Term life: pure insurance, cheapest per dollar of coverage, no cash value. The right answer for almost every client with dependents and a mortgage",
          "Whole life / universal life / variable life: permanent insurance with a cash value investment component. Higher premiums, lower returns on the investment portion, but irreplaceable for specific estate planning uses",
          "How much coverage? Human life value approach (future earnings), needs approach (liabilities + income replacement + education + final expenses), or DIME method",
          "When whole life actually makes sense: estate liquidity for illiquid business owners, permanent special-needs trust funding, premium-payer benefit for high earners with maxed tax shelters"
        ]
      },
      {
        name: "Health, Disability, and Long-Term Care",
        items: [
          "Disability insurance is the most underinsured risk in financial planning. A 35-year-old has a higher probability of long-term disability than death before retirement",
          "Own-occupation vs any-occupation policies: own-occ pays if you can't do YOUR specific job (critical for physicians, surgeons, specialized professionals)",
          "Long-term care insurance: the risk is real (70% of 65-year-olds will need some LTC) but the product market is troubled. Hybrid life/LTC policies are increasingly the preferred solution",
          "Health insurance basics: HMO, PPO, HDHP with HSA. HSAs are the most tax-advantaged account in the US tax code (triple tax-free) and should be maxed by every eligible client"
        ]
      },
      {
        name: "Property, Casualty, and Liability",
        items: [
          "Homeowners, auto, and umbrella policies: the baseline liability coverage every client needs. Umbrella is dramatically underpurchased relative to its cost",
          "Coverage limits matter more than premiums. A client with $2M net worth and $500k liability limits is underinsured — one lawsuit can wipe out the plan",
          "Deductibles as self-insurance: higher deductibles lower premiums. Clients with adequate emergency funds should take higher deductibles on predictable risks",
          "Replacement cost vs actual cash value, named perils vs open perils, flood and earthquake riders. Details matter when claims happen"
        ]
      }
    ],
    resources: [
      { name: "III: Insurance Information Institute", url: "https://www.iii.org/", note: "Industry reference on every product line" },
      { name: "Kitces: Insurance Planning", url: "https://www.kitces.com/category/insurance/", note: "Advisor-level analysis" },
      { name: "LIMRA Research", url: "https://www.limra.com/", note: "Industry data on coverage gaps" }
    ],
    deeper: "Read Moshe Milevsky's work on insurance mathematics and longevity risk — he's the academic who rigorously quantifies when annuities make sense. For the property/casualty side, 'Fundamentals of Risk and Insurance' by Vaughan is the standard textbook."
  },
  {
    id: 7,
    title: "Investment Planning",
    subtitle: "CFP Domain 5 — The Largest Domain",
    time: "50–60 hours",
    icon: "∮",
    color: "#7BB4C4",
    intro: "The biggest CFP domain and the one that attracts most clients. Investment planning is where theory (Modern Portfolio Theory, efficient markets) meets practice (actual portfolio construction, tax-efficient allocation, rebalancing). Your goal isn't to pick winners — it's to build portfolios that serve a plan.",
    sections: [
      {
        name: "Portfolio Theory & Asset Allocation",
        items: [
          "Modern Portfolio Theory (Markowitz): the efficient frontier, how diversification reduces risk without sacrificing return, the optimal portfolio for a given risk level",
          "CAPM and beta: systematic risk (priced) vs idiosyncratic risk (diversifiable, not priced). The theoretical foundation of indexing",
          "Asset allocation is the single biggest determinant of portfolio outcomes — Brinson et al. showed it explains over 90% of return variance",
          "Strategic vs tactical allocation: strategic = long-term target weights; tactical = short-term deviations. Most advisors stick with strategic and rebalance rather than market-time"
        ]
      },
      {
        name: "Securities & Vehicles",
        items: [
          "Stocks: common vs preferred, voting rights, dividend taxation (qualified vs ordinary). Large/mid/small cap, growth/value, domestic/international factors",
          "Bonds: duration and convexity (interest-rate sensitivity), credit quality, yield curve, munis vs corporates vs treasuries. The math of bond pricing is exam-heavy",
          "Mutual funds vs ETFs vs separately managed accounts (SMAs): cost, tax efficiency, transparency, minimums. ETFs win on tax efficiency due to in-kind creation/redemption",
          "Alternatives: REITs, commodities, hedge funds, private equity, structured products. When they add value and when they're just expensive beta"
        ]
      },
      {
        name: "Tax-Efficient Investing",
        items: [
          "Asset location: put tax-inefficient assets (bonds, REITs, active funds) in tax-deferred accounts; put tax-efficient assets (broad index funds, ETFs) in taxable accounts",
          "Tax-loss harvesting: systematically realizing losses to offset gains, up to $3,000/year against ordinary income. Wash sale rule (30 days) is the constraint",
          "Qualified dividends and long-term capital gains taxed at 0%/15%/20%. Short-term gains taxed at ordinary rates — holding periods matter",
          "Rebalancing: periodic (e.g., annual) vs threshold-based (e.g., 5% drift). In taxable accounts, use cash flows and dividends to rebalance without realizing gains"
        ]
      }
    ],
    resources: [
      { name: "Bogleheads Wiki — Investing", url: "https://www.bogleheads.org/wiki/Main_Page", note: "Free, rigorous, practical" },
      { name: "Morningstar Investing Classroom", url: "https://www.morningstar.com/start-investing", note: "Structured lessons" },
      { name: "Kitces: Investment Articles", url: "https://www.kitces.com/category/investments/", note: "Advisor-grade analysis" }
    ],
    deeper: "Read Andrew Ang's 'Asset Management: A Systematic Approach to Factor Investing' for the academic frontier of portfolio construction. For the indexing-vs-active debate, Charley Ellis's 'Winning the Loser's Game' is the definitive case. Swensen's 'Unconventional Success' is the best book on individual investor portfolio design."
  },
  {
    id: 8,
    title: "Tax Planning",
    subtitle: "CFP Domain 6 — Where Real Value Lives",
    time: "40–50 hours",
    icon: "%",
    color: "#B8824F",
    intro: "Tax planning is where a good advisor creates measurable, year-over-year dollar value for clients. Unlike investment returns (which you don't control), taxes are deterministic — and the US tax code is full of legal optimizations most people never use. Master this domain and you justify your fee for life.",
    sections: [
      {
        name: "Individual Tax Law Basics",
        items: [
          "Marginal vs effective tax rates: clients constantly confuse these. Your marginal rate determines the value of a deduction; your effective rate describes your actual tax burden",
          "Filing status, standard deduction vs itemizing, above-the-line vs below-the-line deductions. Post-TCJA, the standard deduction is high enough that most clients no longer itemize",
          "Capital gains: long-term (>1 year, preferential rates) vs short-term (ordinary rates). Qualified dividends same rates as long-term gains",
          "AMT (Alternative Minimum Tax): parallel tax system that catches taxpayers with lots of preference items. Less common post-TCJA but still relevant for ISO exercises"
        ]
      },
      {
        name: "Tax-Advantaged Strategies",
        items: [
          "Tax-deferred (traditional 401k/IRA) vs tax-free (Roth): the fundamental choice is 'do I pay tax now or later?' — answer depends on current vs expected future marginal rates",
          "Backdoor Roth IRA: high earners can still contribute to Roth via nondeductible traditional contribution + immediate conversion. Watch the pro-rata rule",
          "Mega backdoor Roth: after-tax 401k contributions converted to Roth, up to the $70k total 401k limit. Available if your plan allows",
          "Qualified Charitable Distributions (QCDs): direct IRA-to-charity transfers at age 70½+ satisfy RMDs without increasing AGI. One of the best tools for charitable retirees"
        ]
      },
      {
        name: "Equity Compensation (Your Niche)",
        items: [
          "RSUs: taxed as ordinary income at vesting. The share withholding default (often 22%) is insufficient for high earners — clients often owe more at filing",
          "ISOs (Incentive Stock Options): no regular tax at exercise, but the spread is an AMT preference item. Long-term capital gains treatment if held 2 years from grant + 1 year from exercise",
          "NSOs (Non-qualified Stock Options): ordinary income at exercise on the spread, capital gains on post-exercise appreciation",
          "ESPP (Employee Stock Purchase Plans): qualified plans offer 15% discount + lookback provision. Nearly always a guaranteed return — clients should max contributions",
          "Section 83(b) election: for restricted stock, elect to pay tax now at grant instead of at vesting. High-risk/high-reward for early-stage equity"
        ]
      }
    ],
    resources: [
      { name: "IRS Publication 17", url: "https://www.irs.gov/pub/irs-pdf/p17.pdf", note: "Individual tax reference" },
      { name: "Kitces: Tax Planning", url: "https://www.kitces.com/category/taxes/", note: "The deepest tax content for advisors" },
      { name: "Tax Foundation — TCJA Analysis", url: "https://taxfoundation.org/", note: "Policy and rate context" }
    ],
    deeper: "Read 'Tax-Smart Investing' by Andrew Westlin for the advisor-level tax optimization playbook. For equity compensation, myStockOptions.com is the most comprehensive resource. The AICPA Tax Section publishes the Journal of Accountancy, which covers current tax issues at a technical depth that most advisors never reach — a genuine edge."
  },
  {
    id: 9,
    title: "Retirement Planning",
    subtitle: "CFP Domain 7 — Accumulation & Decumulation",
    time: "50–60 hours",
    icon: "◉",
    color: "#9B8BC4",
    intro: "Retirement planning is two completely different problems: accumulating enough wealth while working, and then drawing it down for 30+ years without running out. The decumulation phase is harder and less well-studied, which is exactly why advisors who master it command premium fees.",
    sections: [
      {
        name: "Accumulation Vehicles",
        items: [
          "401(k) / 403(b) / 457 plans: employer-sponsored. 2025 limit is $23,500 + $7,500 catch-up at 50+. Match is free money — maxing to the match is universal advice",
          "Traditional vs Roth IRA: 2025 limit is $7,000 + $1,000 catch-up. Traditional deductibility phases out if covered by a workplace plan; Roth contributions phase out by income",
          "SEP-IRA and Solo 401(k) for self-employed: Solo 401(k) allows much larger contributions and Roth option. Critical for your own side practice",
          "HSA as stealth retirement account: triple tax-free, can be used for any expense penalty-free after 65, pays for Medicare premiums and LTC"
        ]
      },
      {
        name: "Social Security & Pensions",
        items: [
          "Claiming strategies: earliest at 62 (25–30% reduction), Full Retirement Age (FRA) for 100%, delayed to 70 for 8%/year delayed retirement credits. Breakeven math and longevity matter",
          "Spousal and survivor benefits: spouses can claim up to 50% of the worker's PIA at FRA. Survivor benefits can be claimed as early as 60 — complex coordination strategies apply",
          "Working while claiming before FRA triggers the earnings test: $1 withheld per $2 earned above the limit. Amounts are returned as credits after FRA",
          "Pension decisions: lump sum vs annuity, single life vs joint and survivor. Quantify the implicit interest rate the pension is offering and compare to current annuity markets"
        ]
      },
      {
        name: "Decumulation & Income Strategies",
        items: [
          "Safe withdrawal rates: the '4% rule' (Bengen 1994) is a baseline, not a law. Kitces and others have shown 4.5% is more defensible for 30-year horizons with diversified portfolios",
          "Sequence-of-returns risk: poor early-retirement market returns permanently damage a portfolio more than poor late returns. Bond tents and bucket strategies mitigate",
          "Required Minimum Distributions (RMDs): start at 73 (rising to 75 in 2033). Missing an RMD triggers a 25% excise tax (reduced from 50% under SECURE 2.0)",
          "Tax-efficient withdrawal sequencing: conventional order is taxable → tax-deferred → Roth, but Roth conversions in low-income years can dramatically reduce lifetime taxes"
        ]
      }
    ],
    resources: [
      { name: "SSA Quick Calculator", url: "https://www.ssa.gov/OACT/quickcalc/", note: "Official benefit estimator" },
      { name: "Kitces: Retirement Planning", url: "https://www.kitces.com/category/retirement-planning/", note: "The field's deepest research" },
      { name: "Boglehead's Guide to Retirement Planning", url: "https://www.bogleheads.org/wiki/Retirement_planning_start-up_kit", note: "Practical playbook" }
    ],
    deeper: "Read Wade Pfau's 'Retirement Planning Guidebook' for the most current research on decumulation strategies. For Social Security specifically, Mary Beth Franklin's work at InvestmentNews is the best advisor-focused coverage. Moshe Milevsky's academic papers on longevity annuities are worth the effort for clients with genuine longevity concerns."
  },
  {
    id: 10,
    title: "Estate Planning",
    subtitle: "CFP Domain 8 — Legacy & Transfer",
    time: "30–40 hours",
    icon: "⌂",
    color: "#A89B7A",
    intro: "Estate planning is the domain where the stakes are highest (billions in transfer tax planning) and the consequences are irreversible (you die, and whatever you did or didn't do becomes permanent). You will not draft documents — that's an attorney's role — but you must know enough to spot issues and coordinate.",
    sections: [
      {
        name: "Core Documents",
        items: [
          "Will: directs distribution of probate assets, names executor and guardians. Everyone needs one, regardless of wealth",
          "Revocable living trust: assets titled to the trust avoid probate, provide incapacity planning, and keep estate details private. The standard tool for middle/upper-middle clients",
          "Durable power of attorney (financial) and healthcare directive: incapacity planning. Less glamorous than wills but often more important during life",
          "Beneficiary designations on retirement accounts, life insurance, and TOD/POD accounts override the will. Review these every 3 years — stale beneficiaries are the most common estate planning failure"
        ]
      },
      {
        name: "Transfer Taxes",
        items: [
          "Federal estate and gift tax exemption: $13.99M per person in 2025 (scheduled to sunset to ~$7M in 2026 unless extended). Most clients will never owe federal estate tax, but planning for the sunset is urgent",
          "Annual gift tax exclusion: $19,000 per donor per recipient in 2025. No reporting required below this threshold. Simple, powerful, underused",
          "Step-up in basis at death: inherited assets get a new cost basis equal to date-of-death value. Holding appreciated assets until death is a powerful strategy for heirs",
          "State estate and inheritance taxes: ~17 states have them, with lower exemptions than federal. Residency planning matters for high-net-worth clients"
        ]
      },
      {
        name: "Advanced Strategies",
        items: [
          "Irrevocable Life Insurance Trusts (ILITs): keep life insurance proceeds out of the taxable estate. Standard tool for wealthy clients",
          "Grantor Retained Annuity Trusts (GRATs), charitable remainder trusts, family limited partnerships — the vocabulary of high-net-worth planning",
          "Charitable giving vehicles: donor-advised funds (DAFs) for flexibility, private foundations for control, charitable lead trusts for generational planning",
          "Generation-skipping transfer (GST) tax: applies to transfers that skip a generation. Has its own exemption ($13.99M) and must be allocated carefully on gift tax returns"
        ]
      }
    ],
    resources: [
      { name: "ACTEC Estate Planning Resources", url: "https://www.actec.org/", note: "Professional estate planning association" },
      { name: "Kitces: Estate Planning", url: "https://www.kitces.com/category/estate-planning/", note: "Advisor-level deep dives" },
      { name: "IRS Estate & Gift Tax", url: "https://www.irs.gov/businesses/small-businesses-self-employed/estate-and-gift-taxes", note: "Official reference" }
    ],
    deeper: "Read Jonathan Blattmachr and Bridget Crawford's work on advanced estate planning techniques — they're the academic/practitioner bridge in the field. For business succession planning, Michael Allen's 'Valuing the Closely Held Firm' is essential if you'll serve business owners."
  },
  {
    id: 11,
    title: "Practice Building",
    subtitle: "Launch Your Own RIA",
    time: "Months 4–8",
    icon: "⚒",
    color: "#E8A87C",
    intro: "Passing exams gives you credentials. Building a practice gives you a career. This phase covers the practical steps to actually start advising clients, whether you launch your own RIA, join an existing firm, or use a turnkey network. Your goal is to be legally operating within 2–3 months of passing the Series 65.",
    sections: [
      {
        name: "Path Options",
        items: [
          "Start your own RIA: full control, keep 100% of revenue, build your own brand. Startup cost $2k–$10k, ongoing compliance burden. Best for long-term independence",
          "Join an existing RIA as sub-advisor: lower startup cost, built-in compliance, mentorship. Typical revenue split 60–80% to you. Best for learning the ropes",
          "XY Planning Network: turnkey solution for fee-only advisors serving Gen X/Y. Compliance, community, tech stack. ~$500/month membership. Best for fast launch with guardrails",
          "Hourly/project-based model: low barrier, no minimum clients, works well part-time. Income capped by hours but zero AUM minimums to worry about"
        ]
      },
      {
        name: "RIA Registration Steps",
        items: [
          "Choose your state(s) of registration — your principal office state plus any state where you plan to serve more than a de minimis number of clients (typically >5 per state, but rules vary)",
          "File Form ADV Parts 1 and 2 through the IARD (Investment Adviser Registration Depository) system",
          "Draft Form ADV Part 2A ('firm brochure'): describes your services, fees, conflicts of interest, disciplinary history, background. Clients receive this at onboarding",
          "Pay state registration fees: $100–$300 annually, varies by state",
          "Obtain E&O (Errors and Omissions) insurance: $1,000–$2,500/year for a new advisor. Required or strongly recommended by most states",
          "Open a custodial relationship: Schwab, Fidelity, or Altruist (free for custodial clients). Altruist is increasingly the default for new fee-only RIAs"
        ]
      },
      {
        name: "State-Specific Registration Considerations",
        items: [
          "RIA registration requirements vary meaningfully by state — this is where shortcuts cause the most pain later. Research your state securities regulator's specific requirements BEFORE filing Form ADV",
          "Every state has its own fee schedule, net worth or bonding requirements, and documentation standards. Some states require additional exams or disclosures beyond the Series 65",
          "New York / New Jersey tri-state area: NY in particular has nuanced requirements around IAR registration, books and records, and firm-level filings. Historically a unique IAR registration regime",
          "Multi-state: if you serve tech clients scattered across the country (likely given your network), you'll need to register as an IAR in each state where you exceed the de minimis threshold",
          "$100M regulatory AUM threshold: once you cross it, you register with the SEC instead of individual states. Unlikely in Year 1 but worth knowing",
          "Action item: research your specific state's registration process in Month 4, well before you plan to file. Budget extra time if you're in a stricter state"
        ]
      },
      {
        name: "Fee Models",
        items: [
          "Hourly planning: $150–$350/hour for one-time consultations or plan creation. Zero commitment, ideal starting point",
          "Flat-fee financial plans: $1,500–$5,000 per comprehensive plan. Good for clients wanting a one-time deliverable",
          "Subscription/retainer: $100–$300/month for ongoing planning access. Builds recurring revenue without AUM minimums",
          "AUM (Assets Under Management): 0.5%–1.0% annually. Standard industry model but requires custody setup and minimum account sizes"
        ]
      },
      {
        name: "Day-to-Day Compliance & Fiduciary Obligations",
        items: [
          "Buying E&O insurance and compliance software is just the beginning — running a compliant RIA involves ongoing operational obligations required under state and federal rules",
          "Books and records: maintain client agreements, account statements, billing records, correspondence, and advertisements for at least 5 years, with the most recent 2 years immediately accessible",
          "Communication archiving: ALL client communications must be archived — emails, text messages, chat messages, social media DMs, even voicemails in some jurisdictions. Gmail alone is NOT compliant. Use MyRIACompliance, Smarsh, or Global Relay",
          "The personal-texts trap: clients texting you on your personal phone about financial matters is a common compliance violation. Use a separate business number with archiving or avoid the channel",
          "Annual compliance reviews: RIAs must conduct annual reviews of operations, policies, and procedures. File Form ADV amendments within 90 days of fiscal year end. Deliver updated Form ADV Part 2 to clients annually",
          "Personal securities transactions: your own trading is subject to reporting and often pre-clearance requirements. Maintain a personal securities transaction log. This is why personal active trading is incompatible with running an RIA",
          "Fiduciary documentation: every recommendation must be in the client's best interest, not just suitable. Document your rationale for key decisions. Conflicts of interest must be disclosed in writing",
          "If your state regulator audits you (which happens on a rolling basis), you must produce all of the above on request"
        ]
      },
      {
        name: "Outside Business Activity",
        items: [
          "Critical: check your S&P Global employment agreement for outside business activity (OBA) restrictions BEFORE doing anything else — ideally before you take the Series 65",
          "Most large financial data firms require disclosure and approval of outside advisory work",
          "File the necessary paperwork with your employer's compliance department early — approval can take weeks or months",
          "Conflicts to watch for: clients who overlap with S&P data coverage, use of company resources, time allocation during work hours",
          "If approval is delayed or denied, see the contingency options in Phase 16"
        ]
      },
      {
        name: "Client Acquisition Strategy",
        items: [
          "Passing exams and registering an RIA are the easy parts. Getting paying clients is the hard part, and most new advisors underestimate how long the ramp takes",
          "Niche positioning: your biggest edge is your tech network. Tech professionals with RSUs, ISOs, NSOs, and ESPP grants are underserved — most generalist advisors don't understand equity compensation deeply. Position yourself specifically as the equity compensation specialist",
          "Content creation: post 2–3x/week on LinkedIn about RSU vesting strategies, ISO/NSO tax optimization, 10b5-1 plans, concentrated stock diversification. Start a simple blog or newsletter. First 10 posts may get no traction; consistent 6–12 month posting builds a pipeline",
          "Referral partnerships: CPAs and tax preparers who serve tech professionals (tech clients often need both and CPAs rarely do planning), estate attorneys, other fee-only advisors at capacity",
          "Pro bono work through approved organizations serves double duty: builds CFP experience hours (up to 500 count) AND gives you real client practice with lower stakes. Foundation for Financial Planning, Savvy Ladies are options",
          "Realistic Year 1 client count — Months 1–6: 0–2 paying clients (you're still studying). Months 7–9: 2–5 clients. Months 10–12: 5–15 clients",
          "Realistic Year 1 revenue: $15,000–$50,000 depending on fee model and effort. Year 2 typically sees 2–3x growth as referrals compound"
        ]
      },
      {
        name: "Three Budget Scenarios",
        items: [
          "Rather than a single wide range, match your investment to your level of commitment. Each scenario assumes 12 months of activity",
          "Lean Start ($8,000–$10,000): Series 65 only (defer CFP education to Year 2), budget prep provider (Achievable/ExamFX), hourly/project-based model, no RIA custody, free tool trials, minimal filings. Designed to test the waters and build experience hours",
          "Standard Path ($14,000–$17,000) — RECOMMENDED: Kaplan Series 65 prep, mid-tier CFP program (Kaplan self-paced or Boston Institute of Finance cohort), basic functional tech stack (RightCapital, Wealthbox, basic compliance), own RIA with state registration and E&O, FPA/NAPFA membership, simple website",
          "Full Launch ($20,000–$25,000): Everything in Standard plus premium CFP review (Dalton), complete tech stack (eMoney or MoneyGuidePro, Orion, full compliance suite), XY Planning Network membership, professional website with content marketing, Bloomberg Market Concepts",
          "Add a $2,000–$3,000 contingency buffer on top of any scenario for retakes, extended coursework, or extra compliance consulting. The Standard Path budget assumes a clean run"
        ]
      }
    ],
    resources: [
      { name: "XY Planning Network", url: "https://www.xyplanningnetwork.com/", note: "Turnkey launch support" },
      { name: "RIA in a Box", url: "https://www.riainabox.com/", note: "Compliance platform for new RIAs" },
      { name: "IARD (Form ADV filing)", url: "https://www.iard.com/", note: "Official filing portal" },
      { name: "Altruist", url: "https://altruist.com/", note: "Modern custodian for new RIAs" }
    ],
    deeper: "Read 'Storyselling for Financial Advisors' by Scott West for client-conversation mastery. For the business side, Angie Herbers' work on advisory firm economics is the current gold standard. Michael Kitces has written extensively on the economics of solo-advisor practices — required reading before you commit to a path."
  },
  {
    id: 12,
    title: "Technology Stack",
    subtitle: "Your Unfair Advantage",
    time: "Ongoing",
    icon: "⚙",
    color: "#6BC4B8",
    intro: "Your technology background from Google and S&P Global is a significant edge over most financial advisors, who are often stuck with legacy systems. Build a modern stack from day one — it will let you serve more clients, with higher quality, at lower cost than competitors.",
    sections: [
      {
        name: "Financial Planning Software",
        items: [
          "RightCapital ($100–$150/month): modern UI, strong on tax planning and Roth conversion analysis. Preferred by many newer independent advisors",
          "eMoney Advisor ($250–$400/month): industry standard, deepest feature set, account aggregation. Owned by Fidelity",
          "MoneyGuidePro ($150–$300/month): goals-based planning, widely used, owned by Envestnet. Strong probability-based scenario modeling",
          "Asset-Map ($50–$100/month): not a full planning platform, but a brilliant client-facing visualization tool. Complements one of the above"
        ]
      },
      {
        name: "CRM & Operations",
        items: [
          "Wealthbox ($45–$75/month): modern, advisor-focused CRM. The default for new independent RIAs",
          "Redtail ($99/month): legacy standard, feature-rich, deeper integrations with other industry tools",
          "Salesforce Financial Services Cloud: enterprise-grade, expensive, overkill for solo practices",
          "Calendly or SavvyCal: client scheduling. Calendly is universal; SavvyCal has a cleaner UX"
        ]
      },
      {
        name: "Compliance & Portfolio Tools",
        items: [
          "MyRIACompliance, RIA in a Box, Smartria ($100–$300/month): compliance platforms that manage Form ADV updates, code of ethics, personal trading pre-clearance",
          "Orion, Black Diamond, Addepar, Altruist: portfolio management and performance reporting. Altruist is free for advisors custodying there",
          "YCharts or Morningstar Direct: research and analytics. Overkill for pure planners, essential for investment-focused advisors",
          "Holistiplan: automated tax return analysis. Upload a 1040, get a tax planning report. Near-essential modern tool"
        ]
      }
    ],
    resources: [
      { name: "Kitces AdvisorTech Map", url: "https://www.kitces.com/advisor-fintech-map/", note: "The definitive tech stack guide" },
      { name: "T3 Advisor Tech Conference", url: "https://t3technologyhub.com/", note: "Annual tech review for advisors" },
      { name: "Holistiplan", url: "https://holistiplan.com/", note: "Automated tax analysis" }
    ],
    deeper: "Because of your technical background, you can build genuine differentiation by integrating tools with custom scripts and APIs. Most advisors can't; most vendors offer APIs. Study the Plaid and Yodlee APIs for account aggregation, the Schwab/Fidelity institutional APIs for custody data, and consider building simple internal dashboards with Python + Streamlit for client review meetings. This is a moat few competitors can cross."
  },
  {
    id: 13,
    title: "Markets & Trading",
    subtitle: "Supplementary Depth",
    time: "Ongoing",
    icon: "↯",
    color: "#C49B6B",
    intro: "Understanding how markets actually work — trade execution, derivatives, market microstructure — makes you dramatically more credible and useful to sophisticated clients. You don't need to become a trader; you need to be able to explain market events with confidence during client conversations, especially when markets panic.",
    sections: [
      {
        name: "Markets Reading List",
        items: [
          "Market Wizards (Schwager) — interviews with legendary traders. Psychology, strategy, and risk management mindset. Start here; reads like stories",
          "Flash Boys (Lewis) — high-frequency trading and market microstructure. How modern markets actually work. Accessible narrative",
          "The Big Short (Lewis) — the 2008 crisis through traders' eyes. Mortgage securities, credit derivatives, and how crises unfold",
          "Options, Futures, and Other Derivatives (Hull) — the standard textbook. Work through conceptually, not every formula. Reference for life",
          "Trading in the Zone (Douglas) — trading psychology and behavioral discipline. Directly relevant to advising clients on emotional decision-making",
          "When Genius Failed (Lowenstein) — the LTCM collapse. Lessons on leverage, risk, and hubris you'll draw on forever"
        ]
      },
      {
        name: "Key Concepts",
        items: [
          "Market microstructure: order types (market, limit, stop), bid-ask spreads, dark pools, payment for order flow, how exchanges match trades",
          "Options and Greeks: calls/puts, covered calls, protective puts, collars, Black-Scholes intuition, delta/theta/vega. Essential for evaluating client stock option grants",
          "Equity compensation mechanics: RSUs, ISOs, NSOs, ESPP, 10b5-1 plans, Section 83(b) elections. Your niche lever for tech clients",
          "Fixed income: yield curves, duration, convexity, credit spreads, bond pricing mechanics. Explain the rate environment to clients with real fluency",
          "Risk management: position sizing, portfolio hedging, Value at Risk (VaR), correlation, diversification mechanics"
        ]
      },
      {
        name: "Free & Low-Cost Learning",
        items: [
          "MIT OpenCourseWare — Financial Markets (Robert Shiller): free lectures covering market fundamentals, behavioral finance, institutional structure",
          "Khan Academy — Options, Futures, Derivatives: free visual explanations",
          "Investopedia Stock Simulator: paper trade to build intuition without risking money",
          "tastytrade Learn Center: free options education from traders. Practical and well-produced",
          "Bloomberg Market Concepts (~$150): self-paced course on economics, fixed income, equities, currencies. A credential worth putting on your resume"
        ]
      },
      {
        name: "Markets Podcasts",
        items: [
          "Odd Lots (Bloomberg) — Joe Weisenthal and Tracy Alloway on market mechanics, plumbing, and the weird corners of finance. Top recommendation",
          "Macro Voices — deep macro, commodities, and global markets with institutional investors",
          "Chat With Traders — interviews with professional traders across asset classes",
          "Masters in Business (Bloomberg) — Barry Ritholtz interviews top investors and thinkers"
        ]
      }
    ],
    resources: [
      { name: "Odd Lots Podcast", url: "https://www.bloomberg.com/oddlots", note: "The single best markets podcast" },
      { name: "Investopedia Stock Simulator", url: "https://www.investopedia.com/simulator/", note: "Free paper trading" },
      { name: "Bloomberg Market Concepts", url: "https://portal.bloombergforeducation.com/courses/", note: "~$150 credential course" },
      { name: "tastytrade Learn", url: "https://www.tastylive.com/learn", note: "Free options education" }
    ],
    deeper: "Once you're registered, your personal trading will be constrained by compliance — most RIAs require pre-clearance and restricted lists. This is a feature, not a bug: keep your personal portfolio passive and boring, and deploy your markets knowledge in service of clients. For genuine markets depth, Larry Harris's 'Trading and Exchanges: Market Microstructure for Practitioners' is the academic gold standard. Dense but definitive."
  },
  {
    id: 14,
    title: "CFP Exam Preparation",
    subtitle: "The Gold Standard Credential",
    time: "Months 9–15+",
    icon: "★",
    color: "#C4A55E",
    intro: "The CFP mark is the gold standard credential in comprehensive financial planning. Series 65 gets you legally licensed; CFP signals deep competence and opens doors to higher-net-worth clients and referral networks. This phase is intensive review after completing the CFP Board-registered education coursework — but the real bottleneck isn't the exam itself. It's the capstone course and the 6,000-hour experience requirement. Plan for 12–15+ months, not 9–12.",
    sections: [
      {
        name: "Exam Details",
        items: [
          "170 multiple-choice questions across two 3-hour sessions in a single day",
          "Exam windows: March, July, and November. Register early — slots fill",
          "Passing score determined by CFP Board; historically ~64–68% correct",
          "First-time pass rate: approximately 64–67%. Not easy. Disciplined preparation is required",
          "Exam fee: $825–$1,025 depending on registration timing",
          "Prerequisites: completed CFP Board-registered coursework + capstone course + bachelor's degree (your Poli Sci degree qualifies)"
        ]
      },
      {
        name: "Realistic CFP Exam Timing",
        items: [
          "The honest answer on CFP timing: March of the year AFTER you start (Month 14–15) is realistic. November of Year 1 (Month 11) is a stretch that only works if education coursework + capstone both finish cleanly with no delays",
          "Why people miss their target window: the CFP Board-registered coursework covers eight knowledge domains. Even cohort-based programs take 9–12 months of consistent effort. Self-paced programs stretch longer when life gets in the way",
          "The capstone course (see next section) adds another 40–80 hours AFTER coursework completes, and it's often only offered on a fixed schedule — not on-demand",
          "Plan for March Year 2. If you're ready earlier, move to November Year 1. Don't plan for November and scramble to make it work",
          "Slipping your exam window is NOT failure — it's the default outcome for most candidates. The people who rush into November often fail and retake in March anyway. Build in the buffer upfront"
        ]
      },
      {
        name: "The Capstone Course Requirement",
        items: [
          "Beyond the eight knowledge domain courses, the CFP Board requires a capstone course — 'Financial Plan Development' — that integrates everything into a comprehensive client case",
          "This course must be completed BEFORE you sit for the exam. You can't register for the exam without a capstone transcript on file",
          "Time commitment: 40–80 hours of concentrated case work. You'll build a full financial plan for a hypothetical client, applying the 7-step planning process end to end",
          "The pacing constraint: capstone is often scheduled intermittently — many providers only offer 3–4 cohorts per year on fixed dates. If you finish domain coursework in month 8 but the next capstone starts in month 10, you've lost 2 months",
          "Check capstone schedules from your education provider BEFORE you start coursework. Reverse-engineer your timeline from when the capstone is offered, not from when domain courses finish",
          "Plan review and client presentation components — the capstone often requires you to present your plan, which is deliberate practice for real client meetings. Treat it as training, not a hoop"
        ]
      },
      {
        name: "The Biggest Bottleneck: The 6,000-Hour Experience Requirement",
        items: [
          "Passing the exam without the experience hours means you become a 'CFP candidate' — you can't actually use the CFP marks until hours are logged and verified. This is the biggest career-changer trap",
          "Standard Pathway: 6,000 hours of qualifying financial planning experience. Apprenticeship Pathway: 4,000 hours under direct CFP supervision with specific client-facing requirements",
          "What COUNTS: direct financial planning work with individual clients, paraplanning, financial analysis that directly supports planning recommendations, client service with substantive planning content, pro bono planning through approved programs (up to 500 hours)",
          "What does NOT count: revenue operations work at S&P Global (even though it's at a financial data firm), general corporate finance, data analysis without client-facing planning context, marketing or sales without planning substance. Confirm with the CFP Board if uncertain — don't assume",
          "The Part-Time Math Problem: at 20 hours/week of qualifying work, 6,000 hours takes 5.77 years. At 10 hours/week, 11.5 years. This is why experience — not the exam — is the real multi-year commitment",
          "Acceleration Strategy 1 — Front-load: maximize paying client work in Year 1 of your RIA. Every billable planning hour counts toward the 6,000",
          "Acceleration Strategy 2 — Pro bono (up to 500 hours): Foundation for Financial Planning pro bono program, Savvy Ladies, Financial Planning Association pro bono days. Caps at 500 hours of the 6,000 but counts from day one",
          "Acceleration Strategy 3 — FPA Residency Program: intensive 1-week program that counts for ~500 experience hours plus structured mentorship",
          "Acceleration Strategy 4 — Paraplanner role: part-time or freelance paraplanning for an established CFP. You build hours faster AND get mentorship. Several XY Planning Network members hire contract paraplanners",
          "Acceleration Strategy 5 — Apprenticeship Pathway: 4,000 hours instead of 6,000, but requires direct CFP supervision and specific competencies. Only viable if you can get formally supervised by a CFP",
          "Sequencing guidance: start logging hours Day 1 of your RIA. Treat 'complete 6,000 hours' as a 3–5 year initiative that runs PARALLEL to exam prep, not sequential. Passing the exam in Month 14 and finishing hours in Year 4 is a perfectly normal timeline",
          "Track hours from day one — don't rely on reconstruction. CFP Board audits a percentage of applications and the documentation requirements are specific"
        ]
      },
      {
        name: "Review Providers",
        items: [
          "Dalton Education CFP Review ($1,200–$2,500): widely considered the most rigorous and thorough. The default for serious candidates",
          "Kaplan Schweser CFP Review ($800–$1,800): good balance of depth and efficiency. Strong practice exams",
          "Brett Danko CFP Review ($1,000–$2,000): live class format with a practicing CFP instructor. Good if you learn better from lectures",
          "Zahn Associates ($800–$1,500): solid option with a long track record"
        ]
      },
      {
        name: "Final Review Strategy",
        items: [
          "Take Dalton's or Kaplan's full-length timed practice exams. Aim for 70%+ consistently before sitting",
          "Analyze weak domains and drill them specifically. Investment Planning and Tax Planning are the largest domains — don't underinvest",
          "The case study sections are where most candidates lose points. Practice the 7-step planning process application repeatedly",
          "Schedule the exam only when your practice scores are stable at passing levels. A failed attempt costs $825 and months of momentum"
        ]
      }
    ],
    resources: [
      { name: "CFP Board Exam Info", url: "https://www.cfp.net/get-certified/certification-process/exam-requirement", note: "Official exam page" },
      { name: "Dalton Education", url: "https://www.daltonreview.com/", note: "Most rigorous review course" },
      { name: "Kaplan CFP Review", url: "https://www.kaplanfinancial.com/cfp", note: "Balanced review course" }
    ],
    deeper: "The CFP Board's published exam blueprint is more detailed than most candidates realize — it lists specific learning objectives for every topic. Map your weakest topics to the blueprint and build targeted practice question sets. For the ethics and case study portions, studying the CFP Board's published disciplinary decisions gives you real-world feel for how standards are applied."
  },
  {
    id: 15,
    title: "Growth & Specialization",
    subtitle: "After the CFP — Year 2 and Beyond",
    time: "Ongoing",
    icon: "↗",
    color: "#7BB4C4",
    intro: "Earning the CFP is a milestone, not a finish line. The best advisors continue specializing, deepening, and differentiating throughout their careers. This phase is about the strategic choices you make after you're credentialed — where to invest further study, which niches to build, and how to turn competence into a premium practice.",
    sections: [
      {
        name: "Advanced Designations",
        items: [
          "CFA (Chartered Financial Analyst): deep investment analysis and portfolio management. Three exams over 2–4 years. Worth it if you want to manage investments at an institutional level",
          "ChFC (Chartered Financial Consultant): similar scope to CFP but American College. Useful for deepening planning expertise without another exam grind",
          "CLU (Chartered Life Underwriter): life insurance and estate planning. Best if you specialize in risk management or serve HNW estate clients",
          "RICP (Retirement Income Certified Professional): retirement distribution strategies. Focused credential for retiree-heavy practices",
          "AEP (Accredited Estate Planner): advanced estate planning. Strong signal to CPAs and estate attorneys for HNW referral networks"
        ]
      },
      {
        name: "Niche Specialization",
        items: [
          "Tech professionals with equity compensation: your natural niche. RSUs, ISOs, NSOs, concentrated positions, 10b5-1 plans. High-income, complex, underserved",
          "Physicians and dentists: high income, high debt, specific retirement vehicles (Cash Balance Plans). Receptive to specialists",
          "Business owners: succession planning, entity structuring, qualified business income deduction, retirement plan design. High-margin work",
          "Divorcing spouses (CDFA credential): structured specialty with clear referral sources (family law attorneys)",
          "Recent widows/widowers: underserved, emotionally complex, referral-heavy niche if you do it well"
        ]
      },
      {
        name: "Professional Community",
        items: [
          "Financial Planning Association (FPA) — broadest association, strong local chapter meetings for networking",
          "NAPFA (National Association of Personal Financial Advisors) — fee-only, fiduciary-only. Higher barrier, stronger brand for the right clients",
          "XY Planning Network — fee-only, technology-forward, Gen X/Y focus. Strong community and tools",
          "Kitces members section — direct access to Michael Kitces's research and a private community of serious practitioners"
        ]
      },
      {
        name: "Client Base Growth",
        items: [
          "Content marketing: blog posts, LinkedIn articles, or a newsletter on your niche. Compounds slowly but creates inbound leads with minimal cost",
          "Referral relationships with CPAs and estate attorneys — these are the highest-quality referral sources in the industry",
          "Speaking at industry events or employee education sessions at tech companies — direct path to equity-comp clients",
          "Maintain service quality above all else. In a referral business, happy clients are the only marketing that scales"
        ]
      }
    ],
    resources: [
      { name: "Financial Planning Association (FPA)", url: "https://www.financialplanningassociation.org/", note: "Broadest professional association" },
      { name: "NAPFA", url: "https://www.napfa.org/", note: "Fee-only fiduciary association" },
      { name: "Kitces Members Section", url: "https://www.kitces.com/members/", note: "Deepest practitioner community" },
      { name: "XY Planning Network", url: "https://www.xyplanningnetwork.com/", note: "Modern fee-only network" }
    ],
    deeper: "Once you're established, the highest-leverage growth investment is almost always developing a narrow niche and becoming the go-to expert for it. 'So Good They Can't Ignore You' (Cal Newport) and 'The Referral Code' (Larry Kendall) are two of the best books on how to build a specialty practice that attracts clients instead of chasing them. Aim for 100 ideal clients over 5 years rather than 500 random ones."
  },
  {
    id: 16,
    title: "Contingency Planning",
    subtitle: "When Things Don't Go to Plan",
    time: "As Needed",
    icon: "⚑",
    color: "#B47C6B",
    intro: "Everything in Phases 1–15 assumes a clean run: you pass exams on the first try, your employer approves outside business activity quickly, coursework finishes on schedule, and clients show up. Reality rarely cooperates. This phase is the explicit contingency plan for the three most likely setbacks — and a framework for handling whatever else goes wrong. The goal isn't to eliminate risk; it's to make sure no single setback derails the whole roadmap.",
    sections: [
      {
        name: "What if you fail the Series 65?",
        items: [
          "First: it happens. The pass rate is ~72%, which means roughly 1 in 4 candidates retakes. A fail is a delay, not a disqualification",
          "Mandatory 30-day waiting period before you can retest. Use it — don't re-book immediately and study the same material the same way",
          "Request your NASAA score report. It breaks down your performance by content area, showing exactly where you lost points. Most failures cluster in 1–2 weak domains, not across the board",
          "Switch question banks. If you used Kaplan the first time, use Achievable or ExamFX for retake prep. Different question styles reveal different gaps. Fresh material prevents pattern memorization",
          "Budget impact: $187 retake fee + 4–8 additional weeks of study. The real cost is the 1–2 month slip in your overall timeline, not the money",
          "Do not schedule the retake until your practice exam scores are consistently 80%+. Retaking before you're ready wastes another $187 and compounds the delay",
          "Mental reframe: the Series 65 is harder than it looks precisely because it's entry-level. A retake is common enough that no future client or employer will ever ask about it. The only question that matters is whether you hold the license, not how many tries it took"
        ]
      },
      {
        name: "What if S&P Global denies or delays OBA approval?",
        items: [
          "Outside business activity approval from your employer is the single biggest non-exam risk to this roadmap. If compliance says no — or takes six months to say yes — you need options",
          "Option 1 — Delay the launch: finish Series 65, continue CFP coursework, and defer RIA registration until OBA is resolved or until you leave S&P Global. Your licensing progress doesn't expire, and the study time still counts",
          "Option 2 — Education-only mode: if you can't take paying clients, you can still build your content platform, newsletter, and LinkedIn presence as a financial educator (not an advisor). Don't give personalized advice — stay strictly educational. This builds the audience for when you can launch",
          "Option 3 — Pro bono volunteer planning: Foundation for Financial Planning, Savvy Ladies, and FPA pro bono days let you do real planning work without charging fees. Usually doesn't conflict with OBA restrictions because there's no compensation. Bonus: counts toward CFP experience hours",
          "Option 4 — Affiliate with an existing RIA: join an established fee-only firm as a W-2 employee, contractor, or IAR under their registration. You trade independence for speed-to-market and mentorship. Several XY Planning Network members hire CFP candidates in this structure",
          "Option 5 — Defer to post-S&P Global: treat Phases 1–10 as the work you do while employed, and Phase 11 (RIA launch) as the thing you do when you leave. Cleanest path if OBA is a hard no",
          "Have the OBA conversation EARLY — ideally before you start Phase 1. Finding out in Month 10 that you can't launch is the worst possible version of this problem. Get the written policy, talk to compliance informally, and read your employment agreement carefully"
        ]
      },
      {
        name: "What if CFP coursework takes longer than expected?",
        items: [
          "The 9–12 month timeline for CFP education assumes 10–15 hours/week of consistent study across eight domains plus capstone. Job stress, life events, or underestimating course depth routinely stretches this to 14–18 months",
          "Push the exam window: if you're not ready for November Year 1, target March Year 2. If March Year 2 is tight, target July. The exam isn't going anywhere",
          "Use the slip productively: every week you're not sitting the CFP exam is a week you can log experience hours, serve clients, write content, or build referral relationships. The experience requirement (6,000 hours) is the larger constraint anyway",
          "Remember the capstone is the pacing constraint, not domain coursework. If the next available capstone cohort is 3 months out, that's 3 months you can't exam-prep anyway — use them for other roadmap work instead of stressing",
          "Don't skip domains to hit a timeline. A rushed exam attempt with weak domain coverage is the most expensive version of 'saving time' — you pay $825, lose months of momentum, and retake anyway",
          "Financial impact of stretching CFP by 6 months: usually zero if you're employed during the stretch. The only real cost is delayed access to the CFP marks, which isn't what gets your first 20 clients anyway (your niche positioning is)"
        ]
      },
      {
        name: "General Principles for Handling Setbacks",
        items: [
          "Protect your core anchors: Series 65 licensed, RIA registered, first paying clients. Everything else is sequencing. If a setback threatens a core anchor, prioritize the anchor. If it only delays non-core work, absorb the delay and keep moving",
          "Quarterly plan reviews: every 3 months, compare your actual progress to the roadmap. Adjust timelines based on reality, not aspiration. A plan you update quarterly survives contact with reality; a plan you set in stone breaks on first impact",
          "The $2,000–$3,000 contingency buffer from Phase 11's budget scenarios exists for exactly this phase. Retake fees, extra CE credits, additional compliance consulting, one more month of software subscriptions — setbacks cost money AND time",
          "Setback triage framework: (1) Is my license at risk? (2) Is my registration at risk? (3) Is my income at risk? If no to all three, it's a schedule problem, not a roadmap problem — just re-sequence",
          "Don't make reactive career decisions. If something goes wrong, give yourself 2 weeks before deciding to abandon the roadmap, pivot, or double-down. Most setbacks feel catastrophic for 48 hours and routine after 2 weeks",
          "Talk to people who've done this. The XY Planning Network community, NAPFA's Genesis (younger advisor) group, and CFP subreddits are full of people who've failed an exam, had OBA denied, or taken 18 months longer than planned — and are now running successful practices. The setback is not the story; the recovery is"
        ]
      }
    ],
    resources: [
      { name: "NASAA Series 65 Retake Info", url: "https://www.nasaa.org/exams-study-materials/nasaa-exams/", note: "Official retake procedures" },
      { name: "Foundation for Financial Planning", url: "https://foundationforfinancialplanning.org/pro-bono/", note: "Pro bono program (counts toward CFP hours)" },
      { name: "XY Planning Network", url: "https://www.xyplanningnetwork.com/", note: "Community for fee-only advisors, setback support" },
      { name: "Savvy Ladies", url: "https://www.savvyladies.org/", note: "Pro bono planning for women in need" }
    ],
    deeper: "The most dangerous assumption in any career-change roadmap is that you'll execute it perfectly. You won't. The second most dangerous assumption is that a setback means the roadmap is wrong. Usually it just means the timeline was optimistic. The advisors who successfully transition into fee-only practice aren't the ones who never fail an exam or never have OBA issues — they're the ones who had a contingency plan, absorbed the setback, and kept moving. Write your contingencies down BEFORE you need them, while you're thinking clearly. When something goes wrong in Month 8, you don't want to be designing a pivot under stress."
  }
];

const PRIORITY_MAP = {
  "Fastest to licensed": [1, 2, 11],
  "CFP exam track": [3, 4, 6, 7, 8, 9, 10, 14],
  "Serving tech clients": [8, 13, 12],
  "Building the practice": [11, 12, 15],
  "Deepening investment expertise": [7, 13],
  "When things go wrong": [16]
};

function CodeBlock({ code }) {
  return (
    <pre style={{
      background: "#0B1218",
      border: "1px solid rgba(91,154,174,0.1)",
      borderRadius: 8,
      padding: "16px 20px",
      overflowX: "auto",
      fontSize: 13,
      lineHeight: 1.65,
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      color: "#A8C4D4",
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
      background: "rgba(91,154,174,0.03)",
      border: "1px solid rgba(91,154,174,0.08)",
      borderRadius: 8,
      textDecoration: "none",
      color: "#A8C4D4",
      transition: "all 0.2s",
      marginBottom: 6
    }}
    onMouseEnter={e => { e.currentTarget.style.background = "rgba(91,154,174,0.07)"; e.currentTarget.style.borderColor = "rgba(91,154,174,0.18)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = "rgba(91,154,174,0.03)"; e.currentTarget.style.borderColor = "rgba(91,154,174,0.08)"; }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: "#D4DFE5", whiteSpace: "nowrap" }}>↗ {r.name}</span>
      <span style={{ fontSize: 12, color: "#6B8594", fontStyle: "italic" }}>{r.note}</span>
    </a>
  );
}

function PhaseContent({ phase }) {
  const [showDeeper, setShowDeeper] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: "#A8C4D4", margin: 0 }}>{phase.intro}</p>
      {phase.sections?.map((section, si) => (
        <div key={si}>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 14px", fontWeight: 600, paddingBottom: 8, borderBottom: `1px solid ${phase.color}22` }}>{section.name}</h4>
          {section.items.map((item, ii) => (
            <div key={ii} style={{ padding: "10px 0", borderBottom: "1px solid rgba(91,154,174,0.05)", fontSize: 14, color: "#A8C4D4", lineHeight: 1.7 }}>{item}</div>
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
          <button onClick={() => setShowDeeper(!showDeeper)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px dashed rgba(91,154,174,0.15)", color: "#6B8594", fontSize: 13, padding: "10px 16px", borderRadius: 8, cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color; e.currentTarget.style.color = phase.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(91,154,174,0.15)"; e.currentTarget.style.color = "#6B8594"; }}>
            <span style={{ transform: showDeeper ? "rotate(90deg)" : "none", transition: "transform 0.2s", fontSize: 10 }}>▶</span>
            Want to go deeper?
          </button>
          {showDeeper && <p style={{ fontSize: 13, color: "#6B8594", lineHeight: 1.75, padding: "14px 16px", margin: "8px 0 0", background: "rgba(91,154,174,0.03)", borderRadius: 8, fontStyle: "italic", borderLeft: `2px solid ${phase.color}33` }}>{phase.deeper}</p>}
        </div>
      )}
    </div>
  );
}

export default function CFPRoadmap({ onBack }) {
  const [activePhase, setActivePhase] = useState(1);
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('cfp-roadmap-progress');
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
      .eq('curriculum', 'cfp')
      .single();
    if (data?.completed_phases) {
      skipSync.current = true;
      setCompleted(new Set(data.completed_phases));
      localStorage.setItem('cfp-roadmap-progress', JSON.stringify(data.completed_phases));
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
    try { localStorage.setItem('cfp-roadmap-progress', JSON.stringify(arr)); } catch {}
    if (skipSync.current) { skipSync.current = false; return; }
    if (!supabase || !user) return;
    supabase.from('user_progress').upsert({
      user_id: user.id,
      curriculum: 'cfp',
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
    <div style={{ fontFamily: "'Newsreader', Georgia, serif", background: "#0A1015", color: "#D4DFE5", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <header style={{ padding: "14px 24px", borderBottom: "1px solid rgba(91,154,174,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#0A1015", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#6B8594", fontSize: 13, cursor: "pointer", padding: "4px 8px", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          )}
          <button onClick={() => setShowNav(!showNav)} style={{ background: "none", border: "none", color: "#D4DFE5", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>{showNav ? "✕" : "☰"}</button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: -0.3, fontFamily: "'DM Sans', sans-serif" }}>Certified Financial <span style={{ color: "#5B9AAE" }}>Planner</span></h1>
            <p style={{ fontSize: 10, color: "#6B8594", margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>From zero to licensed advisor</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#6B8594", fontFamily: "'IBM Plex Mono', monospace" }}>{completed.size}/{PHASES.length}</span>
          <div style={{ width: 80, height: 4, background: "rgba(91,154,174,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #5B9AAE, #6BB6A0)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          {supabase && !authLoading && (
            user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                <span style={{ fontSize: 12, color: "#6B8594", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(91,154,174,0.15)", color: "#6B8594", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>Sign out</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setAuthMode('signin'); setAuthError(''); }} style={{ background: "rgba(91,154,174,0.1)", border: "1px solid rgba(91,154,174,0.2)", color: "#5B9AAE", fontSize: 11, padding: "4px 12px", borderRadius: 6, cursor: "pointer", marginLeft: 8 }}>Sign in</button>
            )
          )}
        </div>
      </header>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <nav style={{ width: showNav ? 300 : 0, minWidth: showNav ? 300 : 0, borderRight: showNav ? "1px solid rgba(91,154,174,0.08)" : "none", overflow: "hidden", transition: "all 0.3s ease", background: "#08101A", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {PHASES.map(p => (
              <button key={p.id} onClick={() => { setActivePhase(p.id); setShowNav(false); }}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", background: activePhase === p.id ? `${p.color}0D` : "transparent", border: activePhase === p.id ? `1px solid ${p.color}1A` : "1px solid transparent", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                <span onClick={(e) => { e.stopPropagation(); toggleComplete(p.id); }}
                  style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: completed.has(p.id) ? `2px solid ${p.color}` : "2px solid rgba(91,154,174,0.15)", background: completed.has(p.id) ? `${p.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: p.color, cursor: "pointer", transition: "all 0.2s" }}>
                  {completed.has(p.id) ? "✓" : ""}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: activePhase === p.id ? 600 : 400, color: activePhase === p.id ? "#D4DFE5" : "#6B8594", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: p.color, marginRight: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{String(p.id).padStart(2, "0")}</span>{p.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#4A6274", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.subtitle}</div>
                </div>
                <span style={{ fontSize: 10, color: "#4A6274", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>{p.time}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: "1px solid rgba(91,154,174,0.08)" }}>
            <h4 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#4A6274", margin: "0 0 10px", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>Focus Tracks</h4>
            {Object.entries(PRIORITY_MAP).map(([activity, ids]) => (
              <button key={activity} onClick={() => { setActivePhase(ids[0]); setShowNav(false); }}
                style={{ display: "block", width: "100%", padding: "6px 0", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, color: "#6B8594", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#5B9AAE"}
                onMouseLeave={e => e.currentTarget.style.color = "#6B8594"}>
                {activity} → {ids.map(id => String(id).padStart(2, "0")).join(", ")}
              </button>
            ))}
          </div>
        </nav>
        <main ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "40px 32px 80px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: phase.color, fontWeight: 600 }}>Phase {String(phase.id).padStart(2, "0")}</span>
              <span style={{ fontSize: 12, color: "#4A6274", fontFamily: "'IBM Plex Mono', monospace" }}>{phase.time}</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: phase.color, marginRight: 8 }}>{phase.icon}</span>{phase.title}
            </h2>
            <p style={{ fontSize: 17, color: "#6B8594", margin: 0, fontWeight: 300 }}>{phase.subtitle}</p>
          </div>
          <button onClick={() => toggleComplete(phase.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", background: completed.has(phase.id) ? `${phase.color}0D` : "rgba(91,154,174,0.03)", border: `1px solid ${completed.has(phase.id) ? phase.color + "33" : "rgba(91,154,174,0.08)"}`, borderRadius: 8, cursor: "pointer", color: completed.has(phase.id) ? phase.color : "#6B8594", fontSize: 13, fontWeight: 500, marginBottom: 32, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${completed.has(phase.id) ? phase.color : "rgba(91,154,174,0.2)"}`, background: completed.has(phase.id) ? `${phase.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, transition: "all 0.2s" }}>
              {completed.has(phase.id) ? "✓" : ""}
            </span>
            {completed.has(phase.id) ? "Completed" : "Mark as completed"}
          </button>
          <PhaseContent phase={phase} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(91,154,174,0.08)" }}>
            <button onClick={() => activePhase > 1 && setActivePhase(activePhase - 1)} disabled={activePhase === 1}
              style={{ padding: "10px 20px", background: activePhase === 1 ? "transparent" : "rgba(91,154,174,0.03)", border: `1px solid ${activePhase === 1 ? "transparent" : "rgba(91,154,174,0.08)"}`, borderRadius: 8, color: activePhase === 1 ? "#2A3A48" : "#6B8594", cursor: activePhase === 1 ? "default" : "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              ← Previous
            </button>
            <button onClick={() => activePhase < PHASES.length && setActivePhase(activePhase + 1)} disabled={activePhase === PHASES.length}
              style={{ padding: "10px 20px", background: activePhase === PHASES.length ? "transparent" : `${PHASES[activePhase]?.color || phase.color}0D`, border: `1px solid ${activePhase === PHASES.length ? "transparent" : (PHASES[activePhase]?.color || phase.color) + "22"}`, borderRadius: 8, color: activePhase === PHASES.length ? "#2A3A48" : PHASES[activePhase]?.color || phase.color, cursor: activePhase === PHASES.length ? "default" : "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
              Next: {PHASES[activePhase]?.title || "Done"} →
            </button>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div onClick={() => setShowAuthModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#101820", border: "1px solid rgba(91,154,174,0.15)", borderRadius: 12, padding: 32, width: 340, maxWidth: "90vw" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{authMode === 'signin' ? 'Sign in' : 'Create account'}</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6B8594" }}>Sync your progress across devices</p>
            <form onSubmit={handleAuth}>
              <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px 12px", background: "rgba(91,154,174,0.05)", border: "1px solid rgba(91,154,174,0.15)", borderRadius: 6, color: "#D4DFE5", fontSize: 13, marginBottom: 8, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(91,154,174,0.05)", border: "1px solid rgba(91,154,174,0.15)", borderRadius: 6, color: "#D4DFE5", fontSize: 13, marginBottom: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              {authError && <p style={{ fontSize: 12, color: authError.includes('Check your email') ? '#6BB6A0' : '#5B9AAE', margin: "0 0 12px" }}>{authError}</p>}
              <button type="submit" disabled={authSubmitting}
                style={{ width: "100%", padding: "10px", background: "#5B9AAE", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: authSubmitting ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: authSubmitting ? 0.7 : 1 }}>
                {authSubmitting ? '...' : authMode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </form>
            <p style={{ margin: "16px 0 0", fontSize: 12, color: "#6B8594", textAlign: "center" }}>
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(''); }} style={{ color: "#5B9AAE", cursor: "pointer" }}>
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
