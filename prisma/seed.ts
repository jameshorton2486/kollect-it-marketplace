import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@kollect-it.com' },
    update: {},
    create: {
      email: 'admin@kollect-it.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories
  const categories = [
    {
      name: 'Fine Art',
      slug: 'fine-art',
      description: 'Authenticated art pieces spanning various periods and mediums, from paintings to prints and sculptures',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
    },
    {
      name: 'Antique Books',
      slug: 'antique-books',
      description: 'Scarce first editions, beautifully bound volumes, and literary treasures for discerning bibliophiles',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
    },
    {
      name: 'Collectibles',
      slug: 'collectibles',
      description: 'Rare memorabilia, unique ephemera, vintage timepieces, and authenticated collectible items',
      image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80',
    },
    {
      name: 'Militaria',
      slug: 'militaria',
      description: 'Historical artifacts with documented provenance and significance, from military medals to period documents',
      image: 'https://www.ima-usa.com/cdn/shop/files/ONJR24HGGM025__1A.jpg?v=1731974203',
    },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }
  console.log('✅ Categories created');

  // Create sample products
  const fineArtCategory = await prisma.category.findUnique({ where: { slug: 'fine-art' } });
  const antiqueBookCategory = await prisma.category.findUnique({ where: { slug: 'antique-books' } });
  const collectiblesCategory = await prisma.category.findUnique({ where: { slug: 'collectibles' } });
  const militariaCategory = await prisma.category.findUnique({ where: { slug: 'militaria' } });

  if (fineArtCategory) {
    const product1 = await prisma.product.create({
      data: {
        title: 'Classical Landscape Oil Painting, 19th Century',
        slug: 'classical-landscape-oil-painting',
        description: 'A stunning classical landscape oil painting from the 19th century, featuring rolling hills and pastoral scenes.',
        price: 8500,
        categoryId: fineArtCategory.id,
        condition: 'Fine',
        year: '1850s',
        artist: 'Unknown',
        medium: 'Oil on Canvas',
        period: '19th Century',
        featured: true,
        images: {
          create: {
            url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
            alt: 'Classical Landscape Oil Painting',
            order: 0,
          },
        },
      },
    });
    console.log('✅ Sample product created:', product1.title);
  }

  if (antiqueBookCategory) {
    const product2 = await prisma.product.create({
      data: {
        title: 'The Complete Works of Shakespeare, Leather Bound, 1856',
        slug: 'shakespeare-complete-works-1856',
        description: 'A beautiful leather-bound edition of Shakespeare\'s complete works from 1856.',
        price: 3200,
        categoryId: antiqueBookCategory.id,
        condition: 'Very Good',
        year: '1856',
        period: 'Victorian',
        featured: true,
        images: {
          create: {
            url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=800&q=80',
            alt: 'Shakespeare First Folio',
            order: 0,
          },
        },
      },
    });
    console.log('✅ Sample product created:', product2.title);
  }

  if (collectiblesCategory) {
    const product3 = await prisma.product.create({
      data: {
        title: 'Patek Philippe Pocket Watch, 18K Gold, Circa 1920',
        slug: 'patek-philippe-pocket-watch-1920',
        description: 'An exquisite Patek Philippe pocket watch in 18K gold from the 1920s.',
        price: 15800,
        categoryId: collectiblesCategory.id,
        condition: 'Fine',
        year: '1920s',
        period: 'Art Deco',
        featured: true,
        images: {
          create: {
            url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=800&q=80',
            alt: 'Vintage Pocket Watch',
            order: 0,
          },
        },
      },
    });
    console.log('✅ Sample product created:', product3.title);
  }

  if (militariaCategory) {
    const product4 = await prisma.product.create({
      data: {
        title: 'WWI British Medal Group, Named to Soldier, Complete',
        slug: 'wwi-british-medal-group',
        description: 'A complete WWI British medal group, named to an individual soldier.',
        price: 1800,
        categoryId: militariaCategory.id,
        condition: 'Very Good',
        year: '1914-1918',
        period: 'WWI',
        featured: true,
        images: {
          create: {
            url: 'https://images.unsplash.com/photo-1611329857570-f02f340e7378?w=800&q=80',
            alt: 'WWI Medal Group',
            order: 0,
          },
        },
      },
    });
    console.log('✅ Sample product created:', product4.title);
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
