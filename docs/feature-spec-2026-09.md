# FITS — Feature Spec & Screen Map

Source: *FITS Design Features, updated 22 September 2026* (Founders Meetings of 3 and 17 September 2026).
This file is the working reference for the design and development teams. The PDF is the authority on
*what* we build; this file adds the *where* — how each screen maps onto routes in `web/`.

Status of the codebase as of this document: `web/` is a Next.js 14 + Tailwind marketing site only
(`/`, `/shop`, `/creators`, `/collections`, `/editorial`, `/regions`). None of the product screens below
exist yet. Designs are in progress; screens get built as Figma output lands.

---

## 1. Decisions that change the architecture

These four cut across many screens. Settle them before building, because retrofitting is expensive.

**One account, one email, buyer by default.** A single user record, single shared database. Every account
starts with buyer access; "creator" is an elevated privilege on that same account, not a separate account
or a second email. Model this as a role/capability flag on the user, never as two tables. Creators shop as
buyers through a workspace switch, so the session must carry both contexts at once.

**Sign-up is email + password only.** Everything else — location, craft category, phone, bank details,
NIN/BVN — is collected later, through the creator upgrade or progressive profile-completion prompts at
checkout. So every profile field must be nullable, and every screen must render correctly for a user who
has filled in almost nothing.

**Every visitor is a buyer.** The homepage is the default landing page for authenticated and
unauthenticated visitors alike. There is no separate seller front door; there is a persistent
"Become a Creator" link.

**Verification is creator-paid and buys visibility.** The creator pays the verification fee; in return the
verified badge boosts ranking across search, the content feed, and discovery surfaces. Fee payment status
is tracked in the admin onboarding queue, so payment state and verification state are separate fields.

---

## 2. Feature deltas from the September update

Tags follow the PDF: **NEW**, **UPDATED**, **DEFERRED**, **V2**.

### Creator (seller)

| Feature | Tag | Note |
|---|---|---|
| Simple onboarding & registration | UPDATED | Email + password to start; rest captured at upgrade and via prompts |
| Dynamic creator profile | UPDATED | Now also hosts a feed of the creator's own videos and posts |
| Verification badge system | UPDATED | Creator-paid; grants visibility across search, feed, discovery |
| Creator operations dashboard | — | Listings, orders, revenue, ratings |
| Structured listing manager | — | Up to 10 images, variant matrix, lead times, made-to-order vs ready-to-ship |
| Flexible shipping configuration | — | Local / national courier / international |
| Order management system | — | Push + SMS + email; statuses Accepted → In Production → Ready to Ship → Shipped |
| In-app communications hub | — | Phone numbers masked |
| Earnings dashboard & payouts | — | NGN banks, MTN MoMo, OPay, USD/GBP |
| Behind-the-scenes content studio | **NEW** | Short video + photo posts, each taggable with one or more listings |
| Committed delivery timelines | **NEW** | Firm dispatch/delivery window per listing, shown pre-purchase, enforced by the platform |
| Shop as a buyer (dual role) | **NEW** | Same login; a button switches creator workspace ↔ buyer marketplace |

### Buyer

| Feature | Tag | Note |
|---|---|---|
| Curated discovery homepage | UPDATED | Default landing for every visitor; persistent "Become a Creator" link |
| Advanced category & region browsing | UPDATED | Adds location-based browsing — creators and products near the buyer |
| Typo-tolerant native search | UPDATED | Adds an Items / Creators filter toggle |
| Bespoke ordering module | — | Size guides, custom measurements, checkout under 3 minutes, guest path |
| Multi-gateway secure payments | — | Paystack (NGN) + Stripe (intl); escrow holds funds until receipt is confirmed |
| Post-purchase milestone tracking | — | Milestones updated by the creator |
| Verified community reviews | — | Confirmed purchasers only |
| Dispute & return resolution | UPDATED | Explicitly balanced to protect both buyer and creator |
| Shoppable content feed (swipe-to-cart) | **NEW** | Vertical short-video feed; swipe right adds the tagged item to cart |
| Frictionless sign-up & progressive verification | **NEW** | Browse immediately; NIN/BVN requested later, at checkout or via prompts |
| Transparent price breakdown | **NEW** | Item + shipping + fees shown upfront on PDP and in cart, before payment |

### Platform & community

FITS Editorial · Creator Spotlight · Interactive Wishlists · Digital Gift Cards — unchanged.

| Feature | Tag | Note |
|---|---|---|
| Loyalty & milestone rewards | **DEFERRED** | Until active marketing; reward structure undefined |
| Two-sided referral architecture | **DEFERRED** | Until active marketing |
| Unified account & creator upgrade | **NEW** | See §1 |
| Role-based onboarding | **NEW** | Buyer/Seller choice after sign-up; creator page URL TBC |
| Web3 creator wallets & airdrops | **V2** | Post-MVP |

### Admin

| Feature | Tag | Note |
|---|---|---|
| Onboarding verification queue | UPDATED | Also tracks creator verification-fee payment |
| Product listing moderation engine | UPDATED | Extends to feed videos and posts |
| Dispute mediation console | — | Message logs, neutral judgments |
| Global analytics dashboard | — | GMV, trending groups, seller performance, growth |
| Promotions engine | — | Flash discounts, seasonal campaigns, coupons |
| Logistics partner core | — | GIG Logistics, Sendbox, DHL, Shippo |
| Delivery timeline compliance monitor | **NEW** | Flags late/at-risk orders, records on-time performance per creator |

---

## 3. Screen checklist → route map

Screen numbers 1–29 are preserved from the original design set; 30–34 are new. Routes are proposals for
`web/src/app/` and should be confirmed as designs land.

> **Naming note.** The PDF calls Screen 1 the "Homepage", but in this build `/` is the marketing
> landing page and the Discovery Hub lives at `/shop` — you reach it by clicking Shop. The two are
> different pages with different chrome: `/` uses the marketing `Navbar`/`Footer`, `/shop` uses
> `MarketplaceHeader`/`MarketplaceFooter` with the ship-to selector.

### Public track (9 screens) — unauthenticated

| # | Screen | Proposed route | Tag |
|---|---|---|---|
| 1 | Homepage (Discovery Hub) | `/shop` | UPDATED — adds "Near Me" entry point |
| 2 | Category pages | `/category/[slug]` | — |
| 3 | Search results | `/search` | UPDATED — Items / Creators toggle |
| 4 | Creator public storefront | `/creator/[handle]` | UPDATED — adds video/post feed tab |
| 5 | Login | `/login` | — |
| 6 | Sign-up | `/signup` | UPDATED — email + password only |
| 7 | Guest checkout | `/checkout/guest` | — |
| 30 | Role selection onboarding | `/onboarding/role` | **NEW** |
| 31 | "Become a Creator" landing | `/creators` (URL TBC — or `/studios`) | **NEW** |
| — | Reset your password | `/forgot-password` | **not in the checklist** |
| — | Check your email (reset link sent) | `/forgot-password`, second state | **not in the checklist** |

> The last two came from the designer's auth set but appear nowhere in the PDF's 34 screens.
> Screen 5 links to them via "Forgot password?", so they are required, not optional. The public
> track is therefore 11 screens, not 9, and the total is 36. Worth renumbering them (37, 38?) or
> explicitly folding them into Screen 5 so design and dev counts agree.

> Note: `/creators` already exists as a marketing page listing creators. Screen 31 is a different page —
> a sales page for *becoming* one. One of the two needs to move; suggest the existing listing becomes
> `/creators/directory` or `/discover/creators`.

### Buyer track (11 screens) — authenticated

| # | Screen | Proposed route | Tag |
|---|---|---|---|
| 8 | Product detail (PDP) | `/product/[id]` | UPDATED — delivery window + price breakdown |
| 9 | Shopping cart | `/cart` | UPDATED — doubles as swipe-to-cart dashboard, itemised fees |
| 10 | Multi-gateway checkout | `/checkout` | — |
| 11 | Order milestone tracking | `/orders/[id]` | — |
| 12 | Wishlist | `/account/wishlist` | — |
| 13 | Order history | `/account/orders` | — |
| 14 | Review & ratings submission | `/orders/[id]/review` | — |
| 15 | Returns & dispute panel | `/orders/[id]/dispute` | — |
| 16 | Buyer settings | `/account/settings` | — |
| 32 | Shoppable content feed | `/feed` | **NEW** |
| 33 | Profile completion & verification prompt | modal/interstitial, not a route | **NEW** |

### Creator track (9 screens)

| # | Screen | Proposed route | Tag |
|---|---|---|---|
| 17 | Creator registration form | `/studio/register` | UPDATED — upgrades the existing account |
| 18 | KYC verification | `/studio/verification` | UPDATED — includes fee payment |
| 19 | Bank & payout setup | `/studio/payouts` | — |
| 20 | Creator command dashboard | `/studio` | UPDATED — adds "Shop as Buyer" switch |
| 21 | Listing manager catalog | `/studio/listings` | — |
| 22 | Add/edit product listing | `/studio/listings/[id]` | UPDATED — committed delivery window field |
| 23 | Order inbox & fulfilment | `/studio/orders` | — |
| 24 | Secure chat workspace | `/studio/messages` | — |
| 34 | Content studio | `/studio/content` | **NEW** |

### Admin track (5 screens)

| # | Screen | Proposed route | Tag |
|---|---|---|---|
| 25 | Onboarding verification queue | `/admin/verification` | UPDATED — fee payment status |
| 26 | Listing moderation queue | `/admin/moderation` | UPDATED — covers feed content |
| 27 | Dispute console | `/admin/disputes` | — |
| 28 | Global analytics | `/admin/analytics` | — |
| 29 | Promotions & logistics configurator | `/admin/operations` | UPDATED — delivery compliance view |

Total: 34 screens (9 public + 11 buyer + 9 creator + 5 admin).

---

## 3b. End-to-end flow (the 8 bands)

From the flow diagram of 2026-10-02. Each band hands off to the next; screen numbers in brackets.

1. **Arrival and account.** Visitor lands on the homepage as a buyer [1] and browses freely — feed,
   search, Near Me [2, 3, 4, 32]. Nothing asks for an account until they try to save or buy. Then:
   log in [5], sign up [6], or check out as a guest [7]. Sign-up leads to the role question [30] —
   Buyer continues to band 2, Seller branches to band 6.
2. **Discovery to cart.** Two routes in: the product page [8], or a swipe right on a tagged post in
   the shoppable feed [32]. The delivery window and the full price are both shown *before* she
   commits. Custom measurements are saved to the profile for reuse [8, 16].
3. **Checkout, progressive verification, payment.** Only here are the details collected that the
   account never asked for — NIN/BVN where the order needs it, delivery address [33]. Price breaks
   down into item, shipping and fees [9]. Paystack (₦) or Stripe ($/£) [10]. **Money goes to escrow,
   never straight to the maker.** A failed payment keeps the cart.
4. **Maker: acceptance to dispatch.** Accept within 48h or the order auto-cancels with a full refund.
   Then order inbox [23] → chat with numbers masked [24] → in production → ready to ship → courier
   handoff, with FITS booking and paying. If the committed window slips, **compliance flags it before
   it is late, and the buyer — not the maker — decides whether to wait.** If she won't: full refund,
   and the maker's on-time rate takes the hit.
5. **Delivery, money and disputes.** Escrow releases on confirmation or automatically on **day 7**;
   payout within 24h. Then review [14], wishlist/follow/re-order [12, 13]. A dispute [15] freezes
   everything: maker has 48h to respond, then an operator rules on log, spec and photos [27].
6. **Becoming a creator, on the same account.** From [30] or the "Become a Creator" link [31] →
   creator profile [17] → KYC [18] → **verification fee**; unpaid means setup continues but selling
   stays locked → payout setup [19] → ops review [25] → approved gives badge and visibility.
   No second email, no second login.
7. **Listing products and posting content.** Two things a creator publishes: products [22] (photos
   up to 10, committed dispatch and delivery window, shipping scope) and behind-the-scenes posts
   [34] tagged with those products for swipe-to-cart. **Both pass the same moderation queue** [26].
8. **One account, two surfaces.** A creator shops with the login they already have. One button
   crosses from studio [20] to marketplace and back, in both directions.

Two things this flow pins down that the feature list alone does not: escrow auto-releases on **day 7**,
and a slipping delivery window is **the buyer's call, not the maker's**. Both need backend rules, and
both are listed as open questions below.

## 4. Open questions

1. **Creator page URL** — `fit.ng/creators` vs `fit.ng/studios`, marked TBC in the PDF. Blocks Screen 31
   and collides with the existing `/creators` marketing page (see note above).
2. **Verification fee** — amount, currency, whether it is refundable on rejection, and whether it recurs.
3. **Delivery-window enforcement** — *answered by the flow:* flagged before it is late, the buyer
   chooses whether to wait, cancelling means a full refund and a hit to the maker's on-time rate.
   Still open: how far ahead "at risk" fires, and what a poor on-time rate costs beyond the number.
4. **Swipe-right on desktop** — the feed is specified as a mobile gesture; the web app needs an
   equivalent affordance.
5. **Escrow release** — *answered by the flow:* on buyer confirmation, or automatically on day 7.
   Still open: whether day 7 counts from courier-delivered or from dispatch, and what happens to the
   clock while a dispute is open.
6. **Maker acceptance window** — the flow sets auto-cancel at 48h and dispute response at 48h.
   Confirm both, since they drive notification scheduling.
7. **Loyalty & referral** — both DEFERRED with structure undefined; confirm they are out of MVP data
   modelling entirely, or whether we reserve the fields now.
8. **Auth screen numbering** — the reset-password pair is missing from the 34-screen checklist
   (see §3).

---

## 5. Built so far

The auth cluster, from the designer's first Figma set (2026-10-02):

| Route | Screen | States built |
|---|---|---|
| `/login` | 5 | default, validation, wrong password with attempts remaining, lockout after 3, offline, submitting |
| `/signup` | 6 | empty, valid with strength meter, field validation, account-exists conflict, submitting, offline, saved-item banner via `?save=` |
| `/forgot-password` | — | request form (prefills from `?email=`), then "check your email" with a 45s resend countdown |
| `/onboarding/role` | 30 | **placeholder only** — sign-up routes here per Band 1; awaiting design |
| `/category/[slug]` | 2 | 8 categories; filters, sort, grid/list, pagination, ship-to market switching, geo banner, empty state |
| `/shop` | 1 | Discovery Hub: hero, craft tray, new from verified creators, trending, feed strip, countries, spotlight, sell CTA |
| `/search` | 3 | Pieces / Creators tabs, typo correction with "search instead for", no-results with "try instead", filters shared with category |
| `/product/[id]` | 8 | gallery, sizes + size guide, custom measurements (saved for reuse), colour, note to creator, can't-ship-here, sold out, added-to-cart popover |
| `/cart` | 9 | one parcel per creator with its own arrival window and shipping, duty line, sold-out and can't-ship lines excluded from totals, empty state |
| `/creator/[handle]` | 4 | cover, follow and share, catalogue with shop shelves and sort, story, reviews with rating breakdown, new-shop "verification in progress" state |
| `/feed` | 32 | posts from followed creators, Everything / New pieces / Making of, post menu (hide, fewer making-of, unfollow, report) with undo, save to a list, offline banner, caught up, follow-nobody introductions, skeleton |
| `/account/wishlist` | 12 | saved pieces and named lists, new list (with link sharing), rename, copy link, add all to cart, price-dropped / only N left / not yet orderable / no longer available, empty state |
| `/checkout` | 7 + 10 | guest details or saved addresses (add, edit, default, label), per-country address rules with a UK postcode lookup, parcels and dates; card with brand detection and specific number errors, bank approval in app or by text code, decline, cancel; Apple Pay, PayPal; pay in naira by Paystack transfer (30-minute account), Nigerian card or USSD |
| `/checkout/done` | — | order number, what each creator does next and when, track or keep shopping |
| `/account/orders` | 13 | account sidebar; In progress / Delivered / Cancelled and refunded; per-piece status; confirm arrival from the list |
| `/orders/[id]` | 11 | one card per creator's parcel: confirming (48h countdown), packing, being made (updates, message), running late (wait or cancel and refund), on its way (DHL events), delivered (confirm or report a problem), confirmed (review), declined / cancelled (refund, similar pieces); delivery, paid and refunded; money-held, refunds or order-complete note |

The category page (Screen 2) also gained the second design pass: white category row, a loading
skeleton while the ship-to market is read, and a "no pieces match" panel that names the filters
ruling everything out and counts what removing each brings back. The header search suggests
phrases, creators and pieces as you type.

Cart, saved pieces and measurements live in `ShopperProvider`, held in the root layout and
remembered in `localStorage`. Search is a local stand-in in `web/src/lib/search.ts`; parcel, duty
and total rules are in `web/src/lib/cart.ts`.

Shared pieces live in `web/src/components/auth/`; rules in `web/src/lib/auth-validation.ts`;
mock accounts in `web/src/data/accounts.ts` (`amara.obi@gmail.com` / `fitslagos1` signs in,
and is also the address that triggers the sign-up conflict).

The marketplace adds `web/src/components/marketplace/`, the catalogue in
`web/src/data/marketplace.ts`, markets and currency in `web/src/data/markets.ts`, and the filter
and sort rules in `web/src/lib/marketplace-filters.ts`.

**Ship-to market is the spine of the category page.** Choosing a country changes prices and
currency, the "Shipping to X, all in" promise, the "Arrives in X within" filter heading, the
"Ships to X" toggle, and which pieces that toggle keeps. It is held in `MarketProvider` and
remembered in `localStorage`, so one choice follows the visitor around. Prices are stored in GBP
and converted at render; a real build should price per market instead, because a floating rate
would make the same piece cost a different amount day to day.

Decisions taken from the designs, all worth confirming:

- **Login offers Google and Facebook; sign-up does not.** That is what the designs show, and it is
  what is built. If it was not deliberate, sign-up needs the same two buttons.
- **The error copy reveals whether an account exists** ("That password doesn't match", and the
  sign-up conflict card naming the join month). This is a deliberate usability-over-enumeration-
  resistance trade, so it should be a conscious one. Password reset deliberately does *not* leak:
  it reports success for any address.
- **The category frames arrived in two versions**, one on cream and one on black. The black ones
  put dark-green titles and prices on a near-black background, around 1.3:1 contrast, and five of
  the six were identical repeats of one frame. Built as the cream version; if a dark theme is
  genuinely wanted, the text tokens need redefining, not just the background.
- **Facet counts are the designer's illustrative numbers** (412 dresses, 612 from Nigeria) while
  the result count is derived from the real mock catalogue of 24 pieces. So the sidebar says 412
  and the heading says 8. Wire both to the same source once a search backend exists.
- **Duty is a placeholder rate per market** (10% of pieces plus shipping for the UK). It matches
  the designs' one-piece cart (£3.60) but not the two-piece one (designs say £6.40, the rule gives
  £7.00), because the designer's figures do not follow a single rate. Needs a real duty source.
- **Sold out has no live trigger yet.** Set `soldOut: true` on a product in the fixtures to see the
  product page and cart states; a real build needs stock from the backend.
- **Shop verification and the verified badge are two things.** The storefront designs show a new
  shop as "verification in progress" with ordering closed, while the spec's verified badge is a
  paid visibility boost. Built as `identity: "pending" | "confirmed"` (gates ordering on the PDP,
  cart and cards) alongside the existing `verified` badge. Confirm that reading.
- **Awa Diop is the pending shop**, following the storefront designs, so Awa's pieces now show
  "Not yet orderable" and no ratings everywhere — earlier search designs showed Awa as verified.
- **Storefront copy avoids pronouns** ("In Yinka's words" rather than "In her words"), since
  creators have not told us theirs. Worth adding a pronoun field to the creator profile if the
  designs want them.
- **The storefront video/post feed tab** from the spec's Screen 4 note is not in these designs and
  is not built.
- **The feed designs are a post feed, not the swipe-to-cart video feed** the feature list
  describes for Screen 32. Built as designed; the `/shop` feed strip still links to
  `/feed?clip=…`, which this page ignores. Decide whether video clips join this feed or live
  elsewhere.
- **Saved pieces no longer need an account.** Hearts always worked signed out, but the header
  sent signed-out visitors to sign-up instead of their saved list. Both now go to
  `/account/wishlist`, which says "Saved on this device" with a log-in link when signed out.
- **List share links are not real yet.** "Copy share link" copies a URL that only works on the
  owner's device, because lists live in `localStorage`. Sharing needs accounts and a backend.
- **Saved-piece alerts are promised but not built.** The empty state's copy ("We'll tell you if
  the price drops…") comes from the design; nothing sends those notifications yet.
- **Sized pieces can't be added from a list in one tap.** Their card says "Choose size" and opens
  the product page, and "Add all to cart" skips them and says how many need a size.
- **Guest checkout shares `/checkout`** instead of living at `/checkout/guest`. A signed-out
  buyer gets the guest form on the delivery step; everything after is identical.
- **Payments are a stand-in.** Every valid card goes to the bank-approval screen and approves
  after four seconds (or with any 6-digit text code). Card `4000 0000 0000 0002` — Stripe's own
  decline test card — is declined. Apple Pay, PayPal, transfer and USSD succeed when confirmed.
  The design's card number (…4417) fails the Luhn check, so it shows as invalid; use
  `4921 8832 1190 4419` to try it.
- **Paying in naira from abroad converts the destination total**, so a UK order's £76.40
  becomes ₦152,800 at the mock rate, duty included. The "rate locked for 15 minutes" is copy only.
- **Totals differ from the checkout designs by the duty rule** noted above: the designs show
  £6.40 duty on the two-parcel order, the placeholder rule gives £7.00.
- **The address form has an optional "Call it" field** (Home, Work…) that the design lacks;
  without it there is no way to get the saved-address names the delivery step shows.
- **"Track this order" links to `/orders/[id]`**, which is not built yet. Orders are kept on the
  device, ready for that page.
- **Next-step copy names the creator** ("Yinka makes it, with progress photos") where the design
  used "She" and "He".
- **Order states come from a mock history.** Signing in as `amara.obi@gmail.com` shows seven
  demo orders covering every state (`web/src/data/orders.ts`, dated relative to today). Orders
  placed through checkout wait for the creator and, with nothing to accept them, are refunded
  automatically after 48 hours — the promise the page makes. The buyer's own actions (confirm,
  wait, cancel, report, review) are saved and change the page.
- **Rules the designs imply, now in code:** a delivered parcel confirms itself after 7 days; a
  late parcel counts as "happy to wait" after 3 days without an answer; a refund is the piece
  plus its parcel's delivery and duty.
- **"There's a problem" opens a short inline report** (reason and note) that holds payment, in
  place of the separate dispute screen (Screen 15, `/orders/[id]/dispute`, not designed yet).
- **"Message Yinka" and "Write a review" work inline.** The message is not sent anywhere yet;
  the review is saved on the device and shown back on the order.
- **Account sidebar links that are not built yet:** My measurements, Delivery addresses,
  Payments, Settings. "Following" goes to the feed, where follows are managed.
- **Copy names the creator** ("Yinka confirms the piece can be made to your sizes") where the
  designs used "She'll confirm she can make it".
- **Canada was added as a ship-to market** because the "can't ship" designs use it. Only a few
  shops send there, so most pieces show that state.
- **Delivery windows are shown as a span** ("Arrives in 12–14 days") against the single committed
  window the feature list describes. Confirm whether the creator commits to a range or one date.

## 6. Build approach

Agreed: **frontend-first with typed mock data.** Screens are built in `web/src/app/` against typed
fixtures in `web/src/data/`, with component props shaped the way a real API would return them, so the
data layer can be swapped in later without touching the components. No database or auth provider is
wired up yet.
