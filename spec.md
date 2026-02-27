# Specification

## Summary
**Goal:** Build a single-user personal brand landing page for Amazon product promotion, with Internet Identity authentication, a profile section, and a product showcase grid.

**Planned changes:**
- Profile page with circular avatar placeholder, display name, bio/tagline, and social handle fields; editable by authenticated owner, publicly viewable
- Amazon product showcase section where the owner can add, edit, and delete product listings (title, description, thumbnail image URL, Amazon affiliate URL, optional price); displayed as responsive card grid
- Each product card shows thumbnail, title, price (if set), short description, and a "View on Amazon" button opening the affiliate link in a new tab
- Internet Identity login/logout in the header; edit/add/delete actions restricted to authenticated owner; unauthenticated visitors see read-only profile and products
- Bold modern e-commerce influencer theme: warm amber accents for CTAs, charcoal dark hero section with light text, responsive card grid, subtle hover scale/shadow animations on product cards, bold modern typography
- Hero banner and default product placeholder loaded as static assets from `frontend/public/assets/generated/`

**User-visible outcome:** Visitors can view the owner's personal brand profile and browseable Amazon product recommendations. The authenticated owner can log in via Internet Identity to edit their profile and manage product listings.
