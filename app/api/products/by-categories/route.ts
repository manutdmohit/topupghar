import connectDB from '@/config/db';
import { Product } from '@/models/Product';
import { Category } from '@/lib/models/Category';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6'); // Number of products per category
    const includeInactive = searchParams.get('includeInactive') === 'true';

    // Get active categories
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // Get products for each category
    const productsByCategory = await Promise.all(
      categories.map(async (category) => {
        const filter: any = {
          category: category.value,
          isActive: true,
          inStock: true,
        };

        if (!includeInactive) {
          filter.isActive = true;
        }

        const products = await Product.find(filter)
          .sort({ createdAt: -1 })
          .limit(limit);

        return {
          category: {
            _id: category._id,
            name: category.name,
            value: category.value,
            label: category.label,
            description: category.description,
            icon: category.icon,
            color: category.color,
          },
          products,
        };
      })
    );

    // Filter out categories with no products
    const categoriesWithProducts = productsByCategory.filter(
      (item) => item.products.length > 0
    );

    return NextResponse.json(categoriesWithProducts);
  } catch (error) {
    console.error('Error fetching products by categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products by categories' },
      { status: 500 }
    );
  }
}
