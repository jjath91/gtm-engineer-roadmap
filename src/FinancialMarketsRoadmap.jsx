import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

const PHASES = [
  {
    id: 1,
    title: "Capital Markets 101",
    subtitle: "The Map Of The Whole Game",
    time: "2 weeks",
    icon: "◇",
    color: "#B8893E",
    intro: "Before you can specialize in indices, ratings, or market data, you need a working map of the entire capital markets ecosystem. This phase is the orientation lap. By the end you should be able to draw, on a napkin, who the players are, what they trade, where they trade it, and how money moves between them. Skip this and every later phase will feel like a list of disconnected facts.",
    sections: [
      {
        name: "What 'Capital Markets' Actually Means",
        items: [
          "Capital markets = the system through which savings (capital) get matched to productive uses (companies, governments, projects). Two functions: raise new capital (primary) and trade existing claims (secondary)",
          "Two big asset classes: equity (ownership claims, residual cash flows, unlimited upside) and debt (contractual claims, fixed cash flows, limited upside, prior claim in bankruptcy). Almost everything else is a derivative of these two",
          "Money markets vs capital markets: money markets are short-term (<1 year, T-bills, commercial paper, repo). Capital markets are long-term (stocks, bonds with >1 year maturity). The distinction matters for regulation and risk",
          "Public vs private: public markets (regulated, transparent, liquid, anyone can buy) vs private markets (less regulated, less liquid, accredited investors only). Private markets are growing much faster than public",
          "Financial markets are NOT the economy. Mistaking the two is the most common amateur error. Markets reflect expectations about future cash flows; the economy is the present production of goods and services"
        ]
      },
      {
        name: "The Players",
        items: [
          "Issuers: corporations, governments, municipalities, agencies. They want capital. They sell securities into primary markets",
          "Buy-side: who manages money for return. Asset managers (BlackRock, Vanguard, Fidelity), pension funds, sovereign wealth funds, endowments, hedge funds, family offices, retail investors",
          "Sell-side: who facilitates trading and capital raising. Investment banks (Goldman, Morgan Stanley, JPM), broker-dealers, market makers, prime brokers. They make money on spreads, fees, and commissions",
          "Infrastructure: exchanges (NYSE, Nasdaq, ICE, CME), clearinghouses (DTCC, CME Clearing), custodians (BNY Mellon, State Street), settlement systems",
          "The information economy: this is where S&P Global lives. Ratings agencies, index providers, market data vendors, research providers, analytics platforms. Not principals to trades, but everyone trades using their data"
        ]
      },
      {
        name: "Primary vs Secondary Markets",
        items: [
          "Primary market: the issuer sells new securities directly to investors and receives the cash. IPOs, debt issuances, secondary offerings, private placements. This is where capital actually gets raised",
          "Secondary market: existing securities trade between investors. The issuer is not involved and gets no cash. The vast majority of daily trading is secondary",
          "Why secondary matters even though no new capital is raised: liquidity in secondary markets makes primary markets possible. Investors will pay more for new securities they can later sell",
          "IPO mechanics: investment bank underwrites, sets price range, builds book of demand from institutions, prices the night before, stock starts trading the next morning. Most of the famous IPO 'pop' is sales-side underpricing",
          "Bond issuance is more boring and more common: corporates issue bonds nearly continuously through their relationship banks. Frequencies and sizes dwarf equity"
        ]
      },
      {
        name: "Exchanges, OTC, And Trading Mechanics",
        items: [
          "Exchange-traded: standardized contracts traded on a central order book with public prices. Stocks, futures, options on listed underlyings. Highly transparent, highly liquid",
          "OTC (over-the-counter): bilateral trades between two parties, often through dealers. Most bonds, swaps, FX, structured products. Less transparent, customizable",
          "Order types: market (immediate at best price), limit (only at specified price or better), stop (triggers on price), iceberg (hidden size). Knowing these matters for understanding execution",
          "Market makers vs takers: makers post resting orders providing liquidity, takers cross the spread to execute. Exchanges often pay makers and charge takers (the 'maker-taker' model)",
          "Latency matters: HFT firms compete on microseconds. The market microstructure literature is fascinating but mostly irrelevant to your day job — know it exists"
        ]
      },
      {
        name: "Project: Draw The System",
        items: [
          "On paper or whiteboard, draw the full capital markets system: issuers on one side, investors on the other, intermediaries in between. Use arrows for money and securities",
          "Add the regulators: SEC, FINRA, CFTC, Fed, OCC for the US; FCA, ESMA, MAS for international. Note which oversees which",
          "Add the data layer separately: where do indices, ratings, market data, research come from in the picture? This is where you're going to specialize",
          "Add S&P Global: which boxes do its businesses sit in? You should be able to identify at least 4 distinct boxes by end of this phase",
          "Bonus: add a debt cycle annotation. Where does new debt get created? Where does it get refinanced? What happens to defaulted debt? This will matter when you get to credit ratings"
        ]
      }
    ],
    resources: [
      { name: "SEC: How the Markets Work", url: "https://www.sec.gov/about/divisions-offices/division-trading-markets", note: "Government primer on US market structure" },
      { name: "Investopedia: Capital Markets", url: "https://www.investopedia.com/terms/c/capitalmarkets.asp", note: "The default starting point for any topic in this curriculum" },
      { name: "Matt Levine's 'Money Stuff'", url: "https://www.bloomberg.com/account/newsletters/money-stuff", note: "The single best ongoing finance education in the world. Subscribe immediately" },
      { name: "S&P Global: How We Work", url: "https://www.spglobal.com/en/who-we-are", note: "Your employer's own framing of where it sits" }
    ],
    deeper: "If you want a deep narrative of how modern capital markets evolved, read 'Capital Ideas' by Peter Bernstein. It tells the story of how academic finance theory (CAPM, efficient markets, modern portfolio theory) became the operating system of Wall Street starting in the 1960s. The book is dated but the lineage explains why modern finance looks the way it does. For a more contemporary picture, 'The Fund' by Rob Copeland (about Bridgewater) and 'More Money Than God' by Sebastian Mallaby (about hedge funds) give you the modern texture."
  },
  {
    id: 2,
    title: "Equities, Indices & ETFs",
    subtitle: "Stocks, And The Things Built On Top Of Stocks",
    time: "2–3 weeks",
    icon: "▲",
    color: "#B8893E",
    intro: "Equity markets are where most retail investors live and where most public attention focuses. They're also where one of S&P Global's two flagship businesses lives — the index business. This phase covers how stocks actually trade, how indices are constructed, and how the explosion of passive investing reshaped the entire industry. Pay attention to indices specifically; understanding them deeply is a direct career multiplier inside S&P.",
    sections: [
      {
        name: "How Stocks Actually Work",
        items: [
          "A share of common stock is a claim on residual cash flows after debtholders are paid. You get proportional voting rights, proportional dividends if declared, proportional ownership of the company on liquidation",
          "Market cap = price × shares outstanding. The benchmark size measure. Mega-cap (>$200B), large-cap (>$10B), mid-cap ($2–10B), small-cap ($300M–$2B), micro-cap (<$300M). Used everywhere",
          "Free float vs total shares: only shares actually available to trade count toward most index weightings. Founder/insider shares and government holdings are often excluded. This matters a lot in international markets",
          "Share classes: many companies have multiple share classes with different voting rights (Google's GOOG vs GOOGL, Berkshire's A vs B). Created for control reasons, sometimes excluded from indices",
          "Stock splits and dividends: splits change number of shares without changing economics. Dividends transfer cash to shareholders. Both adjust historical prices for clean charts (price-adjusted vs unadjusted)"
        ]
      },
      {
        name: "Market Capitalization Weighting (And Its Critics)",
        items: [
          "Most indices are cap-weighted: bigger companies are bigger weights. Self-balancing — as a stock rises, its weight rises automatically with no rebalancing trades needed",
          "Critique: cap-weighting overweights overvalued stocks by definition. If Apple is at peak valuation, the index buys more Apple. The case for active management often starts here",
          "Equal-weighted: every stock gets the same weight regardless of size. Requires regular rebalancing. Often outperforms over long periods because of small-cap tilt — but with higher volatility",
          "Fundamental-weighted: weight by sales, earnings, or book value instead of market cap. Avoids the 'momentum bias' of cap weighting. This is the methodology behind 'smart beta' products",
          "Factor-weighted: weight by exposure to specific factors (value, momentum, low volatility, quality, size). The bridge between passive and active investing"
        ]
      },
      {
        name: "Indices As Products (S&P's Flagship Business)",
        items: [
          "An index is a calculated number representing the value of a basket of securities according to a published methodology. The methodology IS the product",
          "S&P 500: top ~500 US large-cap stocks selected by a committee, weighted by free-float market cap, rebalanced quarterly. Created 1957. The most-tracked index in the world",
          "Index providers don't trade. They publish methodology, calculate values, license the index to ETF issuers and asset managers, and collect licensing fees. It's a high-margin information business",
          "S&P Dow Jones Indices: joint venture between S&P Global (73%) and CME Group (27%). Owns the S&P 500, the Dow Jones Industrial Average, and thousands of other indices. Multi-billion-dollar revenue line",
          "Major competitors: MSCI (international markets, ESG indices), FTSE Russell (the Russell 1000/2000 family), Bloomberg, Stoxx. The index business is an oligopoly with high barriers to entry"
        ]
      },
      {
        name: "ETFs: How Indices Become Tradeable",
        items: [
          "ETF = Exchange-Traded Fund. A fund whose shares trade on an exchange like a stock. Can hold stocks, bonds, commodities, currencies, or anything else. Modern ETFs are typically passive trackers of an index",
          "The creation/redemption mechanism: authorized participants (big banks) can swap a basket of underlying stocks for ETF shares (creation) or vice versa (redemption). This arbitrage keeps ETF price near NAV",
          "ETF growth: from ~$200B AUM in 2000 to ~$13T+ globally today. The fastest-growing investment vehicle of the last 30 years. This is why the index business matters — ETFs require licensed indices",
          "Major issuers: BlackRock iShares, Vanguard, State Street SPDR, Invesco, Charles Schwab. They charge annual expense ratios (often 3–20 basis points for plain index ETFs)",
          "Active ETFs are the next wave: same wrapper, active management. ARKK is the famous example. Growing fast but dwarfed by passive"
        ]
      },
      {
        name: "Sectors, Style Boxes, And Classification",
        items: [
          "GICS (Global Industry Classification Standard): the dominant industry classification system, created and maintained by S&P Global and MSCI. 11 sectors, 24 industry groups, 69 industries, 158 sub-industries. This is one of S&P's quiet but very valuable products",
          "Sectors: Technology, Healthcare, Financials, Consumer Discretionary, Communication Services, Industrials, Consumer Staples, Energy, Utilities, Real Estate, Materials. Worth memorizing — used everywhere",
          "Style boxes (Morningstar): grid of size (large/mid/small) × style (value/blend/growth). The mental model most retail investors use",
          "Why classification matters: indexing, benchmarking, sector rotation strategies, regulatory reporting, ETF construction. GICS reclassifications move billions of dollars in trades",
          "Notable GICS changes: in 2018, telecom became 'Communication Services' and absorbed Facebook, Google, Netflix from Tech. This single reclassification reshuffled major index weights"
        ]
      },
      {
        name: "Project: Compare Three Indices",
        items: [
          "Pick three indices: S&P 500 (cap-weighted large), S&P 500 Equal Weight, Russell 2000 (small caps). Look up their published methodologies",
          "Pull their year-by-year returns for the last 20 years from a free source (Yahoo Finance, FRED). Note when they diverge and try to explain why (e.g. 2020 mega-cap rally)",
          "Read the actual S&P 500 methodology document. Note the committee discretion clause — the index is not purely rules-based, which is unusual and important",
          "Look up which ETFs track each. Compare expense ratios. Note that the same exposure can be had for 3bps vs 20bps depending on issuer",
          "Bonus: find a recent S&P 500 index reconstitution announcement. Read the press release. Note how additions and deletions are handled"
        ]
      }
    ],
    resources: [
      { name: "S&P Global: S&P 500 Methodology", url: "https://www.spglobal.com/spdji/en/methodology/", note: "The actual rulebook for the index — read it" },
      { name: "Investopedia: ETF Mechanics", url: "https://www.investopedia.com/terms/e/etf.asp", note: "Solid foundational ETF explainer" },
      { name: "BlackRock: ETF Education", url: "https://www.blackrock.com/us/individual/education/etf", note: "From the largest ETF issuer in the world" },
      { name: "MSCI: Index Methodology Library", url: "https://www.msci.com/our-solutions/indexes/index-methodology", note: "Compare methodologies across the major providers" }
    ],
    deeper: "The deepest career-relevant rabbit hole here is the index licensing economics. S&P Global earns recurring licensing fees from every ETF that tracks one of its indices, plus data fees from every fund manager that benchmarks against one. The aggregate revenue is in the billions. The interesting strategic question — and one Kensho can credibly help answer — is how AI-generated synthetic indices, factor portfolios, and direct indexing might disrupt this business over the next decade. Direct indexing in particular (where retail investors hold the underlying stocks instead of an ETF) is an existential challenge to ETF economics and therefore a tailwind to index licensing. Worth understanding the dynamics at the level your CEO understands them."
  },
  {
    id: 3,
    title: "Fixed Income, Credit & Yield Curves",
    subtitle: "The World's Largest Asset Class",
    time: "2–3 weeks",
    icon: "≡",
    color: "#B8893E",
    intro: "Bond markets are bigger than stock markets, far less covered by media, and absolutely central to how the financial system actually works. They're also the foundation of S&P Global's other flagship business: credit ratings. This phase is the technical foundation. Without it, the next phase on ratings is unintelligible.",
    sections: [
      {
        name: "What A Bond Is",
        items: [
          "A bond is a contract: lender gives the issuer cash today, issuer agrees to pay back the principal on a fixed maturity date plus periodic interest (coupons) until then",
          "Key terms: face value (principal, usually $1000), coupon rate (annual interest as % of face), coupon frequency (usually semiannual in US), maturity date, issue date, callable/putable features",
          "Price quotation: bonds quoted as % of face value. A bond at 102 is trading at 102% of face — $1020 for a $1000 face. A bond at 95 is trading at a discount",
          "Yield = the actual return you earn if you buy at current price and hold to maturity. Always compare bonds by yield, not coupon",
          "Bond prices and yields move inversely. This is the most important fact about bonds. When yields rise, prices fall. When yields fall, prices rise. The rest is detail"
        ]
      },
      {
        name: "Types Of Bonds",
        items: [
          "US Treasuries: bills (<1yr), notes (2-10yr), bonds (>10yr). Considered risk-free in nominal terms (US can always print dollars). The benchmark against which all other bonds are priced",
          "Corporate bonds: investment grade (BBB- and above) vs high yield / junk (BB+ and below). The line between them is mostly arbitrary but creates massive flows because many funds can only buy investment grade",
          "Municipal bonds (munis): issued by states, cities, agencies. Interest is often federal-tax-exempt, making yields lower in nominal terms but higher after-tax for high earners",
          "Mortgage-backed securities (MBS): pools of home loans repackaged into bonds. The 2008 crisis was largely about these. Still the single largest fixed-income market in the US",
          "Structured products: CLOs, CDOs, ABS. Pools of various loans tranched into different risk slices. Higher yield, much harder to analyze. S&P Ratings is heavily involved in rating these"
        ]
      },
      {
        name: "Yield Curves",
        items: [
          "The yield curve = a plot of yields against time-to-maturity for bonds of similar credit quality. Usually drawn for US Treasuries",
          "Normal shape: upward sloping (longer maturities yield more) because investors demand more compensation for tying up money longer",
          "Inverted curve: short rates higher than long rates. Historically a near-perfect predictor of recession (within 18 months). Currently a hot topic at S&P and the Fed",
          "Drivers: short end is anchored by the Fed's policy rate; long end is driven by inflation expectations and growth expectations and term premium",
          "Real-world use: every fixed-income trader, every credit analyst, every economist watches the curve. Knowing how to read it is table stakes for any finance conversation"
        ]
      },
      {
        name: "Duration & Convexity",
        items: [
          "Duration = sensitivity of bond price to yield changes. Measured in years. A bond with duration 7 will lose ~7% of its value if yields rise by 1 percentage point",
          "Higher coupon → lower duration. Longer maturity → higher duration. Higher yields → lower duration. Memorize the relationships",
          "Modified duration vs effective duration: modified is the math derivative; effective accounts for embedded options like calls. Use effective for callable bonds",
          "Convexity = second-order term. Bonds with positive convexity benefit from large moves in either direction. MBS have negative convexity due to prepayment options — they suffer in both directions",
          "Why this matters: portfolio managers think in duration. 'Long duration' = bullish on rates falling. 'Short duration' = bearish on rates falling. The whole language of fixed income runs on this concept"
        ]
      },
      {
        name: "Credit Spreads & Default Risk",
        items: [
          "Credit spread = yield difference between a corporate bond and a same-maturity Treasury. Compensation for credit (default) risk",
          "Spreads widen in stress (credit becomes more risky, investors demand more) and tighten in calm. The high-yield CCC spread is one of the best leading indicators of recession",
          "Default rate vs recovery rate: when an issuer defaults, you don't usually lose 100%. Average recovery on senior unsecured corporate debt is ~40% historically",
          "Expected loss = probability of default × loss given default. The fundamental equation of credit",
          "The spread compensates for expected loss + a risk premium for unexpected loss + a liquidity premium. The 'credit risk premium' in academic finance is the unexpected-loss compensation"
        ]
      },
      {
        name: "Project: Read A Real Bond",
        items: [
          "Pick a real corporate issuer (e.g. Apple, Microsoft, AT&T). Look up one of their outstanding bonds on FINRA's TRACE or a free site like Yahoo Finance",
          "Find: coupon, maturity, current price, yield to maturity, S&P credit rating, original issue size",
          "Calculate the yield spread vs the same-maturity Treasury. Note whether it makes sense given the issuer's rating",
          "Now find a high-yield issuer (e.g. a B-rated bond) and repeat. Compare the spread. The difference between the IG and HY spreads is the 'high yield premium'",
          "Bonus: find the original prospectus on the SEC's EDGAR system. Note the covenants, call features, and ranking. This is what credit analysts actually read"
        ]
      }
    ],
    resources: [
      { name: "FINRA TRACE", url: "https://www.finra.org/finra-data/fixed-income/corp-and-agency", note: "Real-time bond pricing data, free" },
      { name: "Pimco Bond Basics", url: "https://www.pimco.com/en-us/resources/education/everything-you-need-to-know-about-bonds", note: "Best free intro from a major bond manager" },
      { name: "FRED: Treasury Yield Curve", url: "https://fred.stlouisfed.org/categories/115", note: "Historical yield curve data, completely free" },
      { name: "Investopedia: Duration", url: "https://www.investopedia.com/terms/d/duration.asp", note: "The single most important bond concept, explained well" }
    ],
    deeper: "The interesting and underappreciated story in fixed income right now is the rise of private credit — direct lending from non-bank institutions to corporate borrowers, growing from ~$300B in 2010 to ~$1.5T+ today. It's eating market share from both syndicated bank loans and the high-yield bond market. S&P Global Ratings is increasingly active in rating these private credit funds and the underlying loans, which is creating a new revenue stream and a new analytical challenge. Worth tracking closely if you want to be useful in product conversations at S&P over the next 5 years."
  },
  {
    id: 4,
    title: "Credit Ratings: The S&P Global Ratings Business",
    subtitle: "Where Half The Company's Revenue Comes From",
    time: "3 weeks",
    icon: "★",
    color: "#B8893E",
    intro: "S&P Global Ratings is one of the two crown jewels of your employer (the other is the indices business). It is roughly a $4B revenue line, very high margin, and structurally protected. If you only deeply learn one phase in this curriculum, it should be this one. The credibility you gain inside S&P from being able to discuss ratings methodology fluently is worth more than any other single skill on this list.",
    sections: [
      {
        name: "What A Credit Rating Is",
        items: [
          "A credit rating is an opinion on the creditworthiness of an issuer or a specific debt instrument — the likelihood that the borrower will repay on time and in full",
          "Ratings are NOT investment recommendations. They're not 'buy/sell/hold'. They're forward-looking opinions on default probability and (in some cases) loss severity. This distinction matters legally and culturally",
          "Ratings scale (S&P): AAA, AA+, AA, AA-, A+, A, A-, BBB+, BBB, BBB- (investment grade) | BB+, BB, BB-, B+, B, B-, CCC+, CCC, CCC-, CC, C, D (speculative grade / 'junk'). 22 notches",
          "Outlooks and CreditWatch: outlook is medium-term direction (positive/stable/negative/developing). CreditWatch is shorter-term and more imminent. These often move markets more than the rating itself",
          "Issuer rating vs issue rating: an issuer can have one credit profile but issue multiple bonds with different ratings depending on collateral, ranking, and covenants"
        ]
      },
      {
        name: "How A Rating Actually Gets Done",
        items: [
          "An issuer requests a rating (most ratings are issuer-paid; this is the controversial business model). The rating agency assigns an analyst lead and team",
          "The analytical process: financial analysis (credit ratios, cash flows, leverage), business risk profile (industry, competitive position, management), country and industry risk overlays",
          "S&P publishes its criteria publicly. Each industry has a specific methodology document. These run hundreds of pages and are updated periodically. They're a goldmine of structured analytical thinking",
          "The rating committee: the analyst presents to a committee of senior analysts who vote on the rating. This is the actual decision mechanism. It's deliberately slow and consensus-driven",
          "Surveillance: ratings are reviewed at least annually and any time material new information emerges. A rating is not a one-time verdict — it's a monitored ongoing opinion"
        ]
      },
      {
        name: "The Issuer-Pays Model And Its Critics",
        items: [
          "Issuer-pays: the company being rated pays the rating agency. This is the dominant model since the 1970s. Before that, ratings were paid for by investors via subscriptions",
          "The conflict-of-interest problem: rating agencies face pressure to give higher ratings to keep clients. The 2008 crisis exposed this in structured products (subprime MBS rated AAA that defaulted en masse)",
          "Defenders of the model: investor-pays would be a free-rider problem (anyone could see the rating without paying). Issuer-pays internalizes the cost of the public good",
          "Regulatory response: NRSRO (Nationally Recognized Statistical Rating Organization) status from the SEC. Limits which agencies' ratings can be used in regulation. Currently 9 NRSROs, but the big three (S&P, Moody's, Fitch) have ~95% market share",
          "Reforms post-2008: separation of rating committee from sales, increased disclosure of methodology changes, performance reporting. Most reforms are around process transparency, not the issuer-pays model itself"
        ]
      },
      {
        name: "Methodology: What Analysts Actually Look At",
        items: [
          "Industry risk: cyclicality, competitive intensity, growth, regulatory exposure. Some industries (utilities) are inherently lower risk than others (commodities, technology)",
          "Country risk: macro stability, currency stability, government interference, legal framework. Bonds issued in unstable countries get a country risk overlay even if the company is fine",
          "Competitive position: market share, scale, diversification, brand, cost position. Two identical-financial-profile companies can be rated differently if one has structural moats and the other doesn't",
          "Financial risk: leverage (debt/EBITDA), interest coverage (EBITDA/interest), cash flow (FFO/debt), liquidity (sources vs uses over 12 months). The quantitative core",
          "Management and governance: track record, strategy, capital allocation discipline, board independence. Often the deciding factor between two notches"
        ]
      },
      {
        name: "Sovereign Ratings",
        items: [
          "Sovereign rating = rating of a national government. Different from corporate ratings because governments can print their own currency, tax their citizens, and default selectively",
          "Major dimensions: economic strength (GDP, growth, diversity), institutional strength (rule of law, governance), fiscal strength (debt, deficit, debt structure), monetary flexibility (central bank independence), external position (current account, FX reserves)",
          "The US sovereign rating: AAA from S&P until 2011, AA+ since. The downgrade was politically explosive. Currently AA+ with stable outlook",
          "Sovereign rating ceilings: corporate ratings are often capped at the sovereign rating of the country they operate in (the 'sovereign ceiling' principle). Loosened in recent decades",
          "Sovereign ratings are read by literally every government finance ministry on Earth. They are politically sensitive. The methodology document is worth reading just for the framing"
        ]
      },
      {
        name: "Structured Finance Ratings",
        items: [
          "Structured finance = securities backed by pools of underlying assets, sliced into tranches with different priority. ABS, MBS, CLOs, CDOs",
          "The mechanics: senior tranches get paid first and are typically rated AAA. Junior tranches absorb losses first but earn higher yields. The waterfall is the entire economic structure",
          "How ratings are determined: cash flow modeling under various default and recovery scenarios. The senior tranche is rated based on what level of underlying losses would cause it to take losses",
          "The 2008 failure: rating agencies underestimated correlation in subprime MBS. Models assumed regional independence; actual defaults were nationally correlated. The senior tranches that were rated AAA defaulted",
          "Post-2008 reforms: more conservative correlation assumptions, more disclosure of model inputs, stress testing, increased regulatory scrutiny. The market shrunk, then partly recovered with cleaner products"
        ]
      },
      {
        name: "S&P Ratings Within S&P Global",
        items: [
          "S&P Ratings is one of S&P Global's four main divisions (alongside Market Intelligence, Indices, and Commodity Insights/Mobility). Roughly $4B annual revenue",
          "Margins are very high (operating margins ~60%) because the marginal cost of issuing one more rating is essentially zero. Revenue scales with bond issuance volumes",
          "Cyclical: when companies issue lots of debt (low rates, growth periods), rating fees boom. When issuance slows, ratings revenue dips. Watch debt issuance volumes",
          "Competitive moat: NRSRO status, decades of methodology IP, the network effect (investors want ratings from agencies other investors recognize), regulatory entrenchment (many funds can only hold rated bonds)",
          "Strategic question: how does AI affect this business? Faster initial ratings, faster surveillance, deeper analytical coverage of esoteric instruments — these are all opportunities Kensho can credibly enable"
        ]
      },
      {
        name: "Project: Read A Real Rating Action",
        items: [
          "Go to spglobal.com/ratings and find a recent rating action. Pick something interesting — a downgrade, an upgrade, or a new rating",
          "Read the full press release. Note the structure: rating change, rationale, key drivers, outlook, sensitivities. This is the standardized format every analyst uses",
          "Now find the methodology document the action references. Skim the table of contents. Note how 30 pages of analysis become 1 page of public commentary",
          "Read S&P's most recent 'Default, Transition, and Recovery' study (published annually). This shows historical default rates by rating. It is the empirical backbone of the entire ratings business",
          "Bonus: find the same issuer's rating from Moody's. Compare. Note where they agree and disagree. Multi-notch disagreements are rare but instructive"
        ]
      }
    ],
    resources: [
      { name: "S&P Global Ratings", url: "https://www.spglobal.com/ratings/en/", note: "Your employer's rating actions, methodology, and research" },
      { name: "S&P Methodology Library", url: "https://www.spglobal.com/ratings/en/criteria-and-models", note: "The actual rulebooks — required reading" },
      { name: "S&P Default Study (Annual)", url: "https://www.spglobal.com/ratings/en/research-insights/topics/default-transition-recovery", note: "The empirical foundation of all credit analysis" },
      { name: "SEC NRSRO page", url: "https://www.sec.gov/structureddata/forms-information-credit-rating-agencies", note: "Regulatory framework and the list of recognized agencies" }
    ],
    deeper: "Every couple of years there's a credible thesis that 'AI will disrupt credit ratings.' It's mostly wrong — the regulatory entrenchment, the legal protection against analytical liability, and the network effects are massive moats. But there ARE genuine AI-augmented opportunities inside the ratings business: faster initial ratings of new instruments, much deeper surveillance of existing credits using alternative data, automated peer comparisons, AI-assisted methodology research. These are exactly the kinds of projects that would make a TPM at Kensho look strategic to S&P leadership. The key insight is that AI is unlikely to replace the rating agency, but it can dramatically increase the analytical capacity of each analyst — which is leverage on a $4B revenue line. Worth thinking about deeply."
  },
  {
    id: 5,
    title: "Indices: The S&P Global Indices Business",
    subtitle: "The Other Crown Jewel",
    time: "2–3 weeks",
    icon: "▣",
    color: "#B8893E",
    intro: "Phase 2 introduced indices as products. This phase goes deeper into S&P Dow Jones Indices specifically — its business model, its products, its strategic position, and its evolution. Like the ratings business, this is a high-margin information business with strong moats. Understanding it at the level your CFO understands it is a serious career multiplier.",
    sections: [
      {
        name: "S&P Dow Jones Indices: Structure And Ownership",
        items: [
          "S&P Dow Jones Indices is a joint venture between S&P Global (73%) and CME Group (27%). Created in 2012 by combining S&P's index business with Dow Jones Indexes (which CME had acquired)",
          "The JV owns: the S&P 500 family, the Dow Jones Industrial Average, the S&P Global BMI, the S&P GSCI commodity indices, sector and thematic indices, factor and ESG indices",
          "Revenue model: licensing fees from ETF issuers (paid as % of AUM tracking the index), subscription fees from institutional investors who use the data for benchmarking, derivatives licensing (CME, ICE, Eurex pay to list futures and options on the indices)",
          "Cost structure: very low. The marginal cost of computing one more index value is essentially zero. The cost is upfront methodology development and ongoing committee work",
          "Operating margins: ~70%+. This is a pure information business with strong network effects"
        ]
      },
      {
        name: "The S&P 500 Methodology In Detail",
        items: [
          "Eligibility: US-domiciled, listed on a major US exchange, market cap above a moving threshold (currently ~$15B), positive earnings over the most recent four quarters (sum, and in the most recent quarter), adequate liquidity, public float above 50%",
          "Selection: by the S&P U.S. Index Committee. The committee has discretion within the eligibility rules. This committee discretion is unusual and important — most other major indices are purely rules-based",
          "Weighting: free-float-adjusted market cap. Recalculated continuously. Quarterly rebalancing of the divisor (which is how the index value is normalized over time)",
          "Additions and deletions: announced 3–5 days in advance. The 'index effect' — the bump a stock gets when added — used to be ~5% on announcement. It has compressed in recent years because front-running ETF rebalances has become widespread",
          "Buffer rules: a stock has to fail the criteria badly to be removed; a stock has to clearly meet the criteria to be added. This reduces churn and trading costs"
        ]
      },
      {
        name: "Other Major Index Families",
        items: [
          "Dow Jones Industrial Average: 30 large US stocks, price-weighted (the only major index still using price weighting), selected by committee. Mostly historical/symbolic at this point — ETFs tracking it exist but trail the S&P 500 in AUM by 100x",
          "S&P SmallCap 600 and S&P MidCap 400: complete the S&P size spectrum. Notably less famous than the S&P 500 but heavily used in institutional benchmarking",
          "S&P Global BMI (Broad Market Index): the international version. Covers ~10,000 stocks across 50+ developed and emerging markets",
          "S&P GSCI: commodity indices. Underlying for many commodity futures and ETFs",
          "Thematic indices: clean energy, semiconductors, AI & robotics, water, infrastructure. The fastest-growing product line. Each is a custom methodology built around a theme"
        ]
      },
      {
        name: "Factor And Smart Beta Indices",
        items: [
          "Factor investing = systematic exposure to historically rewarded characteristics: value, momentum, quality, low volatility, size, dividend yield",
          "Each factor has a 'smart beta' or 'factor index' built around it. S&P 500 Pure Value, S&P 500 Pure Growth, S&P 500 Low Volatility, S&P 500 Quality, etc.",
          "Construction: rank S&P 500 stocks by the factor metric, take the top quintile or weight by factor score, rebalance periodically",
          "These products bridge passive and active investing. They're rule-based (so they qualify as indices and earn tax/cost benefits of passive) but they have systematic biases (so they perform differently from cap-weighted)",
          "Why this matters strategically: smart beta is the growth area in indexing. As pure cap-weighted indexing has become commoditized, the differentiation has moved to factor methodology"
        ]
      },
      {
        name: "ESG And Sustainability Indices",
        items: [
          "S&P 500 ESG: same constituents as S&P 500 (mostly), reweighted by ESG scores. Excludes tobacco, controversial weapons, thermal coal, low-ESG-scored companies",
          "S&P Global 1200 ESG, S&P Global LargeMidCap ESG, S&P Global LargeMidCap Carbon Efficient. Each is a different ESG construction methodology",
          "The ESG indexing market has been one of the fastest-growing index categories of the last decade. Slowing recently due to political backlash in the US but still growing internationally",
          "Methodology challenges: ESG scoring is contested, data is uneven, scoring providers disagree. S&P has its own ESG scoring methodology which is both an advantage and a liability",
          "Strategic question: in an environment of ESG backlash in the US and continued embrace in Europe, how does S&P Global position its ESG products? Real ongoing strategic question at the company"
        ]
      },
      {
        name: "Custom Indices And Index-As-A-Service",
        items: [
          "Custom indices: large institutional clients ask S&P to create a private index to their specifications, which they then license. Examples: a single large pension fund's strategic benchmark, a bank's structured product underlying",
          "Index-as-a-service: S&P calculates and maintains the index for the client; the methodology may be jointly developed or provided by the client. High-margin, recurring revenue, no marketing cost",
          "Direct indexing connection: the rise of direct indexing (where retail investors hold the underlying stocks instead of an ETF) creates demand for index providers to license methodologies for personalized portfolios",
          "Acquisitions in this space: S&P acquired IHS Markit in 2022 (huge deal), which brought in additional data, indexing, and analytics businesses. The strategic logic was 'be the dominant data and analytics provider for capital markets'",
          "AI angle: custom index construction is a natural application for AI tooling — clients describe what they want in natural language, AI helps generate methodology drafts that humans then refine. Real opportunity at Kensho"
        ]
      },
      {
        name: "Project: Build A Mental Model Of The Indices Business",
        items: [
          "Read S&P Global's most recent annual report (10-K, available on EDGAR). Find the indices segment. Note the revenue, growth rate, operating margin, and AUM tracking the indices",
          "Find the segment-by-segment breakout. Compare indices to ratings, market intelligence, and commodity insights. Note the relative scale and growth rates",
          "Read the methodology of three different index types: a vanilla cap-weighted (S&P 500), a factor index (S&P 500 Quality), and a thematic (S&P Kensho New Economy — yes, a Kensho product). Note how the methodologies differ in flavor",
          "Find the licensing terms for an index. (You may need to dig — they're often confidential, but some basics are public.) Get a feel for the per-bps fee structure",
          "Bonus: read 3 quarters of S&P Global earnings call transcripts. Note how management talks about the indices business — what metrics they emphasize, what risks they call out, what acquisitions they hint at"
        ]
      }
    ],
    resources: [
      { name: "S&P Dow Jones Indices Methodology Library", url: "https://www.spglobal.com/spdji/en/methodology/", note: "All published index methodologies — read at least three" },
      { name: "S&P Global Investor Relations", url: "https://investor.spglobal.com/", note: "Annual reports, quarterly earnings, investor presentations" },
      { name: "S&P Kensho New Economy Indices", url: "https://www.spglobal.com/spdji/en/index-family/equity/thematics/kensho-new-economies/", note: "Indices co-developed with Kensho — your own employer's collaboration with the parent" },
      { name: "Bloomberg: Index Industry Association", url: "https://www.indexindustry.org/", note: "Industry-wide context and statistics" }
    ],
    deeper: "The strategic rabbit hole here is the long arc from active management → cap-weighted passive → smart beta → factor → direct indexing → personalized portfolios. Each step disintermediates a layer of the active management value chain and shifts more value to the index provider and the underlying data. S&P Global has been brilliantly positioned at every step of this arc. The next step — AI-personalized investment portfolios for individual clients at scale — is exactly the kind of capability that Kensho's tech and S&P's data could enable. If you can write a 2-page memo on this thesis with specific product proposals, you become a strategic asset to leadership. This is the kind of artifact that gets you promoted into VP-of-product roles."
  },
  {
    id: 6,
    title: "Market Data & Information Services",
    subtitle: "The Plumbing Of Modern Finance",
    time: "2–3 weeks",
    icon: "⊟",
    color: "#B8893E",
    intro: "Market data is the boring, profitable, structurally protected backbone of modern finance. It's also the second-largest segment of S&P Global by revenue (Market Intelligence), and where most of the action happens after the IHS Markit merger. This phase covers what 'market data' actually consists of, who pays for it, and why this business is so durable.",
    sections: [
      {
        name: "What 'Market Data' Actually Includes",
        items: [
          "Real-time and historical prices: every trade, every quote, every level of the order book, for every instrument on every venue. The most basic and most contested layer",
          "Reference data: descriptive metadata about instruments — issuer, ISIN, CUSIP, sector, currency, settlement conventions, corporate action history. Boring but essential",
          "Corporate actions: dividends, stock splits, mergers, spinoffs, name changes. Mistakes here cause real money losses. Specialized providers exist solely for this",
          "Fundamentals: financial statements, ratios, historical earnings, analyst estimates. The data underlying every valuation model. S&P Capital IQ and Compustat are the dominant sources",
          "End-of-day vs streaming: end-of-day data is cheap and serves most purposes. Streaming low-latency data is expensive and sold to traders, hedge funds, banks"
        ]
      },
      {
        name: "Who Sells Market Data",
        items: [
          "Exchanges: NYSE, Nasdaq, CME, ICE all sell market data as a major business line. Often higher margins than the trading business itself",
          "Vendors and aggregators: Bloomberg (largest, ~30% market share), Refinitiv (now part of LSEG), FactSet, S&P Global Market Intelligence, Morningstar. Each has overlapping but differentiated coverage",
          "Specialized providers: ICE Data Services (fixed income pricing), MSCI (international and ESG data), Morningstar (mutual fund data), Preqin (private markets). Niche but important",
          "Alternative data providers: satellite imagery (RS Metrics), credit card transactions (Yipit), web scraping (1010data), sentiment (Quandl). The fast-growing, less mature segment",
          "Government and free sources: SEC EDGAR (filings), FRED (Federal Reserve economic data), BLS (labor statistics). The free baseline that everyone else builds on"
        ]
      },
      {
        name: "S&P Global Market Intelligence",
        items: [
          "S&P Global Market Intelligence (MI) is the largest segment of S&P Global by revenue (~$4.5B). Combines S&P Capital IQ (corporate fundamentals), CRISIL (Indian ratings and analytics), SNL Financial (financial sector data), and many post-IHS-Markit assets",
          "The Capital IQ platform: terminal/web app used by investment bankers, equity analysts, corporate development, M&A teams. Direct competitor to FactSet and Bloomberg for fundamentals work",
          "Compustat: the gold-standard historical fundamentals database. Decades of cleaned and standardized financial statements. Used by virtually every quantitative finance researcher in academia",
          "Pricing data: S&P MI is one of the major suppliers of bond pricing (especially for less liquid instruments where prices have to be modeled rather than observed)",
          "ESG data and analytics: S&P MI's ESG data products compete with MSCI and Sustainalytics. Growing but contested category"
        ]
      },
      {
        name: "Why Market Data Is A Great Business",
        items: [
          "Recurring revenue: customers pay annual subscriptions, often multi-year. Renewal rates are very high (90%+) because data is sticky — once a workflow is built around your data, switching costs are large",
          "Network effects: the more customers use your data, the more valuable it becomes (because counterparties expect it, models reference it, regulators accept it)",
          "High margins: marginal cost of one more user is near zero once data is collected and cleaned. Operating margins for pure-play market data companies are 30–50%",
          "Defensive: customers' compliance and reporting needs ensure they keep paying even in downturns. Less cyclical than most businesses",
          "Hard to disrupt: would-be competitors face cold-start problems on data coverage, sales force build-out, customer trust establishment"
        ]
      },
      {
        name: "Pricing And Sales Models",
        items: [
          "Per-user, per-month: most common for terminal/desktop products. Bloomberg charges ~$25k/user/year for the terminal. Capital IQ is in the same ballpark. FactSet is similar",
          "Per-feed: institutional clients pay for raw data feeds (pricing, reference data) by volume of data and number of fields. Pricing is opaque and negotiated",
          "Site licenses: large enterprises negotiate flat-fee unlimited-use licenses. Often the most profitable structure",
          "API access: API-based access for engineering teams. Pricing varies wildly. The future of how the business is delivered, but the legacy desktop business is still 80% of revenue",
          "Data redistribution rights: customers often want to redistribute data internally or to clients. This is a separate, expensive license layer"
        ]
      },
      {
        name: "The IHS Markit Merger",
        items: [
          "S&P Global acquired IHS Markit in 2022 for ~$44 billion. The largest deal in S&P Global's history",
          "Strategic rationale: combine S&P's data with IHS Markit's data + analytics capabilities, build a more complete capital markets data and analytics platform",
          "What IHS Markit brought: bond pricing (the most-cited bond pricing data in the market), CDS data, loan pricing, leveraged loan data, ESG data, supply chain data, automotive data, energy data",
          "Divestitures required by regulators: some overlapping businesses had to be sold (notably parts of the leveraged loan business and oil price reporting)",
          "Integration: ongoing challenge. Multiple legacy systems, multiple data formats, customer overlap to navigate. The next 3–5 years will see many integration projects you may end up working on",
          "Why this matters for you: as a TPM at Kensho, you sit inside the integrated S&P Global. Many internal projects you'll see are about leveraging the combined data set in new ways"
        ]
      },
      {
        name: "Project: Map Your Own Employer's Data Assets",
        items: [
          "Open the latest S&P Global 10-K. Find the Market Intelligence segment description. Note the listed product lines",
          "For each product line, write 1 sentence on what it is and who its customers are. If you don't know, look it up",
          "Now do the same for S&P Global Ratings, S&P Dow Jones Indices, and S&P Global Commodity Insights / Mobility. By the end of this exercise you should be able to draw the entire S&P Global product portfolio on one sheet of paper",
          "Identify which data assets Kensho can credibly enhance with AI. Which are document-heavy? Which require entity resolution? Which need natural language interfaces?",
          "Bonus: write a 1-page memo identifying 3 specific AI-augmentation opportunities in S&P Global data products. Be concrete. This is the kind of artifact that goes in front of VPs"
        ]
      }
    ],
    resources: [
      { name: "S&P Global Market Intelligence", url: "https://www.spglobal.com/marketintelligence/en/", note: "Your employer's flagship MI product page" },
      { name: "S&P Global 10-K (latest)", url: "https://investor.spglobal.com/financials/sec-filings", note: "Required reading. Multiple times" },
      { name: "Burton-Taylor: Market Data Industry Reports", url: "https://burton-taylor.com/", note: "The definitive market data industry research firm" },
      { name: "Bloomberg vs Refinitiv vs FactSet (industry overviews)", url: "https://www.efinancialcareers.com/news/2023/06/bloomberg-vs-refinitiv-vs-factset", note: "Competitive landscape primer" }
    ],
    deeper: "The frontier in market data is the rise of AI-native data interfaces — instead of selling a terminal with 50,000 functions to learn, sell a chat interface that understands the data and answers questions. This is not a hypothetical: Bloomberg has BloombergGPT, Hebbia is targeting investment workflows, Sigma AI is building on top of FactSet data. Kensho sits inside the company that has the data; the strategic question is whether S&P Global can build the AI interface layer faster than Bloomberg can build the data layer. This is the most interesting strategic battle in your employer's industry over the next 3 years and you should track it closely. PM/TPM roles that touch this directly are the highest-leverage roles in the company."
  },
  {
    id: 7,
    title: "Alternative Data & AI in Finance",
    subtitle: "The New Substrate For Alpha",
    time: "2 weeks",
    icon: "◇",
    color: "#B8893E",
    intro: "Alternative data — satellite imagery, credit card spending, web scraping, sentiment analysis, geolocation — has gone from a fringe hedge fund tool in 2010 to a $7B+ industry today. AI in finance is the broader category. This phase is where Kensho's specific positioning becomes very relevant: Kensho was acquired in part to bring AI capabilities to S&P Global's data products, and alternative data is one of the natural integration points.",
    sections: [
      {
        name: "What Alternative Data Means",
        items: [
          "Alternative data = any information not from traditional financial sources (filings, exchanges, fundamentals databases) that has predictive value for financial decisions",
          "Categories: geospatial (satellite, foot traffic), transactional (credit card, debit card, payment platforms), web (scraped, search trends, app downloads), sentiment (social media, news, forum), corporate (job postings, web hiring, employee reviews)",
          "Typical use case: a hedge fund wants an early read on a retailer's quarterly sales. They buy credit card transaction data showing aggregate purchases at the retailer. Two weeks before the official earnings report, they have a forecast",
          "The market: ~$7B annually in 2024, growing 25%+/year. Most spending is by hedge funds. Asset managers and corporate users are growing customer segments",
          "The economics: alpha decays. As more funds use a dataset, its predictive value falls. Providers compete on novelty and exclusivity"
        ]
      },
      {
        name: "Major Alt Data Categories",
        items: [
          "Geospatial: satellite imagery (RS Metrics, Orbital Insight, Planet Labs) for parking lots, shipping container counts, oil tank levels, agricultural yields. SAR (synthetic aperture radar) for night and weather coverage",
          "Transaction data: credit/debit card aggregates from companies like Yodlee, Yipit, Earnest. Sold as anonymized aggregates by retailer/category. Most-used alt data category",
          "Web scraped: product prices, inventory levels, app downloads, web traffic, hiring activity. Companies: Similarweb, Sensor Tower, Apptopia, Thinknum, LinkUp",
          "Sentiment and news: Refinitiv, Bloomberg, Quiver Quantitative, Stocktwits sentiment APIs. NLP-derived signals from news, filings, earnings calls",
          "Esoteric: shipping vessel tracking (MarineTraffic), private jet movements (JetTrack), patent filings, hiring patterns by company role. Each is a specialized data product"
        ]
      },
      {
        name: "Quality, Privacy, And Legal",
        items: [
          "Selection bias: alt data covers a sample of the underlying population. Credit card data covers credit-card-using consumers. Foot traffic data covers cell-phone-carrying adults. Bias correction is half the analytics work",
          "Privacy: most alt data is anonymized or aggregated, but the line is blurry. Several alt data providers have faced regulatory scrutiny. Always check provenance",
          "Insider information risk: alt data can sometimes give material non-public information. The line between 'mosaic theory' (legal) and insider trading (illegal) is contested. Compliance review is mandatory for hedge fund use",
          "Material adverse changes: in 2020-21, COVID upended the predictive value of many alt datasets overnight. Alt data degrades in regimes that don't match its training period",
          "Legal frameworks: GDPR, CCPA, and similar regulations apply. Data providers spend significant effort on compliance certifications"
        ]
      },
      {
        name: "AI In Finance: Beyond Alt Data",
        items: [
          "Algorithmic trading: high-frequency trading firms have used ML for pricing and execution since the 1990s. This is mature and not really 'AI in finance' anymore",
          "Quant fund signal generation: hedge funds use ML for pattern recognition in market data. AQR, Two Sigma, Renaissance, DE Shaw. The frontier of academic ML applied to markets",
          "Underwriting: banks use ML for credit decisions on consumer loans. Mature but increasingly regulated (fair lending laws, explainability requirements)",
          "Compliance and surveillance: AI for trade surveillance, market abuse detection, KYC, AML. Boring but enormous market. Banks spend billions",
          "Generative AI specifically: research summarization, document Q&A, drafting analyst reports, extracting structured data from filings. This is where the new wave is. Kensho's products live here"
        ]
      },
      {
        name: "Kensho Specifically",
        items: [
          "Kensho was founded in 2013 as a financial AI startup. Acquired by S&P Global in 2018 for ~$550M, the largest AI acquisition in finance at the time",
          "Original product: Kensho Warren — a natural-language interface for financial questions. The 'ask anything about markets' product, predating modern LLMs",
          "Current product portfolio: Kensho NERD (named entity recognition for finance documents), Kensho Scribe (transcription with finance specialization), Kensho Link (entity resolution and data linking), Kensho Classify (document classification), Kensho Extract (data extraction)",
          "Strategic role: Kensho is S&P Global's AI capability center. Its job is to AI-enable S&P Global's data products and enable new AI-native products across the parent company",
          "What this means for you as a TPM: every project has to thread the needle between Kensho's AI capabilities and S&P Global's data assets and customer relationships. Both technical and business-strategy literacy are required. This curriculum is designed to give you the second half"
        ]
      },
      {
        name: "Project: An Alt Data Hypothesis",
        items: [
          "Pick a public company you find interesting. Identify one operational metric that probably moves the stock (same-store sales, inventory levels, hiring, web traffic, foot traffic)",
          "Identify a publicly-or-cheaply-available alt data source that could measure that metric ahead of the company's official reporting",
          "Write a 1-page hypothesis memo: which dataset, why it should be predictive, what the lead time would be, what the limitations are",
          "Now check if any commercial alt data provider already sells a version of this. If yes, that's a competitive market. If no, that's either a novel idea or a sign that the data isn't actually useful",
          "Bonus: identify how Kensho's existing capabilities (entity resolution, document extraction, NLP) could enhance the dataset. This is the kind of cross-product thinking that gets noticed"
        ]
      }
    ],
    resources: [
      { name: "Kensho", url: "https://kensho.com/", note: "Your own employer's product portfolio. Read every page" },
      { name: "Kensho Research Publications", url: "https://kensho.com/research", note: "The papers your colleagues have published. Read at least three" },
      { name: "AlternativeData.org", url: "https://alternativedata.org/", note: "Industry association directory of providers" },
      { name: "Quandl (now part of Nasdaq Data Link)", url: "https://data.nasdaq.com/", note: "Marketplace for alternative datasets, free tier" }
    ],
    deeper: "The most strategically important question at Kensho specifically is: what should an 'AI-native' financial data product look like in 2027? Bloomberg's terminal is 40 years old and shows it. FactSet and Capital IQ are similar. The AI-native version is something like a chat interface backed by all of S&P Global's data, with rigorous citations and provenance, that an analyst can use as a research partner. This isn't a hypothetical — every player in the industry is racing toward it. The TPMs who can articulate this product vision concretely, identify the technical building blocks (which is what Applied AI Phase 4-8 cover), and align stakeholders across S&P Global divisions will be the ones designing it. This is the highest-leverage product role in the company over the next 3 years."
  },
  {
    id: 8,
    title: "Derivatives: Options, Futures, Swaps",
    subtitle: "The Insurance Layer Of Markets",
    time: "2–3 weeks",
    icon: "↔",
    color: "#B8893E",
    intro: "Derivatives are where finance gets weird. They're contracts that derive value from other things — stocks, bonds, rates, commodities, currencies. They are also the layer where most of the actual risk transfer in capital markets happens. You don't need to be a quant, but you do need to know what each instrument does and why it exists.",
    sections: [
      {
        name: "Why Derivatives Exist",
        items: [
          "The original purpose: hedging. A wheat farmer who wants to lock in next year's price uses a futures contract. A US importer who'll receive euros in 6 months hedges with FX forwards",
          "The secondary purpose: speculation with leverage. Derivatives let you take large notional exposures with small upfront capital. Most derivative volume is speculative, not hedging",
          "The third purpose: synthesizing exposures. You can replicate the payoff of one instrument using a combination of others. This is how structured products are built",
          "The dark side: leverage amplifies losses. Most major financial blow-ups (LTCM, AIG, Archegos, Credit Suisse) involved derivative leverage that was invisible until it wasn't",
          "Notional vs market value: a $1 trillion notional swap might have only $10 million of actual at-risk value. Always distinguish the two"
        ]
      },
      {
        name: "Futures",
        items: [
          "A futures contract is an obligation to buy or sell a standardized amount of an asset at a fixed price on a fixed date. Standardized and traded on exchanges",
          "Major futures: S&P 500 E-mini (CME), Eurodollar/SOFR (CME), 10-year Treasury (CME), crude oil (CME/ICE), gold (COMEX). Each has its own contract specifications",
          "Mark-to-market daily: futures positions are settled in cash every day. This eliminates counterparty credit risk that would build up over time",
          "Margin: futures require initial margin (a small % of notional) and maintenance margin (a lower threshold). If your position moves against you, you get a margin call",
          "Use case: a portfolio manager wants to rebalance a $1B equity portfolio without selling stocks. They short S&P 500 futures equivalent to the equity exposure they want to remove. Cheap, fast, reversible"
        ]
      },
      {
        name: "Options",
        items: [
          "An option is the RIGHT but not the OBLIGATION to buy (call) or sell (put) an underlying at a specific price (strike) by a specific date (expiry)",
          "The buyer pays a premium upfront and gets the right. The seller (writer) collects the premium and takes on the obligation",
          "Calls profit when the underlying rises above strike + premium. Puts profit when the underlying falls below strike - premium. Combinations create custom payoffs",
          "Black-Scholes: the famous pricing model. Inputs are spot, strike, time to expiry, volatility, risk-free rate, dividends. The output is the theoretical premium. Real markets price slightly differently due to skew and demand",
          "The Greeks: delta (sensitivity to underlying price), gamma (sensitivity of delta), theta (time decay), vega (volatility sensitivity), rho (interest rate sensitivity). Every options trader speaks in Greeks"
        ]
      },
      {
        name: "Swaps",
        items: [
          "A swap is a contract between two parties to exchange cash flows. Most common: interest rate swaps (one party pays fixed, the other pays floating)",
          "Use case: a corporate has a floating-rate loan but wants the certainty of fixed payments. They enter a swap with a bank, paying the bank fixed and receiving floating, which offsets their loan payments",
          "Notional: swaps have no upfront principal exchange. The notional is just used to compute the cash flows. This is why swap notional figures look enormous — $500T+ globally — without representing $500T of actual risk",
          "Counterparty risk: pre-2008, swaps were bilateral and counterparty risk was a real issue. Post-2008, most plain-vanilla swaps go through central clearing (which also reduces systemic risk)",
          "Variations: currency swaps (exchange flows in different currencies), equity swaps (exchange total equity returns for funding rate), commodity swaps. The principle is always: exchange one cash flow stream for another"
        ]
      },
      {
        name: "Credit Derivatives And CDS",
        items: [
          "Credit Default Swap (CDS): the insurance contract on a corporate bond. The buyer pays a premium and receives a payout if the issuer defaults. Originally intended as a hedging tool, became a major speculative instrument",
          "How CDS prices work: the premium (in basis points per year) reflects the market's expectation of default probability. A 5-year CDS at 200bps roughly implies ~3% annual default probability",
          "CDS is often a faster price signal than bond prices because it's standardized and more liquid for many issuers. Credit analysts watch CDS spreads as a leading indicator",
          "The 2008 crisis: AIG had written massive amounts of CDS on subprime MBS. When the underlying defaulted, AIG had to pay out, which it couldn't, and the federal government had to step in. Single most expensive cleanup of the crisis",
          "Post-crisis: CDS now centrally cleared, more transparent, more regulated. Still a major instrument but less politically toxic"
        ]
      },
      {
        name: "Project: Walk Through A Real Hedge",
        items: [
          "Pick a public company with disclosed derivative use (utility companies, airlines, multinationals). Find the derivatives section of their 10-K (usually under 'risk management' or 'derivatives')",
          "Note: what are they hedging? (Fuel, FX, interest rates, commodity prices.) What instruments are they using? (Forwards, swaps, options.) How much notional?",
          "Calculate the rough scale relative to their revenue or operating costs. Note whether the hedging is for accounting purposes (smoothing) or true economic risk reduction",
          "Bonus: find a derivatives blow-up case study. P&G in the 1990s, Long-Term Capital in 1998, AIG in 2008, Archegos in 2021. Each is a textbook lesson in what goes wrong when derivative leverage hides until it doesn't"
        ]
      }
    ],
    resources: [
      { name: "CME Group: Education", url: "https://www.cmegroup.com/education.html", note: "Free, comprehensive education from the largest derivatives exchange" },
      { name: "Investopedia: Derivatives", url: "https://www.investopedia.com/terms/d/derivative.asp", note: "Solid foundational primer" },
      { name: "Hull's Options, Futures, and Other Derivatives", url: "https://www.amazon.com/Options-Futures-Other-Derivatives-10th/dp/013447208X", note: "The textbook. Skim only — you don't need to do the math" },
      { name: "BIS: Derivatives Statistics", url: "https://www.bis.org/statistics/derstats.htm", note: "Global derivatives market size data" }
    ],
    deeper: "The intersection of derivatives and credit is where S&P Global's data plays a quiet but critical role. Pricing illiquid corporate bonds, OTC derivatives, structured credit — all require modeled prices because there's no observable market price. S&P Global Market Intelligence (post-IHS Markit merger) is one of the largest providers of this data. The methodology is mostly proprietary, the customer base is concentrated (banks and insurance companies), and the regulatory dependency is high. This is one of those quiet billion-dollar businesses inside S&P Global that almost nobody outside the industry has heard of. Worth knowing exists."
  },
  {
    id: 9,
    title: "Macroeconomics for Markets",
    subtitle: "How The Fed Moves Everything",
    time: "2 weeks",
    icon: "◷",
    color: "#B8893E",
    intro: "You don't need to be an economist to be useful in financial services, but you do need to be able to read the economic news intelligently. This phase covers just enough macro to understand what GDP, inflation, employment, and Fed decisions actually do to markets. It's a survey, not a deep dive.",
    sections: [
      {
        name: "GDP, Growth, And Cycles",
        items: [
          "GDP = total value of goods and services produced. Real GDP adjusts for inflation. Per-capita GDP normalizes for population. The headline number that markets and politicians watch",
          "GDP components: consumption (C), investment (I), government spending (G), net exports (X-M). Y = C + I + G + (X-M). Memorize this identity — it's everywhere in macro",
          "Business cycles: expansion → peak → recession → trough → expansion. Lengths vary (avg ~5–8 years). NBER officially dates US recessions",
          "Recession indicators: inverted yield curve, falling leading indicators (Conference Board), rising unemployment claims, declining ISM manufacturing/services",
          "Growth varies: 2–3% real growth is normal for developed economies. Above 3% is hot. Below 1% is weak. Negative is recession"
        ]
      },
      {
        name: "Inflation",
        items: [
          "Inflation = rate of change in the price level. CPI (Consumer Price Index, BLS) is the headline measure. PCE (Personal Consumption Expenditures, BEA) is the Fed's preferred measure",
          "Core inflation: excludes food and energy (volatile). What economists actually look at when forecasting",
          "Drivers: demand-pull (more money chasing same goods), cost-push (input prices rising), wage-price spirals (workers demand raises in response to inflation), inflation expectations (self-fulfilling)",
          "The Fed's target: 2% PCE inflation. When inflation is above target, the Fed raises rates. When below, it cuts. This single mechanism drives most of the macro story",
          "2021–2023: post-COVID inflation surge to 9% CPI. Fed raised rates from 0% to 5.25%. The fastest hiking cycle in 40 years. Now (2025–2026) we're in the cooling phase"
        ]
      },
      {
        name: "Employment And Labor",
        items: [
          "The two big monthly reports: nonfarm payrolls (BLS, first Friday of every month) and unemployment rate (also BLS). These move markets more than almost any other data",
          "Unemployment rate: percent of labor force without a job actively looking. 'Full employment' is around 4%. Below 4% is hot. Above 5% is weak",
          "Labor force participation rate: % of working-age adults working or looking. Has been declining for decades for various reasons",
          "Wage growth: average hourly earnings, employment cost index. Wage growth above productivity growth contributes to inflation",
          "JOLTS (job openings and labor turnover survey): another important monthly release. Job openings vs unemployed people = the tightness of the labor market"
        ]
      },
      {
        name: "Monetary Policy And The Fed",
        items: [
          "The Federal Reserve's mandate: stable prices (2% inflation) and maximum employment. The 'dual mandate'. Sometimes these conflict",
          "The federal funds rate: the rate at which banks lend reserves to each other overnight. The Fed sets a target range (currently 5.25-5.50% as of 2025), and conducts open market operations to keep the actual rate inside the range",
          "FOMC meetings: 8 times per year. Each meeting includes the rate decision, the dot plot (members' projections), and a press conference. These are the most market-moving days on the calendar",
          "Quantitative easing (QE) / quantitative tightening (QT): when the Fed buys or sells bonds to expand or contract its balance sheet. Used when interest rates alone aren't enough",
          "Forward guidance: the Fed signals future policy through speeches and meeting statements. Communication has become a primary policy tool"
        ]
      },
      {
        name: "How Macro Moves Markets",
        items: [
          "Stocks: lower rates → higher valuations (discount rate effect) and easier consumer spending → higher earnings. Both are bullish. Higher rates → opposite",
          "Bonds: rates up → bond prices down (mechanical). Inflation up → bond yields up to compensate → bond prices down. Bonds love deflation, hate inflation",
          "FX: higher rates in one country attract capital → currency strengthens. Inflation differentials matter long-term",
          "Commodities: dollar strength suppresses commodity prices (commodities are dollar-priced). Growth boosts demand. Inflation hedges (gold) move on real interest rates",
          "Sectors: financials love rising rates (better margins), utilities and REITs hate them (dividend yield competition). Tech is rate-sensitive due to long-duration cash flows"
        ]
      },
      {
        name: "Project: Build A Macro Cheat Sheet",
        items: [
          "On one page, list: 5 most important monthly economic releases (date and what they measure), 3 most important Fed events (FOMC, dot plot, Jackson Hole), 5 leading indicators of recession",
          "Pull the latest values for each from FRED. Note where they sit relative to history",
          "Pick one current macro theme (e.g. 'is the Fed done hiking?', 'is the labor market cooling?'). Find 3 data points that support it and 2 that contradict it",
          "Write a 2-paragraph 'state of the macro' note. The kind of thing a buy-side analyst writes daily. The exercise of being concise is the entire skill",
          "Bonus: read a recent FOMC statement and the prior one. Find the words that changed. The 'Fed-speak diff' is a real Wall Street craft"
        ]
      }
    ],
    resources: [
      { name: "FRED (Federal Reserve Economic Data)", url: "https://fred.stlouisfed.org/", note: "The single best free macro data source in the world" },
      { name: "BLS Economic Releases", url: "https://www.bls.gov/schedule/news_release/", note: "Calendar of US labor and inflation releases" },
      { name: "Federal Reserve FOMC Page", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm", note: "Meeting calendar, statements, dot plots" },
      { name: "Marginal Revolution", url: "https://marginalrevolution.com/", note: "Daily readable economics blog. The best way to absorb macro intuition over time" }
    ],
    deeper: "Macro forecasting is famously bad at the timing level — the Fed regularly gets its own forecasts wrong, and famous economists are wrong all the time. The right way to use macro is not to predict but to understand the regime you're in and the asymmetries in different scenarios. Read 'The Big Debt Crises' by Ray Dalio for the long-cycle view. Read 'A Random Walk Down Wall Street' by Burton Malkiel for the case that markets mostly already incorporate macro information. Truth is somewhere in between. For your purposes at Kensho, the value is being able to read the economic news intelligently and understand what your firm's customers care about."
  },
  {
    id: 10,
    title: "Financial Statements & Valuation",
    subtitle: "How Companies Are Actually Worth Money",
    time: "2–3 weeks",
    icon: "$",
    color: "#B8893E",
    intro: "Reading financial statements and doing basic company valuation are foundational skills for anyone in financial services. This phase is the practitioner's version: how to find the numbers that matter, what the major valuation methods do, and how to spot trouble. You don't need to become an analyst, but you should be able to read a 10-K and have an opinion.",
    sections: [
      {
        name: "The Three Statements",
        items: [
          "Balance sheet: a snapshot at a point in time. Assets = Liabilities + Equity. The accounting identity that underlies everything",
          "Income statement: revenue → cost of goods sold → gross profit → operating expenses → operating income → interest/taxes → net income. The 'profit' story over a period",
          "Cash flow statement: operating cash flow + investing cash flow + financing cash flow. Where the actual cash came from and went. The most underrated of the three statements",
          "Why three statements: companies can show profit while running out of cash (working capital, accruals, capex). Cash flow is usually the truest measure of business health",
          "GAAP vs non-GAAP: companies report 'adjusted' metrics excluding things they consider non-recurring. Always read both and figure out what they're hiding"
        ]
      },
      {
        name: "Reading The 10-K",
        items: [
          "Item 1: Business. The plain-English description of what the company does, its products, its competition, its strategy. Read this first for any new company",
          "Item 1A: Risk Factors. The legally-mandated list of everything that could go wrong. Mostly boilerplate but occasionally reveals real concerns. Read it",
          "Item 7: Management's Discussion and Analysis (MD&A). Management's narrative explanation of the year's results. The single most useful section of a 10-K",
          "Item 8: Financial Statements. The audited statements plus footnotes. The footnotes are where the real information is — accounting policies, segment data, debt schedules, contingencies",
          "Item 9A: Controls and Procedures. Disclosure on internal controls. Material weaknesses here are red flags",
          "Read 10-Ks in order: business → MD&A → financials → footnotes → risk factors. Total time for a first read of a new company: 2–3 hours. Worth it"
        ]
      },
      {
        name: "Key Ratios",
        items: [
          "Profitability: gross margin (gross profit / revenue), operating margin (operating income / revenue), net margin (net income / revenue), return on equity (net income / equity), return on invested capital (NOPAT / invested capital)",
          "Liquidity: current ratio (current assets / current liabilities), quick ratio (current assets minus inventory / current liabilities). Indicators of short-term solvency",
          "Leverage: debt/equity, debt/EBITDA, interest coverage (EBIT/interest expense). The ratios credit analysts care about most",
          "Efficiency: inventory turnover, days sales outstanding, asset turnover. How well the company uses its assets to generate revenue",
          "Growth: revenue growth, earnings growth, free cash flow growth. Year-over-year and multi-year. Always look at multi-year because annual numbers are noisy"
        ]
      },
      {
        name: "Valuation Approaches",
        items: [
          "DCF (Discounted Cash Flow): project future free cash flows, discount back to present value at the cost of capital. The most theoretically sound and most assumption-sensitive method",
          "Comparable companies: find similar public companies, look at their valuation multiples (P/E, EV/EBITDA, P/Sales, P/Book), apply to the target. Quick and market-aware",
          "Precedent transactions: find recent acquisitions of similar companies, look at the multiples paid, apply. Used in M&A. Pays a control premium over public comps",
          "Sum-of-the-parts: for diversified companies, value each segment separately and add. Often shows that conglomerates trade at a discount",
          "Asset-based: liquidation value or replacement cost. Used for distressed companies, financial firms, and real estate. Less common for normal operating companies"
        ]
      },
      {
        name: "Multiples In Practice",
        items: [
          "P/E ratio (price/earnings): the most common multiple. Forward P/E (next 12 months earnings) is more useful than trailing P/E. Compare to peers and to history",
          "EV/EBITDA (enterprise value / EBITDA): better than P/E because it accounts for debt and excludes non-cash items. Standard in M&A",
          "P/Sales: useful when earnings are unreliable or negative. Common for early-stage companies and SaaS",
          "PEG ratio (P/E divided by growth rate): adjusts P/E for growth. Rule of thumb: PEG below 1 is cheap, above 2 is expensive. Crude but useful",
          "Sector matters: tech trades at higher multiples than utilities for structural reasons (growth, margins, capital intensity). Don't compare across sectors without adjusting"
        ]
      },
      {
        name: "Project: Read Your Own Employer's Financials",
        items: [
          "Pull S&P Global's most recent 10-K from EDGAR. Read the business section carefully — note all four segments (Ratings, MI, Indices, Commodity Insights/Mobility)",
          "Find revenue and operating income by segment. Compute the operating margin for each. Note which is most profitable",
          "Calculate: revenue growth YoY, operating margin trend, free cash flow / net income, leverage (net debt / EBITDA)",
          "Look up S&P Global's current P/E and EV/EBITDA. Compare to MSCI, Moody's, Morningstar. Note where it trades relative to peers and why",
          "Bonus: read the latest earnings call transcript. Note the metrics management emphasizes, the questions analysts ask, the topics they avoid. This is how Wall Street and your CEO actually talk to each other"
        ]
      }
    ],
    resources: [
      { name: "SEC EDGAR", url: "https://www.sec.gov/edgar.shtml", note: "Free access to every 10-K, 10-Q, 8-K, S-1 filed in the US. The most important free resource in finance" },
      { name: "Damodaran Online", url: "https://pages.stern.nyu.edu/~adamodar/", note: "Aswath Damodaran's free valuation course materials. The authoritative free education on valuation" },
      { name: "Investopedia: Financial Statement Analysis", url: "https://www.investopedia.com/terms/f/financial-statement-analysis.asp", note: "Solid foundational coverage" },
      { name: "Mauboussin: Capital Allocation", url: "https://www.morganstanley.com/im/publication/insights/articles/article_capitalallocationevidenceanalyticalmethodsandassessmenthowto.pdf", note: "How to think about whether management is creating value" }
    ],
    deeper: "Valuation is half craft, half art. The numbers matter but the judgment about which numbers to use, what to believe, and how to weight competing scenarios is where analysts earn their pay. The best book on this craft is Aswath Damodaran's 'Investment Valuation' — long, dense, but the canonical reference. For something more readable, 'The Outsiders' by Will Thorndike profiles eight CEOs who created exceptional shareholder value through capital allocation, and it's a master class in what 'thinking like an owner' actually means in practice."
  },
  {
    id: 11,
    title: "Risk, Compliance & Regulation",
    subtitle: "The Rules That Shape Everything",
    time: "2 weeks",
    icon: "⚐",
    color: "#B8893E",
    intro: "Financial services is a heavily regulated industry. The regulations explain a lot about why markets are structured the way they are, why certain businesses exist, and what constraints apply to product innovation. This phase is a survey, not a comprehensive treatment. The goal is to recognize the landscape so you can ask the right questions when compliance gets involved in a project at Kensho.",
    sections: [
      {
        name: "The US Regulatory Map",
        items: [
          "SEC (Securities and Exchange Commission): regulates securities markets. Public company filings, broker-dealers, investment advisers, investment companies. The agency you'll interact with most",
          "Federal Reserve: central bank, lender of last resort, regulator of bank holding companies and large banks. Sets monetary policy, supervises systemic risk",
          "OCC (Office of the Comptroller of the Currency): primary regulator of national banks. Less prominent than the Fed but important for banking law",
          "FDIC (Federal Deposit Insurance Corporation): insures bank deposits, resolves failed banks. Quietly important",
          "CFTC (Commodity Futures Trading Commission): regulates futures, options on futures, swaps. Smaller than SEC but increasingly important post-2008",
          "FINRA: self-regulatory organization for broker-dealers. Quasi-governmental. Where most enforcement actions against retail brokers happen"
        ]
      },
      {
        name: "Key Post-2008 Regulations",
        items: [
          "Dodd-Frank (2010): the major legislative response to the 2008 crisis. Created the CFPB, expanded swap regulation, required Volcker Rule (banks can't proprietary-trade), required living wills for big banks, designated SIFIs (systemically important institutions)",
          "Volcker Rule: banks can't trade for their own account (with carve-outs for market making and hedging). Reshaped the trading floors of major banks",
          "Stress testing: large banks have to pass annual Fed-administered stress tests showing they can survive severe scenarios. Determines whether they can pay dividends and buy back stock",
          "Capital requirements (Basel III): banks have to hold more capital, especially against risky assets. Made banks safer but reduced their return on equity",
          "Living wills: large banks have to file plans for how they'd be wound down without taxpayer support. Mostly theatrical but legally required"
        ]
      },
      {
        name: "Securities Law Basics",
        items: [
          "Disclosure-based regulation: the US approach is 'tell investors everything material'. The 1933 Act requires registration and prospectus for new offerings. The 1934 Act requires ongoing disclosure for public companies",
          "Insider trading: trading on material non-public information is illegal. The legal definition is more narrow than common usage, but the enforcement regime is aggressive",
          "Material non-public information (MNPI): material = a reasonable investor would consider it important. Non-public = not yet disclosed broadly. The key concept in compliance",
          "Exempt offerings: private placements (Regulation D), crowdfunding (Regulation CF), Reg A. Lower disclosure, restricted to certain investor types or amounts. Most growth-stage funding goes through these",
          "Investment Adviser Act: anyone giving investment advice for compensation generally has to register with the SEC. This is why the CFP curriculum exists at all"
        ]
      },
      {
        name: "International: EU, UK, APAC",
        items: [
          "MiFID II (EU, 2018): comprehensive market structure regulation. Required research unbundling (banks have to charge separately for research), transparency, best execution. Reshaped sell-side research economics",
          "GDPR (EU, 2018): data protection regulation. Affects any company handling EU residents' data. Significant compliance costs",
          "EU AI Act (2024): the first comprehensive AI regulation. Categorizes AI systems by risk level. High-risk AI (which includes some financial use cases) has heavy disclosure and oversight requirements",
          "FCA (UK Financial Conduct Authority): UK's main financial regulator. Increasingly diverging from EU rules post-Brexit",
          "MAS (Singapore), HKMA (Hong Kong), JFSA (Japan): the major APAC regulators. Each has its own approach but generally follow international standards"
        ]
      },
      {
        name: "Compliance In Practice",
        items: [
          "KYC (Know Your Customer): financial firms must verify customer identity before opening accounts. Standardized but tedious. Increasingly automated with ML",
          "AML (Anti-Money Laundering): firms must monitor transactions for suspicious patterns and report them. Bank Secrecy Act in the US",
          "Trade surveillance: firms must monitor employee trading and customer trading for market abuse (insider trading, manipulation, layering). Major opportunity for AI-augmented detection",
          "Best execution: brokers must seek the best terms for client orders. Increasingly data-driven and audited",
          "Disclosure obligations: every customer-facing communication has to be reviewed for compliance. The 'fair, balanced, and not misleading' standard. This is why marketing departments at financial firms are slow",
          "Outside Business Activities (OBA): employees of regulated firms must disclose and get approval for any external paid work. This is what blocks the CFP track at S&P Global for you specifically"
        ]
      },
      {
        name: "Project: Read One Major Regulation",
        items: [
          "Pick one regulation from this phase that's relevant to a project at Kensho or to S&P Global generally. EU AI Act is a good choice",
          "Find the official text or a high-quality summary. Read enough to identify: what does it require, who does it apply to, what are the penalties for violation, what are the timelines",
          "Identify how it affects S&P Global or Kensho specifically. Which products are in scope? Which workflows need to change?",
          "Write a 1-page summary memo. Bullet points. Plain English. No legalese. The kind of thing you'd send to a product team",
          "Bonus: identify one AI-augmentation opportunity in compliance workflow. AI-assisted compliance review is a real product category and Kensho could be relevant"
        ]
      }
    ],
    resources: [
      { name: "SEC.gov", url: "https://www.sec.gov/", note: "The regulator's own site. Genuinely useful" },
      { name: "Federal Reserve: Financial Regulation", url: "https://www.federalreserve.gov/supervisionreg.htm", note: "The bank-side regulatory framework" },
      { name: "EU AI Act Overview", url: "https://artificialintelligenceact.eu/", note: "The defining AI regulation as of 2025" },
      { name: "Compliance Week", url: "https://www.complianceweek.com/", note: "Industry trade publication. Good for staying current" }
    ],
    deeper: "AI compliance is a fast-emerging discipline that combines regulatory knowledge, technical AI fluency, and product judgment — exactly the intersection a TPM at Kensho with this curriculum is well-positioned to occupy. The big banks are hiring 'AI risk officers' and 'AI governance leads' at senior levels. S&P Global will need similar roles. If you can position yourself as the person who understands both how AI products are built (Applied AI curriculum) and what the regulatory constraints are (this phase + ongoing reading), you become uniquely valuable in the next 3-5 years. This is one of the highest-leverage emerging job functions in financial services."
  },
  {
    id: 12,
    title: "The S&P Global 10-K Deep Dive",
    subtitle: "Read Your Employer Like A Sell-Side Analyst",
    time: "2 weeks",
    icon: "⊞",
    color: "#B8893E",
    intro: "There is no faster way to become genuinely strategically literate about S&P Global than to read its 10-K, its earnings calls, and its investor day presentations as if you were a sell-side analyst covering the stock. This phase is intentionally narrow: it's the entire phase dedicated to becoming fluent in your employer's business at the level its CFO is fluent. The career payoff is immediate.",
    sections: [
      {
        name: "Why The 10-K Is The Best Document Ever Written About Your Employer",
        items: [
          "The 10-K is the legally-mandated annual report. Audited, reviewed by lawyers, signed by the CEO and CFO under criminal penalty. As honest a description of the company as you'll find anywhere",
          "It's also the document most outsiders read first. Sell-side analysts. Buy-side analysts. M&A bankers. Competitors. If you want to talk to senior leadership intelligently, read what they read",
          "It's free. Available on EDGAR within 60 days of fiscal year end. And updated every quarter via the 10-Q and 8-K (material event filings)",
          "It's structured. After reading 5 of them you can navigate any 10-K in 30 seconds. The format is consistent across companies",
          "It's underrated. Most TPMs at Kensho have never read S&P Global's 10-K. Reading it once puts you in the 90th percentile of organizational literacy. Reading it three times puts you in the 99th"
        ]
      },
      {
        name: "Structure Of S&P Global's 10-K",
        items: [
          "Item 1: Business. Description of the four segments (Market Intelligence, Ratings, Indices, Commodity Insights, plus the Mobility business). Read this first. Note the order — the order is roughly the revenue order",
          "Item 1A: Risk Factors. The legally-mandated risk list. Skim, but note any unusual risks specific to S&P Global (regulatory risk on ratings, AI-related risks, IHS Markit integration risk)",
          "Item 7: MD&A. Management's narrative on the year's results. Goes segment by segment. Compare what they emphasize this year versus last year — the changes are signal",
          "Item 8: Financial Statements. The actual numbers. Always look at the segment breakout in the footnotes — that's where the real story is",
          "Item 9: Controls. Brief but important if there's been an issue",
          "Read the footnotes carefully: segment data, debt schedules, acquisition disclosures, contingencies (lawsuits and regulatory matters), share repurchase activity. The most concentrated useful information per page in the entire document"
        ]
      },
      {
        name: "What To Look For In Each Segment",
        items: [
          "Market Intelligence: revenue mix (subscription vs transactional), recurring revenue %, revenue growth rate by sub-product, the integration progress on IHS Markit assets",
          "Ratings: revenue by transaction (new issuance) vs surveillance (recurring on existing ratings). The mix matters because transaction is cyclical and surveillance is stable. Note the geographic split",
          "Indices: revenue from asset-based fees (% of AUM tracking the indices), subscription and licensing fees, derivatives licensing. The asset-based fees grow with the market — note correlation",
          "Commodity Insights / Platts: less famous but high-margin. Pricing benchmarks for energy, metals, agriculture. Notable post-IHS-Markit changes",
          "Mobility: CARFAX and related auto data. Often forgotten about but a real ~$1B+ business inside the company",
          "Compute the segment growth rates and operating margins yourself from the segment footnote. Don't trust the press release version — go to the source"
        ]
      },
      {
        name: "Financial Health And Capital Allocation",
        items: [
          "Revenue: total and growth rate. Year-over-year. Note organic vs inorganic (organic excludes acquisition contributions)",
          "Operating margin: total and trend. S&P Global's operating margin should be in the high 40%s — among the highest of any large public company",
          "Free cash flow: cash from operations minus capex. Compare to net income. They should track closely — if FCF persistently lags, something is off",
          "Capital allocation: how much went to dividends, buybacks, M&A, debt repayment? S&P Global is a heavy buyer-back of its own stock. Note the trend",
          "Leverage: net debt / EBITDA. After the IHS Markit deal this jumped, then has been coming down. The trajectory matters",
          "Compare year-over-year. Three years is enough to see trends. The 10-K includes 5-year selected financial data — use it"
        ]
      },
      {
        name: "Earnings Calls And Investor Day",
        items: [
          "Earnings calls: held quarterly, transcripts available on Seeking Alpha, Bloomberg, or directly from S&P Global IR. The CEO and CFO speak first, then take analyst questions",
          "What to listen for: how management frames the year so far, what metrics they emphasize, what risks they're managing, what acquisitions they hint at, how they answer hard analyst questions",
          "Analyst questions are the best part. The smartest analysts ask the questions you should be thinking about. Note which analysts get follow-ups (the smart ones) and which don't",
          "Investor Day: held every 2-3 years. Multi-hour presentation laying out strategy and financial targets for the next 3-5 years. The best concentrated overview of management's actual plans",
          "Read the most recent investor day deck and listen to the audio. This is the single most useful artifact for understanding what S&P Global thinks it's doing"
        ]
      },
      {
        name: "Project: Build Your Own S&P Global Mental Model",
        items: [
          "Read the latest 10-K end to end. 4-6 hours. Take notes",
          "Read the most recent earnings call transcript. 30-60 minutes. Notes",
          "Read the most recent investor day materials if available. 1-2 hours",
          "Build a 1-page mental model: list segments with revenue, growth, margin. List the top 3 strategic priorities management is currently emphasizing. List the top 3 risks they've called out",
          "Identify the 3 places where Kensho can (or should) directly enable strategic priorities. This is the artifact you should be able to defend in any conversation with leadership",
          "Bonus: read the analyst day transcripts of the major competitors (MSCI, Moody's, Morningstar). The competitive picture sharpens dramatically when you see how others position"
        ]
      }
    ],
    resources: [
      { name: "S&P Global Investor Relations", url: "https://investor.spglobal.com/", note: "10-Ks, earnings, presentations, transcripts" },
      { name: "SEC EDGAR — S&P Global", url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000064040", note: "All filings, raw, free" },
      { name: "Seeking Alpha — S&P Global", url: "https://seekingalpha.com/symbol/SPGI", note: "Earnings call transcripts, analyst notes" },
      { name: "Bloomberg / FactSet (if you have access)", url: "https://www.bloomberg.com/", note: "Company profile, peer comps, model" }
    ],
    deeper: "After you've read the S&P Global 10-K, the natural next step is to read its main competitor 10-Ks side-by-side: MSCI (the indices and ESG competitor), Moody's (the ratings competitor), Morningstar (the data and analytics competitor), Bloomberg (private but you can find proxies). Each comparison highlights a different angle of S&P Global's strategy and competitive position. After three or four of these you start seeing the industry the way the CEO sees it. There are at most a dozen TPMs at S&P Global with this depth of comparative literacy — being one of them gets you noticed."
  },
  {
    id: 13,
    title: "Kensho's Place in S&P Global",
    subtitle: "Why You Were Acquired",
    time: "1–2 weeks",
    icon: "◈",
    color: "#B8893E",
    intro: "This phase is the most narrowly Kensho-specific in the curriculum. The goal is to deeply understand Kensho's strategic role inside S&P Global — its acquisition history, its current product portfolio, how it serves the parent's businesses, and where it's heading. This is the kind of organizational and strategic context that takes most TPMs years to absorb informally; you'll get there in two weeks of focused work.",
    sections: [
      {
        name: "Kensho's History",
        items: [
          "Founded 2013 by Daniel Nadler and Peter Kruskall, both with quantitative finance backgrounds. Original product was 'Warren', a natural-language interface for asking questions about markets — predating modern LLMs by 5+ years",
          "Backed by Goldman Sachs, Google Ventures, NEA, Devonshire Investors. Raised ~$70M before acquisition",
          "Acquired by S&P Global in March 2018 for ~$550 million. The largest AI acquisition in financial services at the time",
          "The acquisition rationale (per S&P Global at the time): bring AI and machine learning capabilities to S&P Global's data and analytics products. Enable next-generation NLP, classification, entity resolution, and automation across the parent's businesses",
          "Post-acquisition: Kensho retained its brand and identity, kept its Cambridge MA office, and became S&P Global's AI capability center"
        ]
      },
      {
        name: "Kensho's Product Portfolio",
        items: [
          "Kensho NERD (Named Entity Recognition for Documents): identifies companies, people, locations, products in financial text. The foundation for almost every other Kensho product",
          "Kensho Scribe: speech-to-text optimized for finance. Handles tickers, jargon, accents, multi-speaker earnings calls. The competitive edge over generic STT is the financial vocabulary",
          "Kensho Link: entity resolution and linking — given a mention of 'Apple' in a document, link it to AAPL, link it to S&P Capital IQ's company record, link it to its credit rating. Critical glue for connecting datasets",
          "Kensho Classify: document classification. Takes any document and tags it with finance-relevant categories, sectors, topics, sentiment",
          "Kensho Extract: pulls structured data from unstructured documents (filings, contracts, reports). The kind of work that used to require armies of analysts",
          "Kensho New Economies Indices: a separate product line — thematic indices co-developed with S&P Dow Jones Indices. Real revenue-generating products jointly branded",
          "Each product is sold both internally to other S&P Global divisions and externally to third parties"
        ]
      },
      {
        name: "How Kensho Serves S&P Global",
        items: [
          "Internal customer relationships: every S&P Global division is a potential customer. Ratings uses NERD/Link/Extract for analyst workflow. MI uses Scribe for earnings call processing. Indices uses Kensho's analytics for thematic index construction",
          "Hard challenges in this model: division-level priorities, internal pricing, integration with legacy systems, organizational politics. This is most of what the TPM job actually entails",
          "External revenue: Kensho also sells its products to non-S&P customers — banks, hedge funds, asset managers. The mix between internal enablement and external revenue is a strategic question",
          "Research output: Kensho publishes academic-style papers in NLP and finance. Recruiting tool, brand investment, intellectual signal. Publishes at major NLP venues (ACL, EMNLP, NAACL)",
          "Talent: Kensho is one of the top destinations in finance for ML/AI talent. Recruiting and retention is an ongoing strategic priority"
        ]
      },
      {
        name: "Where Kensho Sits In The Industry",
        items: [
          "Direct competitors at the product level: AlphaSense (NLP for financial research), Hebbia (LLM-powered investment research), Sigma AI (analyst workflow on FactSet), BloombergGPT (Bloomberg's internal LLM)",
          "Indirect competitors: every fintech doing AI on financial documents. Every internal AI team at every major bank, asset manager, hedge fund, ratings agency",
          "Kensho's structural advantage: access to S&P Global's data assets. Compustat, Capital IQ, Ratings data, indices methodology, market data. No competitor has this combination",
          "Kensho's structural disadvantage: integration with a large corporate parent. Slower decision cycles than a startup. Less flexibility in pricing and product",
          "The strategic question: how does Kensho leverage S&P Global's data and customer relationships to win in AI-native financial workflows, faster than the big banks build it themselves?"
        ]
      },
      {
        name: "Where Kensho Is Heading",
        items: [
          "Generative AI is the obvious near-term frontier. LLMs change what's possible in document understanding, question answering, and analyst workflow. Kensho's pre-LLM products (NERD, Link, Classify) become components in larger LLM-based products",
          "RAG over financial documents: a natural fit. Kensho has the entity resolution, document parsing, and finance-specific tooling to build best-in-class retrieval",
          "AI-augmented analyst workflows: in ratings, in research, in compliance. The biggest near-term opportunities are inside S&P Global's existing business units",
          "AI-native customer products: a chat interface to Capital IQ. AI-augmented index construction. AI-enhanced compliance review. Each of these is a multi-year product investment",
          "The biggest open question: does Kensho become a feature factory inside S&P Global, or does it become the AI-native product layer that S&P Global's customers eventually use directly? The answer shapes the next 3 years"
        ]
      },
      {
        name: "Project: Map Your Own Job",
        items: [
          "Write down: which Kensho products you currently work with as a TPM. Which S&P Global divisions consume them. Which external customers, if any",
          "For each product, identify: the next 3 most likely improvements, the constraints to making them, the strategic value of doing them",
          "Identify one project you could propose that combines a Kensho capability with an S&P Global data asset that isn't currently combined. The intersection is your highest-leverage opportunity",
          "Write a 1-page proposal for it. Concrete, scoped, with success metrics. This is the artifact",
          "Bonus: share it with your manager. The act of writing the proposal — independent of whether it ships — moves your reputation. Senior leadership at Kensho is constantly looking for TPMs who think this way"
        ]
      }
    ],
    resources: [
      { name: "Kensho", url: "https://kensho.com/", note: "Your own employer's product pages. Read each carefully" },
      { name: "Kensho Research", url: "https://kensho.com/research", note: "Published research papers from Kensho" },
      { name: "S&P Global press release archive", url: "https://press.spglobal.com/", note: "Search for 'Kensho' to see how the parent company talks about you" },
      { name: "S&P Kensho New Economy Indices methodology", url: "https://www.spglobal.com/spdji/en/index-family/equity/thematics/kensho-new-economies/", note: "Co-branded product, real revenue line" }
    ],
    deeper: "The most consequential strategic question for Kensho specifically is whether it remains a tightly integrated internal AI capability or evolves into an externally branded AI product company. Both have real strategic logic. Internal integration maximizes short-term value to the parent but limits brand and direct customer relationships. External productization builds independent value but creates internal coordination friction. Different leadership eras at Kensho have leaned different directions. Whichever direction you think is right, the TPMs who can articulate the tradeoffs clearly become trusted advisors to leadership. This is not a hypothetical exercise — it shapes hiring, product roadmaps, and your day-to-day work."
  },
  {
    id: 14,
    title: "Capstone: Brief A Senior Stakeholder",
    subtitle: "Apply Everything You Learned",
    time: "2 weeks",
    icon: "◆",
    color: "#B8893E",
    intro: "The capstone is to write a 5-page strategic memo on a Kensho or S&P Global topic that combines everything you've learned — capital markets fluency, S&P Global business literacy, AI capability awareness, and concrete product or strategy proposals. This artifact is the test of whether you've absorbed the curriculum, and it's also the kind of document that gets you noticed inside the company.",
    sections: [
      {
        name: "Picking The Topic",
        items: [
          "Criteria: a real strategic question your CEO, CTO, or division head probably thinks about. Not a tactical product question. Something with multi-year implications",
          "Avoid: anything where the answer is already obvious internally. Anything that requires confidential data you don't have. Anything that's too narrow (one feature) or too broad (the future of finance)",
          "Examples: 'How should Kensho position against Bloomberg's AI products in the next 3 years?', 'Which S&P Global data assets are most undervalued and how would AI augmentation change their value?', 'What does an AI-native version of S&P Capital IQ look like and how would it cannibalize the existing business?', 'How should S&P Global think about direct indexing as a threat or opportunity?'",
          "Pick something you genuinely care about. The quality of the artifact will be visible in the writing",
          "Talk to one trusted senior person before finalizing. They'll either validate the topic or steer you to something better"
        ]
      },
      {
        name: "Memo Structure",
        items: [
          "1-paragraph summary at the top: the question, your answer, the key reasoning. The CEO test — if they only read this paragraph, do they get the point?",
          "Section 1: Context. What's the current state? Who are the players? What are the trends? Roughly 1 page",
          "Section 2: The Question. Why does this matter strategically? What changes if we get it wrong? Roughly 0.5 page",
          "Section 3: The Analysis. The actual reasoning. Multiple options considered. Tradeoffs surfaced. Data and citations where available. Roughly 2 pages",
          "Section 4: Recommendation. The thing you actually think we should do. Clear, actionable, with a sequencing of next steps. Roughly 1 page",
          "Section 5: Risks and unknowns. What you're least sure about. What would change your recommendation. Roughly 0.5 page",
          "Total: 5 pages. Single-spaced. No fluff. Every sentence earns its place"
        ]
      },
      {
        name: "Week 1: Draft",
        items: [
          "Day 1: pick the topic. Write a one-paragraph description. Pressure test it with one trusted colleague",
          "Day 2: outline. Don't write prose yet. Just nail the argument structure",
          "Day 3-4: write the first crap draft. Ugly, too long, too many tangents. The point is to get the argument fully on the page",
          "Day 5: cut ruthlessly. Aim to lose 30% of the words. Almost every cut improves the memo",
          "End of week 1: a finished but rough memo. 5–7 pages. Argumentation is the hard part; this should now exist"
        ]
      },
      {
        name: "Week 2: Revise And Share",
        items: [
          "Day 1-2: heavy revision. Title each paragraph in the margin to check that the argument flows. Remove any paragraph that doesn't carry the argument",
          "Day 3: add citations and data. Every numerical claim needs a source. Every assertion needs justification or hedging",
          "Day 4: read aloud. Fix awkward phrasing. Tighten the sentences",
          "Day 5: share with two trusted senior people for feedback. Senior managers, mentors, or anyone whose strategic judgment you trust. Ask for harsh feedback — easy feedback is useless",
          "Weekend: incorporate feedback. Final polish. Now you have a memo",
          "Optional: present it to your manager or skip-level. The act of presenting forces a level of polish and clarity that writing alone doesn't"
        ]
      },
      {
        name: "What Makes A Memo Land",
        items: [
          "It answers a question senior leaders are actually asking. If the CEO already knows the answer, the memo is wasted. If the CEO doesn't care about the question, it's also wasted. Find the gap",
          "It is concise. 5 pages, not 15. Senior people's time is the constraint. Respecting it is a sign of seniority",
          "It is honest about uncertainty. The worst memos are the ones that pretend to be more certain than the analyst actually is. Be calibrated",
          "It has a clear ask. 'Recommendation' without a specific next step is just analysis. The reader should know exactly what you want them to do",
          "It is written, not formatted. Beautiful slides with no argument are worse than ugly memos with sharp arguments. Memos are the senior currency of intellectual respect inside large companies"
        ]
      },
      {
        name: "What Done Looks Like",
        items: [
          "A 5-page memo on a real strategic question, written by you, that combines capital markets knowledge, S&P Global business literacy, and AI capability awareness",
          "Feedback from at least two senior reviewers, incorporated into the final draft",
          "A clear point of view, defensibly argued, with a concrete recommendation and next steps",
          "Optionally: a presentation to your manager or skip-level. The conversation that follows is the highest-leverage 30 minutes of your year",
          "Most importantly: the demonstrated ability to think strategically about your employer at a senior level. This is the artifact that converts curriculum hours into career velocity"
        ]
      }
    ],
    resources: [
      { name: "Amazon: 6-page memo culture", url: "https://www.justinmares.com/the-amazon-six-page-memo/", note: "How Bezos used memos to drive strategic clarity. The model" },
      { name: "Bain: How to write a memo", url: "https://www.bain.com/insights/", note: "Consulting-style memo writing. Generally good craft references" },
      { name: "Patrick Collison: Writing memos", url: "https://patrickcollison.com/advice", note: "Tactical advice on writing things people read" },
      { name: "The Pyramid Principle (Barbara Minto)", url: "https://www.amazon.com/Pyramid-Principle-Logic-Writing-Thinking/dp/0273710516", note: "The canonical book on structured business writing" }
    ],
    deeper: "After your first capstone memo, write another one in 3 months. And another in 6. Each one will be sharper than the last. By your fifth memo you will be one of the strongest strategic writers in your peer group at Kensho — and writing strategic memos that get read by leadership is the fastest way to be considered for VP-track roles. The compound effect of consistent strategic writing is severely underrated in technical career paths. At this point in the curriculum sequence, you've finished GTM Engineer, Applied AI, and Financial Markets. You are now a TPM who can build, deploy, and reason strategically about AI products inside a major financial services company. There are not many of these. The next curriculum is GenAI Foundations, the deep theoretical track — pursued out of curiosity, not necessity, because you've already earned the right to do it from a position of professional strength."
  }
];

const PRIORITY_MAP = {
  "Markets foundation": [1, 2, 3, 8],
  "S&P Global business deep dive": [4, 5, 6, 12],
  "Kensho-relevant track": [6, 7, 13, 14],
  "Domain credibility fast path": [1, 4, 12, 13],
  "Analyst-style fluency": [3, 9, 10, 11]
};

function CodeBlock({ code }) {
  return (
    <pre style={{
      background: "#0E0905",
      border: "1px solid rgba(184,137,62,0.1)",
      borderRadius: 8,
      padding: "16px 20px",
      overflowX: "auto",
      fontSize: 13,
      lineHeight: 1.65,
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      color: "#D4C5A8",
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
      background: "rgba(184,137,62,0.03)",
      border: "1px solid rgba(184,137,62,0.08)",
      borderRadius: 8,
      textDecoration: "none",
      color: "#D4C5A8",
      transition: "all 0.2s",
      marginBottom: 6,
      fontSize: 13
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(212,184,106,0.3)"; e.currentTarget.style.background = "rgba(184,137,62,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(184,137,62,0.08)"; e.currentTarget.style.background = "rgba(184,137,62,0.03)"; }}>
      <span style={{ flexShrink: 0, color: "#D4B86A" }}>↗</span>
      <span style={{ flex: 1 }}>
        <strong style={{ color: "#EFE3CC", fontWeight: 500 }}>{r.name}</strong>
        {r.note && <span style={{ color: "#9C8B6A", marginLeft: 6, fontStyle: "italic" }}>— {r.note}</span>}
      </span>
    </a>
  );
}

function PhaseContent({ phase }) {
  const [showDeeper, setShowDeeper] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: "#D4C5A8", margin: 0 }}>{phase.intro}</p>
      {phase.sections?.map((section, si) => (
        <div key={si}>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 14px", fontWeight: 600, paddingBottom: 8, borderBottom: `1px solid ${phase.color}22` }}>{section.name}</h4>
          {section.items.map((item, ii) => (
            <div key={ii} style={{ padding: "10px 0", borderBottom: "1px solid rgba(184,137,62,0.05)", fontSize: 14, color: "#D4C5A8", lineHeight: 1.7 }}>{item}</div>
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
          <button onClick={() => setShowDeeper(!showDeeper)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px dashed rgba(184,137,62,0.15)", color: "#9C8B6A", fontSize: 13, padding: "10px 16px", borderRadius: 8, cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color; e.currentTarget.style.color = phase.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(184,137,62,0.15)"; e.currentTarget.style.color = "#9C8B6A"; }}>
            <span style={{ transform: showDeeper ? "rotate(90deg)" : "none", transition: "transform 0.2s", fontSize: 10 }}>▶</span>
            Want to go deeper?
          </button>
          {showDeeper && <p style={{ fontSize: 13, color: "#9C8B6A", lineHeight: 1.75, padding: "14px 16px", margin: "8px 0 0", background: "rgba(184,137,62,0.03)", borderRadius: 8, fontStyle: "italic", borderLeft: `2px solid ${phase.color}33` }}>{phase.deeper}</p>}
        </div>
      )}
    </div>
  );
}

export default function FinancialMarketsRoadmap({ onBack }) {
  const [activePhase, setActivePhase] = useState(1);
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('financial-markets-roadmap-progress');
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
      .eq('curriculum', 'financial-markets')
      .single();
    if (data?.completed_phases) {
      skipSync.current = true;
      setCompleted(new Set(data.completed_phases));
      localStorage.setItem('financial-markets-roadmap-progress', JSON.stringify(data.completed_phases));
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
    try { localStorage.setItem('financial-markets-roadmap-progress', JSON.stringify(arr)); } catch {}
    if (skipSync.current) { skipSync.current = false; return; }
    if (!supabase || !user) return;
    supabase.from('user_progress').upsert({
      user_id: user.id,
      curriculum: 'financial-markets',
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
    <div style={{ fontFamily: "'Newsreader', Georgia, serif", background: "#120E08", color: "#EFE3CC", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <header style={{ padding: "14px 24px", borderBottom: "1px solid rgba(184,137,62,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#120E08", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#9C8B6A", fontSize: 13, cursor: "pointer", padding: "4px 8px", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          )}
          <button onClick={() => setShowNav(!showNav)} style={{ background: "none", border: "none", color: "#EFE3CC", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>{showNav ? "✕" : "☰"}</button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: -0.3, fontFamily: "'DM Sans', sans-serif" }}>Financial <span style={{ color: "#B8893E" }}>Markets</span></h1>
            <p style={{ fontSize: 10, color: "#9C8B6A", margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>S&P Global domain fluency</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#9C8B6A", fontFamily: "'IBM Plex Mono', monospace" }}>{completed.size}/{PHASES.length}</span>
          <div style={{ width: 80, height: 4, background: "rgba(184,137,62,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #B8893E, #D4B86A)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          {supabase && !authLoading && (
            user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                <span style={{ fontSize: 12, color: "#9C8B6A", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(184,137,62,0.15)", color: "#9C8B6A", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>Sign out</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setAuthMode('signin'); setAuthError(''); }} style={{ background: "rgba(184,137,62,0.1)", border: "1px solid rgba(184,137,62,0.2)", color: "#B8893E", fontSize: 11, padding: "4px 12px", borderRadius: 6, cursor: "pointer", marginLeft: 8 }}>Sign in</button>
            )
          )}
        </div>
      </header>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <nav style={{ width: showNav ? 300 : 0, minWidth: showNav ? 300 : 0, borderRight: showNav ? "1px solid rgba(184,137,62,0.08)" : "none", overflow: "hidden", transition: "all 0.3s ease", background: "#0E0A05", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {PHASES.map(p => (
              <button key={p.id} onClick={() => { setActivePhase(p.id); setShowNav(false); }}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", background: activePhase === p.id ? `${p.color}0D` : "transparent", border: activePhase === p.id ? `1px solid ${p.color}1A` : "1px solid transparent", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                <span onClick={(e) => { e.stopPropagation(); toggleComplete(p.id); }}
                  style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: completed.has(p.id) ? `2px solid ${p.color}` : "2px solid rgba(184,137,62,0.15)", background: completed.has(p.id) ? `${p.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: p.color, cursor: "pointer", transition: "all 0.2s" }}>
                  {completed.has(p.id) ? "✓" : ""}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: activePhase === p.id ? 600 : 400, color: activePhase === p.id ? "#EFE3CC" : "#9C8B6A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: p.color, marginRight: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{String(p.id).padStart(2, "0")}</span>{p.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#5C4F38", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.subtitle}</div>
                </div>
                <span style={{ fontSize: 10, color: "#5C4F38", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>{p.time}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: "1px solid rgba(184,137,62,0.08)" }}>
            <h4 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#5C4F38", margin: "0 0 10px", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>Focus Tracks</h4>
            {Object.entries(PRIORITY_MAP).map(([activity, ids]) => (
              <button key={activity} onClick={() => { setActivePhase(ids[0]); setShowNav(false); }}
                style={{ display: "block", width: "100%", padding: "6px 0", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, color: "#9C8B6A", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#B8893E"}
                onMouseLeave={e => e.currentTarget.style.color = "#9C8B6A"}>
                {activity} → {ids.map(id => String(id).padStart(2, "0")).join(", ")}
              </button>
            ))}
          </div>
        </nav>
        <main ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "40px 32px 80px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: phase.color, fontWeight: 600 }}>Phase {String(phase.id).padStart(2, "0")}</span>
              <span style={{ fontSize: 12, color: "#5C4F38", fontFamily: "'IBM Plex Mono', monospace" }}>{phase.time}</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: phase.color, marginRight: 8 }}>{phase.icon}</span>{phase.title}
            </h2>
            <p style={{ fontSize: 17, color: "#9C8B6A", margin: 0, fontWeight: 300 }}>{phase.subtitle}</p>
          </div>
          <button onClick={() => toggleComplete(phase.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", background: completed.has(phase.id) ? `${phase.color}0D` : "rgba(184,137,62,0.03)", border: `1px solid ${completed.has(phase.id) ? phase.color + "33" : "rgba(184,137,62,0.08)"}`, borderRadius: 8, cursor: "pointer", color: completed.has(phase.id) ? phase.color : "#9C8B6A", fontSize: 13, fontWeight: 500, marginBottom: 32, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${completed.has(phase.id) ? phase.color : "rgba(184,137,62,0.2)"}`, background: completed.has(phase.id) ? `${phase.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, transition: "all 0.2s" }}>
              {completed.has(phase.id) ? "✓" : ""}
            </span>
            {completed.has(phase.id) ? "Completed" : "Mark as completed"}
          </button>
          <PhaseContent phase={phase} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(184,137,62,0.08)" }}>
            <button onClick={() => activePhase > 1 && setActivePhase(activePhase - 1)} disabled={activePhase === 1}
              style={{ padding: "10px 20px", background: activePhase === 1 ? "transparent" : "rgba(184,137,62,0.03)", border: `1px solid ${activePhase === 1 ? "transparent" : "rgba(184,137,62,0.08)"}`, borderRadius: 8, color: activePhase === 1 ? "#3A2E1C" : "#9C8B6A", cursor: activePhase === 1 ? "default" : "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              ← Previous
            </button>
            <button onClick={() => activePhase < PHASES.length && setActivePhase(activePhase + 1)} disabled={activePhase === PHASES.length}
              style={{ padding: "10px 20px", background: activePhase === PHASES.length ? "transparent" : `${PHASES[activePhase]?.color || phase.color}0D`, border: `1px solid ${activePhase === PHASES.length ? "transparent" : (PHASES[activePhase]?.color || phase.color) + "22"}`, borderRadius: 8, color: activePhase === PHASES.length ? "#3A2E1C" : PHASES[activePhase]?.color || phase.color, cursor: activePhase === PHASES.length ? "default" : "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
              Next: {PHASES[activePhase]?.title || "Done"} →
            </button>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div onClick={() => setShowAuthModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#1F180E", border: "1px solid rgba(184,137,62,0.15)", borderRadius: 12, padding: 32, width: 340, maxWidth: "90vw" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{authMode === 'signin' ? 'Sign in' : 'Create account'}</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#9C8B6A" }}>Sync your progress across devices</p>
            <form onSubmit={handleAuth}>
              <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px 12px", background: "rgba(184,137,62,0.05)", border: "1px solid rgba(184,137,62,0.15)", borderRadius: 6, color: "#EFE3CC", fontSize: 13, marginBottom: 8, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(184,137,62,0.05)", border: "1px solid rgba(184,137,62,0.15)", borderRadius: 6, color: "#EFE3CC", fontSize: 13, marginBottom: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              {authError && <p style={{ fontSize: 12, color: authError.includes('Check your email') ? '#D4B86A' : '#B8893E', margin: "0 0 12px" }}>{authError}</p>}
              <button type="submit" disabled={authSubmitting}
                style={{ width: "100%", padding: "10px", background: "#B8893E", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: authSubmitting ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: authSubmitting ? 0.7 : 1 }}>
                {authSubmitting ? '...' : authMode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </form>
            <p style={{ margin: "16px 0 0", fontSize: 12, color: "#9C8B6A", textAlign: "center" }}>
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(''); }} style={{ color: "#B8893E", cursor: "pointer" }}>
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
