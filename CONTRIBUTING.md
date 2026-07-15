# Contributing to Music Place

## Branch Naming
- `feature/<description>` — new features (e.g., feature/payment-integration)
- `fix/<description>` — bug fixes (e.g., fix/cart-total-calculation)
- `chore/<description>` — maintenance (e.g., chore/update-dependencies)

## Commit Messages
- Use present tense: "Add product search" not "Added product search"
- Keep under 72 characters for the subject line
- Reference issues: "Fix cart bug #123"

## Code Standards
- TypeScript strict mode
- No hardcoded text — all content from JSON files in data folder
- No dangerouslySetInnerHTML — use stripHtml() or React components
- kebab-case for files/folders, PascalCase for components
- Test at 4 screen sizes: 1440px, 1080px, 720px, 375px

## Pull Requests
- One feature per PR
- Include screenshots for UI changes
- Ensure no console errors
