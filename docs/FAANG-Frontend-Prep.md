# FAANG Frontend Preparation — LLD, Machine Coding & HLD

This guide is a focused, high-impact checklist and exercise set for preparing frontend interviews at FAANG-level companies. It prioritizes component-level Low-Level Design (LLD), practical Machine Coding problems you will implement, and High-Level Design (HLD) system prompts. For each item you'll find what to do, acceptance criteria, and which React/JS topics you exercise.

---

## How to use this file
- Pick a weekly cadence: 2 LLD exercises, 2 machine-coding problems (1 timed), and 1 HLD writeup/mock per week. Adjust for your 1–2 month timebox.
- For each LLD prompt: produce an LLD doc (API, state machine, keyboard/a11y, tests) and implement one variant in a sandbox (component + tests + stories).
- For machine coding: timebox to 45–60 minutes, then write clean-up tests and edge-case notes.
- For HLD: create 1–2 page diagrams and tradeoffs; record a 5–10 minute spoken walkthrough.

---

## LLD (Component-Level) — Core prompts
For each prompt: create a small design doc, implement a basic production-ready component, add unit tests, and write a Storybook story or small demo.

- Design DataTable
  - Goal: sortable, filterable, selectable, virtualized table for large datasets.
  - Deliverables: `DataTable` API doc (props, events), a simple implementation supporting pagination or virtualization, tests for sorting/selection, a11y checks (keyboard navigation, aria attributes).
  - Focus areas: virtualization (windowing), memoization (React.memo/useMemo), keying & identity, controlled vs uncontrolled, accessibility.

- Design Modal/Dialog System
  - Goal: accessible modal with focus trap, stacking, portal usage, and close behaviors.
  - Deliverables: `Dialog` API and state machine, implementation with focus management, tests for open/close/focus trapping.
  - Focus areas: portals, focus management, keyboard handling (Esc, tab), ARIA roles.

- Design Image component + Proxy
  - Goal: robust `Image` that supports responsive sizes, lazy-loading, fallback and optional proxy for third-party hosts.
  - Deliverables: API doc, discussion of `next/image` tradeoffs, a small proxy plan or simplified implementation, tests for fallback.
  - Focus areas: responsive images, lazy-loading, caching headers, security (CORS), edge/SSR integration.

- Design Autocomplete / Typeahead
  - Goal: fast UX for suggestions with debounce, cancellation, and keyboard navigation.
  - Deliverables: component API, implementation with debounce + abort controller, keyboard tests, caching strategy.
  - Focus areas: debouncing, request cancellation, caching, keyboard accessibility.

- Design Button (production-grade)
  - Goal: reusable `Button` with variants, sizes, loading and disabled states, `as`/`asChild` pattern.
  - Deliverables: Button component, tests for click behavior and disabled/loading, LLD doc.
  - Focus areas: composition, polymorphic components, accessibility (aria-disabled), keyboard interactions.

- Design Form primitives / small form library
  - Goal: ergonomics for forms with validation (sync + async), controlled/uncontrolled modes.
  - Deliverables: design doc for `useForm` or `Field` primitives, handling async validators and debounced validation.
  - Focus areas: state management, referential stability, validation patterns.

LLD Checklist (what interviewers expect)
- Clear API: props, events, default behaviors.
- State model: external vs internal state, finite state machine if applicable.
- Accessibility: keyboard, ARIA roles, screen reader notes.
- Tests: unit + interaction tests for critical flows.
- Performance: memoization, virtualization, render budgets.
- Tradeoffs & alternatives: why chosen design.

React / JS topics touched by LLD
- React component patterns (composition, polymorphic `as`), hooks, memoization, refs and imperative handles, portals, SSR/CSR concerns, accessibility, event handling.

---

## Machine Coding (Implementations) — Priority problems
Practice timed implementations; after coding, add tests and complexity analysis.

- LRU Cache (core DS)
  - Implement `get(key)` and `put(key, value)` with O(1) operations.
  - Extension: add TTL expiration.
  - Topics: doubly-linked list + hashmap, complexity analysis, clean API.

- Autocomplete with remote suggestions
  - Implement debounce, request cancellation (AbortController), caching of results, keyboard navigation.
  - Topics: async flows, debouncing, caching layers, UX edge cases.

- Virtualized List (simplified)
  - Implement range calculation for visible rows given scroll position + container height; render a simple visible subset.
  - Topics: performance, reflow, virtualization strategies.

- Worker Pool / Concurrency Queue
  - Implement a function that runs N concurrent promises at a time and resolves when all complete.
  - Topics: concurrency control, promise orchestration.

- Rate limiter (token-bucket)
  - Implement a client-side rate limiter to throttle outgoing requests.
  - Topics: timing, fairness, correctness under burst traffic.

- Merge intervals / calendar booking
  - Classic interval problems: insert & merge, availability queries.
  - Topics: sorting, greedy algorithms.

- Expression evaluator / template mini-engine (secure)
  - Implement a small safe evaluator for expressions used in UI templates.
  - Topics: parsing, sandboxing, security.

Machine Coding Checklist
- Clarify assumptions and edge cases first.
- Provide example inputs and outputs.
- Write correct, readable code; comment non-obvious parts.
- Add tests for edge cases and complexity notes.
- Optimize if time permits and explain tradeoffs.

JS/React topics strengthened by machine coding
- Data structures (maps, linked lists, heaps), algorithms, asynchronous programming (Promises, async/await), AbortController, event batching, performance tradeoffs.

---

## HLD (System Design) — High-impact prompts
For HLD exercises create a 1–2 page writeup + 2 diagrams (component interaction and data flow). Practice a spoken 5–8 minute walkthrough.

- Product Feed at Scale
  - Requirements: personalized feed, low latency, pagination/continuations, read-heavy.
  - Include: feed generation model (fan-out vs fan-in), cache strategy, personalization, pagination tokens, data stores (Redis, primary DB), consistency & rehydration, monitoring.
  - Topics: caching, CDNs, queues, sharding, personalization models.

- Image Pipeline & CDN with Proxy
  - Requirements: accept arbitrary image URLs, serve optimized sizes, protect origin, cache effectively.
  - Include: proxy architecture, resizing service, signed URLs, cache-control headers, virus/content scanning considerations, cost tradeoffs.
  - Topics: CDN edge, resizing workers, signed URLs, security.

- Real-time Notifications & Alerts
  - Requirements: in-app + email, de-duplication, low-latency delivery, scalability.
  - Include: pub/sub (Kafka/PubSub), push channels (websocket, SSE, push), backoff & retries, dedupe storage, observability.

- Auth & Session Management (SSR + services)
  - Requirements: secure session handling, refresh tokens, service-role separation, cron/service endpoints.
  - Include: cookie strategies, token refresh flows, secure storage, rotation and revocation, role-based access, least privilege.

- Offline-first PWA sync
  - Requirements: offline CRUD, conflict resolution, background sync.
  - Include: local-first storage (IndexedDB), sync queues, CRDT vs last-write-wins strategies, user-visible merge UI.

HLD Checklist
- Clarify scale, SLAs, read/write ratios.
- Show component diagram: clients, edge, API, caches, data stores, background workers.
- Discuss data models and flows for critical paths.
- Failure modes and mitigation (retries, timeouts, fallbacks).
- Security considerations and cost tradeoffs.
- Observability: metrics, logs, tracing, SLOs.

Skills & topics touched by HLD
- Networking and caching, storage choices (SQL/NoSQL), queues, CDN, security (auth, signing), scaling strategies, availability vs consistency tradeoffs.

---

## Compact Study Plan (4–8 weeks)
- Week A (LLD heavy): 2 LLD components (implement one fully), 1 machine problem, 1 short HLD writeup.
- Week B (Machine focus): 3 machine problems (2 timed), 1 LLD writeup + tests, 1 HLD mock.
- Repeat pattern; increase problem difficulty and HLD depth.

Daily micro-routine (60–90 minutes)
- 30–45m: focused coding (machine problem or component implementation). 15m: tests/refactor. 15–30m: review or HLD writing.

Mock interview cadence
- 1 full mock/week: alternate between coding and HLD. Record and review. Pair with a peer or platform.

---

## Evaluation rubric (self-review)
- For each exercise write a short self-score (1–5) on: correctness, clarity, performance, edge-case handling, tests, accessibility (for components), and tradeoff reasoning (for HLD).

## Resources & tooling
- Reading: "Designing Data-Intensive Applications" (select chapters), "Refactoring UI", React docs (Hooks, Concurrent Patterns), WAI-ARIA Authoring Practices.
- Practice platforms: LeetCode (Blind75), AlgoExpert, Interviewing.io, Pramp.
- Tools: Storybook, Vitest/Jest, React Testing Library, Playwright, Lighthouse.

---

## Quick starter checklist (first 7 days)
1. Implement `Button` component (LLD deliverable) with tests and a story. Focus: API clarity and accessibility.
2. Solve 3 timed machine problems (LRU cache, merge intervals, debounce/autocomplete). Timebox 45–60m each.
3. Write one HLD (Product Feed) document and record a 5-minute walkthrough.

---

If you want, I can scaffold the `Button` component and tests in this repo, or generate three timed machine-coding problems for a live session. Tell me which to start and I'll create the files and tasks.

Good luck — plan deliberately, keep each session focused, and iterate from feedback.
