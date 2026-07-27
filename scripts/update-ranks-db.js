const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const updates = [
  { name: 'LUX Rank (1 Bulan)', description: '🎁 Rank Perks:\n├ Prefix: [LUX]\n├ Access to set 5x Homes\n├ 3.500 Claim Blocks\n├ 2x Playerwarp Creation\n├ 3x Auction Sell\n├ Kit Lux\n├ 2 Free Pet Request\n├ 1 Free Hat Request\n├ 1 Free Particle Request\n└ 1 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n└ /Disposal' },
  { name: 'LUX Rank (Permanen)', description: '🎁 Rank Perks:\n├ Prefix: [LUX]\n├ Access to set 5x Homes\n├ 3.500 Claim Blocks\n├ 2x Playerwarp Creation\n├ 3x Auction Sell\n├ Kit Lux\n├ 2 Free Pet Request\n├ 1 Free Hat Request\n├ 1 Free Particle Request\n└ 1 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n└ /Disposal' },
  { name: 'VEIL Rank (1 Bulan)', description: '🎁 Rank Perks:\n├ Prefix: [VEIL]\n├ Access to set 8x Homes\n├ 7.500 Claim Blocks\n├ 3x Playerwarp Creation\n├ 3x Auction Sell\n├ Kit Veil\n├ 2 Free Pet Request\n├ 3 Free Hat Request\n├ 3 Free Particle Request\n└ 2 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n├ /Disposal\n├ /Enderchest\n└ /Back' },
  { name: 'VEIL Rank (Permanen)', description: '🎁 Rank Perks:\n├ Prefix: [VEIL]\n├ Access to set 8x Homes\n├ 7.500 Claim Blocks\n├ 3x Playerwarp Creation\n├ 3x Auction Sell\n├ Kit Veil\n├ 2 Free Pet Request\n├ 3 Free Hat Request\n├ 3 Free Particle Request\n└ 2 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n├ /Disposal\n├ /Enderchest\n└ /Back' },
  { name: 'RIFT Rank (1 Bulan)', description: '🎁 Rank Perks:\n├ Prefix: [RIFT]\n├ Access to set 11x Homes\n├ 9.500 Claim Blocks\n├ 4x Playerwarp Creation\n├ 4x Auction Sell\n├ Kit Rift\n├ 3 Free Pet Request\n├ 3 Free Hat Request\n├ 3 Free Particle Request\n└ 2 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n├ /Disposal\n├ /Enderchest\n├ /Back\n├ /Near\n└ /Ptime' },
  { name: 'RIFT Rank (Permanen)', description: '🎁 Rank Perks:\n├ Prefix: [RIFT]\n├ Access to set 11x Homes\n├ 9.500 Claim Blocks\n├ 4x Playerwarp Creation\n├ 4x Auction Sell\n├ Kit Rift\n├ 3 Free Pet Request\n├ 3 Free Hat Request\n├ 3 Free Particle Request\n└ 2 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n├ /Disposal\n├ /Enderchest\n├ /Back\n├ /Near\n└ /Ptime' },
  { name: 'CORE Rank (1 Bulan)', description: '🎁 Rank Perks:\n├ Prefix: [CORE]\n├ Access to set 15x Homes\n├ 15.000 Claim Blocks\n├ 5x Playerwarp Creation\n├ 4x Auction Sell\n├ Kit Core\n├ 3 Free Pet Request\n├ 4 Free Hat Request\n├ 5 Free Particle Request\n├ Unlock All Emotes\n└ 3 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n├ /Disposal\n├ /Enderchest\n├ /Back\n├ /Near\n├ /Ptime\n├ /Pweather\n└ /Heal' },
  { name: 'CORE Rank (Permanen)', description: '🎁 Rank Perks:\n├ Prefix: [CORE]\n├ Access to set 15x Homes\n├ 15.000 Claim Blocks\n├ 5x Playerwarp Creation\n├ 4x Auction Sell\n├ Kit Core\n├ 3 Free Pet Request\n├ 4 Free Hat Request\n├ 5 Free Particle Request\n├ Unlock All Emotes\n└ 3 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n├ /Disposal\n├ /Enderchest\n├ /Back\n├ /Near\n├ /Ptime\n├ /Pweather\n└ /Heal' },
  { name: 'ARCH Rank (1 Bulan)', description: '🎁 Rank Perks:\n├ Prefix: [ARCH]\n├ Access to set Unlimited Homes\n├ 25.000 Claim Blocks\n├ 7x Playerwarp Creation\n├ 6x Auction Sell\n├ Kit Arch\n├ 4 Free Pet Request\n├ 5 Free Hat Request\n├ 5 Free Particle Request\n├ Unlock All Emotes\n└ 5 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n├ /Disposal\n├ /Enderchest\n├ /Back\n├ /Near\n├ /Ptime\n├ /Pweather\n├ /Heal\n├ /Nick\n├ /Repair\n└ /Repair all' },
  { name: 'ARCH Rank (Permanen)', description: '🎁 Rank Perks:\n├ Prefix: [ARCH]\n├ Access to set Unlimited Homes\n├ 25.000 Claim Blocks\n├ 7x Playerwarp Creation\n├ 6x Auction Sell\n├ Kit Arch\n├ 4 Free Pet Request\n├ 5 Free Hat Request\n├ 5 Free Particle Request\n├ Unlock All Emotes\n└ 5 Free Toolskin Request\n\n💻 Rank Commands:\n├ /Fly\n├ /Craft\n├ /Recipe\n├ /Feed\n├ /Disposal\n├ /Enderchest\n├ /Back\n├ /Near\n├ /Ptime\n├ /Pweather\n├ /Heal\n├ /Nick\n├ /Repair\n└ /Repair all' },
  { name: 'CUSTOM Rank (1 Bulan)', description: '🎁 Rank Perks:\n├ Prefix: [Custom]\n├ Name Color: Pink/Custom\n├ Unlimited Sethome\n├ Keep XP & Inv\n├ No Chat Cooldown\n├ Unlimited Playerwarps\n├ Daily Reward: /reward custom\n├ 20 Player Vaults\n├ Diskon 30% Server Shop\n├ Join Full Server\n└ Custom Join/Quit Message\n\n💻 Rank Commands:\n├ Semua command dari rank ARCH\n├ /skull (Get player heads)\n├ /ptime (Personal time)\n└ /pweather (Personal weather)' },
  { name: 'CUSTOM Rank (Permanen)', description: '🎁 Rank Perks:\n├ Prefix: [Custom]\n├ Name Color: Pink/Custom\n├ Unlimited Sethome\n├ Keep XP & Inv\n├ No Chat Cooldown\n├ Unlimited Playerwarps\n├ Daily Reward: /reward custom\n├ 20 Player Vaults\n├ Diskon 30% Server Shop\n├ Join Full Server\n└ Custom Join/Quit Message\n\n💻 Rank Commands:\n├ Semua command dari rank ARCH\n├ /skull (Get player heads)\n├ /ptime (Personal time)\n└ /pweather (Personal weather)' }
];

async function main() {
  for (const item of updates) {
    await prisma.product.updateMany({
      where: { name: item.name },
      data: { description: item.description }
    });
    console.log(`Updated ${item.name}`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
