# PRINTPRO3D Meta measurement

Website: https://printpro3d.lk. Pixel: 1770603234189018, created in ad account 1093902011166579. Public pixel ID defaults to this value and can be overridden by VITE_META_PIXEL_ID at build time. Never place an access token in a VITE variable.

## Consent and browser events

A separate advertising opt-in is required; existing analytics consent alone does not enable Meta. Reject, analytics-only and analytics + advertising choices are provided. Do Not Track and Global Privacy Control override advertising consent. Advanced matching is disabled in the code; names, email addresses, phone numbers and postal addresses are not sent to Meta.

Public catalogue pages generate PageView, ViewContent, AddToCart and InitiateCheckout using catalogue SKUs and LKR prices. Private routes, fragments, arbitrary query strings and unsafe UTM values are excluded. Accepted checkout requests generate custom OrderSubmitted, never Purchase.

## Confirmed purchases via OMS

The storefront bridge sends opted-in _fbp/_fbc identifiers with server-calculated item prices and shipping to the authenticated OMS intake. The OMS stores this attribution for at most 30 days. No historical leads are backfilled.

Only the existing order qualification transaction queues Purchase: COD must have its confirmed total unchanged; bank orders require verified payment. Value excludes shipping. A persistent SQLite outbox uses a unique order ID, atomic leases, stable event ID/time, retries and expiry. Cancelled orders are suppressed before sending. Browser return visits are not required and never send Purchase, avoiding browser/server duplication.

The private OMS variable META_CAPI_ACCESS_TOKEN enables delivery to Meta. It must be generated for the correct pixel and saved only in the server environment. With no token the worker sends nothing. Checkout/order processing remains functional if Meta is unavailable. The application sends only consented Meta identifiers, browser User-Agent, catalogue items, order value, an opaque event ID and a fixed public checkout URL.

Withdrawing advertising consent requests removal of this browser's pending attribution and unsent conversions while online. Previously transmitted events cannot be recalled by this mechanism. Browser pending request references expire after 30 days. Delivered-order profitability remains a separate OMS metric: a confirmed COD order can still be returned or refused.

## Publication checklist

- Deploy the OMS branch and storefront branch, preserving the existing OMS volume and checkout bridge credentials.
- Generate and privately save the CAPI token. Current Meta UI reports that a business portfolio admin/developer is required; do not claim server tracking is live until this is resolved.
- Confirm new events in Meta Test Events after advertising opt-in. Check reject/withdrawal, private page exclusion, product/cart/checkout LKR values and server event acceptance.
- Automated tests cover actual qualification, unpaid bank orders, cancellation, consent, retry persistence, duplicate prevention, server-side prices and private bridge boundaries. No real production order was created for tests.
- Verify the selected ad dataset/Purchase event, audience, authentic photo, destination URL and tracking parameters.
- Obtain final approval for the selected campaign's $5 USD daily ongoing spend. Do not publish unrelated drafts.
