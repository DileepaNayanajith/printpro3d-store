# PRINTPRO3D SEO implementation

Production canonical origin: https://printpro3d.lk . Vue 3 + Vue Router + Pinia + Vite; Railway runs Node 24 using the existing Dockerfile. Product data is the existing `src/data/products.json` catalog, not a new database. Orders/accounts continue through the private server-only OMS bridge.

## Rendering and automatic discovery

`npm ci && npm run build` builds the normal browser application, builds a temporary Vue server-rendering entry, then runs `scripts/prerender.mjs`. The same existing Vue components render 48 public URLs: 32 products, nine valid category queries, homepage, catalog, custom-print, about, contact, terms and warranty. No separate crawler-only template or browser automation is involved. Each render uses fresh Pinia/router state and cannot include saved customer data. Private routes retain the normal client application.

Node serves those generated pages to all visitors and crawlers, with route-specific head metadata. Vue mounts the same existing interactive UI after loading. Shopping, local cart/wishlist/theme, rack colour selection, quantity discount, customer account, custom STL preview and WhatsApp actions remain interactive. This is build-time pre-rendering, not per-request SSR. The private OMS/database is never queried during builds.

`/sitemap.xml` is generated from the deployed catalog on request, using the canonical domain. New valid catalog products and category values appear automatically after their normal rebuild/deploy, without editing a URL list. Products explicitly marked `published:false` or `deleted:true` are excluded. Sold-out but public products remain discoverable and carry OutOfStock schema. Product `updatedAt` or `lastModified` is included only when valid; no invented deployment timestamps are added. Update/remove products in the catalog and rebuild so the sitemap and prerendered HTML stay in sync.

`/robots.txt` allows public crawling and lists the sitemap. API/admin/login paths are disallowed. Cart/checkout/account/success/wishlist/compare/search pages carry meta and HTTP `noindex, follow`; keeping those routes crawlable lets Google see noindex. Robots rules are not authentication. Existing staff/session/access control was retained.

Product metadata uses actual catalog names, descriptions, photos, SKUs, LKR prices and stock status. JSON-LD includes Product/Offer/Brand/seller; no reviews, ratings, stock quantities, fake expiry dates or GTINs are invented. Prices are unchanged; the existing rack bulk offer remains separate from its single-item offer price. Canonicals and Open Graph URLs use printpro3d.lk. Invalid public/product/category routes return HTTP 404, including initial page loads. Private API/health/static handling and video ranges remain available.

Old Railway public HTML URLs redirect 301 to matching printpro3d.lk paths/queries. Private account/cart/checkout and API endpoints remain available to preserve their existing flows. Existing PUBLIC_URL was found to still reference the Railway origin. Environment variables are unchanged; an exact, owner-controlled custom-domain origin alias is accepted for checkout/account/analytics when the configured origin is one of the two known production origins. Arbitrary origins remain blocked, tested locally. No Cloudflare, DNS, OMS service or database changes were made.

## Files

- `src/lib/seo.ts`: shared canonical origin, route metadata, catalog visibility, descriptions, product schema, sitemap.
- `src/lib/seo-client.ts`, `src/main.ts`: metadata updates on client navigation; removes old product schema on non-product routes.
- `src/entry-prerender.ts`, `scripts/prerender.mjs`: build-time rendering of the existing Vue application.
- `src/router/index.ts`, `src/App.vue`, `src/stores/recentStore.ts`: server-safe router/state initialization.
- `server/seo.mjs`, `server/index.mjs`: HTTP sitemap/robots, prerendered HTML, metadata, noindex, 404 and canonical redirects.
- `server/origins.ts` and the checkout/account/analytics middleware: exact custom-domain compatibility with existing variables.
- `src/pages/ProductsPage.vue`: crawlable category links, published products and nonvisual homepage heading.
- `src/pages/ProductDetailsPage.vue`: shared existing descriptions, visible products and eager primary image.
- `src/components/ProductImage.vue`, `src/components/ProductCard.vue`: eager/high-priority images for the first catalog row; other product images stay lazy/async. Fixed-ratio image wells preserve layout.
- `Dockerfile`, `package.json`, `package-lock.json`, `vite.config.ts`, ignore files: reproducible Railway build and shared runtime SEO module.
- `server/seo.test.mjs`: HTTP/schema/discovery/privacy/redirect regression tests.

## Deploy

1. Run `npm ci`, `npm run build`, `npm test` using Node 24.
2. Deploy this repository using the existing Railway website service/Dockerfile. No new Railway project, variables or database migration is needed.
3. Check https://printpro3d.lk/sitemap.xml and https://printpro3d.lk/robots.txt . Verify product HTML includes its name, canonical, meta description and Product JSON-LD before JavaScript executes. Check an invalid product returns 404.
4. Run Google's Rich Results Test on a public product URL after deployment. Optional shipping/returns/review enhancement fields may be absent; do not invent values merely to clear recommendations.
5. Observe Core Web Vitals in Search Console as real visitor data accumulates. This change does not claim a measured PageSpeed score or guaranteed Google ranking.

## Google Search Console

1. Select the verified `printpro3d.lk` property.
2. Open **Sitemaps**. Submit `https://printpro3d.lk/sitemap.xml` (or `sitemap.xml` if the property prefix is already displayed).
3. Confirm the status becomes **Success**, then check discovered URLs and Page indexing over the following days.
4. In **URL inspection**, inspect the homepage, custom-print service and priority products such as `https://printpro3d.lk/products/1021`.
5. Choose **Test live URL**, review crawl/indexing availability and rendered content, then **Request indexing** if eligible. Do this for important pages; the sitemap handles routine discovery of the full catalog.
6. Inspect a private URL to confirm noindex and monitor Product snippets/Merchant listings reports after Google recrawls. Indexing and rich results are Google's decision and may take time.

References: [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [Product structured data](https://developers.google.com/search/docs/appearance/structured-data/product), [Sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

## Verification notes

The custom domain loaded in a normal browser during inspection. Automated Python requests received Cloudflare HTTP 403 before changes, while the Railway origin was accessible; this does not prove Googlebot is blocked. Cloudflare security/DNS was left unchanged. Use Search Console's live inspection to confirm Google's access and review Cloudflare security events only if Google reports a fetch block. Do not weaken security blindly.

Local build passed and all 18 regression tests passed, including the prior checkout/account/analytics tests. Browser checked metadata updates, product schema removal on checkout, Mochi Buy it now, mixed rack colour/three-rack discount, mobile category drawer and widths 320/390/768/1440 without page overflow. No real customer order or message was submitted.
