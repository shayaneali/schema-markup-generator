# Contributing

Thanks for helping. Keep it simple: vanilla JS, no dependencies, no build step.

## Workflow
1. Fork the repo and create a branch: `git checkout -b feat/event-schema`
2. Make one focused change. Run the app locally (`python3 -m http.server`) and try it with the keyboard.
3. Commit with a clear message, push, and open a pull request describing what changed and why.

## Adding a schema type
Add an entry to `SCHEMAS` in `js/app.js` with `label`, `icon`, `fields` (use `F(id, label, level)`) and `build(values)`. Add a preview in `PREV`. Check the output with Google's Rich Results Test.

## Standards
- Accessible: labels, focus styles, keyboard support
- No fake data, no tracking, no API keys in code
- Readable code with short comments where helpful

## Good first issues
1. Add a "Download .json" button next to Copy
2. Add the BreadcrumbList schema type
3. Add a character counter to the Article summary field
