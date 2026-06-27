# SendMyForm — Revenue Placement Map
## Ad Strategy + Ko-fi Integration Guide

---

## THE RULE: Ads earn revenue. Ko-fi earns loyalty. Never mix them on the same view.

---

## PAGE-BY-PAGE MAP

### ✅ SHOW ADS — These pages are public, high traffic, appropriate for AdSense

| Page | Ad Slots | Ko-fi? | Notes |
|------|----------|--------|-------|
| `/` Homepage | hero_bottom, features_top, faq_top | Banner in footer | Keep ads between sections, not inside hero |
| `/success` | top leaderboard, bottom leaderboard | ✅ Banner (middle) | Ko-fi REPLACES middle ad — better ROI |
| `/tools/form-generator` | top, bottom | Minimal button in toolbar | Developers = high donation rate |
| `/blog/[slug]` | in-article (after intro), end of post | Inline card at end | Blog readers are most tolerant of ads |
| `/integrations/[slug]` | bottom only | Inline card | One ad max — devs hate ad-heavy docs |
| `/vs/[slug]` | bottom only | None | Comparison pages need trust, fewer distractions |
| `/use-cases/[slug]` | bottom only | None | Commercial intent pages — keep clean |

---

### ❌ NO ADS — Remove AdSense from these pages immediately

| Page | Why No Ads | What to Show Instead |
|------|-----------|---------------------|
| `/docs` and `/docs/*` | Kills E-E-A-T, destroys developer trust, hurts US SEO ranking | Ko-fi inline card in sidebar only |
| `/dashboard` and `/dashboard/*` | Users are logged in, using the product. Ads feel like betrayal | Ko-fi inline card in sidebar bottom |
| `/dashboard/project/*` | Same reason | Nothing — keep it clean |
| `/admin/*` | Internal tool | Nothing |
| `/login`, `/signup` | Conversion page — ads distract from signup | Nothing |
| `/pricing` (future) | Commercial intent, ads distract from CTA | Nothing |

---

## EXACT CODE CHANGES NEEDED

### 1. Remove AdSense from `/docs/page.tsx`
```tsx
// DELETE these 3 lines:
import AdSense from "@/components/AdSense";
<AdSense adSlot="docs_quickstart_bottom" />
<AdSense adSlot="docs_examples_bottom" />
<AdSense adSlot="docs_footer" />

// ADD in the right sidebar or after the last section:
import KoFiWidget from "@/components/KoFiWidget";
<KoFiWidget variant="inline" />
```

### 2. Remove AdSense from `/dashboard/page.tsx`
```tsx
// DELETE these 3 lines:
<AdSense adSlot="dashboard_sidebar_bottom" adFormat="vertical" />
<AdSense adSlot="dashboard_overview_middle" />
<AdSense adSlot="dashboard_project_middle" />

// ADD at the very bottom of the dashboard sidebar:
<KoFiWidget variant="inline" className="mt-auto" />
```

### 3. Update `/success/page.tsx`
```
BEFORE: top ad + hero + MIDDLE AD + privacy badge + bottom ad
AFTER:  top ad + hero + KO-FI BANNER + privacy badge + bottom ad
```
→ See success-page.tsx in this update package

### 4. Update `src/lib/themes.ts`
Replace the "Achaia Labs Partner" ad block in emails with the Ko-fi block.
→ See themes.ts in this update package

### 5. Update `Footer.tsx`
Add Ko-fi banner above the link grid + minimal button in bottom bar.
→ See Footer.tsx in this update package

---

## WHY KO-FI IN DOCS AND DASHBOARD (NOT ADS)

### The developer psychology argument:

A developer reading your docs is in **learning mode** — they're trying to solve a problem. 
An ad interrupts that. They close the tab and go to a competitor's docs.

The same developer, after it works, is in **gratitude mode** — they just saved hours.
A Ko-fi ask at that moment ("it's free, but if it helped, buy us a coffee") converts.

Real conversion rates from similar developer tools:
- AdSense CTR on docs pages: **0.2–0.5%** (very low — devs use ad blockers)
- Ko-fi conversion from docs: **1–3%** of regular users donate within 30 days
- Ko-fi from success page: **2–5%** (peak goodwill moment)

### The SEO argument:

Ads in docs pages = lower E-E-A-T score from Google = lower US rankings.
No ads in docs + clean authoritative content = higher E-E-A-T = better US rankings.
Better rankings = more traffic = more Ko-fi revenue overall.

---

## KO-FI WIDGET USAGE SUMMARY

```tsx
// 3 variants:

// 1. Full-width section (homepage footer, success page, end of blog posts)
<KoFiWidget variant="banner" />

// 2. Compact card (docs sidebar, dashboard sidebar, end of tool pages)
<KoFiWidget variant="inline" />

// 3. Small pill button (nav bar, footer bottom bar, toolbar buttons)
<KoFiWidget variant="minimal" />
```

---

## EMAIL TEMPLATE

The form submission notification email now shows a Ko-fi block instead of
the "Achaia Labs Partner" ad block. This is sent to form owners every time
they get a submission — so they see the Ko-fi ask at peak positive moment
(just got a lead). Much higher conversion than a random ad.

---

## FINAL REVENUE MODEL

```
┌─────────────────────────────────────────────────────┐
│  Revenue Stream 1: AdSense                          │
│  Pages: homepage, success, tools, blog              │
│  Est: $0.50–2.00 CPM initially, grows with traffic  │
├─────────────────────────────────────────────────────┤
│  Revenue Stream 2: Ko-fi                            │
│  Touchpoints: success page, email, footer, docs     │
│  Est: $1–5 per supporter (one-time or monthly)      │
│  Grows as: free users build trust → donate          │
├─────────────────────────────────────────────────────┤
│  Revenue Stream 3: Topical ad partnerships (future) │
│  When you have 10k+ monthly visits, reach out to    │
│  dev tool companies (Netlify, Vercel, Sentry, etc.) │
│  for direct sponsorships at $500–2000/mo            │
└─────────────────────────────────────────────────────┘
```

---

## YOUR KO-FI SETUP CHECKLIST

- [ ] Create account at https://ko-fi.com — use name "SendMyForm" or "Achaia Labs"
- [ ] Set profile photo = SendMyForm logo
- [ ] Write bio: "We build SendMyForm — a 100% free form backend for developers. No plans, no limits. Your support keeps it running."
- [ ] Enable both one-time and monthly support
- [ ] Set a goal (e.g. "Cover server costs: $50/month") — goals convert better than open-ended asks
- [ ] Update `KOFI_URL` in `KoFiWidget.tsx` and `themes.ts` with your real URL
- [ ] Add Ko-fi widget button to your Twitter/X bio and GitHub README

---

*Revenue placement map · SendMyForm · June 2026*
