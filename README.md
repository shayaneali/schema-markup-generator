# Schema Markup Generator

> Fill in a form, get valid JSON-LD for LocalBusiness, Article, Product and FAQPage, with a live search preview. No build step, no tracking.

## The problem

Writing structured data by hand is slow, and one missing comma or required property can make Google ignore it. This tool builds the JSON-LD for you, flags what is missing as you type, and shows roughly how the result could appear in search.

![Screenshot placeholder: add docs/screenshot.png](docs/screenshot.png)

**Live demo:** https://shayaneali.github.io/schema-markup-generator/

## Features

- Four schema types: LocalBusiness (with sub-types), Article / BlogPosting / NewsArticle, Product (offer + rating), FAQPage (add and remove questions)
- Live, syntax-highlighted JSON-LD; changed lines flash so you see what each field does
- Completeness score with plain-English errors and suggestions (required vs recommended)
- Format checks for URLs, phone numbers, dates and numbers; headline length warning
- Search preview card, including an expandable FAQ
- Copy as raw JSON or wrapped in a `<script type="application/ld+json">` tag
- Remembers your last session locally (browser storage only)
- Responsive, keyboard friendly, visible focus, labelled fields, dark mode, respects reduced motion

## Quick start

No install needed.

```bash
git clone https://github.com/shayaneali/schema-markup-generator.git
cd schema-markup-generator
python3 -m http.server 8000   # or: npx serve
```

Open http://localhost:8000. There are no API keys, so no `.env` file is needed.

## Tech stack

Vanilla HTML, CSS and JavaScript. No dependencies. Fonts: Bricolage Grotesque and JetBrains Mono (Google Fonts, with system fallbacks).

## Roadmap

- [ ] Event, Recipe, JobPosting and BreadcrumbList types
- [ ] Import: paste existing JSON-LD to edit it
- [ ] Download as `.json`
- [ ] Unit tests for `clean()` and `check()`

## Contributing

Pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). A new schema type is one object in `SCHEMAS` inside `js/app.js`.

## License

MIT. See [LICENSE](LICENSE).
