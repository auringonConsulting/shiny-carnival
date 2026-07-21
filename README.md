# Auringon — multi-page site

Built July 16, 2026 from the single-file index.html. Same design, same copy
(including the voice-guide fixes), split into real pages.

## What's here

    /                                          Home (doors, example of the work)
    /about/                                    About
    /offerings/                                Approach & Offerings  (#shapes anchor)
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
