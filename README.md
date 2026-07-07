# Kybalion Protocol

> **A 7-dimension evaluation protocol for Intentional Systems.**
> Derived from the Seven Hermetic Principles, translated into a formal protocol
> for evaluating software architectures, AI agents, and creative content.

---

## What is this?

The **Kybalion Protocol** is a framework built around 7 universal dimensions to answer a single question:

> *Is this Intentional System fundamentally sound?*

An **Intentional System** is any structure built by a mind (human or artificial) to achieve a specific purpose — such as a software feature, an AI agent, a database index, or a video campaign. 

The protocol evaluates these systems across **7 orthogonal dimensions**. The output is a **radar**, not a score: a visual shape that makes gaps immediately visible without collapsing distinct signals into a single, misleading number.

---

## Why a radar and not a score?

A single score destroys information. A product with Traceability at 10 and everything
else at 90 might score 74 overall — which looks fine. It isn't fine. A radar makes
the hole visible instantly.

```
        Clarity
           ●
      ●         ●
  Bal.    ·     Fidelity
      ●         ●    ← Traceability = 10 (the hole)
           ·
        Energy
```

**The shape of the radar IS the diagnosis.**
A full, symmetric shape → fundamentally sound.
A collapsed edge → a critical gap.

---

## The 7 Dimensions

| # | Dimension | Hermetic Law | Core Question |
|---|-----------|-------------|---------------|
| 1 | 🧠 **Clarity** | Mentalism | Does it communicate a single, clear intention? |
| 2 | 🪞 **Fidelity** | Correspondence | Does the output match what was intended? |
| 3 | ⚡ **Energy** | Vibration | Is the energy calibrated to the content? |
| 4 | 🎯 **Contrast** | Polarity | Does it have enough tension to sustain attention? |
| 5 | 🌊 **Flow** | Rhythm | Does it respect the natural rhythm of attention? |
| 6 | 🔄 **Traceability** | Cause & Effect | Can decisions be traced back to measurable outcomes? |
| 7 | ⚖️ **Balance** | Gender | Does it balance structure and emotional resonance? |

Full specs: [DIMENSIONS.md](./DIMENSIONS.md)

---

## The Three Pillars of Evaluation

To simplify high-level reporting, the 7 dimensions are grouped into **Three Pillars** representing the fundamental forces of any system:

```
      [ PILLAR OF FORCE ]          [ PILLAR OF FORM ]          [ PILLAR OF SYNTHESIS ]
      (Expansion / Intent)          (Rigor / Constraints)           (Integration)
         
         🧠 Clarity                    🪞 Fidelity                 ⚖️ Balance
         ⚡ Energy                     🎯 Contrast                 🌊 Flow
                                                                   🔄 Traceability
```

### 1. The Pillar of Force (Intent & Vitality)
* **Score:** `mean(clarity, energy)`
* **Focus:** The creative drive, clarity of vision, and active energy of the system.
* **Failure mode (Low Force):** Apathetic, boring, or bloated features without a clear purpose.

### 2. The Pillar of Form (Rigor & Constraints)
* **Score:** `mean(fidelity, contrast)`
* **Focus:** The boundaries, error controls, and alignment with target specifications.
* **Failure mode (Low Form):** Unstable, buggy, or hallucinating features without guardrails.

### 3. The Pillar of Synthesis (Integration & Experience)
* **Score:** `mean(balance, flow, traceability)`
* **Focus:** User ergonomics, narrative structure, and closed-loop data feedback.
* **Failure mode (Low Synthesis):** Intimidating, disjointed, or blind features running without analytics.

---

## No-Code & Visual Tools

You do not need to be a developer to use the Kybalion Protocol in your projects. The repository provides out-of-the-box tools for creators, product managers, and designers:

*   **Interactive Web App (GitHub Pages):** Drag sliders, click checklists, and generate your custom radar chart SVG and PDF reports directly in your browser. (Link: `https://kybalion-protocol.github.io`).
*   **Notion Template:** Duplicate the official workspace to track features, log scores, and automatically calculate maturity and symmetry coefficients inside your Notion database.
*   **Google Sheets Template:** Copy the pre-built spreadsheet with native radar charts and automatic formulas to run manual team evaluations.
*   **Markdown Templates:** Find copy-pasteable templates for quick-checks and manual reviews inside the `/templates` folder.

---

## Three modes of use

The protocol meets you where you are. Start with Mode 1 — upgrade only if you need to.

---

### Mode 1 — Quick Check *(5 minutes, no code)*

Seven yes/no questions. No adapters, no infrastructure. Any team can do this
in a planning meeting with a whiteboard.

```
[ ] Clarity:      Is there ONE clear intention behind this?
[ ] Fidelity:     Does the output match what was planned?
[ ] Energy:       Is the energy calibrated to the content/context?
[ ] Contrast:     Is there enough tension to sustain attention?
[ ] Flow:         Does it flow naturally from start to finish?
[ ] Traceability: Can we measure the impact of our decisions?
[ ] Balance:      Does it balance technical rigor with human resonance?
```

**Scoring:** each `yes` = 1 point. Read the result as a gate:

| Yes answers | Reading |
|-------------|---------|
| 7 / 7 | Ship it |
| 5–6 / 7 | Ship with known gaps — document them |
| 3–4 / 7 | Needs work before shipping |
| < 3 / 7 | Reconsider the scope or intent |

---

### Mode 2 — Scored Evaluation *(30 minutes, manual)*

Each dimension is scored 0–100 by the team, using the rubrics in [DIMENSIONS.md](./DIMENSIONS.md).
No code required. Output is a `KybalionReport` filled manually.

```json
{
  "dimensions": {
    "clarity":      { "score": 85, "gap": null, "insight": "Clear hook, one message." },
    "fidelity":     { "score": 90, "gap": null, "insight": "Output matches spec." },
    "energy":       { "score": 55, "gap": "Audio energy misaligned with cut rate.", "insight": "..." },
    "contrast":     { "score": 70, "gap": null, "insight": "..." },
    "flow":         { "score": 60, "gap": "Plateau detected at 1:30.", "insight": "..." },
    "traceability": { "score": 20, "gap": "No feedback loop from decisions to outcomes.", "insight": "..." },
    "balance":      { "score": 65, "gap": "Weak emotional resonance.", "insight": "..." }
  },
  "maturity": "growing",
  "critical_gap": "traceability",
  "top_recommendation": "Close the traceability loop first."
}
```

Note: **no `overall_score`**. The radar is the output, not a number.

---

### Mode 3 — Automated Evaluation *(adapter-based)*

Domain-specific adapters compute scores automatically. Best for teams that
want to run evaluations at scale or in CI/CD pipelines.

```typescript
import { KybalionEvaluator } from 'kybalion-protocol';

const evaluator = new KybalionEvaluator({
  clarity:      myClarityAdapter,
  fidelity:     myFidelityAdapter,
  energy:       myEnergyAdapter,
  contrast:     myContrastAdapter,
  flow:         myFlowAdapter,
  traceability: myTraceabilityAdapter,
  balance:      myBalanceAdapter,
});

const report = await evaluator.evaluate(context);
// → KybalionReport (same shape as Mode 2, computed automatically)
```

How to build adapters: [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## Maturity levels

Maturity is defined by how many dimensions score ≥ 70 — not by the average.

| Dimensions ≥ 70 | Maturity | Reading |
|-----------------|----------|---------|
| 0–1 | `seed` | Concept only — not ready |
| 2–3 | `sprouting` | Useful but fragile |
| 4–5 | `growing` | Solid — worth full investment |
| 6 | `mature` | Fundamentally sound |
| 7 (+ traceability loop closed) | `complete` | Self-improving system |

**Critical rule:** Traceability at < 30 overrides maturity to `growing` regardless
of other scores. A product flying blind is not mature, no matter how good it looks.

---

## Where it works

The same 7 dimensions apply across domains:

| Domain | Adapter |
|--------|---------|
| 🎬 Video editors | [FrameOracle adapter](./adapters/frameoracle/) — reference implementation |
| 🛒 E-commerce | Product listing: description ↔ photos ↔ conversion |
| 🎙️ Podcasts | Episode arc, voice energy, narrative flow |
| 🖥️ SaaS products | Feature adoption, onboarding, analytics loop |
| 📣 Marketing | Campaign clarity, promise ↔ delivery, emotion vs. logic |
| 🤖 AI systems | Prompt clarity, output fidelity, decision traceability |
| 📚 Education | Learning objective, content arc, outcome measurement |

---

## Repository structure

```
kybalion-protocol/
├── README.md               ← you are here
├── WHY.md                  ← justification and best practices
├── MANIFESTO.md            ← The Kybalion of Software
├── DIMENSIONS.md           ← full spec for each of the 7 dimensions
├── SPEC.md                 ← KybalionReport type definition
├── CONTRIBUTING.md         ← how to build adapters
├── core/                   ← language-agnostic core
│   ├── types/              ← KybalionReport, DimensionScore, EvalContext
│   └── evaluator/          ← KybalionEvaluator (Mode 3)
├── adapters/
│   ├── frameoracle/        ← reference implementation (video editor AI)
│   └── _template/          ← starter template
└── examples/
    ├── quick-check.md      ← Mode 1 walkthrough
    ├── scored-eval.md      ← Mode 2 walkthrough
    └── automated.md        ← Mode 3 walkthrough
```

---

## Reference implementation

**FrameOracle** is where the protocol was born and proven. Its adapters live
in the FrameOracle codebase and consume this package as a dependency — the
core never imports anything from FrameOracle (see roadmap, Phase 4).

---

## Roadmap

- [x] **Phase 1 — Documentation**: 7 dimensions, manifesto, WHY, maturity model
- [x] **Phase 2 — Specification**: formal `KybalionReport` type + SPEC.md
- [x] **Phase 3 — Core**: `KybalionEvaluator` + Mode 1/2 quick-start tools
- [ ] **Phase 4 — FrameOracle adapter**: reference implementation extracted as adapter
- [ ] **Phase 5 — Public release**: `npm install kybalion-protocol` + PyPI + docs site

---

## Philosophy

> *"The Principles of Truth are Seven; he who knows these, understandingly,
> possesses the Magic Key before whose touch all the Doors of the Temple
> fly open."* — The Kybalion (1908)

The protocol borrows the structure of the Seven Hermetic Principles as a
philosophical anchor — not as mysticism. The value is in the **completeness
and orthogonality** of the 7 axes: together they cover every failure mode
of any creative or technical product.

---

## License

MIT — see [LICENSE](./LICENSE)
