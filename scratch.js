const text = `- *Lux* ~Rp 45.000~ Rp 30.000
- *Veil* ~Rp.65.000~ Rp 50.000
- *Rift* ~Rp 90.000~ Rp.75.000`;

const regexOld = /-\s*\*(.*?)\*\s*~?Rp\.?([\d.]+)~?\s*(?:`Rp\.?([\d.]+)`|Rp\.?([\d.]+))/ig;
const regexNew = /-\s*\*(.*?)\*\s*~?Rp\.?\s*([\d.]+)~?\s*(?:`Rp\.?\s*([\d.]+)`|Rp\.?\s*([\d.]+))/ig;

console.log("OLD REGEX MATCHES:");
let match;
while ((match = regexOld.exec(text)) !== null) {
  console.log(match[1]);
}

console.log("NEW REGEX MATCHES:");
while ((match = regexNew.exec(text)) !== null) {
  console.log(match[1]);
}
