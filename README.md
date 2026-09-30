# Auringon — multi-page site

Built July 16, 2026 from the single-file index.html. Same design, same copy
(including the voice-guide fixes), split into real pages.

## What's here

    /                                          Home (doors, example of the work)
    /about/                                    About
    /engagements/                              Engagements  (#shapes anchor)
    /offerings/                                Redirect stub → /engagements/
    /journal/                                  The Urbanist Operator
    /journal/four-ways-urban-work-fails/       Post, July 2026
    /journal/container-moves/                  Post, June 2026
    /journal/the-working-layer/                Post, May 2026
    /work/building-a-product-practice/         TLC case study
    /work/shipping-a-new-service-line/         Bandwagon case study
    /work/growing-an-account-from-the-inside/  Ad Hoc case study
    /assets/site.css, /assets/site.js          Shared styles and behavior
    /404.html, /robots.txt, /sitemap.xml, /.nojekyll

## Deploying to GitHub Pages

1. Replace the repo contents with these files. Keep your existing CNAME file —
   this bundle deliberately doesn't include one.
2. favicon.svg and og-image-2.jpg aren't in this bundle (they weren't in the
   source file); keep the copies already in the repo.
3. After deploy, spot-check /about/, one journal post, and one work page.

## What changed under the hood

- Every page has its own title, description, canonical, Open Graph and Twitter
  tags (identical to each other, per the voice guide), and page-appropriate
  JSON-LD: ProfessionalService and Person on Home, the offer catalog on
  Offerings, Blog on the Journal, BlogPosting on posts, Article on case studies.
- Google Analytics (G-P9ZN3YW9J8) is on every page. Beyond page views, four
  events are named: door_open (with door), email_click, book_call_click,
  subscribe.
- Old deep links still work: the single-file site used #hashes (#about,
  #post-container-moves, …); the homepage now redirects those to the new URLs.
- The subscribe form returns to /journal/?subscribed=1.
- Nav grew to Home · Offerings · Journal · About, with aria-current on the
  active page.

## Worth doing next (not code)

- Add the property to Google Search Console and submit /sitemap.xml.
- When a new journal post ships: add its page under /journal/<slug>/, add it to
  the Journal index and the sitemap, and set its datePublished in the JSON-LD.

## September 30, 2026: email signature wordmark

Added /assets/auringon-wordmark-email.png, the header wordmark rendered as a
360 x 58 PNG (charcoal #3a3a3a, mark shapes filled cream #f1f2da, on white)
for the Gmail signature, which loads it from
https://www.auringon.com/assets/auringon-wordmark-email.png. Every sent email
points at that URL, so don't rename, move, or delete the file. No pages
reference it.

## September 29, 2026 revision (9)

"The plan" is now "the strategy" sitewide: "plan" read as public-sector
planning next to the city-agency background. Home hero and its
meta/OG/Twitter/JSON-LD copies ("the platform the strategy needs"), the
fork framing ("Whatever the strategy is missing"), the shared Build tagline
("What the strategy still needs") on Home, Engagements, and all three /for/
pages, the Engagements lede, meta, JSON-LD, and Build body ("whatever size the
strategy calls for"), and "arrive where the strategy is stalling" on About and
Work. Left alone: the journal essay line "The plan assumed someone would build
it," the Ad Hoc case study's "a partner in the plan," and the hero's
.stone--plan class (internal only).

Home also gets a second, smaller example under the TLC story: "Building
support without a support team," eyebrowed "Also, inside a startup," so the
one featured case doesn't make the practice read as public-sector only. It
pays off the fork framing's "support queue that needs automating." Kept
compact on purpose (eyebrow and a linked title only, no dek, no second "Read
the full story") so the section reads as one story plus a pointer. The home
title is "Building support for every customer, without hiring a team"; the case study
page keeps its own title. The TLC example on Home is retitled to land on the
outcome: "Turning a rule into wheelchair-accessible rides" (its case study page
stays "Turning a rule into something that runs"). New
.example-also styles in site.css.

Changed: /, /engagements/, /for/founders/, /for/funders/, /for/consultancies/,
/about/, /work/, /assets/site.css, /README.md.

## September 28, 2026 revision (8)

Funders page de-"planned": the word read nonprofit rather than venture. The
lede (and its meta/OG/Twitter copies) is now "You wrote the check, and the team
is out building. When they need something they don't have yet, I'm the operator
you can offer them." Also: "The team you backed needs one nobody on it has
yet", "The gap, closed.", "if something's missing, we know an operator", "a
skill the business needs", "A number they promised you", "everything between
roadmap and release". The Engagements funder card now opens "Venture fund or
foundation, you wrote the check." The shared Build tagline ("What the plan
still needs") is unchanged sitewide.

Changed: /for/funders/, /engagements/, /README.md.

## September 28, 2026 revision (7)

Accessibility case reframed from monitoring to program design and change
management, which is the practice's positioning. The trip-level logic is now
described as the program itself (a data-driven program: compliance was a
calculation), and the industry communications and work with industry groups as
designing adoption in. Lede, meta descriptions, record strip, "The rule on
paper", "Every system it touched", "Following every trip" and "What travels"
all updated; Work index dek and homepage example text follow.

Changed: /, /work/, /work/turning-a-rule-into-something-that-runs/, /README.md.

## September 28, 2026 revision (6)

Accessibility case gains a sixth chapter, "Following every trip" (id rule-trips,
rail label "Trips"): inspection data merged with trip records, a measurement for
each compliance path (share of trips in accessible vehicles; whether riders who
needed one could get one), and attribution of trips farmed out between bases.
The stakes paragraph and the outcome figures moved to close that chapter. The
record strip's "Built" row now ends on measuring compliance trip by trip.

Changed: /work/turning-a-rule-into-something-that-runs/, /sitemap.xml, /README.md.

## September 28, 2026 revision (5)

Homepage: the "Example of the work" feature is now the accessibility rule
("Turning a rule into something that runs"), with its mark drawn static like the
feature mark before it. Amit Agarwal's quote stays with it; it fits this case as
well as the last one. The product-practice case remains on /work/ and the
funders page.

Engagements: "Who this is for" moved up to sit right after the page head, so the
page reads who, how, then the shapes. It takes the tinted band so plain and tint
still alternate. The page-head sentence lost its inline audience links (the
cards below now carry them) and reads "Here's who I work with, how an
engagement works, and the shapes it takes."

Sitemap lastmod bumped for every page changed today.

Changed: /, /engagements/, /sitemap.xml, /README.md.

## September 28, 2026 revision (4)

Work index reordered: accessibility rule first, then Bandwagon, support,
product practice, Ad Hoc last. Public and private sector alternate, so the two
TLC cases never sit side by side. JSON-LD ItemList positions follow the new
order.

Changed: /work/, /README.md.

## September 28, 2026 revision (3)

References are linkable: the About page's References section has
id="references", so https://www.auringon.com/about/#references lands on it (a
72px scroll-margin keeps the heading clear of the sticky nav). Amit Agarwal's
quote, previously only on the homepage, joins the wall as a sixth clip,
"Readies the systems for what comes next.", which also evens the three-column
grid to two full rows.

Changed: /about/, /assets/site.css, /README.md.

## September 28, 2026 revision (2)

A fifth case study: /work/turning-a-rule-into-something-that-runs/, the TLC's
for-hire wheelchair accessibility rule taken from adopted policy to tracked
compliance. Same template as the other cases (no role kicker), five chapters, id
prefix "rule", with the pull quote on forcing decisions (a concrete proposal to argue about). Outcome figures are the
TLC's own, from its September 2019 FHV wheelchair accessibility compliance
report. New mark: a dashed outline of a stone (the rule on paper) and the same
shape in terracotta, real, resting on a bed of five mixed stones (the systems it
touched); the sun sits between them. Also the Work index thumbnail.

Work index: fifth entry, "Four" became "Five" in the lede, meta descriptions and
JSON-LD, ItemList position 5. Every case's "More of the work" now lists the
other four. Sitemap: new URL added.

Changed: /work/, /work/turning-a-rule-into-something-that-runs/ (new), the four
existing case pages, /sitemap.xml, /README.md.

## September 28, 2026 revision

A fourth case study: /work/building-support-without-a-support-team/. Company
unnamed on purpose; the kicker is "First business hire · Early-stage startup"
in place of title · company. Built from the Bandwagon page's template (same
head, nav, footer, chapter rail, record strip, closing), five chapters, id
prefix "support". New engagement mark: sun over a ghosted heap (the inbox),
a terracotta stone (the system, squashing on the shared .sq cycle), and three
small stones in different colors set down one by one (each customer answered
for who they are). The same mark is the Work index thumbnail. Revised the same day: no motion trails; the left is six faded pebbles tumbling loose, and the right is the same six stones, solid, sorted by color and built into a three-course pyramid (sky base, olive above), taller than the system stone so the result reads as the grander thing. Mess in, order out, with nothing drawn between them.

Work index: fourth entry added, "Three engagements" became "Four" in the lede,
meta descriptions, and JSON-LD; ItemList gained position 4. Every other case's
"More of the work" now links the new one. Sitemap: new URL added, /work/
lastmod bumped.

Role kickers retired from all four case pages (the small caps "Title · Company"
line inside each h1). The h1 is now just the headline, which also cleans up what
screen readers announce. The .role-kicker rule left site.css with them. The Work
index entries lost their role lines too (the post-meta div above each title), so
each entry is now illustration, title, dek, read link.

Changed: /work/, /work/building-support-without-a-support-team/ (new), the
three existing case pages, /assets/site.css, /sitemap.xml, /README.md.

## August 4, 2026 revision

Three housekeeping fixes, none of them copy.

The URL now says what the nav says: /offerings/ became /engagements/. Every
internal link, the sitemap (lastmod bumped for the moved page), the canonical
and og:url, and the legacy #offerings hash map point at the new path. A stub
stays behind at /offerings/ — noindex, canonical to the new URL, and a JS
redirect that carries the hash so old /offerings/#shapes links still land on
the shapes; the meta refresh is the no-JS fallback. The 404 footer also said
"Offerings" where every other footer said "Engagements"; it doesn't anymore.
The inert view-offerings id came along as view-engagements.

Dead code from the single-file build retired from site.js: selectDoor and
closeDoor (the doors are plain links now — no card-founder/funder/prime ids
exist), the details.way block (no <details> anywhere), and the two scroll
helpers only they called. navOffset stays; the chapter rail uses it. The
orphaned .has-open rules in site.css were left alone.

jonathan.jpg went from 1.15MB to ~210KB: 1280×1280 resized to 1024×1024
(the portrait renders at 340px CSS at its widest, so 1024 keeps 3x retina
covered), re-encoded q80 progressive. Same filename, no markup changes.

Changed: /assets/site.js, /sitemap.xml, /jonathan.jpg, /README.md, every
page's nav and footer, /engagements/ (moved), /offerings/ (now a stub).

## July 22, 2026 revision (7)

Journal wash, corrected to a true band: revision (4) matched the case
closings' bleed numbers (-40px) but not their structural position — the case
band sits outside the 960 wrap and reaches the viewport at every width; the
journal wash sits inside it, so above ~1040px it capped at the wrap and read
as a box floating on paper. The wash now bleeds with margin
calc(50% - 50vw), which reaches the viewport edges from within the wrap at
every width; the global overflow-x clip absorbs the scrollbar sliver the
trick can produce on Windows. Below 1040px nothing changes, which is why the
box never showed on laptop or phone. Changed: /assets/site.css.

## July 22, 2026 revision (6)

Accessibility polish, none of it visible to a mouse or a finger: a skip-to-
content link on every page (off-screen until focused — the case pages put a
nav and a seven-chapter rail before the article); keyboard focus on a journal
or work entry now gets everything hover and press get (terracotta title,
read-more arrow, the stones running), not just the spotlight; and --muted
darkened from #6e6f5c to #656654, lifting the smallest text on the site from
4.47:1 to ~5.1:1 against paper — same olive, a few percent deeper, checked
against every use (the dark footer has its own paper-tinted values and is
untouched). Changed: /assets/site.css, every page's <body> and <main>.

## July 22, 2026 revision (5)

Case-study closings: the "Looking for the right shape" section was the one
element on an essay page not on the reader's column — its content sat on the
960 wrap's left edge, exactly 140px left of the centered 680 everything else
lives on (a homepage habit that lost its illustration counterweight in the
move). The closing's wrap is now capped at 680; the tint still runs
full-bleed. Changed: /assets/site.css.

## July 22, 2026 revision (4)

Journal post footers: the contact block was the one composed moment on the
site without a scene, and its answer row sat left of its centered question.
Fixed both. Each post now closes with the homepage conversation reused small
— the same stone and sun, at 200px, drifting on the ambient tier (slower and
shallower than the homepage's hover version) — set on the sky ground,
full-bleed to the same edges as the case studies' closing tint. The journal
was the only long read that didn't end this way; now all of them do. The
hairline rule above the block retired; the wash edge does the separating.
The back link stays on paper, after. Changed: /assets/site.css, all three
/journal/ posts.

## July 22, 2026 revision (3)

Doors on touch devices: hover can't wake the scenes, so scroll position now
does. The door nearest the middle of the screen runs its animation; the
others hold still — one at a time, the doors' own rule with the thumb for a
cursor. Gated by (hover: none), not width: a narrow laptop keeps hover, an
iPad gets the scroll behavior. Desktop never attaches the listener; reduced
motion is respected where the animations live, in the CSS. Everything else
(index thumbnails, offerings shapes, contact illo) stays hover-only by
design — the heroes remain mobile's on-load moment. Changed:
/assets/site.css, /assets/site.js.

## July 22, 2026 revision (2)

Journal and Work indexes: each entry gained a "Read the post →" / "Read the
case →" line in the case-link idiom, visible at every width — on mobile the
hover spotlight never fires, so the entries carried no affordance at all.
The line is a decorative span (aria-hidden); the title's stretched link still
owns the whole card, so screen readers hear each entry once. A press now gets
what desktop gets on hover: terracotta title, siblings receding, and the
default grey tap flash suppressed. Changed: /assets/site.css, /journal/,
/work/.

## July 22, 2026 revision

Chapter bar, journal posts and case studies: the active chip now keeps itself
in view. Centering scrolls only the bar (never the page), with a
distance-scaled sine glide instead of the browser's brisk native smooth
scroll; a finger on the bar cancels it; tapping a chip centers its
destination at once instead of chasing the page chapter by chapter;
reduced-motion readers get an instant jump. The scroll-spy also runs once on
load, so a reader arriving mid-page finds the bar already pointing at the
right chapter. Only /assets/site.js changed.

## July 21, 2026 revision

Changes from the feedback round:

- Door cards: hairline borders and a hover lift; the bare arrow became each
  panel's own question ("Where do you need help?" and kin) with a plus that
  turns to a × when open. door_open analytics unchanged.
- Homepage order is now hero → doors → example → contact. The doors section
  carries the terracotta wash; the example block is back to paper.
- New page: /work/, a journal-format index of the three case studies, with
  role lines (Chief Operating Officer · Bandwagon, etc.) as each entry's
  meta. Footer gained a Work link on every page; sitemap updated.
- The /work/ hero glyph is an inuksuk that builds course by course on load,
  sun first. The Ad Hoc engagement mark was redrawn as a two-tone cairn with
  a squash-and-stretch cycle (shared verbatim between its case page and the
  index).
- Offerings: the eight linear shape rows became two 2×2 tile grids (Direct,
  On team) with four new shape illustrations; same copy, canonical order.
- Engagement models renamed: "On team" is now "Through a prime" (group
  head, group line, and the JSON-LD catalog). The second grid renders as a
  compact reprise: same shapes, no illustrations, half the visual weight.

Voice system, final: we sells outcomes and follows Auringon's name; Jonathan,
then he, sells the seat (prime-facing surfaces) and tells the record; I
survives only under a byline (the Journal, and the case studies via "As told
by Jonathan") and in clients' quoted words. Record is simple past, standing
experience present perfect, the offer simple present. The COO kicker on the
Bandwagon case is now spelled out.
- Voice system replaced with the publisher/author model (guide v3): Auringon
  is the imprint and takes being-verbs only; Jonathan is the sole first-person
  narrator; "he" retired from prose in favor of bylines; collaborative "we"
  survives where the client is inside it. Signature line is now "I build the
  operation behind the plan, then leave it running without me." Work index
  ledes moved to the pronoun-free Nameplate register.

## July 22, 2026 revision (8)

Door repositioning. The funder door now speaks to VC and philanthropic
funders about the company or grantee they back, not to gov/non-profit
implementers: "An operation that outlasts the money," a rewritten panel
intro, and pronouns flipped to their team. Founder headline traded
"operation" for "company" to keep the nouns distinct; consultancy door
recentered on the bid-to-delivery seam ("A win that gets delivered," the
ends named in the opener, "ramp" and the exit added to the scramble
scenario). Offerings: audience list now the canonical triplet, a funder
geometry sentence added to the direct group, Build and Number lines made
audience-neutral (page and JSON-LD). Sitemap lastmod bumped for / and
/offerings/. The voice guide's Doors row and funder tone row still need
updating to match (the guide lives outside this repo).
Second pass, same day: Read gained its two-week bound, Number its
"paid on performance" closer, Activation rewritten to the door's build
commitment and earnings-based pay (page and JSON-LD).
Group lines extended: the funder geometry sentence on the direct group,
and the consultancy line now carries the seat's range and the account
reassurance ("Put me on the bid, the delivery, or the handoff between
them. The account stays yours.").
