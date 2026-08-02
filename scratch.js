const text = `
*⚔️Promo Rank Awal Agustus*

⏰ -: Waktu sampai dengan 1 Agustus hingga 2 Agustus pukul 0.00 (bisa dibooking mulai sekarang sesuai antrian, jika admin belum online)

- *Lux* ~Rp.45.000~ \`Rp.30.000\`
(Lux Untuk 8 orang) 
- *Veil* ~Rp.65.000~ \`Rp.45.000\`
- *Rift* ~Rp.90.000~ \`Rp.70.000\`
- *Core* ~Rp.120.000~ \`Rp.95.000\`
- *Arch* ~Rp.160.000~ \`Rp.140.000\`
- *Custom* ~Rp.450.000~ \`Rp.325.000\`

*#RANKPERMANEN*
`;

const isPermanen = text.toLowerCase().includes('#rankpermanen');

// Regex to extract rank names, old price, new price
const regex = /-\s*\*(.*?)\*\s*~?Rp\.?([\d.]+)~?\s*(?:`Rp\.?([\d.]+)`|Rp\.?([\d.]+))/ig;

let match;
while ((match = regex.exec(text)) !== null) {
  const rank = match[1].trim();
  const oldPrice = parseInt(match[2].replace(/\./g, ''));
  const newPrice = parseInt((match[3] || match[4]).replace(/\./g, ''));
  console.log({ rank, oldPrice, newPrice });
}
