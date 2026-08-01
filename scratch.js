const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'LiveChatWidget.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements
const replacements = [
  { from: /bg-\[\#0B0B0B\]/g, to: 'bg-[#0b1121]' },
  { from: /border-\[\#0B0B0B\]/g, to: 'border-[#0b1121]' },
  
  { from: /bg-\[\#1F1F1F\]/g, to: 'bg-[#1a2333]' },
  { from: /border-\[\#1F1F1F\]/g, to: 'border-[#1a2333]' },
  
  { from: /bg-\[\#2A2A2A\]/g, to: 'bg-[#2a374a]' },
  { from: /border-\[\#2A2A2A\]/g, to: 'border-[#2a374a]' },
  
  // Floating button & accent colors
  { from: /bg-\[\#FF4D4D\]/g, to: 'bg-[#f2e28a] text-[#0b1121]' },
  { from: /text-\[\#FF4D4D\]/g, to: 'text-[#f2e28a]' },
  { from: /border-\[\#FF4D4D\]/g, to: 'border-[#f2e28a]' },
  
  { from: /hover:bg-\[\#ff3333\]/g, to: 'hover:bg-[#d1c272]' }, // darker gold for hover
  
  { from: /rgba\(255,77,77,0\.4\)/g, to: 'rgba(242,226,138,0.4)' },
  
  // Specific tweaks
  // In user chat bubble, text should be dark instead of text-white if bg is gold
  { from: /bg-\[\#f2e28a\] text-\[\#0b1121\] text-white rounded-tr-sm/g, to: 'bg-[#f2e28a] text-[#0b1121] rounded-tr-sm font-medium' },
  // And time text inside user bubble
  { from: /text-white\/80/g, to: 'text-[#0b1121]/60' },
  // Send button text-white -> text-[#0b1121]
  { from: /text-white w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-sm/g, to: 'text-[#0b1121] w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 active:scale-95 shadow-sm' },
  // Floating button text-white -> text-[#0b1121]
  { from: /bg-\[\#f2e28a\] text-\[\#0b1121\] hover:bg-\[\#d1c272\] text-white w-14 h-14/g, to: 'bg-[#f2e28a] hover:bg-[#d1c272] text-[#0b1121] w-14 h-14' },
];

replacements.forEach(({ from, to }) => {
  content = content.replace(from, to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Theme updated successfully.');
