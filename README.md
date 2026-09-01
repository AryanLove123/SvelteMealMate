# SvelteMealMate

A recipe discovery, favorites, meal-planning, and community-recipe-sharing app built with **SvelteKit**, using a custom **Stencil** web component library for its UI, and **MongoDB** for community data. Public recipe data is sourced from [TheMealDB](https://www.themealdb.com/api.php).

- **Live app:** https://svelte-meal-mate.vercel.app/
- **GitHub repository:** https://github.com/AryanLove123/SvelteMealMate
- **Stencil UI component library (published on npm):** https://www.npmjs.com/package/recipemealui

---

## Tech stack

- **Frontend framework:** SvelteKit (Svelte 5, runes mode)
- **UI components:** Custom Stencil web components, published as the `recipemealui` npm package and consumed as native custom elements inside Svelte
- **Database:** MongoDB (stores community-created recipes, favorites, and meal-plan entries)
- **External data:** TheMealDB REST API (public recipe search/browse)
- **Validation:** Zod schemas shared across client and server

---

## Assumptions made

- **Authentication is intentionally simplified.** There is no real signup/password flow — logging in only requires entering any unique, unused name. This is a deliberate "dummy login" so the app's core features (favoriting, meal planning, recipe creation/editing) can be evaluated without building out full auth. Any name not already taken creates a new user session.
- **Cascading delete is implemented for community recipes.** If a community recipe is deleted, any favorites or meal-plan entries referencing it (belonging to any user, not just its creator) are cleaned up automatically rather than left dangling.
- **Community recipe data lives entirely in MongoDB**, separate from TheMealDB's external recipes. The app treats `source: 'external'` and `source: 'community'` as two distinct recipe origins throughout (favorites, meal plan, discovery, etc.), resolved back to a unified summary shape for display.
- **Category and area for community recipes are constrained to TheMealDB's canonical category/area lists** (via dropdowns in the recipe form) rather than free text, so community recipes always integrate correctly with the discover page's category/area filters.
- **TheMealDB's free-tier API has no official rate-limit documentation**, so occasional `429` responses during heavy filtering/searching are expected and are not specifically handled with retry/backoff in this build (kept out of scope for the assignment).

---

## Setup instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm
- A MongoDB connection (local instance or a hosted cluster, e.g. MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/AryanLove123/SvelteMealMate.git
cd SvelteMealMate/MealMate
```

### 2. Install dependencies
```bash
npm install
```
This installs the SvelteKit app's dependencies, including `recipemealui` (the published Stencil component library) from npm.

### 3. Configure environment variables (Already Provided in the zipped folder)
Create a `.env` file in the project root (see `.env.example` if present in the repo) with at least:
```env
MONGODB_URI=your-mongodb-connection-string
```
`MEALDB_BASE_URL` is optional — it defaults to TheMealDB's public base URL (`https://www.themealdb.com/api/json/v1/1`) if not set.

### 4. Starting the development server
```bash
npm run dev
```
The app will be available at **http://localhost:5173** by default.

### 5. Building for production
```bash
npm run build
npm run preview
```

---

## Notes on the component library

UI elements such as `recipe-form`, `recipe-grid`, `meal-plan-week`, `modal-dialog`, etc. are custom elements defined in the separately published `recipemealui` Stencil package, not native Svelte components. They're consumed directly in `.svelte` files as HTML tags and communicate with the SvelteKit app via DOM events (e.g. `onmeal-add`, `onrecipe-submit`) and callback/prop bindings.
