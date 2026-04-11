import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabaseClient";

const PHASES = [
  {
    id: 1,
    title: "Algebra, Trig & Precalculus",
    subtitle: "Rebuild Your Mathematical Floor",
    time: "4–6 weeks",
    icon: "∑",
    color: "#7B4FAB",
    intro: "Before calculus, before circuits, before the Schrödinger equation — you need a clean, fast, intuitive grasp of algebra, trig, and the precalculus toolkit. Most adults remember these topics fuzzily; that fuzz becomes friction in every later phase. This phase is short by design but should leave you fluent. Skip it and you'll spend Phase 2 fighting algebra instead of learning calculus.",
    sections: [
      {
        name: "Algebra & Functions",
        items: [
          "Algebraic manipulation: factoring, polynomial division, completing the square, partial fractions. You'll use these constantly when integrating, solving ODEs, and simplifying transfer functions",
          "Functions and graphs: domain/range, inverses, transformations, piecewise functions. Build the intuition that every equation describes a shape",
          "Exponentials and logarithms: log identities, change of base, growth/decay. Crucial for everything from RC circuits to entropy to amplifier gain (decibels)",
          "Complex numbers: rectangular and polar forms, Euler's formula e^(iθ) = cos θ + i sin θ. This is the single most important algebraic identity in physics and EE — memorize it cold",
          "Sequences, series, summation notation, the binomial theorem. These show up the moment you touch Taylor series or quantum mechanics"
        ]
      },
      {
        name: "Trigonometry",
        items: [
          "The unit circle from memory: sin, cos, tan, and the values at 0, π/6, π/4, π/3, π/2, π and so on. Don't memorize as tables — visualize the rotating point on the circle",
          "Trig identities: Pythagorean, sum/difference, double-angle, half-angle. The big six you'll actually use — write them on a card and reference until they stick",
          "Inverse trig functions and their domains. Common trap when computing angles from vector components",
          "Connection to complex exponentials: cos θ = (e^(iθ) + e^(-iθ))/2 and sin θ = (e^(iθ) - e^(-iθ))/(2i). This is how trig and exponentials become the same thing in physics",
          "Law of sines and law of cosines for non-right triangles. Useful in mechanics and EM problems with non-orthogonal geometries"
        ]
      },
      {
        name: "Precalculus & Mathematical Mindset",
        items: [
          "Vectors in 2D and 3D: addition, scalar multiplication, dot product, cross product. The dot product gives you 'how parallel'; the cross product gives you 'how perpendicular and in which direction'",
          "Conic sections: circles, ellipses, parabolas, hyperbolas. These ARE planetary orbits, parabolic mirrors, and antenna dishes — not abstract curves",
          "Parametric and polar equations. Once you learn Lagrangian mechanics you'll wish you'd internalized parametric thinking earlier",
          "Mathematical induction and proof basics. You don't need to be a proof-writer, but recognizing an inductive argument matters",
          "Mathematical mindset shift: stop trying to memorize formulas. Try to derive everything from a small set of principles. The point of this phase is fluency, not recall"
        ]
      },
      {
        name: "Free & Low-Cost Resources",
        items: [
          "Khan Academy Algebra II + Trigonometry + Precalculus — completely free, well-structured, with exercises. The default starting point. Aim to clear the mastery levels for each topic",
          "Paul's Online Math Notes (Lamar University) — excellent free reference with worked examples. Bookmark it permanently; you'll return to it for the next 5 years",
          "3Blue1Brown's 'Essence of Linear Algebra' (preview the first few episodes here). Deeply visual intuition for vectors and transformations — pair with Khan Academy",
          "'Precalculus' by Stewart, Redlin, and Watson — if you want a real textbook. Used copies of older editions are $5–$20",
          "Brilliant.org — interactive problem sets if you learn by doing rather than reading. ~$15/month, optional"
        ]
      },
      {
        name: "Project: Personal Math Reference",
        items: [
          "Build your own one-page math reference card as you go. Every identity, every formula, every visualization that you have to look up TWICE goes on the card",
          "By end of phase the card should fit on a single A4 sheet (front and back). The act of curating it forces you to internalize what's important",
          "Type it in LaTeX (use Overleaf for free). Learning LaTeX now pays off forever — every physics and EE document you write later uses it",
          "Save it as your permanent reference for the next 14 phases. You'll add to it as new topics appear",
          "Bonus exercise: pick 5 trig identities and prove each one starting from sin² + cos² = 1 and Euler's formula. The point isn't the proofs — it's learning to derive instead of recall"
        ]
      }
    ],
    code: `# Quick Python sanity check — visualize the unit circle and trig
import numpy as np
import matplotlib.pyplot as plt

theta = np.linspace(0, 2*np.pi, 360)
fig, ax = plt.subplots(1, 2, figsize=(10, 4))

ax[0].plot(np.cos(theta), np.sin(theta))
ax[0].set_aspect('equal'); ax[0].set_title('Unit circle')
ax[0].grid(True)

ax[1].plot(theta, np.sin(theta), label='sin')
ax[1].plot(theta, np.cos(theta), label='cos')
ax[1].set_xlabel('θ'); ax[1].legend(); ax[1].grid(True)
plt.tight_layout(); plt.show()`,
    resources: [
      { name: "Khan Academy — Trigonometry", url: "https://www.khanacademy.org/math/trigonometry", note: "Free, complete, with exercises" },
      { name: "Paul's Online Math Notes", url: "https://tutorial.math.lamar.edu/", note: "Excellent reference site" },
      { name: "3Blue1Brown — Essence of Linear Algebra", url: "https://www.3blue1bsrown.com/topics/linear-algebra", note: "Visual intuition" },
      { name: "Overleaf (LaTeX online)", url: "https://www.overleaf.com/", note: "Free LaTeX editor" }
    ],
    deeper: "If you find any of this genuinely difficult rather than rusty, the issue is almost certainly arithmetic and algebra fluency from earlier years. Don't be embarrassed to drop down to Khan Academy's Algebra I content — adults often have surprising gaps in middle-school topics that compound into struggle later. The only mistake is rushing past weakness."
  },
  {
    id: 2,
    title: "Calculus, Linear Algebra & Computational Toolkit",
    subtitle: "The Language of Physics",
    time: "12–16 weeks",
    icon: "∫",
    color: "#7B4FAB",
    intro: "Calculus is the language physics is written in. Linear algebra is the language modern physics, EE, and computation use to scale that language. And the Python scientific stack is the lab notebook that makes both of them visceral. This phase is theory plus tools — by the end, you should be able to compute, plot, and simulate your way through any equation that appears in later phases.",
    sections: [
      {
        name: "Single-Variable Calculus",
        items: [
          "Limits and continuity: the formal foundation. Don't dwell here — get the intuition (epsilon-delta is optional for our purposes) and move on",
          "Derivatives: rules, chain rule, implicit differentiation, related rates. Geometric meaning is what matters — the slope of a curve at a point",
          "Integrals: Riemann sums, fundamental theorem of calculus, substitution, integration by parts, partial fractions. Integration is harder than differentiation — be patient",
          "Series and Taylor expansions: this is the most important calculus topic for physics. Every approximation you make in mechanics, optics, and quantum starts with Taylor",
          "Improper integrals and convergence. Useful for normalizing wavefunctions and dealing with infinities in field problems",
          "Recommended text: Stewart 'Calculus' (any edition, used copies cheap) or Spivak 'Calculus' (harder, more rigorous, more rewarding)"
        ]
      },
      {
        name: "Multivariable & Vector Calculus",
        items: [
          "Partial derivatives, gradients, directional derivatives. The gradient is a vector that points uphill in a scalar field — central to thermodynamics and EM",
          "Multiple integrals: double, triple, change of variables, Jacobians. Volume and surface integration is constant in EM",
          "Vector fields, divergence, curl, line and surface integrals. Maxwell's equations are written in this language",
          "The big three theorems: Green's, Stokes', Divergence theorem. They're all secretly the same theorem (the generalized Stokes theorem) — try to feel why",
          "Coordinate systems beyond Cartesian: cylindrical and spherical. Most physics problems have natural symmetries — choosing the right coordinates is half the work",
          "Recommended text: Marsden & Tromba 'Vector Calculus' or Hubbard 'Vector Calculus, Linear Algebra, and Differential Forms' (more advanced, more unified)"
        ]
      },
      {
        name: "Linear Algebra",
        items: [
          "Vectors and matrices: addition, multiplication, transpose, determinant, inverse. The mechanics matter less than what they MEAN",
          "Linear transformations: a matrix is a function that warps space. This perspective unlocks everything",
          "Eigenvalues and eigenvectors: the directions a transformation doesn't rotate. Quantum mechanics IS eigenvalue problems",
          "Change of basis, diagonalization, orthogonality. Critical for Fourier analysis, signal processing, and quantum measurement",
          "Vector spaces and inner products as abstract structures. Function spaces look like vector spaces — that's how Fourier series and quantum states work",
          "Recommended texts: Strang 'Introduction to Linear Algebra' (warm and accessible) PLUS 3Blue1Brown's 'Essence of Linear Algebra' video series. Watch the videos first, then read Strang"
        ]
      },
      {
        name: "Ordinary Differential Equations",
        items: [
          "First-order ODEs: separable, linear, exact. Newton's law for a particle in a velocity-dependent force is a first-order ODE — solve it before you trust mechanics",
          "Second-order linear ODEs with constant coefficients: the harmonic oscillator. This SINGLE equation is the model for half of physics — pendulums, springs, RLC circuits, even quantum systems",
          "Forced and damped oscillators: resonance, the Q-factor. Bridges directly to electronics in Phase 3 and signals in Phase 10",
          "Systems of ODEs and phase portraits: the geometric way of thinking that makes nonlinear dynamics intelligible",
          "Numerical methods: Euler, Runge-Kutta, why they matter, when they fail. You'll implement these next",
          "Recommended text: Boyce & DiPrima 'Elementary Differential Equations' (standard) or Strogatz 'Nonlinear Dynamics and Chaos' for the geometric flavor"
        ]
      },
      {
        name: "Python Scientific Stack",
        items: [
          "Install: Python 3.11+, then NumPy, SciPy, Matplotlib, Jupyter via Anaconda or uv. Use Jupyter notebooks as your lab notebook for the entire curriculum",
          "NumPy: arrays, vectorized operations, broadcasting. STOP using Python loops for math — broadcasting is 100x faster and clearer",
          "Matplotlib: line plots, scatter, contour plots, vector field plots, animation. By end of curriculum you should be able to make a publication-quality figure in 5 minutes",
          "SciPy: integration (scipy.integrate.solve_ivp), optimization, linear algebra, special functions. The toolbox you reach for after NumPy",
          "SymPy for symbolic math: take derivatives, do integrals, solve ODEs symbolically. Useful when you want to check work or explore",
          "Free resource: 'Python for Computational Science and Engineering' (Hans Fangohr, free PDF). Excellent intro tailored to physics use cases"
        ]
      },
      {
        name: "Project: ODE Solver From Scratch + Pendulum",
        items: [
          "Write your own RK4 (4th-order Runge-Kutta) solver in NumPy without using SciPy's solve_ivp. This forces you to understand WHY numerical integration works",
          "Test it against the simple harmonic oscillator (analytic solution known). Plot energy vs time — RK4 should conserve energy to high accuracy on short time scales",
          "Validate against scipy.integrate.solve_ivp. Plot the difference between your solver and SciPy. Match to 6+ decimal places",
          "Then simulate a damped, driven pendulum at varying drive frequencies. Plot phase portraits. Find the resonance peak numerically",
          "Bonus: implement the symplectic Euler method (energy-conserving for Hamiltonian systems) and compare to RK4 over long time integration. You'll discover why orbital mechanics simulations use symplectic methods",
          "Goal: by the end of this project, NumPy and Matplotlib should feel like extensions of your hand"
        ]
      }
    ],
    code: `# RK4 ODE solver from scratch — minimal version
import numpy as np
import matplotlib.pyplot as plt

def rk4_step(f, t, y, dt):
    k1 = f(t, y)
    k2 = f(t + dt/2, y + dt/2 * k1)
    k3 = f(t + dt/2, y + dt/2 * k2)
    k4 = f(t + dt,   y + dt   * k3)
    return y + dt/6 * (k1 + 2*k2 + 2*k3 + k4)

# Damped, driven pendulum: theta'' + b*theta' + w0^2*sin(theta) = A*cos(wd*t)
def pendulum(t, state, b=0.1, w0=1.0, A=0.5, wd=0.8):
    theta, omega = state
    return np.array([omega, -b*omega - w0**2*np.sin(theta) + A*np.cos(wd*t)])

t = 0; dt = 0.01; T = 100
state = np.array([0.1, 0.0])
ts, thetas = [], []
while t < T:
    ts.append(t); thetas.append(state[0])
    state = rk4_step(pendulum, t, state, dt)
    t += dt

plt.plot(ts, thetas)
plt.xlabel('t'); plt.ylabel('θ'); plt.title('Driven damped pendulum')
plt.show()`,
    resources: [
      { name: "MIT OCW — 18.01 Single Variable Calculus", url: "https://ocw.mit.edu/courses/18-01-single-variable-calculus-fall-2006/", note: "Free MIT calculus course" },
      { name: "MIT OCW — 18.06 Linear Algebra (Strang)", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", note: "The legendary Gilbert Strang course" },
      { name: "3Blue1Brown — Essence of Calculus", url: "https://www.3blue1brown.com/topics/calculus", note: "Visual calculus intuition" },
      { name: "SciPy Lecture Notes", url: "https://scipy-lectures.org/", note: "Free, comprehensive scientific Python tutorial" }
    ],
    deeper: "If you want one book that unifies most of the math in this phase, Boas's 'Mathematical Methods in the Physical Sciences' is the canonical 'every math you need to do physics' textbook. Work through the chapters as the topics come up rather than front-to-back. For deeper computational fluency, 'Computational Physics' by Mark Newman (free PDF online) is excellent and uses Python."
  },
  {
    id: 3,
    title: "Classical Mechanics + Intro Electronics",
    subtitle: "Newton in One Hand, Soldering Iron in the Other",
    time: "10–12 weeks",
    icon: "↻",
    color: "#7B4FAB",
    intro: "Classical mechanics is where physics started and where most of your intuition about the world lives. Pair it with the absolute basics of electronics: Ohm's law, KVL/KCL, and a real breadboard. The point of running mechanics and electronics in parallel is that they're both governed by the same kinds of differential equations — the harmonic oscillator from mechanics and the RLC circuit from electronics are mathematically identical. Seeing that twice cements it forever.",
    sections: [
      {
        name: "Newtonian Mechanics",
        items: [
          "Newton's three laws — but understand them as definitions and statements about the universe, not as memorizable rules",
          "Kinematics in 1D, 2D, and 3D. Position, velocity, acceleration. Projectile motion as the canonical example",
          "Work, energy, and the work-energy theorem. Conservative forces and potential energy",
          "Conservation of energy and momentum. Use them to solve problems where forces are too messy to integrate directly",
          "Central forces and orbital mechanics: derive Kepler's laws from Newton's. This is one of the most beautiful proofs in physics",
          "Rotational dynamics: angular velocity, angular momentum, torque, moment of inertia. Most undergrad mechanics courses underemphasize this"
        ]
      },
      {
        name: "Lagrangian & Hamiltonian Mechanics",
        items: [
          "The Lagrangian L = T - V (kinetic minus potential). Why this minus sign? Because nature minimizes action. Read Feynman's chapter on the principle of least action",
          "The Euler-Lagrange equations as a coordinate-independent way to derive equations of motion. Once you see this, you'll never want to use Newton's laws directly again for complex problems",
          "Generalized coordinates and constraints. The double pendulum is much easier in Lagrangian form than Newtonian",
          "Hamiltonian mechanics: H = T + V (total energy). Phase space, Hamilton's equations, canonical transformations",
          "Symmetry and conservation laws (Noether's theorem at an intuitive level). Time symmetry → energy conservation; space symmetry → momentum conservation; rotational symmetry → angular momentum conservation. This is one of the deepest ideas in physics",
          "Recommended text: Taylor 'Classical Mechanics' for Newtonian + Lagrangian, then Goldstein 'Classical Mechanics' if you want graduate-level rigor"
        ]
      },
      {
        name: "Hardware: Set Up Your Bench",
        items: [
          "Buy a starter electronics kit (~$60). Should include: breadboard, jumper wires, resistors (E12 series 220Ω–1MΩ), capacitors (10pF–100µF), LEDs, push buttons, a few transistors (2N3904, 2N7000), op-amps (LM358), 9V battery clip",
          "Buy a basic digital multimeter (~$30 — Klein, Fluke 101, or AstroAI). Reads voltage, current, resistance, continuity. You'll use this constantly",
          "Optional but recommended: a basic USB oscilloscope (~$80–$150 — Hantek 6022BE for budget, OWON VDS1022 for slightly better). Or use the audio jack on your laptop with software scopes for free up to 20kHz",
          "Workspace: a clear desk, an anti-static mat ($15), good lighting. Don't underestimate ergonomics — you'll be staring at small components",
          "Safety: most projects in this curriculum stay under 30V DC. The exceptions (mains-powered amplifiers, vacuum tubes) we'll flag explicitly. Never assume a capacitor is discharged — measure it"
        ]
      },
      {
        name: "Circuit Fundamentals",
        items: [
          "Voltage, current, resistance, power. Ohm's law (V = IR) and the power dissipation formulas (P = IV = I²R = V²/R)",
          "Kirchhoff's laws: KVL (voltages around a loop sum to zero) and KCL (currents into a node sum to zero). These are conservation laws, not separate rules",
          "Series and parallel resistors and capacitors. Voltage dividers as the workhorse circuit you'll see everywhere",
          "RC circuits: charging, discharging, time constant τ = RC. Same math as a damped harmonic oscillator — note the parallel with mechanics",
          "RL and RLC circuits: resonance, Q-factor, bandwidth. Identical equations to a damped driven oscillator. The math from Phase 2 pays off here",
          "Recommended text: 'The Art of Electronics' (Horowitz & Hill, 3rd ed) — the bible. Plus 'Practical Electronics for Inventors' (Scherz & Monk) for a friendlier tone"
        ]
      },
      {
        name: "Project: Double Pendulum + RC Filter",
        items: [
          "PHYSICS PROJECT: Simulate the double pendulum from the Lagrangian. Generate the chaos diagram (sensitivity to initial conditions). Animate it in Matplotlib. The point: see Lagrangian mechanics produce something hard to derive Newtonianly",
          "ELECTRONICS PROJECT: Build an RC low-pass filter on a breadboard. Choose R and C so the cutoff frequency is around 1 kHz. Use your multimeter and an audio signal generator (free apps for phone) to measure the actual cutoff",
          "Plot frequency response (gain in dB vs frequency). Compare to theoretical 1/(1 + jωRC). Match to within a few percent",
          "Connect the two projects: solve the analogous mechanical problem (mass on a damper-spring system) with the SAME math. Note that ωRC plays the same role as ω/ω0 in the mechanical version",
          "Document both in the same Jupyter notebook with clean plots and explanation. This is the format you'll use for every project from here on"
        ]
      }
    ],
    code: `# Double pendulum from the Lagrangian — equations of motion
import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

g, L1, L2, m1, m2 = 9.81, 1.0, 1.0, 1.0, 1.0

def deriv(t, state):
    th1, w1, th2, w2 = state
    delta = th2 - th1
    den1 = (m1 + m2)*L1 - m2*L1*np.cos(delta)**2
    den2 = (L2/L1)*den1
    dw1 = (m2*L1*w1**2*np.sin(delta)*np.cos(delta)
           + m2*g*np.sin(th2)*np.cos(delta)
           + m2*L2*w2**2*np.sin(delta)
           - (m1+m2)*g*np.sin(th1)) / den1
    dw2 = (-m2*L2*w2**2*np.sin(delta)*np.cos(delta)
           + (m1+m2)*g*np.sin(th1)*np.cos(delta)
           - (m1+m2)*L1*w1**2*np.sin(delta)
           - (m1+m2)*g*np.sin(th2)) / den2
    return [w1, dw1, w2, dw2]

sol = solve_ivp(deriv, [0, 30], [np.pi/2, 0, np.pi/2 + 0.001, 0],
                t_eval=np.linspace(0, 30, 3000))
plt.plot(sol.t, sol.y[0], label='θ1'); plt.plot(sol.t, sol.y[2], label='θ2')
plt.xlabel('t'); plt.legend(); plt.show()`,
    resources: [
      { name: "MIT OCW — 8.01 Classical Mechanics", url: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/", note: "Walter Lewin's mechanics course (free)" },
      { name: "Feynman Lectures Vol I (free)", url: "https://www.feynmanlectures.caltech.edu/I_toc.html", note: "Mechanics chapters are unmatched" },
      { name: "All About Circuits — DC", url: "https://www.allaboutcircuits.com/textbook/direct-current/", note: "Free comprehensive electronics text" },
      { name: "Adafruit Learning System", url: "https://learn.adafruit.com/", note: "Project-based electronics tutorials" }
    ],
    deeper: "Once you've seen Lagrangian mechanics and harmonic oscillators in two domains (mechanical and electrical), look up 'electromechanical analogies' — there's a beautiful formal correspondence between mass↔inductance, spring↔1/capacitance, damper↔resistance, force↔voltage, velocity↔current. This isn't a metaphor; it's a deep structural fact about second-order linear systems and it shows up everywhere in physics and EE."
  },
  {
    id: 4,
    title: "Electromagnetism I + Analog Circuits",
    subtitle: "Maxwell's Equations, Through Hands",
    time: "12–16 weeks",
    icon: "⚡",
    color: "#7B4FAB",
    intro: "Electromagnetism is the most mathematically beautiful theory in undergraduate physics — four equations that describe every electrical and magnetic phenomenon you'll ever encounter, from radio waves to your nervous system. We'll pair Griffiths E&M with hands-on op-amp and transistor circuits so the math has a physical referent. By the end you'll have built a working audio amplifier and understood why it works at the level of fields, not just symbols.",
    sections: [
      {
        name: "Electrostatics",
        items: [
          "Coulomb's law and the electric field. Compute fields from point charges, lines, sheets, and spheres",
          "Gauss's law: ∮E·dA = Q/ε₀. The single most useful tool for computing fields with symmetry. Memorize how to apply it for spherical, cylindrical, and planar symmetry",
          "Electric potential and its relationship to the field (E = -∇V). Energy in electric fields",
          "Conductors and capacitors. Why charges live on the surface of a conductor. Parallel plate capacitor capacitance",
          "Dielectrics, polarization, and the electric displacement field D. Why every real capacitor has an insulator between the plates",
          "Recommended text: Griffiths 'Introduction to Electrodynamics' (4th ed). The undergraduate E&M text — clear, rigorous, with excellent problems"
        ]
      },
      {
        name: "Magnetostatics",
        items: [
          "Magnetic field from currents. Biot-Savart law and Ampère's law",
          "Why moving charges feel forces (Lorentz force F = qv × B). The magnetic force does no work — but it changes direction",
          "Magnetic field from solenoids, toroids, and current loops",
          "Magnetic materials: paramagnetism, diamagnetism, ferromagnetism. Why iron is special",
          "The vector potential A and gauge freedom. Looks abstract; becomes essential in quantum mechanics",
          "Common confusion: charges in motion produce magnetic fields, AND magnetic fields exert forces on charges in motion. Both are true; both are part of the same Lorentz-covariant phenomenon (Phase 11 closes this loop)"
        ]
      },
      {
        name: "Maxwell's Equations",
        items: [
          "The four equations: Gauss for E, Gauss for B (no magnetic monopoles), Faraday's law, Ampère-Maxwell. Memorize them in differential AND integral form",
          "Faraday's law: a changing magnetic flux induces an EMF. This is how every motor, generator, and transformer works",
          "The displacement current term (Maxwell's contribution). Without it, you can't have electromagnetic waves",
          "Derive the wave equation for E and B from Maxwell's equations in vacuum. Discover that c = 1/√(ε₀μ₀). This is one of the great calculations in physics",
          "Energy density, Poynting vector, and electromagnetic radiation. Compute the energy carried by a wave",
          "Boundary conditions on E and B. Critical for understanding reflection, transmission, and waveguides"
        ]
      },
      {
        name: "Op-Amps & Active Filters",
        items: [
          "The ideal op-amp: infinite gain, infinite input impedance, zero output impedance. Then learn how the LM358/LM741/TL072 deviate from ideal",
          "The two golden rules: in negative feedback, the inputs are at the same voltage and no current flows into the inputs. Most op-amp circuits become trivial with these",
          "Inverting and non-inverting amplifier topologies. Compute gain from feedback resistor ratios",
          "Difference amplifier, instrumentation amplifier, summing amplifier. The Lego bricks of analog signal processing",
          "Active filters: Sallen-Key low-pass and high-pass, second-order bandpass. Compare to passive RC filters from Phase 3 — active filters can have gain and sharper roll-off",
          "Op-amp pitfalls: input bias current, slew rate, gain-bandwidth product, oscillation in poorly compensated circuits. Read the actual datasheet for the parts you use"
        ]
      },
      {
        name: "Building With Transistors",
        items: [
          "BJTs (NPN/PNP): the three regions (cutoff, active, saturation). Common-emitter, common-collector (emitter follower), common-base configurations",
          "Biasing: how to set the operating point so the transistor amplifies linearly. Voltage divider bias is the safe default",
          "MOSFETs: enhancement vs depletion, threshold voltage, the simple model VGS > VTH for the channel to conduct. Most modern electronics is MOSFETs",
          "Small-signal analysis vs large-signal. Linearize around the operating point",
          "Why digital logic is just transistors used as switches (saturation/cutoff). This bridges to Phase 8 (digital logic)",
          "Read 'The Art of Electronics' chapters 2 and 3 carefully. Build the example circuits"
        ]
      },
      {
        name: "Project: 2-Stage Audio Amplifier + Field Visualization",
        items: [
          "ELECTRONICS PROJECT: Design and build a 2-stage audio amplifier on a breadboard. Stage 1: op-amp non-inverting amp with gain ~10. Stage 2: BJT common-emitter with gain ~10. Total voltage gain ~100",
          "Test with a small audio signal (your phone's headphone jack). Drive a small 8Ω speaker through a coupling capacitor. You should hear amplified audio",
          "Measure the actual gain at multiple frequencies. Plot the frequency response. Identify the low-frequency rolloff (due to coupling caps) and high-frequency rolloff (due to op-amp GBW and transistor capacitance)",
          "PHYSICS PROJECT: In Python, plot the electric field from a few point charges using a vector field plot (matplotlib quiver). Then plot the equipotential lines using contour. Then compute a line integral of E along several paths between two points and verify they're path-independent",
          "Bonus: simulate a parallel-plate capacitor with a dielectric slab. Compute capacitance numerically and compare to the analytic formula"
        ]
      }
    ],
    code: `# E-field from N point charges, with quiver + contour
import numpy as np
import matplotlib.pyplot as plt

charges = [( 1, -1, 0), (-1, 1, 0), (1, 1, 0)]  # (q, x, y)
x, y = np.meshgrid(np.linspace(-3, 3, 30), np.linspace(-3, 3, 30))
Ex = np.zeros_like(x); Ey = np.zeros_like(y); V = np.zeros_like(x)

for q, x0, y0 in charges:
    rx, ry = x - x0, y - y0
    r2 = rx**2 + ry**2 + 1e-3
    Ex += q * rx / r2**1.5
    Ey += q * ry / r2**1.5
    V  += q / np.sqrt(r2)

fig, ax = plt.subplots(figsize=(7, 7))
ax.contourf(x, y, V, 30, cmap='RdBu_r', alpha=0.6)
ax.quiver(x, y, Ex, Ey)
for q, x0, y0 in charges:
    ax.plot(x0, y0, 'ko', markersize=12)
ax.set_aspect('equal'); plt.show()`,
    resources: [
      { name: "Griffiths E&M (Cambridge)", url: "https://www.cambridge.org/highereducation/books/introduction-to-electrodynamics/", note: "The standard undergraduate text" },
      { name: "MIT OCW — 8.02 Electricity and Magnetism", url: "https://ocw.mit.edu/courses/8-02-physics-ii-electricity-and-magnetism-spring-2007/", note: "Walter Lewin lectures" },
      { name: "Art of Electronics (Horowitz & Hill)", url: "https://artofelectronics.net/", note: "The bible of analog electronics" },
      { name: "EEVblog YouTube", url: "https://www.youtube.com/@EEVblog", note: "Practical electronics tutorials and reviews" }
    ],
    deeper: "If you fall in love with E&M, the next book up is Jackson's 'Classical Electrodynamics' — graduate level, mathematically demanding, and the canonical reference. For a more geometric/modern view, Schutz 'A First Course in General Relativity' starts by reformulating special relativity and E&M in tensor language, which is the right way to think about EM if you want to understand it the way physicists do at the frontier."
  },
  {
    id: 5,
    title: "Embedded Systems & Sensors",
    subtitle: "When Physics Becomes Measurable",
    time: "6–8 weeks",
    icon: "⌨",
    color: "#7B4FAB",
    intro: "Microcontrollers are the bridge between the physical world and software. They give you the ability to read sensors, drive actuators, and run control loops in real time — which means every physics experiment you want to do from Phase 6 onward can be instrumented and quantitative. This is a relatively short phase but unlocks everything that comes after it.",
    sections: [
      {
        name: "Microcontroller Platforms",
        items: [
          "Arduino Uno / Nano (~$15–$25): the gentlest entry. ATmega328P, 16 MHz, 32 KB flash. Slow but documented to death. Start here if you're new to embedded",
          "ESP32 (~$8–$15): WiFi + Bluetooth + dual core, 240 MHz, much more capable. Free Arduino-compatible IDE support. Best price/performance for serious projects",
          "Raspberry Pi Pico (~$4): RP2040 chip, dual-core ARM Cortex-M0+, 133 MHz. Great C/C++ and MicroPython support. The cheapest viable option",
          "STM32 'Blue Pill' (~$5): ARM Cortex-M3, harder learning curve, much more powerful. Industry standard for serious embedded work",
          "Recommendation: buy ONE Arduino Uno for the gentle intro, then transition to ESP32 or RP2040 for everything else. Don't get stuck on the Arduino UNO forever — it's underpowered for any modern sensor work"
        ]
      },
      {
        name: "Communication Protocols",
        items: [
          "Digital I/O: reading buttons, controlling LEDs, debouncing inputs. Every embedded project starts here",
          "PWM (pulse-width modulation): how digital outputs simulate analog. How servo motors and LED dimming work",
          "ADC (analog-to-digital conversion): resolution (10-bit, 12-bit, 16-bit), sample rate, aliasing, the Nyquist theorem. This is also where Phase 10 starts to feel real",
          "I²C: 2-wire bus, master/slave, addressing. Most sensors talk I²C. Learn to read and write registers from a datasheet",
          "SPI: 4-wire, faster than I²C, common for SD cards, displays, and high-bandwidth sensors",
          "UART/Serial: the simplest protocol, used for debugging and connecting to a PC. Always add serial debug output to every project"
        ]
      },
      {
        name: "Sensors as Physics Instruments",
        items: [
          "Inertial measurement units (IMUs): MPU-6050 ($3) or BMI270 — accelerometer + gyroscope. Use them to measure orientation, vibration, free fall (verify g = 9.81 m/s²)",
          "Magnetometers: HMC5883L or QMC5883L. Measure Earth's magnetic field. Build a digital compass",
          "Temperature sensors: thermistors (cheap, nonlinear), DS18B20 (digital, accurate), MCP9808 (precision). Use them in thermodynamics experiments later",
          "Pressure sensors: BMP280 (~$3) for atmospheric pressure. Compute altitude from pressure (verify the barometric formula)",
          "Light sensors: photodiodes, phototransistors, TSL2561 lux meter. Measure inverse-square law from a point light source",
          "Hall effect sensors: A1324 or A3144. Measure magnetic field strength, build a tachometer for a spinning magnet, verify Faraday's law"
        ]
      },
      {
        name: "Closed-Loop Control Basics",
        items: [
          "Open loop vs closed loop: an open-loop motor just spins; a closed-loop motor knows its actual speed and adjusts. The difference is everything",
          "Read sensor → compare to target → compute error → drive actuator. This is the universal control pattern (you'll formalize it as PID in Phase 10)",
          "Bang-bang controller as the simplest closed loop. Then add proportional control (P). Then proportional + integral (PI) for offset elimination",
          "Sample rate matters: faster sampling = more responsive control but more CPU and noise sensitivity. Aim for at least 10x your system's response bandwidth",
          "The interrupt-driven approach: timer interrupts to keep control loops running at fixed rate, not in the main loop. This is real-time programming"
        ]
      },
      {
        name: "Project: Sensor Data Logger + Closed-Loop Motor Control",
        items: [
          "PROJECT 1: Build a 3-axis IMU data logger. ESP32 + MPU-6050. Stream accelerometer + gyro data over WiFi or USB serial to your laptop at 100Hz. Log to CSV in Python",
          "Verify g = 9.81 m/s² when stationary in different orientations. Compute Euler angles (pitch and roll) from accelerometer. Note the gyro drift over time — this motivates Kalman filtering in Phase 10",
          "PROJECT 2: Closed-loop motor speed controller. Use a small DC motor with an attached optical or hall encoder. Read speed in RPM. PWM-drive the motor to maintain a target RPM regardless of load",
          "Implement P, then PI, then PID controllers. Plot the step response (target jumps from 0 to 1000 RPM). Tune by hand and observe overshoot, settling time, steady-state error",
          "Bonus: log sensor data + motor command + motor speed to a CSV. Open in Python and analyze. This becomes your data analysis muscle for every project after"
        ]
      }
    ],
    code: `# Arduino-style ESP32 sketch — IMU read + WiFi stream
#include <Wire.h>
#include <MPU6050.h>
#include <WiFi.h>
MPU6050 imu;
WiFiServer server(8080);

void setup() {
  Serial.begin(115200);
  Wire.begin();
  imu.initialize();
  WiFi.begin("YOUR_SSID", "YOUR_PSK");
  while (WiFi.status() != WL_CONNECTED) delay(500);
  server.begin();
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    while (client.connected()) {
      int16_t ax, ay, az, gx, gy, gz;
      imu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
      client.printf("%lu,%d,%d,%d,%d,%d,%d\\n",
                    millis(), ax, ay, az, gx, gy, gz);
      delay(10);  // 100 Hz
    }
  }
}`,
    resources: [
      { name: "Adafruit Learn", url: "https://learn.adafruit.com/", note: "Best beginner tutorials, ranked" },
      { name: "Sparkfun Tutorials", url: "https://learn.sparkfun.com/tutorials", note: "Hardware-focused projects" },
      { name: "Hackaday", url: "https://hackaday.com/", note: "Daily embedded project inspiration" },
      { name: "ESP32 Documentation", url: "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/", note: "Reference for the recommended platform" }
    ],
    deeper: "After this phase, you have the tools to instrument any physics experiment. Whenever a later phase has a measurement to make, ask: can I write a microcontroller program that takes this measurement automatically and logs it? The answer is almost always yes. That habit — measuring everything — separates a project-builder from a textbook-reader."
  },
  {
    id: 6,
    title: "Waves, Oscillations & Optics",
    subtitle: "The Universe Is Made of Waves",
    time: "8–10 weeks",
    icon: "∿",
    color: "#7B4FAB",
    intro: "Waves are the second universal pattern in physics (after the harmonic oscillator). Light is a wave, sound is a wave, electrons are waves, gravitational radiation is a wave. This phase covers the math of waves, the optics of light, and the Fourier transform — which becomes the most-used mathematical tool in EE and signal processing. Project anchor: build a Michelson interferometer with $40 of parts and measure the wavelength of light.",
    sections: [
      {
        name: "Oscillations & The Wave Equation",
        items: [
          "Simple harmonic motion as the canonical oscillator: m·d²x/dt² = -k·x. Solution is x(t) = A·cos(ωt + φ)",
          "Damped oscillator: underdamped, critically damped, overdamped. The Q factor (quality factor) characterizes how 'ringy' a system is",
          "Driven oscillator: resonance, lineshape, the Lorentzian. The math is identical to RLC circuits and atoms absorbing light",
          "Coupled oscillators and normal modes. Two coupled pendulums show beat patterns; N coupled oscillators give you a wave equation in the limit",
          "The wave equation: ∂²ψ/∂t² = v²·∇²ψ. Solutions: traveling waves f(x - vt) and standing waves",
          "Wave on a string, sound waves, EM waves — all governed by the same equation with different v"
        ]
      },
      {
        name: "Interference & Diffraction",
        items: [
          "Superposition principle: waves add linearly. This is what makes interference possible",
          "Two-slit (Young's) experiment: derive the interference pattern from path-length differences. This is the cleanest demonstration of the wave nature of light",
          "Multiple slits and diffraction gratings. The grating equation d·sin θ = mλ. Used in spectrometers — you'll build one if you go deeper",
          "Single-slit diffraction: pattern width inversely proportional to slit width. The same math gives you the resolution limit of telescopes and microscopes",
          "Thin film interference: anti-reflection coatings, soap bubbles, oil slicks. Why they show colors",
          "Coherence: temporal (related to bandwidth) and spatial (related to source size). Critical for understanding lasers and interferometers"
        ]
      },
      {
        name: "Geometric & Wave Optics",
        items: [
          "Reflection and refraction. Snell's law n₁·sin θ₁ = n₂·sin θ₂. Total internal reflection — how fiber optics work",
          "Lenses and mirrors: ray tracing, the lensmaker's equation, the thin lens equation. Learn to draw ray diagrams quickly",
          "Polarization: linear, circular, elliptical. Polaroid filters, Brewster's angle, optical activity",
          "Imaging: aperture, depth of field, resolution (Rayleigh criterion). Connects directly to camera and telescope design",
          "Aberrations: spherical, chromatic, coma. Why telephoto lenses have so many elements",
          "Fermat's principle: light takes the path of stationary time. This is to optics what the principle of least action is to mechanics"
        ]
      },
      {
        name: "Fourier Analysis",
        items: [
          "Fourier series: any periodic function as a sum of sines and cosines. The mathematical heart of frequency-domain thinking",
          "Fourier transform: the continuous version. Functions of time ↔ functions of frequency",
          "Key properties: linearity, time-shift = phase shift, convolution theorem (multiplication in time = convolution in frequency, and vice versa)",
          "Discrete Fourier transform (DFT) and the Fast Fourier Transform (FFT) algorithm. O(N log N) instead of O(N²) — this is one of the most important algorithms ever invented",
          "Spectrograms: a sequence of FFTs over short time windows. Visualize how a signal's frequency content changes over time",
          "Why this matters: the FFT is the universal tool for analyzing signals, whether they're audio, sensor data, EM fields, or quantum wavefunctions"
        ]
      },
      {
        name: "Project: Michelson Interferometer + FFT Audio Analyzer",
        items: [
          "PHYSICS PROJECT: Build a Michelson interferometer. Parts: cheap red laser pointer ($5), 2 first-surface mirrors ($10 each), one beam splitter ($15), some screws and a piece of plywood. Total ~$40",
          "Align it carefully (this is the hardest part — give yourself an evening). You should see interference fringes when you slightly tilt one mirror",
          "Move one mirror by a known small distance (use a stack of paper or a precision screw). Count fringes. Each fringe = λ/2 of mirror motion",
          "From your fringe count and distance moved, compute the laser wavelength. You should get within 5% of 650 nm (red laser)",
          "EE/MATH PROJECT: Build an FFT audio spectrum analyzer in Python. Use sounddevice to record from your laptop microphone, scipy.fft to compute FFTs, matplotlib to display a live spectrogram",
          "Whistle, hum, sing — watch the harmonics. Then play different musical notes — verify the 12-tone equal temperament (each semitone is a frequency ratio of 2^(1/12))"
        ]
      }
    ],
    code: `# Live audio spectrogram in Python
import numpy as np, sounddevice as sd, matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

FS, BLOCK = 44100, 2048
buf = np.zeros(BLOCK)

def callback(indata, frames, time, status):
    global buf
    buf = indata[:, 0].copy()

stream = sd.InputStream(channels=1, samplerate=FS,
                        blocksize=BLOCK, callback=callback)
fig, ax = plt.subplots()
freqs = np.fft.rfftfreq(BLOCK, 1/FS)
line, = ax.semilogx(freqs, np.zeros_like(freqs))
ax.set_xlim(50, 20000); ax.set_ylim(-100, 0)
ax.set_xlabel('Hz'); ax.set_ylabel('dB')

def update(_):
    spectrum = np.abs(np.fft.rfft(buf * np.hanning(BLOCK)))
    line.set_ydata(20*np.log10(spectrum + 1e-10))
    return line,

stream.start()
ani = FuncAnimation(fig, update, interval=50, blit=True)
plt.show()`,
    resources: [
      { name: "MIT OCW — 8.03 Vibrations and Waves", url: "https://ocw.mit.edu/courses/8-03sc-physics-iii-vibrations-and-waves-fall-2016/", note: "Free MIT course" },
      { name: "Hecht 'Optics'", url: "https://www.pearson.com/en-us/subject-catalog/p/optics/P200000006783", note: "Standard optics undergraduate text" },
      { name: "DIY Michelson Interferometer guides", url: "https://www.instructables.com/Cheap-and-Easy-Michelson-Interferometer/", note: "Many free build guides online" },
      { name: "Better Explained — Fourier Transform", url: "https://betterexplained.com/articles/an-interactive-guide-to-the-fourier-transform/", note: "Best intuition piece on Fourier" }
    ],
    deeper: "Once you've built the Michelson, the natural extensions are: a Mach-Zehnder interferometer (different topology, same principles), a Fabry-Perot interferometer (high finesse, used in laser cavities and gravitational wave detection), and a Sagnac interferometer (used in fiber optic gyroscopes for navigation). LIGO is just a Michelson interferometer with 4 km arms and exquisite stabilization — the principle you built on a $40 setup is the same."
  },
  {
    id: 7,
    title: "Thermodynamics & Statistical Mechanics",
    subtitle: "Entropy and the Arrow of Time",
    time: "10–12 weeks",
    icon: "♨",
    color: "#7B4FAB",
    intro: "Thermodynamics looks like a 19th-century engineering subject until you realize it's secretly the most universal theory in physics. The second law applies to black holes, brain states, and computer hardware. Statistical mechanics derives thermodynamics from the random motion of microscopic particles — and it's where you first really feel that the macroscopic world emerges from the microscopic. The crown jewel project here is the Ising model, where you'll watch a phase transition emerge from simple rules.",
    sections: [
      {
        name: "Classical Thermodynamics",
        items: [
          "Temperature, heat, work — the three concepts everyone confuses. Heat is energy in transit due to temperature difference; work is energy in transit due to force times displacement; temperature is what's the same when systems are in equilibrium",
          "First law: dU = δQ - δW. Energy conservation, including heat. The funny δ symbols matter — Q and W are not state functions",
          "Second law: entropy of an isolated system never decreases. Multiple equivalent statements (Clausius, Kelvin, Carathéodory). Pick the one that clicks for you",
          "Entropy as ∫dQ/T for reversible processes. The Carnot cycle and the maximum efficiency of a heat engine. No engineering trick can beat the Carnot limit",
          "Thermodynamic potentials: U, H (enthalpy), F (Helmholtz), G (Gibbs). When to use which depends on what's held constant",
          "Phase transitions: melting, boiling, the Clausius-Clapeyron equation. Latent heat as the energy cost of restructuring matter"
        ]
      },
      {
        name: "Statistical Foundations",
        items: [
          "Microstates, macrostates, and the fundamental assumption: all microstates of an isolated system in equilibrium are equally probable",
          "Boltzmann's entropy: S = k·ln(W). The single most profound equation linking microscopic and macroscopic. Boltzmann had it inscribed on his tombstone",
          "The Boltzmann distribution: P(state) ∝ exp(-E/kT). Why hot things rattle around in higher-energy states more often",
          "Partition function Z = Σ exp(-E_i/kT). The single computation that connects to all thermodynamic quantities. Once you know Z, you know everything",
          "Equipartition theorem: each quadratic degree of freedom has average energy (1/2)kT. Predicts the heat capacity of ideal gases (works) and solids (fails — quantum mechanics required)",
          "Maxwell-Boltzmann distribution for molecular speeds. Derive the rms speed of an air molecule at room temperature (~500 m/s)"
        ]
      },
      {
        name: "Phase Transitions & Critical Phenomena",
        items: [
          "Ferromagnets: above the Curie temperature they're disordered, below they have spontaneous magnetization. The order parameter goes continuously to zero as you approach Tc",
          "Universality: very different physical systems (magnets, fluids, alloys) show the same critical exponents. This is one of the deepest discoveries in 20th century physics",
          "The Ising model: a 2D lattice of spins ±1, each interacting only with neighbors. The simplest model that has a phase transition. Onsager solved it analytically in 1944 — the math is brutal but the model is intuitive",
          "Mean field theory as the simplest analytical approach. Gives qualitatively correct results, wrong critical exponents",
          "Renormalization group ideas (intuitive level only). Why critical phenomena look the same at every length scale",
          "Recommended text: Schroeder 'An Introduction to Thermal Physics' is the friendliest intro. Kittel's 'Thermal Physics' is more concise"
        ]
      },
      {
        name: "Heat in Electronics",
        items: [
          "Joule heating: P = I²R. Why resistors get hot. Why high-current circuits need heatsinks",
          "Thermal management of CPUs and GPUs: heatsinks, thermal paste, heat pipes, why the AI chip industry is fundamentally constrained by heat dissipation",
          "Peltier (thermoelectric) coolers: solid-state heat pumps. Cheap, inefficient, but useful for small-scale temperature control",
          "Thermistors and temperature sensing. NTC and PTC types. The Steinhart-Hart equation",
          "Why semiconductor properties depend on temperature (you'll meet this in Phase 9). The reverse leakage current of diodes doubles every ~10°C. This affects every analog circuit",
          "Thermal noise (Johnson-Nyquist noise): 4kTRΔf. The fundamental noise floor of any resistor. Limits the sensitivity of every electronic measurement"
        ]
      },
      {
        name: "Project: 2D Ising Model + Thermal PID Controller",
        items: [
          "PHYSICS PROJECT: Implement the 2D Ising model with Metropolis Monte Carlo. 50x50 lattice, periodic boundary conditions, nearest-neighbor coupling",
          "Run at multiple temperatures (above, near, and below Tc ≈ 2.27 J/k). Visualize the spin configurations as images. Above Tc you see noise; below Tc you see magnetic domains",
          "Compute the magnetization M as a function of temperature. Plot M(T) and observe the phase transition: M → 0 continuously as T → Tc",
          "Compute the heat capacity C(T) (energy fluctuations divided by T²). It diverges near Tc — your first taste of critical phenomena",
          "EE PROJECT: Build a closed-loop thermal stage. Peltier element ($10) + thermistor + ESP32 + PID controller from Phase 5. Set a target temperature; hold it within ±0.5°C against ambient changes",
          "Plot temperature vs time during a step change. Tune PID parameters. This same control loop runs in every climate system, every 3D printer hotend, every laser thermal stabilizer"
        ]
      }
    ],
    code: `# 2D Ising model — Metropolis Monte Carlo
import numpy as np
import matplotlib.pyplot as plt

L, J, kT = 50, 1.0, 2.0  # Tc ≈ 2.27 in these units
spins = np.random.choice([-1, 1], size=(L, L))

def step():
    for _ in range(L*L):
        i, j = np.random.randint(L, size=2)
        s = spins[i, j]
        nb = (spins[(i+1)%L, j] + spins[(i-1)%L, j]
              + spins[i, (j+1)%L] + spins[i, (j-1)%L])
        dE = 2 * J * s * nb
        if dE <= 0 or np.random.random() < np.exp(-dE/kT):
            spins[i, j] = -s

for _ in range(200): step()

plt.imshow(spins, cmap='RdBu')
plt.title(f'Ising model at kT = {kT}')
plt.show()`,
    resources: [
      { name: "Schroeder 'Thermal Physics'", url: "https://physics.weber.edu/thermal/", note: "The friendliest thermo textbook" },
      { name: "MIT OCW — 8.044 Statistical Physics", url: "https://ocw.mit.edu/courses/8-044-statistical-physics-i-spring-2013/", note: "Free undergraduate stat mech" },
      { name: "Sethna 'Statistical Mechanics' (free)", url: "https://sethna.lassp.cornell.edu/StatMech/", note: "Modern, free, from Cornell" },
      { name: "Three Pass Approach to Ising Model", url: "https://rajeshrinet.github.io/blog/2014/ising-model/", note: "Free Python tutorial" }
    ],
    deeper: "The deepest result in this area is the connection between thermodynamics and information theory — Shannon entropy and Boltzmann entropy are literally the same quantity (up to units). This means the thermodynamics of computation is real: erasing a bit of information dissipates at least kT·ln(2) of energy (Landauer's principle). Charles Bennett's papers on reversible computation are a beautiful read once you've done some Phase 8 (digital logic)."
  },
  {
    id: 8,
    title: "Digital Logic & Computer Architecture",
    subtitle: "Build a CPU From NAND Gates",
    time: "8–10 weeks",
    icon: "▣",
    color: "#7B4FAB",
    intro: "Modern computers are towers of abstraction, and most software developers never see the bottom. This phase strips them down. By the end you'll have built a working CPU on an FPGA — designed by you, in Verilog, using only the gates you understand from physics. The point isn't to become a chip designer; the point is to never have to take 'the computer just runs it' on faith again.",
    sections: [
      {
        name: "Boolean Logic & Combinational Circuits",
        items: [
          "Boolean algebra: AND, OR, NOT, NAND, NOR, XOR. The two-element field. NAND alone is functionally complete — every other gate can be built from NANDs",
          "Truth tables and Karnaugh maps for circuit minimization. Useful by hand for small problems; logic synthesis tools do it automatically for large ones",
          "Multiplexers, decoders, encoders. The basic combinational building blocks",
          "Adders: half adder, full adder, ripple carry, carry-lookahead. Build addition from gates and feel why every CPU has an ALU",
          "Comparators and arithmetic logic units (ALUs). The ALU is the workhorse of every CPU",
          "Recommended book: 'The Elements of Computing Systems' (Nisan & Schocken) — also known as 'NAND to Tetris'. The single best educational resource on computer architecture, period"
        ]
      },
      {
        name: "Sequential Logic & State Machines",
        items: [
          "Latches and flip-flops: SR, D, JK, T. The atomic memory units. D flip-flops are the workhorses of synchronous digital design",
          "Clock signals, setup time, hold time, metastability. Why digital design is fundamentally analog at the edges",
          "Registers and counters: built from flip-flops. The basic memory and timing primitives",
          "Finite state machines (FSMs): Moore vs Mealy. Design state machines for traffic lights, vending machines, button debouncers",
          "Pipelines: how to do multiple things at once. Why modern CPUs have 15-stage pipelines and why branches are expensive",
          "Hazards and timing constraints. The 'static timing analysis' that real chip designers obsess over"
        ]
      },
      {
        name: "FPGAs & Open Toolchains",
        items: [
          "What an FPGA is: a grid of programmable logic blocks (LUTs and flip-flops) connected by programmable routing. You describe a circuit in HDL; the toolchain compiles it to a bitstream that programs the FPGA",
          "Verilog vs VHDL: pick one. Verilog is more widely used and has more learning resources. Stick with Verilog (or its modern variant SystemVerilog)",
          "Hardware: Lattice iCEstick (~$25) or iCEBreaker (~$70). Both have fully open-source toolchains (Yosys for synthesis, nextpnr for place-and-route, IceStorm for bitstream)",
          "Open toolchain advantage: you can read the source code of every step. The closed Xilinx/Intel toolchains are powerful but opaque — bad for learning",
          "Simulation first: use Icarus Verilog (iverilog) and GTKWave to simulate your designs before flashing them to hardware. Saves enormous time",
          "Tutorial: nandland.com has the best beginner FPGA tutorials. fpga4fun.com is older but excellent"
        ]
      },
      {
        name: "Computer Organization",
        items: [
          "The von Neumann architecture: CPU + memory + I/O on a shared bus. The dominant model for ~80 years",
          "Instruction set architectures (ISAs): RISC vs CISC, x86 vs ARM vs RISC-V. RISC-V is open source, simple, and increasingly common — best to learn",
          "Registers, instruction fetch/decode/execute cycle, the program counter. Build this from gates and you'll understand assembly forever",
          "Memory hierarchy: registers, caches (L1/L2/L3), DRAM, disk. Each level is roughly 10-100x slower than the one above. This is why algorithms with good cache locality are fast",
          "Pipelining and out-of-order execution at a conceptual level. Why modern CPUs do speculative execution and why that led to Spectre and Meltdown",
          "Recommended text: Patterson & Hennessy 'Computer Organization and Design' (RISC-V edition)"
        ]
      },
      {
        name: "Project: Build a CPU on an FPGA",
        items: [
          "WORK THROUGH NAND TO TETRIS: project 1 (logic gates from NAND), project 2 (ALU), project 3 (memory), project 4 (machine language), project 5 (the Hack CPU). Free online, no FPGA needed for this part",
          "Then port it to actual hardware: implement the Hack CPU in Verilog and synthesize for the iCEstick or iCEBreaker. Run a real program on real silicon",
          "Bonus: implement a tiny RISC-V core (RV32I subset). picorv32 by Clifford Wolf is the open-source reference implementation — read its source",
          "Stretch project: extend your CPU with a UART so it can talk to your laptop. Now you can write programs in assembly, send them to your CPU, and see the output. This is the moment computer science becomes physics",
          "Document everything in a Markdown file with circuit diagrams. This is the most impressive project on this whole curriculum to show non-physicists"
        ]
      }
    ],
    code: `// Verilog: a 4-bit ripple-carry adder + simple register file
module full_adder(input a, b, cin, output sum, cout);
    assign sum  = a ^ b ^ cin;
    assign cout = (a & b) | (cin & (a ^ b));
endmodule

module adder4(input [3:0] a, b, output [3:0] sum, output cout);
    wire c1, c2, c3;
    full_adder fa0(a[0], b[0], 1'b0, sum[0], c1);
    full_adder fa1(a[1], b[1], c1,   sum[1], c2);
    full_adder fa2(a[2], b[2], c2,   sum[2], c3);
    full_adder fa3(a[3], b[3], c3,   sum[3], cout);
endmodule

module reg4(input clk, rst, we, input [3:0] d, output reg [3:0] q);
    always @(posedge clk or posedge rst)
        if (rst)      q <= 4'b0;
        else if (we)  q <= d;
endmodule`,
    resources: [
      { name: "NAND to Tetris (free course)", url: "https://www.nand2tetris.org/", note: "The single best computer architecture course" },
      { name: "Project F: FPGA Tutorials", url: "https://projectf.io/posts/", note: "Modern open-source FPGA tutorials" },
      { name: "Yosys + nextpnr toolchain", url: "https://yosyshq.net/", note: "Open-source FPGA synthesis" },
      { name: "RISC-V Foundation", url: "https://riscv.org/", note: "Open ISA spec" }
    ],
    deeper: "Once you can design a small CPU, the next frontiers are: GPU architectures (massively parallel, very different from CPUs), TPUs and accelerators for AI (matrix multiply units), and novel computing paradigms (analog, optical, quantum). Bunnie Huang's 'Hardware Hacker' is a wonderful book about the broader hardware ecosystem and how chips actually get made. For the long view, 'But How Do It Know?' by J. Clark Scott is a delightfully simple introduction to how a computer actually computes."
  },
  {
    id: 9,
    title: "Quantum Mechanics I + Solid State",
    subtitle: "Why Transistors Work",
    time: "12–16 weeks",
    icon: "ψ",
    color: "#7B4FAB",
    intro: "Quantum mechanics is the most successful theory in physics and the strangest. It's also the foundation of every semiconductor device you've used in earlier phases — every diode, every transistor, every LED. This phase covers the standard QM curriculum (Schrödinger equation, square wells, hydrogen) and then immediately uses it to explain why solid-state devices work. The project: numerically solve the Schrödinger equation for arbitrary potentials, then characterize a real diode and fit the Shockley equation.",
    sections: [
      {
        name: "Foundations of Quantum Mechanics",
        items: [
          "The historical motivation: blackbody radiation (Planck), photoelectric effect (Einstein), atomic spectra (Bohr), de Broglie waves, Davisson-Germer. Read 'Quantum Mechanics: A Modern Development' by Ballentine or any modern intro for this",
          "Wave-particle duality and the double-slit experiment with electrons. The deepest experimental fact in physics",
          "The Schrödinger equation: iℏ·∂ψ/∂t = Ĥψ. Both time-dependent and time-independent forms. Memorize them",
          "The wavefunction ψ(x,t) and the Born rule: |ψ|² is the probability density. Probability, not certainty",
          "Operators, eigenvalues, and observables. Position, momentum, energy. The commutator [x, p] = iℏ",
          "Heisenberg uncertainty principle as a consequence of operator commutators, NOT as a measurement disturbance argument"
        ]
      },
      {
        name: "Standard Solvable Systems",
        items: [
          "Free particle: plane waves, wave packets, group velocity",
          "Particle in a 1D infinite square well. Quantized energy levels, normalization, orthogonality. The simplest QM problem and a workhorse",
          "Finite square well and tunneling. Tunneling is real and is the basis of scanning tunneling microscopes, alpha decay, and flash memory",
          "Quantum harmonic oscillator. Solve it both with brute-force series methods and with ladder operators (the latter is more elegant)",
          "Hydrogen atom: separation of variables, radial equation, spherical harmonics, the 1s/2s/2p orbital shapes. The first system where quantum mechanics meets the periodic table",
          "Recommended text: Griffiths 'Introduction to Quantum Mechanics' (3rd ed). The standard undergraduate text and rightly so"
        ]
      },
      {
        name: "Operators, Measurement & Spin",
        items: [
          "Hermitian operators have real eigenvalues — that's why observables in QM are Hermitian. Eigenstates form an orthonormal basis",
          "Measurement postulate: a measurement collapses the wavefunction to an eigenstate of the measured operator",
          "Stern-Gerlach experiments and spin-1/2. Pauli matrices σ_x, σ_y, σ_z. Spin doesn't have a classical analog — get used to it",
          "Two-state systems and quantum bits. The Bloch sphere as visualization",
          "Entanglement, EPR, Bell's theorem at a conceptual level. The world is non-local in a precise, measurable sense",
          "Schrödinger's cat and the measurement problem. Honest position: this is unsettled philosophy. The math works regardless"
        ]
      },
      {
        name: "Solid State: Bands & Semiconductors",
        items: [
          "Crystal structure: lattices, unit cells, the seven crystal systems. Most semiconductors are face-centered cubic (silicon, germanium) or zinc blende (GaAs)",
          "Bloch's theorem and band structure. The Kronig-Penney model is the simplest example. The key insight: in a periodic potential, electrons live in bands separated by gaps",
          "Conductors vs insulators vs semiconductors: difference is band structure. Metals have a partially filled band; insulators have a filled valence band and large gap; semiconductors are insulators with a small gap (~1 eV)",
          "Doping: n-type (extra electrons from donors like phosphorus), p-type (extra holes from acceptors like boron). This is how you tune the conductivity of silicon",
          "p-n junctions: the diode. Built-in field, forward bias (current flows easily), reverse bias (current barely flows). Derive the Shockley equation I = I₀(exp(qV/kT) - 1)",
          "BJTs and MOSFETs from solid-state principles. You'll finally understand why the transistors you used in Phase 4 work the way they do",
          "Recommended text: Kittel 'Introduction to Solid State Physics' (advanced) or Hook & Hall 'Solid State Physics' (gentler)"
        ]
      },
      {
        name: "Project: Numerical Schrödinger + Diode I-V Characterization",
        items: [
          "PHYSICS PROJECT: Write a program that solves the time-independent Schrödinger equation in 1D for an arbitrary potential V(x). Use finite differences: discretize x, build the Hamiltonian as a sparse matrix, find eigenvalues and eigenvectors with scipy.sparse.linalg.eigsh",
          "Test on the infinite square well — energies should match E_n = n²π²ℏ²/(2mL²). Then the harmonic oscillator (E_n = ℏω(n+1/2)). Then a double well. Then a finite barrier (visualize tunneling)",
          "EE PROJECT: Measure the I-V curve of a real diode (1N4148 or any small signal diode). Use a variable power supply or a battery + potentiometer + multimeter to sweep the voltage from 0 to 0.7 V and record the current",
          "Plot I vs V on linear and log scales. Fit the Shockley equation to extract the saturation current I₀ and the ideality factor n. You should find n ≈ 1-2",
          "Repeat at two different temperatures (room temp and warmed with a hairdryer). Verify that I₀ approximately doubles for every 10°C — this is the temperature-dependence the datasheet mentions",
          "Document side by side: the QM theory (band gap, p-n junction, Shockley derivation) AND the experimental data. This is how every physicist's lab notebook should look"
        ]
      }
    ],
    code: `# Schrödinger equation, 1D finite-difference solver
import numpy as np
from scipy.sparse import diags
from scipy.sparse.linalg import eigsh
import matplotlib.pyplot as plt

N, L = 1000, 10.0
x = np.linspace(-L/2, L/2, N)
dx = x[1] - x[0]

V = 0.5 * x**2  # harmonic oscillator (units where m=1, omega=1, hbar=1)
T = -0.5 * diags([1, -2, 1], [-1, 0, 1], shape=(N, N)) / dx**2
H = T + diags(V, 0)

E, psi = eigsh(H, k=4, which='SM')
order = np.argsort(E)
E, psi = E[order], psi[:, order]

print('Energies:', E)              # should be ~0.5, 1.5, 2.5, 3.5
for n in range(4):
    plt.plot(x, psi[:, n] + E[n], label=f'n={n}')
plt.plot(x, V, 'k--', alpha=0.5)
plt.legend(); plt.xlabel('x'); plt.show()`,
    resources: [
      { name: "Griffiths 'Quantum Mechanics' (3rd ed)", url: "https://www.cambridge.org/highereducation/books/introduction-to-quantum-mechanics/", note: "Standard undergraduate QM text" },
      { name: "MIT OCW — 8.04 Quantum Physics I", url: "https://ocw.mit.edu/courses/8-04-quantum-physics-i-spring-2016/", note: "Allan Adams's wonderful course" },
      { name: "Feynman Lectures Vol III", url: "https://www.feynmanlectures.caltech.edu/III_toc.html", note: "Feynman's QM intro — uniquely insightful" },
      { name: "Kittel 'Introduction to Solid State'", url: "https://www.wiley.com/en-us/Introduction+to+Solid+State+Physics%2C+8th+Edition-p-9780471415268", note: "Standard solid state text" }
    ],
    deeper: "After Quantum I you should read Sakurai's 'Modern Quantum Mechanics' for the operator-first approach (much more elegant than Griffiths) and Shankar's 'Principles of Quantum Mechanics' for a more thorough mathematical treatment. For the physics-of-information angle, Mike & Ike's 'Quantum Computation and Quantum Information' is the canonical text and you can read it without a graduate background."
  },
  {
    id: 10,
    title: "Signals, Systems & Control",
    subtitle: "The EE Backbone",
    time: "10–12 weeks",
    icon: "⇄",
    color: "#7B4FAB",
    intro: "Signals and systems is the unifying language of electrical engineering. Once you have it, you have a single framework for analyzing audio, radar, communications, control loops, neural circuits, and more. Add control theory on top and you have the tools to build anything that needs to maintain a state against disturbances — from balancing robots to chemical reactors to spacecraft. This phase is computationally intensive and project-rich.",
    sections: [
      {
        name: "Linear Time-Invariant Systems",
        items: [
          "Signals as functions of time. Continuous vs discrete. Periodic, aperiodic, finite-energy, finite-power",
          "Systems as operators on signals. The defining properties: linearity, time-invariance, causality, stability, memory",
          "Convolution: the operation that defines an LTI system's response. y(t) = ∫h(τ)·x(t-τ)·dτ. The most important integral in EE",
          "Impulse response and step response. Once you know an LTI system's impulse response, you know everything about it",
          "Frequency response: the Fourier transform of the impulse response. Magnitude (in dB) and phase. Bode plots as the standard visualization",
          "The connection to Phase 6 Fourier analysis: convolution in time = multiplication in frequency. This is why frequency-domain thinking is so powerful"
        ]
      },
      {
        name: "Laplace & Z-Transforms",
        items: [
          "Laplace transform: a generalization of the Fourier transform that handles non-finite-energy signals (like step functions and exponentials). The standard tool for continuous-time system analysis",
          "Transfer functions: H(s) = Y(s)/X(s). The fingerprint of any LTI system",
          "Poles and zeros in the s-plane. Stability = all poles in the left half-plane. The geometric way to read system behavior off a pole-zero plot is incredibly powerful — internalize it",
          "Z-transform: the discrete-time analog. Used for digital filters and discrete control",
          "Filter design: Butterworth, Chebyshev, elliptic. Bilinear transform to convert continuous designs to discrete. SciPy has all of this built in (scipy.signal)",
          "Recommended text: Oppenheim & Willsky 'Signals and Systems' (the classic) or Lathi 'Linear Systems and Signals' (gentler)"
        ]
      },
      {
        name: "Feedback & PID Control",
        items: [
          "Open-loop vs closed-loop. Feedback as the universal mechanism for robust control",
          "The block diagram language: blocks, summing junctions, feedback loops. Manipulate them to derive the closed-loop transfer function",
          "Proportional, integral, derivative (PID) control. What each term contributes: P for proportional response, I for zero steady-state error, D for damping",
          "Tuning PID controllers: Ziegler-Nichols method, manual tuning, auto-tuners. The art that complements the math",
          "Stability margins: gain margin and phase margin. How close to instability are you?",
          "Practical issues: integral windup, derivative kick, noise on the derivative, saturation. Real PID controllers have ~200 lines of code, not 5"
        ]
      },
      {
        name: "State-Space Methods",
        items: [
          "State-space representation: dx/dt = Ax + Bu, y = Cx + Du. A modern alternative to transfer functions, with better support for multi-input multi-output systems",
          "Controllability and observability: can you actually steer the system? Can you actually measure what you need? Often overlooked questions",
          "Pole placement: choose the closed-loop poles you want, then compute the feedback gains that put them there",
          "The Linear Quadratic Regulator (LQR): the optimal feedback for a quadratic cost function. The default modern controller",
          "Kalman filters: optimal state estimation in the presence of noise. Fundamental for sensor fusion (combining IMU + GPS + etc.)",
          "Recommended free text: Åström & Murray 'Feedback Systems' (free PDF online). Modern, comprehensive, project-oriented"
        ]
      },
      {
        name: "Project: Self-Balancing Robot + Kalman Filter",
        items: [
          "PROJECT: Build a self-balancing robot. Two-wheeled, ESP32 brain, MPU-6050 IMU, two small DC motors with encoders, motor driver IC (DRV8833 or TB6612FNG), small Li-ion or 9V battery. Total ~$50",
          "Measure tilt angle from accelerometer (slow but absolute) and gyroscope (fast but drifty). This is the textbook sensor fusion problem",
          "Implement a complementary filter as a first cut. Tilt = α·gyro_estimate + (1-α)·accel_estimate. Works surprisingly well",
          "Then implement a proper Kalman filter. Compare performance — Kalman should reduce noise and respond faster",
          "Implement PID control to maintain upright. Tune by hand starting with P only, then add D, then I last. Document each step",
          "Bonus: add velocity control on top of balance control (cascaded loops). Make the robot drive and turn while staying balanced"
        ]
      }
    ],
    code: `# Discrete PID + simple Kalman filter for tilt angle (Python)
import numpy as np

class PID:
    def __init__(self, kp, ki, kd, dt):
        self.kp, self.ki, self.kd, self.dt = kp, ki, kd, dt
        self.integral = 0; self.prev_err = 0
    def step(self, setpoint, measurement):
        err = setpoint - measurement
        self.integral += err * self.dt
        deriv = (err - self.prev_err) / self.dt
        self.prev_err = err
        return self.kp*err + self.ki*self.integral + self.kd*deriv

class TiltKalman:
    def __init__(self, dt, q_angle=0.001, q_bias=0.003, r=0.03):
        self.dt = dt; self.angle = 0.0; self.bias = 0.0
        self.P = np.zeros((2, 2))
        self.q_angle, self.q_bias, self.r = q_angle, q_bias, r
    def update(self, new_angle, new_rate):
        rate = new_rate - self.bias
        self.angle += self.dt * rate
        self.P[0,0] += self.dt*(self.dt*self.P[1,1] - self.P[0,1] - self.P[1,0] + self.q_angle)
        self.P[0,1] -= self.dt * self.P[1,1]
        self.P[1,0] -= self.dt * self.P[1,1]
        self.P[1,1] += self.q_bias * self.dt
        S = self.P[0,0] + self.r
        K = np.array([self.P[0,0], self.P[1,0]]) / S
        y = new_angle - self.angle
        self.angle += K[0] * y
        self.bias  += K[1] * y
        self.P -= np.outer(K, self.P[0])
        return self.angle`,
    resources: [
      { name: "Åström & Murray — Feedback Systems (free)", url: "https://fbswiki.org/", note: "Best modern free control textbook" },
      { name: "MIT OCW — 6.003 Signals and Systems", url: "https://ocw.mit.edu/courses/6-003-signals-and-systems-fall-2011/", note: "Free MIT signals course" },
      { name: "Brian Douglas — Control Systems Lectures", url: "https://www.youtube.com/@BrianBDouglas", note: "Best free control theory videos" },
      { name: "scipy.signal documentation", url: "https://docs.scipy.org/doc/scipy/reference/signal.html", note: "Filter design and analysis tools" }
    ],
    deeper: "Once you have classical control, the next steps are: optimal control (LQR, MPC, model predictive control), nonlinear control (Lyapunov methods, sliding mode, backstepping), and robust control (H-infinity). For a beautiful application, look up the SpaceX Falcon 9 landing — it's an inverted pendulum problem at planetary scale, using techniques you can understand after this phase."
  },
  {
    id: 11,
    title: "Special Relativity + RF & Antennas",
    subtitle: "Closing the E&M Loop",
    time: "8–10 weeks",
    icon: "⇶",
    color: "#7B4FAB",
    intro: "Special relativity is the second most important conceptual revolution in physics (quantum is the first). It's also the deepest answer to a question you may not have known to ask: why are electricity and magnetism the same thing? Pair the theory with RF and antennas — the practical art of radiating and receiving electromagnetic waves — and you'll close the loop on Phase 4 in a way that makes E&M feel inevitable.",
    sections: [
      {
        name: "Special Relativity Foundations",
        items: [
          "The two postulates: laws of physics are the same in all inertial frames, and the speed of light is the same in all inertial frames. Einstein 1905. Surprisingly, these two assumptions force everything else",
          "Time dilation, length contraction, relativity of simultaneity. Work the standard 'train and platform' thought experiments by hand until they feel natural",
          "Lorentz transformations: how coordinates change between frames. Inverse transformations and invariants",
          "Spacetime intervals: ds² = c²dt² - dx² - dy² - dz². The geometry of Minkowski spacetime. Past, future, and elsewhere",
          "Four-vectors: position, velocity, momentum, energy-momentum. The 4-momentum p^μ = (E/c, p_x, p_y, p_z) is the most useful object in relativistic kinematics",
          "Famous equation E² = (pc)² + (mc²)². E = mc² is just the case p = 0",
          "Recommended text: Griffiths 'Introduction to Electrodynamics' chapter 12, or Taylor & Wheeler 'Spacetime Physics' for the gentlest intro"
        ]
      },
      {
        name: "Why Magnetism Is Just Relativity",
        items: [
          "The setup: a current-carrying wire and a moving charge nearby. In one frame the wire is electrically neutral; the charge feels a magnetic force. In the wire's rest frame the charge feels no magnetic force — but the wire appears electrically charged due to relativistic length contraction of the moving electrons",
          "Both frames give the same physical force on the charge (as they must), but one calls it 'magnetic' and the other calls it 'electric'. Magnetism is what electricity looks like in a different frame",
          "This means electromagnetism is fundamentally a SINGLE phenomenon — the electromagnetic field is a single mathematical object (an antisymmetric rank-2 tensor) that splits into E and B in a frame-dependent way",
          "Maxwell's equations are naturally Lorentz-invariant when written in tensor form (∂_μ F^μν = J^ν, ∂_μ *F^μν = 0). All four equations become two — the most beautiful compression in physics",
          "Read Griffiths chapter 12 carefully. This is one of the great revelations in undergraduate physics",
          "After this you'll never confuse 'magnetic field' with 'something separate from electricity' again"
        ]
      },
      {
        name: "Transmission Lines & RF Basics",
        items: [
          "Why a wire is not a wire at high frequency. When the wavelength becomes comparable to the wire length, the wire behaves as a distributed system, not a lumped element",
          "The telegrapher's equations and the characteristic impedance Z₀. Why coaxial cable is 50Ω or 75Ω",
          "Reflection from impedance mismatches. The reflection coefficient Γ = (ZL - Z₀)/(ZL + Z₀). VSWR (voltage standing wave ratio) as the practical measure of mismatch",
          "Smith charts: a graphical tool for impedance matching. Looks intimidating, becomes intuitive after using it for a few problems",
          "Skin effect: at high frequencies, current flows in a thin layer near the conductor surface. Why RF wires are different from DC wires",
          "S-parameters as the language of RF measurement. S11 is reflection, S21 is transmission. Network analyzers measure them"
        ]
      },
      {
        name: "Antennas & Software-Defined Radio",
        items: [
          "Antennas as transducers between guided EM waves (in a transmission line) and free-space EM waves. The half-wave dipole as the canonical example",
          "Radiation patterns: omnidirectional vs directional. Gain (dBi), beam width, front-to-back ratio. Why a Yagi antenna is directional",
          "Polarization matching: vertical, horizontal, circular. Cross-polarization losses",
          "The Friis transmission equation: how much power do you receive at distance d from a transmitter? P_r = P_t·G_t·G_r·(λ/(4πd))². Verify it experimentally",
          "Software-defined radio (SDR): instead of dedicated analog RF hardware, sample the signal directly and do all processing in software (DSP from Phase 10)",
          "RTL-SDR (~$30): a USB dongle that can receive 24 MHz to 1.7 GHz. Originally designed for digital TV. The cheapest entry into RF experimentation. HackRF One ($300) for transmit too"
        ]
      },
      {
        name: "Project: ADS-B Aircraft Tracking + Build a Dipole",
        items: [
          "PROJECT 1: Receive ADS-B (Automatic Dependent Surveillance-Broadcast) signals from aircraft using an RTL-SDR. Aircraft above ~30,000 feet broadcast their position, altitude, speed, and ID at 1090 MHz",
          "Use dump1090 (open source) to decode signals. Pipe the output to a Python script that plots aircraft positions on a map (use folium or plotly)",
          "On a clear day with a roof antenna, you'll see hundreds of aircraft within 200 miles. The same data is what flightradar24.com uses",
          "PROJECT 2: Build a simple half-wave dipole antenna for the FM band (88-108 MHz). Total length ≈ λ/2 = 1.5 m. Just two pieces of wire connected to coax — the simplest antenna possible",
          "Measure SWR if you have access to a VNA (~$60 nanoVNA) or use the SDR itself with a return loss bridge. Compare resonance to the calculated frequency",
          "RELATIVITY PROJECT: Compute the relativistic correction to GPS satellite clocks. GPS satellites orbit at ~14,000 km/h and at altitude where gravitational time dilation is different. Without correcting for SR + GR, GPS would accumulate 10+ km of position error per day. Verify the numbers"
        ]
      }
    ],
    code: `# ADS-B Python decoder skeleton (using pyModeS)
import pyModeS as pms
from rtlsdr import RtlSdr

# Initialize RTL-SDR
sdr = RtlSdr()
sdr.sample_rate = 2.4e6
sdr.center_freq = 1090e6
sdr.gain = 'auto'

# Pipe samples to demodulation
def demod_loop():
    while True:
        samples = sdr.read_samples(256*1024)
        # Decode ADS-B messages from samples (simplified)
        # In practice, use dump1090 + pyModeS for full decoding
        for msg in get_messages(samples):
            if pms.adsb.icao(msg) and pms.adsb.typecode(msg) in range(9, 19):
                lat, lon = pms.adsb.position(msg, ref_msg, t0, t1)
                alt = pms.adsb.altitude(msg)
                print(f'{pms.adsb.icao(msg)}: {lat:.4f}, {lon:.4f}, {alt}ft')

demod_loop()`,
    resources: [
      { name: "Taylor & Wheeler — Spacetime Physics", url: "https://www.eftaylor.com/spacetimephysics/", note: "The gentlest SR text, free PDF" },
      { name: "MIT OCW — 8.20 Special Relativity", url: "https://ocw.mit.edu/courses/8-20-introduction-to-special-relativity-january-iap-2021/", note: "Free undergraduate SR" },
      { name: "ARRL Antenna Book", url: "http://www.arrl.org/", note: "Ham radio canonical antenna reference" },
      { name: "RTL-SDR.com", url: "https://www.rtl-sdr.com/", note: "Best community resource for SDR projects" }
    ],
    deeper: "After special relativity, general relativity is the natural next step. Carroll 'Spacetime and Geometry' is the gold standard graduate intro; Schutz 'A First Course in General Relativity' is gentler. For the deeper view of EM as a gauge theory, Zee 'Quantum Field Theory in a Nutshell' chapters 1-3 are accessible after this phase."
  },
  {
    id: 12,
    title: "Quantum II + Photonics & Lasers",
    subtitle: "Light, Quantized",
    time: "10–14 weeks",
    icon: "✦",
    color: "#7B4FAB",
    intro: "The first quantum mechanics phase covered the textbook one-particle problems. This phase pushes into perturbation theory (how to handle problems you can't solve exactly), multi-electron atoms (where the periodic table comes from), and the most important quantum technology in the world: the laser. By the end you'll understand why a laser pointer works and you'll have driven a real laser diode in a circuit you built.",
    sections: [
      {
        name: "Perturbation Theory & Approximations",
        items: [
          "Time-independent perturbation theory: when the Hamiltonian is H₀ + λV with V small. Compute corrections to energies and eigenstates",
          "First-order corrections to non-degenerate states: ΔE = ⟨n|V|n⟩. Second-order corrections involve sums over states",
          "Degenerate perturbation theory: when multiple states have the same energy. Diagonalize V in the degenerate subspace",
          "Time-dependent perturbation theory: transitions between states due to a time-varying perturbation. Fermi's golden rule for transition rates",
          "Variational method: a powerful way to estimate ground state energies for systems you can't solve. Used heavily in quantum chemistry and condensed matter",
          "WKB approximation: for slowly-varying potentials. Connects classical and quantum mechanics in the semiclassical limit"
        ]
      },
      {
        name: "Identical Particles & Multi-Electron Atoms",
        items: [
          "Identical particles in QM: bosons (symmetric under exchange) and fermions (antisymmetric). This isn't a convention — it's a deep fact about the world",
          "Pauli exclusion principle as a consequence of fermion antisymmetry. Why electrons can't all sit in the lowest energy state",
          "Atomic structure beyond hydrogen: shell structure (1s, 2s, 2p, 3s, ...), Hund's rules, the periodic table. Chemistry as applied QM",
          "Spin-orbit coupling: the relativistic correction that explains atomic fine structure and is responsible for ferromagnetism in some materials",
          "Selection rules for atomic transitions. Why some transitions are 'allowed' and others are 'forbidden'",
          "The hydrogen atom revisited with corrections: fine structure, Lamb shift, hyperfine structure. Each correction reveals deeper physics"
        ]
      },
      {
        name: "Lasers from First Principles",
        items: [
          "Stimulated emission: when a photon stimulates an excited atom to emit another photon coherent with the first. Einstein 1917 — predates the laser by 40 years",
          "Population inversion: why you need more atoms in the excited state than in the ground state. This requires a 'pump' — energy input from outside",
          "The 3-level and 4-level laser systems. Why 4-level systems are easier (lower threshold)",
          "Optical cavities: two mirrors that bounce light back and forth, creating standing wave modes. Longitudinal and transverse modes",
          "Threshold condition: the gain must overcome losses. Above threshold, the laser turns on suddenly",
          "Coherence properties: temporal coherence (narrow linewidth) and spatial coherence (single-mode beam). Why laser light is fundamentally different from incoherent light"
        ]
      },
      {
        name: "Photonics & Optoelectronics",
        items: [
          "Semiconductor lasers (diode lasers): the most common type. Same p-n junction physics from Phase 9, but with population inversion driven by current",
          "LEDs as the inverse process: pass current, get incoherent light. Same physics, no coherence",
          "Photodetectors: photodiodes, phototransistors, avalanche photodiodes. Convert light back to current",
          "Optical fibers: light guided by total internal reflection in a core surrounded by lower-index cladding. Bandwidths of THz over distances of km",
          "Modulation: amplitude, phase, frequency. How information is encoded onto light for fiber-optic communications",
          "Nonlinear optics: second-harmonic generation, sum-frequency mixing, parametric down-conversion. The basis of green laser pointers (532 nm = SHG of 1064 nm Nd:YAG)"
        ]
      },
      {
        name: "Project: Drive a Laser Diode + Numerical Atomic Physics",
        items: [
          "EE PROJECT: Build a constant-current driver for a laser diode (5 mW red, ~$10). Laser diodes need precise current control — a 1 mA error can destroy them. Use an LM317 in current-source mode or a dedicated laser driver IC",
          "Measure the I-L (current vs light) curve. Below threshold (~25 mA), no laser action — just LED-like emission. Above threshold, light output rises sharply with current",
          "Extract the threshold current and slope efficiency. Compare to the datasheet",
          "Bonus: use the laser in your Phase 6 Michelson interferometer to measure something — a mirror translation, a thermal expansion of a metal rod (heat it gently and count fringes)",
          "PHYSICS PROJECT: Numerically solve the helium atom (2 electrons) using the variational method. Compare ground-state energy estimates with simple trial wavefunctions to the experimental value (-79 eV)",
          "More ambitious: implement a Hartree-Fock calculation for a few-electron atom. Real quantum chemistry codes (PySCF) make this approachable in Python"
        ]
      }
    ],
    code: `# Variational ground-state estimate for helium atom
import numpy as np
from scipy.integrate import quad

def E_helium(Z_eff):
    """Variational energy for helium with effective nuclear charge Z_eff.
    Uses a hydrogenic 1s orbital trial wavefunction."""
    # Kinetic energy: Z_eff^2 per electron
    # Electron-nucleus: -2 Z Z_eff
    # Electron-electron: 5 Z_eff / 8
    Z = 2  # actual nuclear charge for helium
    return 2 * Z_eff**2 - 2 * (2*Z) * Z_eff + 5 * Z_eff / 8

from scipy.optimize import minimize_scalar
result = minimize_scalar(E_helium, bracket=(1.0, 2.0))
print(f'Optimal Z_eff = {result.x:.4f}')
print(f'E_min = {result.fun:.4f} Hartrees = {result.fun * 27.2:.2f} eV')
# Compare to experiment: -79.0 eV`,
    resources: [
      { name: "Griffiths QM (3rd ed) — Chapters 6-10", url: "https://www.cambridge.org/highereducation/books/introduction-to-quantum-mechanics/", note: "Standard text continues" },
      { name: "Yariv & Yeh 'Photonics'", url: "https://global.oup.com/academic/product/photonics-9780195179460", note: "Standard photonics text" },
      { name: "Siegman 'Lasers'", url: "https://www.osapublishing.org/", note: "The bible of laser physics (advanced)" },
      { name: "PySCF", url: "https://pyscf.org/", note: "Open-source quantum chemistry in Python" }
    ],
    deeper: "Quantum optics, where you treat light itself as a quantum field, is the next frontier. The classic text is Loudon 'The Quantum Theory of Light'. For the engineering side, Saleh & Teich 'Fundamentals of Photonics' is the standard reference and covers everything from optical fibers to quantum information."
  },
  {
    id: 13,
    title: "Computational Physics",
    subtitle: "Physics at Scale",
    time: "8–10 weeks",
    icon: "⊞",
    color: "#7B4FAB",
    intro: "Most physics problems aren't analytically solvable — they require numerical methods. Computational physics is the modern third pillar of the field, alongside theory and experiment. This phase teaches the techniques that let you tackle problems too messy for pen and paper: Monte Carlo, molecular dynamics, finite elements, and PDE solvers. By the end you'll have built an N-body gravity simulator and a 2D heat equation solver — and you'll have a real intuition for what's hard about scientific computing.",
    sections: [
      {
        name: "Monte Carlo Methods",
        items: [
          "Monte Carlo as the universal numerical technique: instead of computing an integral, sample it randomly. Especially powerful in high dimensions",
          "Importance sampling: sample where the integrand is large. Without this, MC is useless beyond a few dimensions",
          "Markov Chain Monte Carlo (MCMC): the technique behind the Ising model from Phase 7 and Bayesian inference everywhere",
          "Metropolis-Hastings algorithm: the workhorse MCMC method. You implemented this in Phase 7; here you'll use it for new problems",
          "Sampling continuous distributions: rejection sampling, inverse transform sampling, the Box-Muller method for Gaussians",
          "Quasi-random sequences (Sobol, Halton): better-than-random sampling for low-dimensional integrals"
        ]
      },
      {
        name: "Molecular Dynamics",
        items: [
          "Molecular dynamics (MD): integrate Newton's equations for many particles interacting via known forces. Used for everything from protein folding to material properties",
          "Pairwise potentials: Lennard-Jones (van der Waals fluids), Coulomb (charged particles), Morse (chemical bonds). The simplest is LJ",
          "Symplectic integrators: Velocity Verlet, leapfrog. Standard Runge-Kutta methods drift in energy over long simulations; symplectic methods conserve energy on average",
          "Periodic boundary conditions: simulate a tiny box that 'wraps around' to model an infinite system. Critical for any thermodynamic calculation",
          "Computing thermodynamic quantities: temperature from average kinetic energy, pressure from the virial theorem, radial distribution function",
          "Free public MD codes: LAMMPS, GROMACS. Don't reinvent the wheel for production — but writing your own toy MD code is essential for understanding"
        ]
      },
      {
        name: "Finite Differences & Finite Elements",
        items: [
          "Discretizing PDEs: finite differences as the simplest approach. Centered differences, forward differences, backward differences. Accuracy orders",
          "The 1D heat equation ∂u/∂t = α·∂²u/∂x² as the canonical example. Explicit (forward Euler) vs implicit (Crank-Nicolson) schemes. Stability conditions",
          "The wave equation as the second canonical example. Conservation of energy in discrete schemes",
          "Poisson's equation ∇²V = -ρ/ε₀. Solve electrostatics problems on a grid. The same code, with different boundary conditions, solves heat steady-state problems",
          "Finite element method (FEM) at a conceptual level: instead of a regular grid, use unstructured meshes that adapt to geometry. Used for everything from car crash simulation to quantum chemistry",
          "Free software: FEniCS for FEM, scipy.sparse for FD problems. Building your own from scratch is best for learning"
        ]
      },
      {
        name: "High-Performance Computing Basics",
        items: [
          "Why physics simulations need speed: many problems are at the edge of what's computationally feasible. A 10x speedup is sometimes the difference between a feasible study and an infeasible one",
          "Vectorization: NumPy is roughly 100x faster than Python loops because it uses vectorized C code under the hood. Always vectorize first",
          "Profiling: cProfile, line_profiler, py-spy. Don't optimize what isn't slow",
          "Numba: JIT compile Python to native code with a single decorator. Often gets you within 2x of C performance for numerical code",
          "GPU computing: CuPy as a NumPy drop-in for NVIDIA GPUs. JAX for differentiable, GPU-accelerated NumPy. The future of scientific computing",
          "Parallelism: threads vs processes vs distributed. multiprocessing for embarrassingly parallel work, mpi4py for tightly coupled simulations"
        ]
      },
      {
        name: "Project: N-Body Simulator + 2D Heat Equation Solver",
        items: [
          "PROJECT 1: N-body gravitational simulator. 100-1000 particles, all-pairs gravity (O(N²)), Velocity Verlet integration. Set up a small galaxy with realistic orbital velocities and watch it evolve",
          "Verify energy conservation over long simulations (1000+ orbits). If energy is drifting, your time step is too large or your integrator is wrong",
          "Make a movie of the simulation in matplotlib. Watching a galaxy evolve is one of the great pleasures of computational physics",
          "Bonus: implement a Barnes-Hut tree algorithm for O(N log N) scaling. This lets you simulate ~10⁵ particles instead of ~10³",
          "PROJECT 2: 2D heat equation solver. Square plate with prescribed boundary conditions (e.g., 100°C on top edge, 0°C on the other three). Solve the steady-state temperature distribution",
          "Then add time evolution: start with the plate uniformly at 0°C, suddenly impose the boundary conditions, watch the heat diffuse in",
          "Visualize as a 2D color map with matplotlib imshow. This same code, with different physics, solves wave propagation, neutron diffusion, drug diffusion, image inpainting"
        ]
      }
    ],
    code: `# 2D heat equation explicit solver
import numpy as np
import matplotlib.pyplot as plt

N, T_steps = 100, 5000
alpha, dx = 1.0, 1.0/N
dt = 0.2 * dx**2 / alpha   # CFL stability condition

u = np.zeros((N, N))
u[0, :] = 1.0   # top boundary at T=1

for step in range(T_steps):
    lap = (np.roll(u, 1, 0) + np.roll(u, -1, 0)
         + np.roll(u, 1, 1) + np.roll(u, -1, 1) - 4*u) / dx**2
    u += dt * alpha * lap
    # Re-apply boundary conditions
    u[0, :] = 1.0; u[-1, :] = 0.0; u[:, 0] = 0.0; u[:, -1] = 0.0

plt.imshow(u, cmap='hot', origin='upper')
plt.colorbar(label='Temperature')
plt.title('2D heat equation, steady state')
plt.show()`,
    resources: [
      { name: "Newman 'Computational Physics' (free PDF)", url: "https://public.websites.umich.edu/~mejn/cp/", note: "Best free intro, uses Python" },
      { name: "MIT OCW — 18.330 Numerical Methods", url: "https://ocw.mit.edu/courses/18-330-introduction-to-numerical-analysis-spring-2012/", note: "Free numerical analysis course" },
      { name: "FEniCS Project", url: "https://fenicsproject.org/", note: "Open-source FEM in Python" },
      { name: "Numba documentation", url: "https://numba.readthedocs.io/", note: "JIT-compile Python for speed" }
    ],
    deeper: "After the basics, the next frontier is differentiable programming with JAX or PyTorch — being able to take gradients through your physics simulator opens up optimization, machine learning, and inverse problems in physics. The 'physics-informed neural networks' literature is recent, exciting, and accessible. For a more traditional path, Press et al. 'Numerical Recipes' is the canonical reference that has lived on every physicist's desk for 30 years."
  },
  {
    id: 14,
    title: "Modern Physics Survey",
    subtitle: "Where the Field Actually Is",
    time: "8–10 weeks",
    icon: "✧",
    color: "#7B4FAB",
    intro: "The previous phases covered the standard undergraduate physics curriculum at a serious level. This phase is breadth, not depth — a survey of what physicists actually study at the frontier. Atomic, nuclear, and particle physics; cosmology and general relativity; condensed matter and statistical phenomena. The goal is to know enough to read a Quanta Magazine article fluently and to know what you'd dive into next if a topic catches you.",
    sections: [
      {
        name: "Atomic & Nuclear Physics",
        items: [
          "Atomic structure refresher: hydrogen, helium, multi-electron atoms. The fine structure, hyperfine structure, and Zeeman effect",
          "Atomic clocks: how they work (cesium-133, rubidium, optical lattice clocks). The most precise instruments humans have ever built",
          "Nuclear structure: protons and neutrons, the strong force at the level of nucleons, binding energy curve, fission and fusion",
          "Radioactive decay: alpha, beta, gamma. Half-lives, decay chains, the math of exponential decay",
          "Nuclear reactors and weapons at a conceptual level. Critical mass, neutron multiplication, moderators",
          "Recommended text: Krane 'Introductory Nuclear Physics' for nuclear; Demtröder 'Atoms, Molecules and Photons' for atomic"
        ]
      },
      {
        name: "Particle Physics & The Standard Model",
        items: [
          "The particle zoo: quarks (up, down, charm, strange, top, bottom), leptons (electron, muon, tau and their neutrinos), gauge bosons (photon, W, Z, gluon), the Higgs",
          "The four forces and their carriers. Gravity is conspicuously absent from the Standard Model",
          "Quantum chromodynamics (QCD) and color confinement. Why you can't isolate a quark",
          "Electroweak unification and the Higgs mechanism. How particles get mass",
          "Open questions: dark matter, dark energy, neutrino masses, hierarchy problem, matter-antimatter asymmetry. Frontier physics",
          "Beyond the Standard Model: supersymmetry, extra dimensions, grand unified theories. Speculative but actively researched",
          "Recommended free text: 'Particle Physics: A Very Short Introduction' (Close) for the gentle version, or Griffiths 'Introduction to Elementary Particles' for the standard undergraduate text"
        ]
      },
      {
        name: "Cosmology & General Relativity Survey",
        items: [
          "General relativity at a conceptual level: gravity is curvature of spacetime, not a force. The equivalence principle. Geodesics as 'straight lines in curved space'",
          "The Einstein field equations (look at them, don't solve them): G_μν = 8πG/c⁴ T_μν. Geometry on the left, matter on the right",
          "Black holes: the Schwarzschild solution, event horizons, singularities, Hawking radiation",
          "The expanding universe: Hubble's law, the cosmic microwave background, Big Bang nucleosynthesis, inflation",
          "Dark matter and dark energy: 95% of the universe is stuff we don't understand. Strong observational evidence, weak theoretical understanding",
          "Recommended free resource: Sean Carroll's 'No-Nonsense Introduction to General Relativity' (free PDF). For the full treatment: Carroll's 'Spacetime and Geometry' or Schutz 'A First Course in General Relativity'"
        ]
      },
      {
        name: "Condensed Matter & Soft Matter Frontiers",
        items: [
          "Beyond simple solids: superconductors, superfluids, Bose-Einstein condensates. Quantum mechanics at macroscopic scales",
          "Topological materials: topological insulators, Weyl semimetals, the quantum Hall effect. The frontier of condensed matter, with deep connections to topology",
          "Soft matter: polymers, colloids, liquid crystals, biological materials. Statistical mechanics of complex systems",
          "Active matter: self-propelled particles, flocking, swarming. Connects to biology and engineering",
          "Phonons, plasmons, polaritons: collective excitations in solids. The 'particles' that actually carry heat, light, and sound through materials",
          "Recommended popular reading: 'A Different Universe' (Robert Laughlin) on emergence in condensed matter"
        ]
      },
      {
        name: "Project: Cloud Chamber + Cosmic Ray Photography",
        items: [
          "Build a diffusion cloud chamber from a small fish tank, dry ice, and isopropyl alcohol. Plans are widely available online (Instructables, MIT public lecture demonstrations)",
          "Cost: ~$30 for the tank and alcohol; dry ice is the only ongoing cost (~$5-10 per session)",
          "When working, you'll see vapor trails left by cosmic ray muons passing through the chamber. These are real particles from cosmic ray showers in the atmosphere — direct evidence of high-energy physics from your own basement",
          "Photograph the trails. Different particles leave different tracks: thin straight lines (muons), kinked lines (low-energy electrons scattering), helical paths (in the presence of a magnet), short fat tracks (alpha particles from natural radon)",
          "Bonus: place a small radioactive source in the chamber (Am-241 from a smoke detector — be safe). You'll see beautiful alpha tracks",
          "This is the most direct experiment in this curriculum. You're literally seeing particle physics happen in your home"
        ]
      }
    ],
    code: `# Simulate a simple cosmic ray shower (toy model)
import numpy as np
import matplotlib.pyplot as plt

def shower(E_initial, depth=20):
    """Simple electromagnetic shower: each particle splits into 2 at each step
    until energy per particle drops below the critical energy."""
    E_crit = 0.1   # arbitrary units
    particles = [(0, 0, E_initial)]   # (depth, x, energy)
    history = []

    for d in range(depth):
        next_gen = []
        for (depth_p, x, E) in particles:
            history.append((d, x, E))
            if E > E_crit:
                # Split into two with random transverse displacement
                next_gen.append((d+1, x + np.random.normal(0, 0.3), E/2))
                next_gen.append((d+1, x + np.random.normal(0, 0.3), E/2))
        particles = next_gen
        if not particles: break
    return history

h = shower(100, depth=15)
ds, xs, Es = zip(*h)
plt.scatter(xs, ds, s=np.array(Es)*5, alpha=0.5)
plt.gca().invert_yaxis()
plt.xlabel('x'); plt.ylabel('depth')
plt.title('Toy electromagnetic shower')
plt.show()`,
    resources: [
      { name: "Quanta Magazine — Physics", url: "https://www.quantamagazine.org/physics/", note: "Best science journalism on frontier physics" },
      { name: "Sean Carroll's Mindscape Podcast", url: "https://www.preposterousuniverse.com/podcast/", note: "Long-form interviews with frontier physicists" },
      { name: "Particle Adventure (LBL)", url: "https://www.particleadventure.org/", note: "Free interactive intro to particle physics" },
      { name: "MIT OCW — 8.282 Cosmology", url: "https://ocw.mit.edu/courses/8-282j-introduction-to-astronomy-spring-2006/", note: "Intro astronomy/cosmology" }
    ],
    deeper: "If one of these areas catches you and you want to go deep, the standard graduate paths are: particle physics → Peskin & Schroeder 'An Introduction to Quantum Field Theory'; condensed matter → Ashcroft & Mermin 'Solid State Physics' followed by Mahan 'Many-Particle Physics'; gravity/cosmology → Misner-Thorne-Wheeler 'Gravitation' followed by Weinberg 'Cosmology'. Each is a multi-year commitment but each opens a real research literature."
  },
  {
    id: 15,
    title: "Integrated Capstone",
    subtitle: "The Generalist, Built",
    time: "3 months",
    icon: "◆",
    color: "#7B4FAB",
    intro: "The previous 14 phases have built the components. The capstone integrates them. Pick one substantial project that uses physics, electronics, embedded systems, signal processing, and computational analysis together. Spend 3 months on it. Document it like an undergraduate thesis. The point of the capstone isn't to prove anything to anyone else — it's to prove to YOURSELF that the curriculum stuck, that you can apply this knowledge to a real problem from end to end.",
    sections: [
      {
        name: "Choosing Your Capstone",
        items: [
          "Choose one project that genuinely excites you. Excitement is the only renewable energy source for a 3-month solo project",
          "Aim for 'visibly hard' — something you couldn't have built before this curriculum and can't easily find a tutorial for. Stretch yourself",
          "Constraints to set early: total budget cap, weekly time commitment (suggest 8-12 hours/week), final deliverables (working hardware + documented results + writeup)",
          "Define a minimum viable result and a stretch goal. The MVP is what you commit to deliver; the stretch goal is what you reach for if things go well",
          "Pick a project with multiple subsystems. The point of the capstone is integration — proving you can connect physics to electronics to firmware to data analysis"
        ]
      },
      {
        name: "Option A: SDR-Based Passive Radar",
        items: [
          "Use two RTL-SDR receivers and existing FM radio broadcast signals as the illuminator. Detect aircraft, cars, or other reflective targets",
          "Theory load: signal processing (cross-correlation), Doppler shifts, basic radar equation, array geometry",
          "Hardware: 2x RTL-SDR ($60), 2x antennas, USB hub, laptop. Total <$150",
          "Software: GNU Radio for the receive/synchronization, Python for the cross-correlation processing and visualization",
          "Stretch goal: ambiguity function, multi-target tracking, comparison with ADS-B for ground truth"
        ]
      },
      {
        name: "Option B: Reaction Wheel Inverted Pendulum",
        items: [
          "Single rigid rod with a flywheel at the top. Brushless motor spins the wheel. Reaction torque keeps the pendulum upright. Looks impossible until you see it",
          "Theory load: rigid body dynamics, Lagrangian mechanics, linear quadratic regulator (LQR), state estimation, real-time control",
          "Hardware: brushless motor + ESC, IMU, microcontroller (Teensy or ESP32), 3D-printed or laser-cut chassis. Total ~$80-150",
          "Software: derive the linearized dynamics, design an LQR controller in Python, port the gains to C/Arduino, real-time control loop at 1+ kHz",
          "Stretch goal: swing-up control (start from hanging down and swing into the upright position before stabilizing). Vastly harder than balance alone"
        ]
      },
      {
        name: "Option C: Precision Michelson Interferometer",
        items: [
          "Take your Phase 6 Michelson and turn it into a precision instrument. Goal: measure displacements smaller than 100 nm",
          "Theory load: laser stability, vibration isolation, photodiode signal conditioning, fringe counting, environmental compensation",
          "Hardware: stabilized laser ($100-200), better mirrors ($30-50), photodiode + transimpedance amp, vibration-isolated breadboard, microcontroller for fringe counting. Total ~$300-500",
          "Measurement targets: thermal expansion of an aluminum bar (heat it 1°C and count fringes), acoustic vibrations, your own footsteps",
          "Stretch goal: a frequency-stabilized HeNe laser, sub-nanometer resolution, computer-recorded fringe counts with sub-fringe interpolation"
        ]
      },
      {
        name: "Option D: Quadcopter With Kalman-Filtered State Estimation",
        items: [
          "Build a small quadcopter from scratch (no off-the-shelf flight controller). Frame, motors, ESCs, IMU, microcontroller, battery",
          "Theory load: rigid body dynamics in 3D, quaternions, sensor fusion, cascaded PID control, motor mixing",
          "Hardware: FPV-grade frame ($30), 4x brushless motors ($30), 4x ESCs ($30), Teensy 4.0 ($25), MPU-9250 IMU ($10), LiPo battery ($20), prop guards. Total ~$150",
          "Software: Madgwick or Mahony filter for orientation, PID for attitude control, cascaded PID for position. RC receiver for manual control",
          "Stretch goal: GPS hold, autonomous waypoint navigation, indoor positioning with optical flow",
          "Safety note: test outside, away from people, with prop guards. Quadcopters can hurt you"
        ]
      },
      {
        name: "Documenting Like a Thesis",
        items: [
          "Write up the project as if you were submitting it for an undergraduate thesis. Aim for 20-40 pages",
          "Standard structure: Abstract, Introduction, Theory, Methods/Hardware, Results, Discussion, Conclusion, References. This forces you to be comprehensive",
          "Include: derivations of the key equations, schematics, photos of the hardware, plots of all measurements, comparison to theory, error analysis, things that didn't work and why",
          "Use LaTeX (you set this up in Phase 1). Make the equations beautiful. Use proper figure captions and references",
          "Publish it: GitHub repo with README + PDF + source code. Even if no one reads it, the act of writing it for an audience changes how you think about the work",
          "Bonus: write a short blog post or LinkedIn post summarizing the project for non-physicists. This is genuinely useful — distilling technical work for a general audience is a separate skill that will serve you well"
        ]
      }
    ],
    resources: [
      { name: "GNU Radio", url: "https://www.gnuradio.org/", note: "Free SDR signal processing framework" },
      { name: "Open Robotics — Reaction Wheel Pendulum", url: "https://github.com/lucasw/reaction_wheel", note: "Reference implementations" },
      { name: "Teensy 4.0", url: "https://www.pjrc.com/store/teensy40.html", note: "Best microcontroller for high-speed control" },
      { name: "Overleaf LaTeX templates", url: "https://www.overleaf.com/latex/templates/category/thesis", note: "Free thesis templates" }
    ],
    deeper: "After the capstone, you've built something most physics undergraduates haven't — a project that integrates theory, hardware, firmware, and analysis into a working system. The natural next steps depend on what you loved most: deeper into a specific physics area (Phase 14 hints at the standard graduate paths), deeper into engineering (a focused subspecialty like robotics, photonics, or RF), or applied work (research lab volunteering, citizen science, an open-source hardware project, or a side hustle in instrumentation). The curriculum ends here, but the practice of being a generalist physicist-engineer is something you'll keep building for life."
  }
];

const PRIORITY_MAP = {
  "Math foundation": [1, 2],
  "Physics core sequence": [3, 4, 6, 7, 9, 11, 12],
  "EE backbone": [3, 4, 5, 8, 10, 11],
  "Hardware project track": [5, 8, 10, 15],
  "Computational track": [2, 13, 15]
};

function CodeBlock({ code }) {
  return (
    <pre style={{
      background: "#100A18",
      border: "1px solid rgba(123,79,171,0.1)",
      borderRadius: 8,
      padding: "16px 20px",
      overflowX: "auto",
      fontSize: 13,
      lineHeight: 1.65,
      fontFamily: "'IBM Plex Mono', 'Fira Code', monospace",
      color: "#C9B8DC",
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
      background: "rgba(123,79,171,0.03)",
      border: "1px solid rgba(123,79,171,0.08)",
      borderRadius: 8,
      textDecoration: "none",
      color: "#C9B8DC",
      transition: "all 0.2s",
      marginBottom: 6,
      fontSize: 13
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(184,148,212,0.3)"; e.currentTarget.style.background = "rgba(123,79,171,0.06)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(123,79,171,0.08)"; e.currentTarget.style.background = "rgba(123,79,171,0.03)"; }}>
      <span style={{ flexShrink: 0, color: "#B894D4" }}>↗</span>
      <span style={{ flex: 1 }}>
        <strong style={{ color: "#DDD4E5", fontWeight: 500 }}>{r.name}</strong>
        {r.note && <span style={{ color: "#8B7B95", marginLeft: 6, fontStyle: "italic" }}>— {r.note}</span>}
      </span>
    </a>
  );
}

function PhaseContent({ phase }) {
  const [showDeeper, setShowDeeper] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <p style={{ fontSize: 15, lineHeight: 1.75, color: "#C9B8DC", margin: 0 }}>{phase.intro}</p>
      {phase.sections?.map((section, si) => (
        <div key={si}>
          <h4 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 1.5, color: phase.color, margin: "0 0 14px", fontWeight: 600, paddingBottom: 8, borderBottom: `1px solid ${phase.color}22` }}>{section.name}</h4>
          {section.items.map((item, ii) => (
            <div key={ii} style={{ padding: "10px 0", borderBottom: "1px solid rgba(123,79,171,0.05)", fontSize: 14, color: "#C9B8DC", lineHeight: 1.7 }}>{item}</div>
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
          <button onClick={() => setShowDeeper(!showDeeper)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1px dashed rgba(123,79,171,0.15)", color: "#8B7B95", fontSize: 13, padding: "10px 16px", borderRadius: 8, cursor: "pointer", width: "100%", textAlign: "left", transition: "all 0.2s", fontFamily: "inherit" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = phase.color; e.currentTarget.style.color = phase.color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(123,79,171,0.15)"; e.currentTarget.style.color = "#8B7B95"; }}>
            <span style={{ transform: showDeeper ? "rotate(90deg)" : "none", transition: "transform 0.2s", fontSize: 10 }}>▶</span>
            Want to go deeper?
          </button>
          {showDeeper && <p style={{ fontSize: 13, color: "#8B7B95", lineHeight: 1.75, padding: "14px 16px", margin: "8px 0 0", background: "rgba(123,79,171,0.03)", borderRadius: 8, fontStyle: "italic", borderLeft: `2px solid ${phase.color}33` }}>{phase.deeper}</p>}
        </div>
      )}
    </div>
  );
}

export default function PhysicsEERoadmap({ onBack }) {
  const [activePhase, setActivePhase] = useState(1);
  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem('physics-ee-roadmap-progress');
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
      .eq('curriculum', 'physics-ee')
      .single();
    if (data?.completed_phases) {
      skipSync.current = true;
      setCompleted(new Set(data.completed_phases));
      localStorage.setItem('physics-ee-roadmap-progress', JSON.stringify(data.completed_phases));
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
    try { localStorage.setItem('physics-ee-roadmap-progress', JSON.stringify(arr)); } catch {}
    if (skipSync.current) { skipSync.current = false; return; }
    if (!supabase || !user) return;
    supabase.from('user_progress').upsert({
      user_id: user.id,
      curriculum: 'physics-ee',
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
    <div style={{ fontFamily: "'Newsreader', Georgia, serif", background: "#0C0814", color: "#DDD4E5", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <header style={{ padding: "14px 24px", borderBottom: "1px solid rgba(123,79,171,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#0C0814", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {onBack && (
            <button onClick={onBack} style={{ background: "none", border: "none", color: "#8B7B95", fontSize: 13, cursor: "pointer", padding: "4px 8px", fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
          )}
          <button onClick={() => setShowNav(!showNav)} style={{ background: "none", border: "none", color: "#DDD4E5", fontSize: 20, cursor: "pointer", padding: "4px 8px" }}>{showNav ? "✕" : "☰"}</button>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0, letterSpacing: -0.3, fontFamily: "'DM Sans', sans-serif" }}>Physics & <span style={{ color: "#7B4FAB" }}>Electrical Engineering</span></h1>
            <p style={{ fontSize: 10, color: "#8B7B95", margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>From first principles</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#8B7B95", fontFamily: "'IBM Plex Mono', monospace" }}>{completed.size}/{PHASES.length}</span>
          <div style={{ width: 80, height: 4, background: "rgba(123,79,171,0.1)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, #7B4FAB, #B894D4)", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          {supabase && !authLoading && (
            user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
                <span style={{ fontSize: 12, color: "#8B7B95", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                <button onClick={signOut} style={{ background: "none", border: "1px solid rgba(123,79,171,0.15)", color: "#8B7B95", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer" }}>Sign out</button>
              </div>
            ) : (
              <button onClick={() => { setShowAuthModal(true); setAuthMode('signin'); setAuthError(''); }} style={{ background: "rgba(123,79,171,0.1)", border: "1px solid rgba(123,79,171,0.2)", color: "#7B4FAB", fontSize: 11, padding: "4px 12px", borderRadius: 6, cursor: "pointer", marginLeft: 8 }}>Sign in</button>
            )
          )}
        </div>
      </header>
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <nav style={{ width: showNav ? 300 : 0, minWidth: showNav ? 300 : 0, borderRight: showNav ? "1px solid rgba(123,79,171,0.08)" : "none", overflow: "hidden", transition: "all 0.3s ease", background: "#0A0612", flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {PHASES.map(p => (
              <button key={p.id} onClick={() => { setActivePhase(p.id); setShowNav(false); }}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "11px 14px", background: activePhase === p.id ? `${p.color}0D` : "transparent", border: activePhase === p.id ? `1px solid ${p.color}1A` : "1px solid transparent", borderRadius: 8, cursor: "pointer", textAlign: "left", marginBottom: 2, transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                <span onClick={(e) => { e.stopPropagation(); toggleComplete(p.id); }}
                  style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, border: completed.has(p.id) ? `2px solid ${p.color}` : "2px solid rgba(123,79,171,0.15)", background: completed.has(p.id) ? `${p.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: p.color, cursor: "pointer", transition: "all 0.2s" }}>
                  {completed.has(p.id) ? "✓" : ""}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: activePhase === p.id ? 600 : 400, color: activePhase === p.id ? "#DDD4E5" : "#8B7B95", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    <span style={{ color: p.color, marginRight: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>{String(p.id).padStart(2, "0")}</span>{p.title}
                  </div>
                  <div style={{ fontSize: 11, color: "#5C5066", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.subtitle}</div>
                </div>
                <span style={{ fontSize: 10, color: "#5C5066", fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>{p.time}</span>
              </button>
            ))}
          </div>
          <div style={{ padding: 16, borderTop: "1px solid rgba(123,79,171,0.08)" }}>
            <h4 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: "#5C5066", margin: "0 0 10px", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>Focus Tracks</h4>
            {Object.entries(PRIORITY_MAP).map(([activity, ids]) => (
              <button key={activity} onClick={() => { setActivePhase(ids[0]); setShowNav(false); }}
                style={{ display: "block", width: "100%", padding: "6px 0", background: "none", border: "none", textAlign: "left", cursor: "pointer", fontSize: 12, color: "#8B7B95", fontFamily: "'DM Sans', sans-serif", transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = "#7B4FAB"}
                onMouseLeave={e => e.currentTarget.style.color = "#8B7B95"}>
                {activity} → {ids.map(id => String(id).padStart(2, "0")).join(", ")}
              </button>
            ))}
          </div>
        </nav>
        <main ref={contentRef} style={{ flex: 1, overflowY: "auto", padding: "40px 32px 80px", maxWidth: 720, margin: "0 auto", width: "100%" }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: phase.color, fontWeight: 600 }}>Phase {String(phase.id).padStart(2, "0")}</span>
              <span style={{ fontSize: 12, color: "#5C5066", fontFamily: "'IBM Plex Mono', monospace" }}>{phase.time}</span>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 700, margin: "0 0 4px", letterSpacing: -0.5, lineHeight: 1.1, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: phase.color, marginRight: 8 }}>{phase.icon}</span>{phase.title}
            </h2>
            <p style={{ fontSize: 17, color: "#8B7B95", margin: 0, fontWeight: 300 }}>{phase.subtitle}</p>
          </div>
          <button onClick={() => toggleComplete(phase.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", background: completed.has(phase.id) ? `${phase.color}0D` : "rgba(123,79,171,0.03)", border: `1px solid ${completed.has(phase.id) ? phase.color + "33" : "rgba(123,79,171,0.08)"}`, borderRadius: 8, cursor: "pointer", color: completed.has(phase.id) ? phase.color : "#8B7B95", fontSize: 13, fontWeight: 500, marginBottom: 32, transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${completed.has(phase.id) ? phase.color : "rgba(123,79,171,0.2)"}`, background: completed.has(phase.id) ? `${phase.color}1A` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, transition: "all 0.2s" }}>
              {completed.has(phase.id) ? "✓" : ""}
            </span>
            {completed.has(phase.id) ? "Completed" : "Mark as completed"}
          </button>
          <PhaseContent phase={phase} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(123,79,171,0.08)" }}>
            <button onClick={() => activePhase > 1 && setActivePhase(activePhase - 1)} disabled={activePhase === 1}
              style={{ padding: "10px 20px", background: activePhase === 1 ? "transparent" : "rgba(123,79,171,0.03)", border: `1px solid ${activePhase === 1 ? "transparent" : "rgba(123,79,171,0.08)"}`, borderRadius: 8, color: activePhase === 1 ? "#3A2A48" : "#8B7B95", cursor: activePhase === 1 ? "default" : "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              ← Previous
            </button>
            <button onClick={() => activePhase < PHASES.length && setActivePhase(activePhase + 1)} disabled={activePhase === PHASES.length}
              style={{ padding: "10px 20px", background: activePhase === PHASES.length ? "transparent" : `${PHASES[activePhase]?.color || phase.color}0D`, border: `1px solid ${activePhase === PHASES.length ? "transparent" : (PHASES[activePhase]?.color || phase.color) + "22"}`, borderRadius: 8, color: activePhase === PHASES.length ? "#3A2A48" : PHASES[activePhase]?.color || phase.color, cursor: activePhase === PHASES.length ? "default" : "pointer", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
              Next: {PHASES[activePhase]?.title || "Done"} →
            </button>
          </div>
        </main>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div onClick={() => setShowAuthModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#14101D", border: "1px solid rgba(123,79,171,0.15)", borderRadius: 12, padding: 32, width: 340, maxWidth: "90vw" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>{authMode === 'signin' ? 'Sign in' : 'Create account'}</h3>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#8B7B95" }}>Sync your progress across devices</p>
            <form onSubmit={handleAuth}>
              <input type="email" placeholder="Email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required
                style={{ width: "100%", padding: "10px 12px", background: "rgba(123,79,171,0.05)", border: "1px solid rgba(123,79,171,0.15)", borderRadius: 6, color: "#DDD4E5", fontSize: 13, marginBottom: 8, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              <input type="password" placeholder="Password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required minLength={6}
                style={{ width: "100%", padding: "10px 12px", background: "rgba(123,79,171,0.05)", border: "1px solid rgba(123,79,171,0.15)", borderRadius: 6, color: "#DDD4E5", fontSize: 13, marginBottom: 12, outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
              {authError && <p style={{ fontSize: 12, color: authError.includes('Check your email') ? '#B894D4' : '#7B4FAB', margin: "0 0 12px" }}>{authError}</p>}
              <button type="submit" disabled={authSubmitting}
                style={{ width: "100%", padding: "10px", background: "#7B4FAB", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: authSubmitting ? "wait" : "pointer", fontFamily: "'DM Sans', sans-serif", opacity: authSubmitting ? 0.7 : 1 }}>
                {authSubmitting ? '...' : authMode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </form>
            <p style={{ margin: "16px 0 0", fontSize: 12, color: "#8B7B95", textAlign: "center" }}>
              {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setAuthError(''); }} style={{ color: "#7B4FAB", cursor: "pointer" }}>
                {authMode === 'signin' ? 'Sign up' : 'Sign in'}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
