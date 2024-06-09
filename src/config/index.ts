export const PRODUCT_CATEGORIES = [
    {
      label: 'Sports',
      value: 'Sports' as const,
      featured: [
        {
          name: 'Hybrid',
          href: `/sports/hybrid`,
          imageSrc: '/nav/ui-kits/mixed.jpg',
          subtitle: 'Learn more',
        },
        {
          name: 'Strength',
          href: '/sports/strength',
          imageSrc: '/nav/ui-kits/blue.jpg',
          subtitle: 'Learn more',
        },
        {
          name: 'Endurance',
          href: '/sports/endurance',
          imageSrc: '/nav/ui-kits/purple.jpg',
          subtitle: 'Learn more',
        },
      ],
    },
    {
      label: 'Training plans',
      value: 'marketplace' as const,
      featured: [
        {
          name: 'Top Coach Picks',
          href: `/products?category=icons`,
          imageSrc: '/nav/icons/picks.jpg',
          subtitle: 'Shop now',
        },
        {
          name: 'New Arrivals',
          href: '/products?category=icons&sort=desc',
          imageSrc: '/nav/icons/new.jpg',
          subtitle: 'Shop now',
        },
        {
          name: 'Bestselling Plans',
          href: '/products?category=icons',
          imageSrc: '/nav/icons/bestsellers.jpg',
          subtitle: 'Shop now',
        },
      ],
    },
  ]