const text = `- *Lux* ~Rp.45.000~ Rp.30.000
- *Veil* ~Rp.65.000~ Rp.50.000`;

fetch('http://localhost:3000/api/products/promo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text })
}).then(res => res.json()).then(console.log).catch(console.error);
