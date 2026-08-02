import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const isPermanen = text.toLowerCase().includes('#rankpermanen');
    const regex = /-\s*\*(.*?)\*\s*~?Rp\.?\s*([\d.]+)~?\s*(?:`Rp\.?\s*([\d.]+)`|Rp\.?\s*([\d.]+))/ig;

    const products = await prisma.product.findMany();
    let updatedCount = 0;

    let match;
    while ((match = regex.exec(text)) !== null) {
      const rank = match[1].trim();
      const oldPrice = parseInt(match[2].replace(/\./g, ''));
      const newPrice = parseInt((match[3] || match[4]).replace(/\./g, ''));

      // Calculate discount percentage.
      // (1 - newPrice/oldPrice) * 100
      let discountPercentage = (1 - (newPrice / oldPrice)) * 100;
      
      // We will look for products that match the rank name.
      // e.g. "Lux" -> matches "LUX Rank (Permanen)"
      const matchedProducts = products.filter(p => {
        const isNameMatch = p.name.toLowerCase().includes(rank.toLowerCase());
        
        // If #RANKPERMANEN is mentioned, only target "Permanen" items
        if (isPermanen) {
          return isNameMatch && p.duration.toLowerCase().includes('permanen');
        }
        
        return isNameMatch;
      });

      for (const product of matchedProducts) {
        // If the product price in db is not the oldPrice, we use the DB price to calculate discount.
        // E.g. DB price 45000, oldPrice 45000, newPrice 30000 => 33.333%
        // E.g. DB price 50000, oldPrice 45000, newPrice 30000 => ((50000-30000)/50000) = 40%
        // Let's just calculate based on the newPrice from the text compared to the DB price.
        // If user wants exactly newPrice, discount = (1 - (newPrice / product.price)) * 100
        const calculatedDiscount = (1 - (newPrice / product.price)) * 100;
        
        await prisma.product.update({
          where: { id: product.id },
          data: { discount: calculatedDiscount }
        });
        updatedCount++;
      }
    }

    return NextResponse.json({ success: true, updatedCount });
  } catch (error) {
    console.error('API POST promo parser error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
