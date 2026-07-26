const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const products = await prisma.product.findMany();
  console.log(products.map(p => ({ id: p.id, discount: p.discount, discountExpiresAt: p.discountExpiresAt })));
}
main().catch(console.error).finally(() => prisma.$disconnect());
