// Store prices are whole Sri Lankan rupees; a fixed locale keeps grouping identical in prerendered and browser views.
export const formatLkr = (value: number) => `Rs. ${value.toLocaleString('en-LK')}`
