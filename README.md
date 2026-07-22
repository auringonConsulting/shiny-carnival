# Auringon — multi-page site

Built July 16, 2026 from the single-file index.html. Same design, same copy
(including the voice-guide fixes), split into real pages.

## What's here

    /                                          Home (doors, example of the work)
    /about/                                    About
    /offerings/                                Offerings  (#shapes anchor)
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
