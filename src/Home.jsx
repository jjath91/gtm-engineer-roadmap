export default function Home({ onSelect }) {
  const curricula = [
    {
      id: 'gtm',
      title: 'GTM Engineer',
      subtitle: 'Engineering Fluency',
      description: 'Master the engineering toolkit — Git, terminal, APIs, Python, Docker, CI/CD, and more. Go from GTM professional to technical builder.',
      phases: 14,
      icon: '◈',
      color: '#E8927C',
      gradient: 'linear-gradient(135deg, #E8927C 0%, #7CC6A0 100%)'
    },
    {
      id: 'genai',
      title: 'GenAI Foundations',
      subtitle: 'From Zero to Frontier Lab Fluency',
      description: 'Understand generative AI from the ground up — math foundations, neural networks, transformers, training, RLHF, and frontier research.',
      phases: 20,
      icon: '∑',
      color: '#D4915E',
      gradient: 'linear-gradient(135deg, #D4915E 0%, #E8C857 100%)'
    },
    {
      id: 'cfp',
      title: 'Certified Financial Planner',
      subtitle: 'From Zero to Licensed Advisor',
      description: 'Go from zero formal finance background to licensed financial advisor — Series 65, the eight CFP domains, practice building, and the CFP exam.',
      phases: 15,
      icon: '◈',
      color: '#5B9AAE',
      gradient: 'linear-gradient(135deg, #5B9AAE 0%, #6BB6A0 100%)'
    }
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      background: "#0d0d14",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 8px", letterSpacing: -1 }}>
          Learning Roadmaps
        </h1>
        <p style={{ fontSize: 16, color: "#667788", margin: 0, fontWeight: 300 }}>
          Choose your curriculum
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20,
        maxWidth: 720,
        width: "100%"
      }}>
        {curricula.map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "32px 28px",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.2s",
              fontFamily: "inherit",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.borderColor = c.color + "44";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.03)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: c.gradient,
              borderRadius: "16px 16px 0 0"
            }} />

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 28, color: c.color }}>{c.icon}</span>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, letterSpacing: -0.3, color: "#fff" }}>{c.title}</h2>
                <p style={{ fontSize: 11, color: "#667788", margin: 0, letterSpacing: 0.5, textTransform: "uppercase" }}>{c.subtitle}</p>
              </div>
            </div>

            <p style={{ fontSize: 14, color: "#8899aa", margin: "0 0 16px", lineHeight: 1.6 }}>
              {c.description}
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, color: "#556677", fontFamily: "'JetBrains Mono', monospace" }}>
                {c.phases} phases
              </span>
              <span style={{ fontSize: 13, color: c.color, fontWeight: 600 }}>
                Start learning →
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
