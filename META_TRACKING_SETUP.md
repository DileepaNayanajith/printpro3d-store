# Meta website tracking rollout

This change is a browser integration, disabled unless VITE_META_PIXEL_ID is set at build time. It does not deploy, change Meta asset permissions or send server-side events.

## Proposed configuration

- Website: https://printpro3d.lk
- Existing website pixel to verify and connect: 1020017270659994 (PrintPro3D's pixel).
- Ad account: 1093902011166579.
- Set VITE_META_PIXEL_ID=1020017270659994 in the storefront build environment only after verifying account access. Pixel IDs are public; never put a Conversions API token in VITE_*.
- Rebuild/redeploy after changing this variable.

## Events and consent

Advertising measurement requires a new explicit opt-in; prior Google Analytics consent alone is insufficient. Reject, analytics-only, and analytics + advertising choices are available. Browser privacy signals override consent. Raw customer contact details and advanced matching are not implemented.

PageView, ViewContent, AddToCart and InitiateCheckout use catalogue fields with LKR values. OrderSubmitted is a custom event after the checkout API accepts the request. It is **not Purchase**.

Purchase requires the existing authenticated OMS account response to confirm an eligible COD order or verified bank payment, matching the saved total. Purchase value excludes shipping. Stable event IDs and browser storage prevent duplicate reporting while advertising consent remains active. Private routes and unsafe query strings are excluded from pixel calls, so reconciliation waits for a return to a public page.

## Material limitation: not complete purchase optimization

Browser reconciliation needs the same browser, advertising consent, an authenticated account and a return visit after confirmation. Guest orders and customers who never return will be missed. This is not sufficient as the sole reliable purchase signal for paid acquisition.

Complete the OMS-to-Meta Conversions API integration before claiming end-to-end tracking. It must use actual order confirmation/payment state, stable event IDs shared with the browser, consent-aware attribution retained from checkout, and a persistent outbox with retries. Do not classify form submissions or checkout clicks as purchases, and do not expose the CAPI access token to the browser. Delivered-order profitability remains a separate OMS metric.

## Acceptance before publishing ads

1. Verify the pixel owner and connect it to the intended ad account in Meta.
2. Deploy the reviewed website change with the public pixel ID configured.
3. Use Meta Test Events to verify opt-in, no tracking after reject/withdrawal, page/product/cart/checkout events, correct LKR values, private-page exclusion and no duplicate events.
4. Use an explicitly designated test order with OMS access to verify confirmation and cancellation handling. No real production order was placed in this task.
5. Implement and test the server-side confirmation path for guests/non-returning customers.
6. Select the verified dataset and Purchase event in the campaign. Obtain final approval for $5/day ongoing spend.
