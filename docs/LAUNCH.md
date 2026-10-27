# Launch kit

**Repo description:** Free, private schema markup generator: build valid JSON-LD for LocalBusiness, Article, Product and FAQ with a live search preview. Vanilla JS.

**Topics:** seo, schema-markup, json-ld, structured-data, schema-org, javascript, vanilla-js, web-tools

## Deploy
**GitHub Pages:** repo Settings > Pages > Source: "Deploy from a branch" > branch `main`, folder `/ (root)` > Save. Live at `https://shayaneali.github.io/schema-markup-generator/`.
**Netlify:** Add new site > Import from Git > pick the repo. Build command: empty. Publish directory: `.` > Deploy. (Or drag the folder onto app.netlify.com/drop.)

## LinkedIn / dev.to draft
I just shipped a small tool: a schema markup generator. You fill in a form (local business, article, product or FAQ) and it gives you JSON-LD you can paste into your page, with a score that tells you what Google still needs and a preview of how it could look in search.

I built it because hand-writing structured data is easy to get wrong. It is plain HTML, CSS and JavaScript, runs in the browser, and sends nothing anywhere.

Live: <your link>  |  Code (MIT): github.com/shayaneali/schema-markup-generator
Feedback and PRs welcome. Next up: a SERP snippet previewer.

## Reddit-style post (r/webdev "Showoff Saturday" or r/SideProject; check each sub's rules first)
**Title:** I built a free schema markup (JSON-LD) generator in vanilla JS, feedback welcome

I'm a CS student in Lahore working on frontend + SEO. I kept getting structured data wrong by hand, so I made a form-based generator for LocalBusiness, Article, Product and FAQ. It validates as you type and shows a rough search preview. No framework, no tracking, MIT licensed.
Known gaps: only 4 types, the preview is an approximation of Google's UI, and there are no tests yet. I'd love to hear which types or checks you'd want next.
Demo: <link> / Code: <link>
