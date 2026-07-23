import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initialProducts = [
  { name: 'LUX', description: 'Rank mewah dengan keuntungan eksklusif dan prefix spesial.', category: 'Rank', price: 25000, duration: 'Permanen', image: 'https://i.ibb.co.com/pZ2D8X0/Sera-Logo.png' },
  { name: 'RIVER', description: 'Rank premium yang memberikan akses fitur spesial.', category: 'Rank', price: 20000, duration: 'Permanen', image: 'https://i.ibb.co.com/pZ2D8X0/Sera-Logo.png' },
  { name: 'VVIP', description: 'Status prestisius untuk pemain VIP dengan bonus mingguan.', category: 'Rank', price: 15000, duration: 'Permanen', image: 'https://i.ibb.co.com/pZ2D8X0/Sera-Logo.png' },
  { name: 'VIP', description: 'Akses khusus dengan fitur ekstra untuk mempermudah petualangan.', category: 'Rank', price: 10000, duration: 'Permanen', image: 'https://i.ibb.co.com/pZ2D8X0/Sera-Logo.png' },
  { name: 'Battle Pass', description: 'Buka hadiah premium untuk setiap level.', category: 'Pass', price: 30000, duration: 'Season', image: 'https://i.ibb.co.com/pZ2D8X0/Sera-Logo.png', isPopular: true },
  { name: 'Unban', description: 'Beli kesempatan kedua untuk bermain kembali.', category: 'Service', price: 50000, duration: 'Sekali', image: 'https://i.ibb.co.com/pZ2D8X0/Sera-Logo.png' }
];

async function main() {
  console.log('Seeding database...');
  for (const product of initialProducts) {
    await prisma.product.create({
      data: product
    });
  }
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
