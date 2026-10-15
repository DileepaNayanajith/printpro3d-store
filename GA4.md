# PRINTPRO3D GA4 integration

Framework inspected: Vue 3, Vue Router, Pinia, Vite, Node server and Vue prerendering. Measurement ID: **G-7ZX443RS8G**. No new environment variables or dependencies. Production collection is restricted to printpro3d.lk and www.printpro3d.lk; previews/localhost do not send Google events.

## Consent and privacy

Official asynchronous Google tag loads only after opt-in. Ads storage, ad user data, ad personalization and Google signals remain disabled. Existing first-party visitor statistics use the same choice. Unknown consent means no analytics; Do Not Track and Global Privacy Control override acceptance. Choice expires after 180 days. Footer Privacy settings permits withdrawal, clears analytics cookies and pending records and reloads to stop the loaded tag. Cart, authentication and order operations are unaffected. `/privacy` is prerendered and included automatically in the sitemap.

Google Analytics property PRINTPRO3D Website (559154173), stream PRINTPRO3D E-Commerce Store (16135989951), verified matching measurement ID. Enhanced Measurement was switched OFF in the property on 15 October 2026, to avoid duplicate history pageviews and automatic collection of WhatsApp URLs/form details. Keep it off. The app explicitly uses `send_page_view:false` and sends route pageviews itself. See [Google page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views) and [consent guidance](https://developers.google.com/tag-platform/security/guides/consent).

Names, phone numbers, addresses, emails, account credentials, free-text order fields and WhatsApp message URLs are never included in application event payloads. Private account/admin/success URLs are excluded; shipping information includes only a constant delivery tier. Page URLs omit free query strings and hashes. Campaign labels retain sanitized standard UTM fields without changing the visitor's URL. Referrers contain origin only. Google still processes normal network/device information for consented analytics.

## Events and parameters

| Event | Trigger | Parameters |
|---|---|---|
| page_view | Initial public page after consent and each changed public route | Sanitized page_location, static/catalog page_title, origin-only page_referrer |
| view_item | Product route | currency LKR, value, items |
| add_to_cart | Successful cart addition/increase, including Buy it now | currency LKR, value, items with added quantity |
| remove_from_cart | Decrease/remove | currency LKR, value, items with removed quantity |
| view_cart | Open cart route | currency LKR, value, items |
| begin_checkout | Open checkout with items | currency LKR, value, items |
| add_shipping_info | Validated checkout submission; identical retries suppressed | currency LKR, value, items, shipping_tier=islandwide_delivery |
| order_submitted | Checkout API successfully accepts request | currency LKR, value, items; **not purchase** |
| purchase | Matching authenticated OMS confirmed order, same total | transaction_id=PP3D order reference, currency LKR, subtotal value, shipping, items |
| search | Header submit or product search after 500ms debounce | search_term=exact matched catalogue SKU or other; never typed free text |
| whatsapp_contact | Store WhatsApp anchor | interaction_context=store |
| product_inquiry | WhatsApp anchor while viewing a product | interaction_context=product |
| whatsapp_checkout | Custom-print WhatsApp quote or payment slip link | interaction_context=custom_print or store |

Every ecommerce item contains actual catalogue SKU as item_id, item_name, item_category, actual current unit price and quantity. Selected catalogue colour adds item_variant. `value` is merchandise subtotal; purchase `shipping` is separate, following [Google ecommerce guidance](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce). No customer identifier is sent. Cart restoration does not emit additions; cart clearing after checkout does not emit removals.

## Purchase limitations

The current checkout API returns `received`, not a confirmed sale. Successful submission is therefore `order_submitted`. Only an authenticated existing account-orders response with a real PP3D order reference, an allowed confirmed status and matching total can emit purchase. Bank orders also need payment_verified. Pending consented order snapshots contain only catalogue items, totals, shipping and reference, expire after 30 days and are checked on navigation and every visible minute. Guests, confirmations while browser is closed, another browser, changed totals, blockers, rejected consent and expired/cleared storage cannot be counted reliably. Complete guest/offline purchase coverage requires a future authorized OMS server-side confirmation integration; OMS code has not been changed.

Purchase markers are persisted before enqueueing to avoid duplicates on refresh/revisit. Cross-tab Web Locks are used when supported, with GA transaction_id as a secondary dedupe signal. A network failure after claiming can lose an event; browser analytics cannot guarantee exactly-once delivery. Refund/cancellation reconciliation is not implemented.

## Files

- src/lib/ga4-core.ts: allowlists, ecommerce payloads, confirmation rule, purchase dedupe.
- src/lib/ga4.ts: tag, router tracking, events and existing OMS confirmation reads.
- src/lib/consent.ts and src/components/CookieConsent.vue: optional analytics choices.
- src/lib/analytics.ts: consent gate for existing visitor statistics.
- src/main.ts: install once after initial route and cart restoration.
- src/stores/cartStore.ts: successful mutations, silent restoration.
- src/pages/CheckoutPage.vue: shipping and received-order snapshot.
- src/pages/ProductsPage.vue and src/App.vue: search actions; footer/banner integration.
- src/pages/CustomPrintPage.vue: WhatsApp quote action.
- src/pages/PrivacyPage.vue, src/router/index.ts, src/lib/seo.ts: policy route and metadata.
- server/ga4.test.mjs: payload/privacy/confirmation/dedupe and real tracker lifecycle tests.

## Validation and deployment

`npm run build` passes and prerenders 49 URLs plus 404. `npm test` passes 25 tests, including the existing checkout/SEO regression suite and seven new GA4 tests. Tests simulate Google transport and OMS confirmation without creating real customer orders or fake production revenue. Mobile 390x844 verified: banner fits without horizontal overflow; reject keeps tag absent. Existing custom-print 3D bundle size warning remains unrelated to analytics.

Deploy this repository to the existing PRINTPRO3D STORE Railway service using its normal Docker build (or `npx --yes @railway/cli up --service fbf93402-c627-4b3a-a13d-773f2a906a2b --environment 23a3ae60-1b65-410a-9292-3599118b3cf1`). Do not deploy to OMS. No DNS, prices, accounts, database schema or environment changes are needed.

## Verify in GA4

1. Open https://printpro3d.lk/products/1021?ga_debug=1&utm_source=whatsapp&utm_medium=social&utm_campaign=store_launch and accept analytics. Debug mode persists for client-side navigation in that tab until reload; ga_debug is not sent as a campaign or page parameter.
2. Open GA4 Admin > Data display > DebugView for PRINTPRO3D Website; select the test device. Check page_view and view_item, then add an item, open cart and checkout to see the corresponding events. Repeated same-route navigation must not duplicate page_view. Do not place a test production order just to generate revenue.
3. Reports > Realtime shows consented activity; acquisition reports take processing time. Standard reports can take 24–48 hours. DebugView may be blocked by browser privacy tools even if app logic works.
4. Purchase and shipping are verified safely in automated tests. For a genuine consented signed-in order, staff confirmation followed by a store visit should produce one purchase; refresh should not repeat it.
5. Reject or withdraw via footer Privacy settings; no subsequent analytics events should be sent. Google tag is absent on a fresh rejected visit.
6. Share tagged links using utm_source=facebook / instagram / whatsapp and utm_medium=social. Untagged WhatsApp links can appear as Direct because WhatsApp often supplies no referrer. UTMs cannot recover attribution missing from the incoming link.

Railway upload recovery: local uploads timed out during code snapshot creation. The existing STORE service is now connected to DileepaNayanajith/printpro3d-store, branch main, and deployments can build the exact pushed commit directly from GitHub. Future pushes to main may trigger STORE deployments. No OMS source/settings were changed.
