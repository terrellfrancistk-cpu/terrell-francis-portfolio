# PAID_TOOLS — every tool and service the TK Hub chats can use
Packed: Friday, Nov 13, 2026, America/Chicago
Source: ASCENDIUM export `00-START-HERE.md` Part C (13 Nov 2026), plus this house's standing rules.

## Standing rules (every session)
- Use **all** of Terrell's paid and already-installed tools to make the best, most realistic assets and experiences (images, video, 3D, sound, builds). Never ship stock placeholders in a finished build.
- **No new spending**, upgrades, credit top-ups, paid plugins, cloud minutes, domain buys, store fees, or developer-program fees without Terrell's OK on the exact item and cost.
- **Never ask for or use passwords, keys, tokens, or signing secrets.** He signs in himself. Vault entry names only. Never commit `.env`, keystores, or credential-bearing logs.
- Plan facts (Meshy 1,100 credits, Higgsfield Max, etc.) come from the **5 Nov 2026 records** and the **8 Nov handoffs**. They are **not live balance checks**. Verify before assuming credits remain.
- Claude Code tools are verified on the PCs that already have them. **Each Cowork space's connectors depend on how it was set up — mark them verify before relying on them.**
- **Talencia is excluded** from these personal Claude / personal-account sessions. It has its own chat and rules. Do not put Talencia work, code, or company-specific details in these packs or sessions.
- TORQ and Ascendium are **Unreal Engine only**, never Rork. Rork is for the phone apps' simulators and those apps' marketing sites.

Status keys: **working / installed** · **signed-in (Terrell signs in)** · **costs money (needs his OK per use)** · **needs fixing** · **available to add**.

---

## C1. Claude itself (every Claude Code chat on the assigned PC)
| Tool | Use | Status |
|---|---|---|
| Claude Code desktop (Code tab), local sessions per lane | Builds code, runs builds/tests, edits repos, writes docs | working (lanes include Master, Mobile Apps, Websites, Rork Publish, Ads, TORQ, ASCENDIUM; Personal Ops and Talencia are separate and out of scope here) |
| Models: Opus 5.5, Sonnet 5.5, Haiku 5.5, Fable 5.1 | Fable is named for ROLE auto-apply work in the Websites lane | working per plan; weekly usage limits apply (hit 8 Nov, reset 10 Nov). Pace Ultra so it lasts until about a day before weekly reset, then use the remainder. |
| Shell: PowerShell + Git Bash; file read/write/search | Everything local | working |
| Subagents (general-purpose, Explore, Plan, web-fetch) and Workflows | Parallel research, reviews, big multi-step jobs | working (Workflows only when Terrell asks) |
| Cross-session messaging + starting/handing off sessions | Chats coordinate (e.g. ASCENDIUM ↔ TORQ lock agreement) | working |
| Web search + web fetch | Research, name screening, docs | working |
| Built-in browser pane | Opens sites, previews dev servers; Terrell signs in himself | working |
| Claude in Chrome (extension) | Works in Terrell's real Chrome with his sign-ins (Play Console, ad accounts, Rork, Grok publish) | working |
| Computer use | Drives desktop apps (Unreal Editor click-throughs, Epic Launcher) with per-app approval | working |
| Terminal panel | Runs commands in visible tabs | working |
| Gmail connector (tkhub business Gmail) | Search, read, labels, drafts; sending only with his OK on the exact draft | working |
| Claude Docs connector | Shareable living documents | working |
| Artifacts (claude.ai pages) | Private pages, dashboards, reports he can share | working |
| Scheduled tasks / cloud routines | Recurring checks and reports | working (nothing scheduled for ASCENDIUM at export time) |
| Skills: docx, pdf, pptx, xlsx, docs, google-workspace, deep-research, dataviz, artifact-design, computer-use, chrome-browser, built-in-browser, schedule, loop, code-review, security-review, simplify, run, claude-api, skill-creator, plugin-authoring, workflow-authoring, morning brief, memory tools | Ready-made workflows | working |
| MCP registry / plugin catalog | Connect more services (e.g. GitHub, Figma, Notion, Slack) | available to add |
| Memory | Remembers resume points across sessions | working |
| Cowork chats | Same Claude models; connectors depend on how each Cowork space is set up. Earlier cowork handoffs were moved into local Code chats on 8 Nov. | needs fixing — verify each Cowork space's connectors before relying on them |

---

## C2. Game development (TORQ, ASCENDIUM)
| Tool | Use | Status |
|---|---|---|
| Unreal Engine 5.8.4 | Both games | working on the Razer at `C:\Program Files\Epic Games\UE_5.8`. The TK desktop was installing Unreal (Terrell approved that install) so TORQ can run there. Confirm the install before the first TORQ cook on that machine. |
| Epic Games Launcher + Fab | Engine, free Fab/Megascans content, MetaHuman | signed-in (he signs in). No paid Fab/Marketplace buys without OK. |
| Epic City Sample 5.8 (vault, ~105 GB) | Real city buildings, cars, crowds (Unreal projects only, no redistribution) | working — downloaded on the Razer |
| MetaHuman Creator (in UE 5.8) | Photoreal faces/bodies; cloud auto-rig needs Epic sign-in | signed-in needed — no MetaHumans built yet in either game |
| Visual Studio 2022 Community (MSVC 14.44, SDK 10.0.22621) | C++ builds | working (Razer; verify on the TK desktop) |
| Blender 4.5.3 (portable) | Modeling, decimation, FBX export | working at `C:\Users\iterr\tools\blender-4.5.3-windows-x64` on the Razer |
| Android SDK + NDK 27.2 + JDK 21 + ADB + 6 emulator profiles | Android builds and tests | working (Razer; verify on the TK desktop) |
| Git, Git LFS 3.8.1, GitHub CLI | Source control | working. LFS pushes need a storage/bandwidth cost OK first. Never force-push. |
| Python (`py`) + UE's Python 3.11 | Import/automation scripts | working |
| NVIDIA GPU drivers | Rendering (`-preferNvidia`) | working |
| Free asset sources: Poly Haven, ambientCG, Kenney, Microsoft Rocketbox, OpenStreetMap (credit required), Copernicus/SRTM elevation, Google Fonts | Art, textures, HDRIs, map data | working — keep provenance in CREDITS.md |
| Free tools to install only if needed: Android Studio, FFmpeg, RenderDoc, GIMP/Krita, Audacity, VS Code | Debugging, video, textures, audio | available to add (tell Terrell first) |
| Mac with Xcode | iOS builds for any app/game | needs fixing — needs a Mac (a historical MacBook host exists). No paid cloud Mac without OK. |
| Console SDKs and dev kits (PlayStation, Xbox, Nintendo) | Console ports | available to add — needs developer-program approval for TK Hub LLC and his cost OK |

Machine split (do not share a compile queue): **TORQ = TK desktop** (machine `a68617a6-4945-40d1-83ca-297d29cf94d8`, label **Tk**). **ASCENDIUM = Razer laptop** (machine `986c5019-f5cd-436d-9fd7-8b969f7ae3a0`, label **TkRazor**). If both Unreal jobs ever run on the same PC, use the lock file `C:\dev\.unreal-lock` (`<chat> \| <what> \| <start CT>`).

---

## C3. AI generation and creative
| Tool | Use | Status |
|---|---|---|
| Meshy AI (Pro, 1,100 credits/month on the 5 Nov record) | Text/image-to-3D models (props, vehicles, costume pieces, buildings) | signed-in + costs money. Passwordless email-code sign-in; codes still go to the **paused Grok inbox** — **move Meshy to Terrell's own email**. No API key is set up; if automation is wanted, he puts the key in an environment variable himself (never ask for or type it). OK credits per batch. Verify commercial rights per generation. TORQ and ASCENDIUM have **not used Meshy yet**. Prefer Blender/CC0 until sign-in and a credit OK are in place. |
| Higgsfield (Max monthly on record, Google SSO) | AI video: trailers, promo footage, ad creative, cinematic references | signed-in + costs money. No generation or top-up without OK. |
| Holo (Starter; Scale upgrade pending) | Ad creative (Ads lane) | signed-in + costs money. Do not upgrade without OK. |
| Grok (xAI) | Hosts and publishes ROLE (tryrole.app) and Apex (Publish in Grok); old Grok bots are paused | signed-in (Grok inbox paused). He presses Publish. Do not publish without OK. |
| Claude (above) | Code, writing, research, design docs | working |
| Add if wanted (all need his OK): Mixamo animations (free, Adobe sign-in), Cesium for Unreal (free plugin) + Cesium ion, Google Map Tiles API / Photorealistic 3D Tiles (Google Cloud account, billing, attribution and terms), voice (e.g. ElevenLabs), music licensing, motion capture | Optional world/avatar/audio upgrades | available to add + costs money where noted. TORQ's standing rule has been **Google Earth for looking only** — do not stream Google 3D Tiles until he picks a globe source (see Ascendium `OPEN_DECISIONS.md`). |

GUI-only tools run on House Officer's box; list exact asset requests (prompt, size, format, destination path) in `HANDOFF_TO_HOUSE_OFFICER.md`.

---

## C4. App building and publishing
| Tool | Use | Status |
|---|---|---|
| Rork | Builds the TK Hub **mobile apps** (per-app Rork projects; web / iOS / Android simulators) and those apps' marketing sites | signed-in + costs money (credits need OK). No Rork branding visible. **Not** the build path for TORQ or ASCENDIUM. Do not type in a Rork chat or press Publish. |
| GitHub `terrellfrancistk-cpu` | All repos (tryrole, rork-*, terrell-francis-portfolio, wrace-unreal, …), Actions, Pages | signed-in. **Needs fixing:** Actions fail to start on tryrole and rork-afterglow-live (billing); payment-method switch and 2FA before 7 Dec. He handles sign-in/2FA. |
| GitHub Pages | terrellfrancis.app (portfolio) deploys from main via pages.yml | working |
| Porkbun | Domains and static hosting | signed-in (vault fill locked: don't retry). No domain buy without a cost OK. |
| Vercel (team tkhub / tkhub2) | Some sites; **not** for ROLE or Apex | signed-in |
| Cloudflare | Turnstile and related protection | signed-in |
| Supabase (Pro active) | App backends/databases | signed-in + costs money. Do not copy one app's project into another. |
| Stripe | Payments for TK Hub products | signed-in. Test vs live keys stay separated. Never commit keys. |
| Twilio | SMS/phone features | signed-in. SMS only if the campaign is approved. |
| Sign-in providers: Google, Apple, X, Facebook, Microsoft | App sign-in | signed-in |
| Google Play Console (TK Hub LLC) | Android releases (Zilt promotion/review pending; trader-status declaration before Feb 2027) | signed-in. Play production usage fixes are permanent priority #1 for live apps. |
| App Store Connect / TestFlight (TK Hub LLC) | iOS releases; banking not done | signed-in + needs fixing (banking). No submit without OK. |
| AdMob | In-app ads (Zilt review) | signed-in + needs fixing |
| Future stores: Steamworks/Steam Direct (fee), Epic Games Store, PlayStation Partners, ID@Xbox, Nintendo Developer Portal | Game releases | available to add + costs money. Steam + iOS + Android first for TORQ and ASCENDIUM; consoles later. |

---

## C5. Marketing, ads and email
| Tool | Use | Status |
|---|---|---|
| Google Ads (TK Hub LLC) | Search/app-install campaigns | signed-in + needs fixing (balance to pay; spend to verify). No spend without OK. |
| Meta Ads (TK Hub LLC) | Social ads | signed-in + needs fixing (disabled after a declined payment). Do not re-enable or spend without OK. |
| Holo, Higgsfield | Ad creative | signed-in + costs money |
| Gmail (tkhub business inbox connected; a separate real-estate inbox exists) | Business email | working / signed-in |
| Support inboxes | Booked, NOIR, WRACE/TORQ support addresses already in use — do not invent a new inbox | signed-in |

---

## C6. The TK Hub portfolio these tools serve
- **Apps** (each session owns the app and its website, target 100% / "PERFECT"): ROLE, RADR, Booked, Apex, NOIR, AfterGlow, Zilt, Curb, Our People, plus the two website-only sessions (tkhub.app, terrellfrancis.app).
- **Sites:** tryzilt.app, getoncurb.app, trybooked.app, tryafterglow.app, tryourpeople.app, trynoir.app, apexpeakofcare.app, terrellfrancis.app, tkhub.app, tryrole.app.
- **Games:** TORQ (Unreal, driving; Steam + iOS + Android first, then consoles) and ASCENDIUM (Unreal, superhero MMO; same platform order). Not Rork.
- **Not in these sessions:** Brylo, Bench Card, NEXUS RAIN, 4AM, Blip, IfNotMe, Threshold, ThisLot, OpenAir (do not start them). **Talencia is excluded.**

How: tools that need a signed-in GUI are run by House Officer or by Terrell. Realistic sound, imagery, 3D and motion are required for "100% perfect."
