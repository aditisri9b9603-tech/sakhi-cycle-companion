# Sakhi Cycle — Polish Pass

Theme stays exactly the same (rose/peach glass + warm gradients). Only additive UI polish + the four feature fixes below. No new dependencies, no backend.

## 1. Home dashboard — full 3D, responsive, with CycleRing

Edit `src/routes/index.tsx`:
- Replace the flat phase progress bar with the existing `<CycleRing insight={insight} />` placed inside a floating glass card. Show ring on the left, "Today / phase / next period / fertile window" stats on the right in a 2-col grid (`grid-cols-1 md:grid-cols-[260px_1fr]`).
- Add a floating affirmation chip overlaid on the hero (already partially there) and make it visible on all breakpoints (`block` not `hidden sm:block`).
- Wrap the dashboard card with `card-3d` + subtle hover `tilt`. Add `animate-float` to a small accent orb behind the ring.
- Quick-action grid for the 8 feature tiles: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` so it fills wide desktops and stacks cleanly on phones.
- Guard: if no profile yet, show a "Set up your cycle" CTA inside the same card so the dashboard never looks empty.
- Audit text sizes: `text-3xl sm:text-4xl md:text-5xl` on the H1, `text-sm sm:text-base` on body, `min-w-0` + `truncate` on stat rows.

## 2. Products — fix broken YouTube tutorials

Some current IDs (e.g. `Yb2sZBVjGNc`, `OQg-iozkUSY`) return "video unavailable". Edit `src/routes/products.tsx`:
- Replace each product's `videos` array with verified, embeddable public tutorials. For pads, add the user-supplied video first: ID `kmWbOC8Fbb0` (from `https://youtu.be/kmWbOC8Fbb0`) as "How to use a sanitary pad — quick guide".
- Use neutral, well-known channels (e.g. Sirona, Stayfree, Saalt, DivaCup) and keep 1–2 videos per product.
- Add a small "Watch on YouTube" link under the player (`https://www.youtube.com/watch?v=<id>`) as a fallback when embedding is blocked.
- Switch iframe to `https://www.youtube.com/embed/<id>?rel=0` (the standard host is more reliably embeddable than `youtube-nocookie.com` for some uploads).
- Make the player + thumbnail list responsive: `grid-cols-1 lg:grid-cols-2`, player keeps `aspect-video w-full`.

## 3. Vibes — add Bollywood Spotify playlists

Edit `src/routes/vibes.tsx`:
- Extend `PLAYLISTS` with 4 verified public Bollywood playlists (Spotify's "Bollywood Butter", "Bollywood Acoustic", "Hot Hits Hindi", "Bollywood Romance") using their `open.spotify.com/embed/playlist/<id>` IDs. Group via a small tab switcher: "For Your Phase" vs "Bollywood".
- Each playlist stays inside a `card-3d` glass tile, `grid-cols-1 md:grid-cols-2` so phones get one column.
- Keep existing Affirmations / Breathe / Mood Match tabs untouched.

## 4. Buddy — fix WhatsApp matching flow

Edit `src/routes/buddy.tsx`:
- Bug: pairing always works but the "save WhatsApp" step silently no-ops if the field is empty, and the share link uses the user's own number (which is wrong for "connecting" to the buddy). Fix:
  - Onboarding form requires a valid `+<country><number>` (regex check) when "Enable WhatsApp connect" is on; show inline error.
  - Persist number to `sakhi:buddy:wa` and surface it in the sidebar as "Your WhatsApp" with an edit button.
  - Add a second action **"Open WhatsApp with {buddy.name}"** that opens `https://wa.me/?text=...` (no number = WhatsApp's "share to a contact" picker) pre-filled with: "Hey! I'm your Sakhi Cycle buddy ({buddy.name} persona). Want to check in this week? 🌷". This is the realistic flow given no real matchmaking backend.
  - Keep the existing "Copy invite link" (uses the user's saved number) so a real friend can be invited.
  - Add a tiny "How matching works" disclosure so users understand the in-app chat is an AI persona and the WhatsApp button is for inviting a real friend.
- Visual: chat card gets `card-3d`, message bubbles get `shadow-soft` + slight `backdrop-blur`, sidebar cards float with `animate-float` (very subtle, staggered delays).

## 5. Cross-cutting glassy/floaty polish (theme unchanged)

- Promote remaining `glass` cards on Home / Vibes / Buddy / Products to `card-3d` where appropriate.
- Add `hover:-translate-y-1 transition-all` to clickable cards.
- Ensure every page wraps headers in `grid-cols-[minmax(0,1fr)_auto]` pattern so 360px screens never clip.

## Out of scope
- Real buddy matchmaking backend (still localStorage, by your earlier choice).
- Theme / color changes.
- New routes or new dependencies.

Approve and I'll implement in one pass.
