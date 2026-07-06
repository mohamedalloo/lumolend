# LumoLend

**AI finds it. A human funds it.**

A three-surface mortgage experience: an AI pricer that feels like a game, a verification engine that turns pricing into proof, and a command deck that hands the best human MLO everything they need to close the loan on the fastest possible path.

## The three surfaces

### 1. `index.html` — The Pricer
A conversational pricing journey (purchase, refi, DSCR, STR, fix & flip, HELOC). Every answer moves a live HUD — loan, rate estimate, monthly payment — in real time. Ends at indicative pricing across three structures and a gate that locks the scenario into a **LoanFile**.

- Tron-grid aesthetic, circuit-board progress, section-complete interstitials
- Flow-specific logic: DSCR coverage math, bridge LTC caps, HELOC DTI + CLTV ceilings, VA routing, bank-statement income detection
- Exit-intent save-run capture
- On lock: builds a structured LoanFile and hands off to pre-approval

### 2. `preapprove.html` — The Scenario Review
Three one-tap confirmations (identity & contact, property address, scenario snapshot), each with a live terminal-style scan of the borrower's own inputs. The centerpiece: a **review-readiness meter** and a **rate band that visibly narrows** as the file firms up. At 100% the scenario is queued for loan-officer review. No letters are auto-generated — pre-approvals are issued by the loan officer after review.

### 3. `desk.html` — The MLO Command Deck
The internal view. The borrower's file arrives fully assembled — nothing gets re-asked. For every file the deck generates:

- **Fastest Path to Clear-to-Close** — a day-by-day task sequence, each task owned by AI, MLO, or borrower, tailored to the file (trust vesting → title review day 1; bank statements → deposit analysis first; contract clock → rush appraisal)
- **Risk Radar** — structural flags computed from the run (tight DTI, thin DSCR coverage, projection haircuts, CLTV ceiling conflicts) each with the fix attached
- **Lender Routing** — match-scored lender panel with turn times, re-ranked per file
- **First-Call Talking Beats** — a personalized call script so the MLO's first 12 minutes land
- **Run Replay** — every borrower answer, verbatim, with verification status

## Architecture

```
lumolend/
├── index.html          # Pricer — self-contained (single-file artifact)
├── preapprove.html     # Pre-approver
├── desk.html           # MLO command deck
└── assets/
    ├── theme.css       # Shared design tokens & primitives
    └── core.js         # Helpers, LoanFile persistence, pricing firm-up, demo data
```

**State handoff.** A `LoanFile` JSON travels between surfaces two ways at once: URL hash (`#f=<base64>`) for portability, `localStorage` (`lumolend_file` + `lumolend_pipeline`) for persistence. Works from `file://` with zero backend.

**Pricing firm-up model.** `firmedBand()` in `core.js`: each completed verification removes a share of the indicative spread; a fully verified file keeps ~22% of the original band. The floor creeps up slightly as the band tightens — honesty over theater.

## Run it

No build, no server. Open `index.html` in a browser. Or:

```bash
npx serve .
```

Run a full journey → lock the scenario → complete verifications → generate the letter → route to desk. The desk also seeds three demo files so it's never empty.

## Status / disclaimers

Prototype. Nothing is auto-verified or auto-approved — every scenario is reviewed by a loan officer, and pre-approval letters are issued only after review. Rates are illustrative indicative ranges, not offers or commitments to lend. NMLS #2732105 · Equal Housing Lender.

## Roadmap

- Real integrations: soft-pull bureau, Plaid-style asset/VOE, pricing engine (OB/Polly)
- LoanFile → LOS handoff (Encompass/BytePro) from the desk
- Borrower/MLO shared timeline with live status
- A/B harness on journey copy & step order
