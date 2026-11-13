# HELD_FOR_TERRELL — terrellfrancis.app

Content restored from git history that the `restore/2026-11-13` PR (`ed6d8fe`, Terrell-approved restoration) deliberately did **not** put on the page. It is kept here word for word so nothing is lost, and so it never ships in the live page source until Terrell decides. Each item has a row in `PROPOSED_REMOVALS.md`.

Nothing here was ever on the live site after Nov 6, so leaving it out does not change the live page.

## TORQ studio panel (a881646^)

Why held: restore/2026-11-13: "TORQ panel left out: WRACE/TORQ removal approved Nov 13".

To put it back: paste between the markers in `index.html` that point to this file.

```html
            <article class="studio-panel panel-wrace" style="--c:#C2410C">
              <img src="assets/apps/wrace.png" width="112" height="112" alt="TORQ logo" loading="lazy" decoding="async">
              <div>
                <p class="product-tag">Racing game</p>
                <h3>TORQ</h3>
                <p>A 3D garage and racing sim: build a car in the bay with real parts, then take it to real tracks for drag, street, circuit, and oval events.</p>
                <a class="product-link" href="https://tkhub.app/" target="_blank" rel="noopener">TORQ at tkhub.app<span class="sr-only"> (opens in a new tab)</span><span aria-hidden="true"> ↗</span></a>
              </div>
            </article>
```

## TORQ studio picker button (a881646^)

Why held: goes with the TORQ panel above.

To put it back: paste between the markers in `index.html` that point to this file.

```html
            <label class="studio-pick" style="--c:#C2410C"><input type="radio" name="studio" id="app-wrace" data-demo="https://tkhub.app/" data-name="TORQ"><img src="assets/apps/wrace.png" width="56" height="56" alt="" decoding="async"><span>TORQ</span></label>
```

## About, second paragraph (5f2d6ce^)

Why held: restore/2026-11-13: "The second paragraph (Talencia) is held for Terrell." Also: never work on Talencia.

To put it back: paste between the markers in `index.html` that point to this file.

```html
          <p>Now I'm <strong>Director of Technology Development &amp; Operations at Talencia</strong>, a healthcare staffing company, where I own the systems the business runs on and the rollouts that put them in people's hands. Alongside it I run TK Hub LLC, and I'm building my AI/ML depth through the McCombs School of Business (UT Austin) program in AI &amp; Machine Learning.</p>
```

