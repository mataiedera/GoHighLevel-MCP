# GHL-MCP vs BusyBee — Tool Gap Audit

## Totals
| Repo | Tools | Categories |
|------|-------|-----------|
| Your GHL-MCP (fork of mastanley13) | 253 | 19 |
| BusyBee 2026 Complete | 562 | 44 |
| **Gap** | **+309** | **+25** |

## Categories you HAVE (19)
association, blog, calendar, contact, conversation, custom-field-v2, email, email-isv, invoices, location, media, object, opportunity, payments, products, social-media, store, survey, workflow

## Categories MISSING vs BusyBee (25)
affiliates, agent-studio, businesses, campaigns, companies, courses, custom-menus, forms, funnels, links, marketplace, oauth, phone, phone-system, proposals, reporting, reputation, saas, smartlists, snapshots, templates, triggers, users, voice-ai, webhooks, workflow-builder

## High-value merges for Altitude

| Category | Why matters |
|----------|-------------|
| **voice-ai** | CSP cold-call AI qualification, Altitude Club support bot |
| **phone / phone-system** | Click-to-dial, Twilio-like flows inside GHL |
| **forms / funnels** | goaltitude-club-apply forms, altitudepulse-waitlist captures |
| **proposals** | CSP client onboarding proposals (sales collateral) |
| **reporting** | Engagement reports per sub-account (CSP clients) |
| **triggers** | Event-driven automations for Pulse nudges, trial conversions |
| **campaigns** | Full email/SMS drip programmatic control |
| **users** | CSP team management across sub-accounts |
| **webhooks** | Programmatically register webhooks (daily-pulse-sync, Kartra sync) |
| **snapshots** | Clone sub-account templates (multi-CSP client rollout) |
| **workflow-builder** | Programmatic workflow creation, not just trigger |
| **saas** | SaaS mode config for CSP Agency tier |

## Nice-to-have (lower priority)
affiliates, agent-studio, businesses, companies, courses, custom-menus, links, marketplace, oauth, reputation, smartlists, templates

## Merge strategy
1. Copy BusyBee `src/tools/*.ts` for the 12 high-value categories into your `src/tools/`
2. Adjust imports, types to match your API client shape
3. Register new tools in `src/server.ts` and `src/http-server.ts`
4. Test each category incrementally

## Alternative
Skip merge. Run BOTH servers in Claude. Register BusyBee as second MCP alongside your custom one. Simpler but duplicates namespace.

