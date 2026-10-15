# Ge'ez → Shopify

This repository contains two things:

| Path | What it is |
| --- | --- |
| `/` (root) | The **original React + Vite storefront**, untouched. `npm install && npm run dev` still works. |
| `/shopify-theme` | **The Shopify Online Store 2.0 theme** — this is your store. |

The theme is a faithful port of the original design (stone palette, Playfair Display
headings, split hero, dark flagship-store showcase, category cards, product grid,
trust badges, FAQ). Shopify now owns the parts that were faked in the React app.

---

## 1. Install the Shopify CLI and log in

You need a Shopify store first (creating one and its billing is yours to do).

```powershell
npm install -g @shopify/cli@latest
shopify auth login --store YOUR-STORE.myshopify.com
```

## 2. Preview the theme locally

```powershell
cd "C:\Users\nahom\Downloads\projects\Ge-ez"
shopify theme dev --path ./shopify-theme
```

This serves a live preview and hot-reloads files as you edit them.

## 3. Push the theme to your store

```powershell
# Push as a new UNPUBLISHED theme — your live store is not touched
shopify theme push --path ./shopify-theme --unpublished
```

Then open **Online Store → Themes** in your admin, preview it, and **Publish** it when
you are happy. You can also run `shopify theme publish --path ./shopify-theme`.

To take the theme back down: `shopify theme pull --path ./shopify-theme`.

---

## 4. Import the product catalog

`shopify-theme/data/products-import.csv` holds **8 products / 32 variants** (sizes S–XL),
scaffolded from the designs visible in your shop photos.

> **These are starting points, not real listings.** I inferred names, prices, types and SKUs
> from what is on your racks in the photos. Every price and title needs your review.

Import it: **Admin → Products → Import** → choose the CSV → **Upload and preview** → **Import**.

Notes:

* **Product images are intentionally blank.** See §7 — this is the single biggest gap.
* Prices are in **USD** to match the React app. If your store's currency is **ETB**,
  change the `Variant Price` column before importing (Shopify will otherwise convert).
* `Variant Inventory Policy` is `continue` and inventory tracking is off, so nothing is
  "sold out" on day one. Turn on tracking in the admin once you have real stock counts.

## 5. Create collections and navigation

Create these collections (**Products → Collections**), matching the theme's category cards:

| Title | Handle | Condition |
| --- | --- | --- |
| Shirts | `shirts` | Product type equals `Shirts` |
| Hoodies | `hoodies` | Product type equals `Hoodies` |
| Pants | `pants` | Product type equals `Pants` |

Then wire up navigation (**Online Store → Navigation**):

* **`main-menu`** — the header links. Suggested: Shop (All products), Shirts, Hoodies, Pants, Visit Us.
* **`footer`** — the footer links. Suggested: Shipping, Returns, Contact, FAQ.

The header and footer sections both default to these handles. If you use different
handles, point them at your menus in **Customize → Header / Footer**.

**Collections in the theme:** the "Category list" section on the homepage takes up to 6
collection blocks — pick your collections there to replace the placeholder titles.

## 6. Configure the theme

**Online Store → Themes → Customize:**

* **Theme settings → Colors** — brand colours (defaults already match the original design).
* **Theme settings → Social** — paste your Instagram / TikTok / Facebook / Telegram URLs,
  otherwise the footer icons stay hidden.
* **Theme settings → Favicon** — upload your logo mark.
* **Header** — brand text defaults to your store name.
* **Hero** — upload a hero image (currently a grey placeholder, since no suitable
  portrait shot exists in `/assets`).
* **Store showcase** — already uses **your real store photos** as defaults. Override any
  image by picking your own.
* **FAQ** — the answers are carried over from the React app. Correct them to match your
  actual policy.

Also required for a sellable store:

* **Settings → Customer accounts** — enable, or the login/register/order templates are dead weight.
* **Settings → Payments** — connect a payment provider.
* **Settings → Shipping and delivery** — set rates. The theme says "fast shipping" and
  "free returns" in the trust badges and FAQ — make those true or edit the copy.
* **Settings → Policies** — refund, privacy and terms pages (Shopify Payments requires them).
* **Settings → Store details → Currency** — set before importing products if not USD.

---

## 7. Known gaps — read before going live

**Product images are missing.** The 7 photos in `/assets` are *interior shots of your shop*
(neon signage, racks, mirror wall), not product cutouts. I used them where they genuinely
belong — the flagship-store showcase section — and optimized them from 28 MB to 845 KB.

But they are **not** usable as product images, so every product currently renders a clean
grey placeholder. Shooting 8 products on a plain background is the highest-value next step.
Once you have them, add them in the admin (or re-import the CSV with a public `Image Src` URL).

If you want the store to *look* complete before the shoot, a temporary option is to set
`Image Src` in the CSV to the raw GitHub URLs of your store photos
(`https://raw.githubusercontent.com/kylosonic/Ge-ez/main/assets/IMG_7159.JPG`, etc.).
Shopify will fetch them on import. They will look like shop photos, not product shots.

### What I deliberately did not port

The React app faked a lot of commerce. Rebuilding those fakes would have been worse than
deleting them, so Shopify's real equivalents took over:

| React app | Now |
| --- | --- |
| `services/authService.ts` — users in `localStorage`, **passwords stored in plaintext**, plus a hardcoded admin `admin@geezshirts.com` / `admin123` | Shopify customer accounts (real, hashed, server-side) |
| `components/AdminDashboard.tsx` | Shopify admin |
| `services/geminiService.ts` — "AI receipt verification" that always returned `isValid: true` | Removed. A checkout that approves every receipt is worse than no checkout — Shopify Payments handles this properly. |
| `services/emailService.ts` — order confirmation `console.log` | Shopify's real transactional email |
| `OrderHistoryModal` — orders in `localStorage` | Customer account → Order history |
| Mock reviews (Sarah M., Michael K., Jessica T.) | Removed rather than ship fabricated testimonials. Add a reviews app (Judge.me, Loox) if you want them. |
| Wishlist (heart button, `localStorage`) | Removed. Needs an app; the button would have been dead weight. |

**Also note:** the original `localStorage` auth meant anyone could open devtools and grant
themselves the admin role. None of that code is in the theme.

## 8. Theme structure

```
shopify-theme/
├── layout/theme.liquid              # shell, fonts, CSS-variable injection, content_for_*
├── config/settings_schema.json      # colours, page width, socials, favicon
├── locales/en.default.json          # every storefront string
├── templates/
│   ├── index.json                   # hero → showcase → categories → products → badges → FAQ
│   ├── product.json                 # product + trust badges + FAQ
│   ├── collection.json / list-collections.json / search.json / cart.json / page.json
│   ├── 404.json / blog.json / article.json
│   ├── password.liquid / gift_card.liquid
│   └── customers/                   # login, register, account, order, addresses, resets
├── sections/                        # 20 sections, all merchant-editable
├── snippets/                        # icon, price, product-card, pagination
├── assets/                          # base.css, theme.js, 7 optimized store photos
└── data/products-import.csv         # the 8-product starting catalog
```

### Implementation notes

* The cart is a **slide-out drawer** driven by the Shopify AJAX API
  (`cart/add.js`, `cart/change.js`) and re-rendered through the **Section Rendering API**,
  so line items and totals are always server truth — never stale client state.
* The drawer works as a **section**, which is why it can be re-rendered in place.
* Variant selection uses **real links / a native `<select>`** rather than JS-injected prices,
  so price, availability and image stay correct with JavaScript disabled.
* Collection category pills use Shopify's native product-type routing
  (`/collections/<handle>/<type>`), so filtering happens server-side.
* CSS is hand-written with custom properties fed from theme settings — no Tailwind CDN,
  so the storefront has no runtime CSS dependency.

## 9. Validation performed

The theme passed a purpose-built static check with **zero errors**, covering: JSON validity
(schemas, templates, locales), Liquid block-tag balance, section/snippet/asset reference
resolution, every `section.settings.*` and `block.settings.*` key declared in its schema,
every `| t` translation key present in `en.default.json`, every global `settings.*` key
present in `settings_schema.json`, valid Shopify `{% form %}` types, and valid
`placeholder_svg_tag` names.

Shopify's official **`shopify theme check`** was also run against the theme:

```
48 files inspected with 3 total offenses found across 1 files.
3 warnings.
```

**Zero errors.** All 3 warnings are `RemoteAsset` on the Google Fonts `<link>` tags in
`layout/theme.liquid`, which is deliberate: the original design depends on **Playfair Display**
+ **Inter**, and loading them from Google Fonts guarantees the exact rendering. The faster
Shopify-native alternative is to switch `layout/theme.liquid` to a `font_picker` theme setting
and render `{{ settings.heading_font | font_face }}` — worth doing later if the 
`RemoteAsset` warnings become a blocker.

**Not yet verified:** an end-to-end render in a real store. Push with `--unpublished`
first and click through every template before publishing.
