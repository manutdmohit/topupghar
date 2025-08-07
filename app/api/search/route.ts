import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import connectDB from '@/config/db';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const type = searchParams.get('type') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'name';
    const sortOrder = searchParams.get('sortOrder') || 'asc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build search filter
    const filter: any = {
      isActive: true,
      inStock: true,
    };

    // Text search across multiple fields
    if (query.trim()) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { platform: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } },
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Type filter
    if (type) {
      filter.type = type;
    }

    // Build sort object
    const sort: any = {};
    if (sortBy === 'price') {
      sort['variants.price'] = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'name') {
      sort.name = sortOrder === 'desc' ? -1 : 1;
    } else if (sortBy === 'createdAt') {
      sort.createdAt = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute search with pagination
    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('variants')
        .lean(),
      Product.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Transform products to include search-specific data
    const transformedProducts = products.map((product: any) => {
      const lowestPrice = Math.min(
        ...product.variants.map((v: any) => v.price)
      );
      const highestPrice = Math.max(
        ...product.variants.map((v: any) => v.price)
      );

      return {
        ...product,
        lowestPrice,
        highestPrice,
        priceRange:
          lowestPrice !== highestPrice
            ? `${lowestPrice} - ${highestPrice}`
            : lowestPrice,
        searchScore: calculateSearchScore(product, query),
      };
    });

    // Sort by search relevance if query exists
    if (query.trim()) {
      transformedProducts.sort((a, b) => b.searchScore - a.searchScore);
    }

    return NextResponse.json({
      success: true,
      data: {
        products: transformedProducts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage,
          hasPrevPage,
          limit,
        },
        filters: {
          query,
          category,
          type,
          sortBy,
          sortOrder,
        },
      },
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform search',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Calculate search relevance score
function calculateSearchScore(product: any, query: string): number {
  if (!query.trim()) return 0;

  const queryLower = query.toLowerCase();
  let score = 0;

  // Exact matches get higher scores
  if (product.name.toLowerCase().includes(queryLower)) score += 10;
  if (product.platform.toLowerCase().includes(queryLower)) score += 8;
  if (product.category.toLowerCase().includes(queryLower)) score += 6;
  if (product.type.toLowerCase().includes(queryLower)) score += 4;
  if (product.description?.toLowerCase().includes(queryLower)) score += 2;

  // Partial matches
  const queryWords = queryLower.split(' ').filter((word) => word.length > 2);
  queryWords.forEach((word) => {
    if (product.name.toLowerCase().includes(word)) score += 3;
    if (product.platform.toLowerCase().includes(word)) score += 2;
    if (product.category.toLowerCase().includes(word)) score += 1;
  });

  // Boost popular products
  if (
    product.platform.includes('netflix') ||
    product.platform.includes('freefire')
  )
    score += 2;
  if (
    product.platform.includes('instagram') ||
    product.platform.includes('tiktok')
  )
    score += 1;

  return score;
}
