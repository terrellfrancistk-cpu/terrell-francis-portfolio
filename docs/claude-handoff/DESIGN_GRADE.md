# DESIGN_GRADE — terrellfrancis.app

Standing rule (Nov 18, 2026): grade every screen on **white space, hierarchy and alignment**, and keep one design language across tkhub.app, the product sites, iOS, Android and the web apps.

Graded Nov 18 from full-page captures of the live build `64da6017edc73e0b`, phone (390 px) and desktop (1280 px), light theme. A = nothing to fix; B = small flaw; C = needs work.

| Section | White space | Hierarchy | Alignment | Notes |
|---|---|---|---|---|
| Header | A | A | A | Mark, signature, nav and Resume sit on one baseline |
| Hero + Now cards | A | A | A | Name is the largest thing on the page; one primary button |
| How I run an implementation | A | A | **B → A** | Phone: first card snapped flush to the screen edge (scroll snapping ate the 20 px gutter). Fixed |
| Impact metrics | A | A | A | Three lead numbers, three supporting; even columns |
| Experience timeline | A | A | A | Dates, dots and titles share one grid |
| Education / Skills | A | A | A | Two columns on desktop, stacked on phone |
| About + principles | A | A | A | Heading left, copy right; three equal cards |
| Case studies | A | A | A | Tabs left, one case right; phone tabs scroll sideways |
| Products grid | A | A | A | Five per row desktop, two per row phone |
| Product studio | A | A | **B → A** | Desktop: app picker wrapped 8 + 2. Now two even rows of five across the panel's width |
| Contact | A | A | A | Email is the largest line; one button |
| Footer | A | A | A | Three columns desktop, stacked phone |

**Fixes made (add/fix only, nothing removed):** `styles.css` "Design grade pass (2026-11-18)"; guarded by `tests/e2e/alignment.spec.mjs`.

**One design language:** this site uses its own personal identity (TF mark, navy + blue, Inter + serif italics). The TK Hub logo appears only as "by TK Hub" on the splash and in the footer, from Terrell's vector master, and each app keeps its own mark and colors in the tiles, per VISION ("One house. Not one skin").

**Not changed (would be a product/layout decision for Terrell):** none open.
