<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/header/gradient.svg?title=FeedbackIO&subtitle=Collect,+manage+%26+showcase+user+feedback&theme=orange&mode=dark" />
    <img alt="FeedbackIO — collect, manage & showcase user feedback" src="https://shieldcn.dev/header/gradient.svg?title=FeedbackIO&subtitle=Collect,+manage+%26+showcase+user+feedback&theme=orange&mode=light" width="820" />
  </picture>
</p>

<p align="center">
  Feedback collection for makers — branded feedback pages, a wall of fame, analytics,
  embeddable widgets, and shareable README badges.
</p>

<p align="center">
  <img alt="Appwrite Hackathon 2024 Winner" src="https://shieldcn.dev/badge/Appwrite%20Hackathon-2024%20Winner-FD366E.svg?logo=appwrite" />
</p>

<p align="center">
  <a href="https://feedback-io-beta.vercel.app/"><img alt="Create your feedback badge" src="assets/create-feedback-badge.svg" height="20" /></a>
</p>

---

## ✨ Features

- **Branded feedback pages** — a customizable landing page per project (logo, colours, message, questions, star ratings) at `/{projectId}/landing-page`.
- **Auth & rate limiting** — collect feedback publicly, or gate it behind SSO (Appwrite OAuth) and per-IP rate limits.
- **Wall of Fame** — curate the best feedback and showcase it, with an embeddable wall for your own site.
- **Analytics** — visits, sentiment, and metadata charts per space.
- **Social import** — pull testimonials from Twitter/LinkedIn via background workers.
- **API keys** — submit feedback programmatically from your own app.
- **Shareable links** — temporary tokenized links (with expiry) and QR codes.
- **GitHub badges** — drop a "give feedback" badge in your README; it links to your public feedback page and can show a live feedback count, custom text, icons, and light/dark themes.

## 🧱 Tech stack

- **Next.js 14** (App Router) — SSR/BFF, server actions, route handlers
- **Appwrite** — database, auth, storage, and Python functions
- **Trigger.dev** — background jobs and scraping workers
- **Upstash Redis** — rate limiting and caching
- **Tailwind CSS + shadcn/ui** — UI
- **Puppeteer** — headless rendering for scraping/imports

## 🏆 Origin

Built during the **Appwrite Hackathon 2024** — and thanks to all the users, it won the hackathon. 🎉

---

## 🚀 Running the app locally

1. Storage → make sure to add permission for both `any` and `all users`.
2. Run either the script (if you wanna hustle like I did) or use the Appwrite CLI and the `appwrite.json` file:
   ```bash
   appwrite pull
   appwrite push <element>
   ```
3. For events, also use the JSON file.
4. For identifying any element like a db or collection, use the key instead of the literal. Example: don't write `databases.space`, rather `databases.<space_Id>`.
5. For functions, follow this: https://appwrite.io/docs/products/functions/develop#request
6. Also paste the env into the function environment variables.
7. For using Redis:
   - Run the docker compose.
   - Go to http://0.0.0.0:5540/ for using RedisInsight.
   - Use `redis://redis:6379` in RedisInsight for using the database.
   - Using a serverless Redis proxy as well in Docker, as suggested by the Upstash local development docs.

## 🔐 Implementing SSO and extending it

1. Basically for auth-required spaces, we need to authenticate users.
2. So if the server is telling the widget it is not authenticated, then the widget redirects to `/api/identity?next=<redirectURI>`.
3. Here the search param `next` is telling the redirect URI.
4. Then at `/api/identity` we authenticate the user with OAuth by creating a redirect OAuth URL using Appwrite and redirecting to that generated URL. Here we provide a success URL (if Google authentication is successful) and a failure case, which is redirection to the original site.
5. In the success case, we redirect again to `/identity/oauth?next=<>&userId=<>&secret=<>`. Here we create the session.
6. Then again redirect to the `?next` site with a token search param: `http://nextsite?token=<>`, which can be a frontend or the backend.
7. In the frontend, the client reads the token and saves it to local storage. With every request to `/api/feedback`, the token is sent to authenticate and accordingly the settings are sent.
8. If we want them to automatically get logged in at the FeedbackIO main site, then we can set the cookie before redirection to the next site, like we do in the main app.

## 🕷️ Why not Appwrite Functions for the scraping service?

I started with this only because it's simple: events published → scrapers consumed → operation → updated.

But Appwrite Functions literally didn't work for scrapers, maybe due to the level of abstraction it runs on. Headless browser drivers weren't found, and the custom downloading script also failed to download them during runtime — even if downloaded, path issues came up. I tried the approach I did in Vercel functions by downloading custom binaries to mitigate function size, but that also failed. So I'm going with Trigger.dev for running workers.

## 🧭 Decisions

1. **Creating separate schemas for each instead of clubbing them together.**
   - Pros — collection-level queries will be fast.
   - Cons — insertion will be heavy during the creation of a space, as the collection is populated by default data.

   But since pages are served individually to the client, that will be fast. Also, every page is one-to-one mapped to a space to uniquely query by `space_id` and update them.

2. **Appwrite functions are written in Python** because why not — it's my favourite language and I want to explore the SDKs to the utmost.

3. **The SSR/BFF code is written and managed using `node-appwrite` and Next.js.**

4. **The `delete-image` function runs twice.** The space is updated in the backend (in the `newFiles` field) to track whether an image was changed. During execution of the function we update once more, but the second one won't be highly expensive as it already ran — the check is important.

   Can be solved using an external queue/collection update: queue col updated → function for updating space, landing page, and deleting the old file. (Image change is unlikely to happen most of the time.)

## 🛠️ Improvements

1. Currently all pages and routes are totally dynamic with no caching. So they can be cached.
2. By using a domain, we can use apex domains to serve personalised pages.
3. Polls creation, form creation, etc.

## 📎 Notes

- Solving the Next.js and Trigger.dev build issue: https://github.com/triggerdotdev/trigger.dev/issues/1547
