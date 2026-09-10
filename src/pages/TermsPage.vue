<script setup lang="ts">
const updated = '10 September 2026'
const sections = [
  { title: '1. About these terms', text: 'These terms apply when you browse PRINTPRO3D or place an order through this website. By submitting an order, you confirm that the information you provide is accurate and that you agree to these terms.' },
  { title: '2. Products and availability', text: 'We aim to display product descriptions, images, prices and stock information accurately. Colours and packaging may vary slightly. An order is subject to final stock and product-condition confirmation by our team.' },
  { title: '3. Prices and payment', text: 'All displayed prices are in Sri Lankan Rupees. Cash on Delivery includes a Rs. 400 delivery charge. Bank-deposit orders receive free delivery. We will provide the required payment instructions when confirming a bank-deposit order.' },
  { title: '4. Order confirmation', text: 'Submitting the checkout form sends an order request. The sale is confirmed only after our team verifies stock, delivery details and payment method with you. We may decline or cancel an order when an item is unavailable, information is incorrect or the order cannot reasonably be fulfilled.' },
  { title: '5. Delivery', text: 'Islandwide delivery is available through suitable delivery providers. Estimated delivery timing will be communicated during confirmation. Delays caused by weather, courier operations, incorrect addresses or events outside our reasonable control may affect delivery.' },
  { title: '6. Changes and cancellation', text: 'Contact us as soon as possible if you need to change or cancel an order. We will accept cancellation before dispatch where practicable. Once dispatched, cancellation or return depends on the item condition, delivery status and applicable consumer rights.' },
  { title: '7. Returns and damaged items', text: 'Inspect your parcel promptly. If an item arrives damaged, incorrect or apparently defective, contact us without delay and retain the item, packaging, receipt and clear photos or video. We will assess the issue and provide an appropriate remedy in line with the warranty and applicable law.' },
  { title: '8. Safe and responsible use', text: 'Follow the product manual, age guidance and safety instructions. Drones and RC products must be operated responsibly, away from restricted locations, people, traffic and unsafe conditions. The customer is responsible for complying with applicable operating rules.' },
  { title: '9. Privacy', text: 'Checkout information is collected only to process and support your order. We do not sell customer information. Appropriate care should be taken when sending personal or payment information through any communication channel.' },
  { title: '10. Consumer rights', text: 'Nothing in these terms excludes or limits rights or remedies that cannot lawfully be excluded under Sri Lankan consumer law. If a term conflicts with a mandatory legal requirement, that requirement will apply.' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-950 px-5 py-16 text-white sm:px-8">
    <div class="mx-auto max-w-4xl">
      <p class="section-kicker">Store information</p><h1 class="section-title">Terms & Conditions</h1><p class="mt-4 text-sm text-slate-500">Last updated: {{ updated }}</p>
      <div class="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-6 text-sm leading-7 text-cyan-100">This page explains how orders, payment, delivery and customer support work at PRINTPRO3D. Please read it before placing an order.</div>
      <div class="mt-8 space-y-4">
        <section v-for="section in sections" :key="section.title" class="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8"><h2 class="text-xl font-black">{{ section.title }}</h2><p class="mt-3 leading-7 text-slate-400">{{ section.text }}</p></section>
      </div>
      <div class="mt-10 flex flex-wrap gap-3"><router-link to="/warranty" class="primary-button">View warranty policy</router-link><router-link to="/products" class="secondary-button">Back to products</router-link></div>
    </div>
  </div>
</template>
