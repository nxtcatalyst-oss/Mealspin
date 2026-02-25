import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data in correct order
  await prisma.selectionHistory.deleteMany()
  await prisma.meal.deleteMany()
  await prisma.appSettings.deleteMany()

  // Create app settings
  await prisma.appSettings.create({
    data: { id: 'singleton', cooldownDays: 21 },
  })

  // Create meals
  const meals = await prisma.$transaction([
    prisma.meal.create({
      data: {
        name: 'Chicken Tikka Masala',
        category: 'Asian',
        description: 'Creamy tomato-based curry with tender grilled chicken',
        tags: JSON.stringify(['curry', 'spicy', 'comfort']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Beef Tacos',
        category: 'Mexican',
        description: 'Crispy or soft shell tacos with seasoned ground beef, salsa, and all the fixings',
        tags: JSON.stringify(['tacos', 'quick', 'crowd-pleaser']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Margherita Pizza',
        category: 'Italian',
        description: 'Classic pizza with fresh mozzarella, tomato sauce, and basil',
        tags: JSON.stringify(['pizza', 'veggie', 'classic']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Pad Thai',
        category: 'Asian',
        description: 'Stir-fried rice noodles with shrimp or chicken, peanuts, and lime',
        tags: JSON.stringify(['noodles', 'quick', 'asian']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Beef Burger',
        category: 'American',
        description: 'Juicy smash burger with caramelized onions and special sauce',
        tags: JSON.stringify(['burger', 'quick', 'classic']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Grilled Salmon',
        category: 'Mediterranean',
        description: 'Herb-crusted salmon with lemon butter and roasted vegetables',
        tags: JSON.stringify(['healthy', 'seafood', 'light']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Chicken Quesadillas',
        category: 'Mexican',
        description: 'Crispy flour tortillas stuffed with chicken, cheese, peppers, and onions',
        tags: JSON.stringify(['quick', 'cheese', 'easy']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Spaghetti Bolognese',
        category: 'Italian',
        description: 'Rich slow-cooked meat sauce with pasta, parmesan, and fresh herbs',
        tags: JSON.stringify(['pasta', 'comfort', 'classic']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Sushi Rolls',
        category: 'Asian',
        description: 'Assorted maki and nigiri with wasabi, pickled ginger, and soy sauce',
        tags: JSON.stringify(['sushi', 'seafood', 'light']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Greek Salad',
        category: 'Mediterranean',
        description: 'Fresh cucumber, tomato, olives, feta with lemon-herb vinaigrette',
        tags: JSON.stringify(['healthy', 'light', 'veggie']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'BBQ Ribs',
        category: 'American',
        description: 'Fall-off-the-bone pork ribs with smoky BBQ sauce and coleslaw',
        tags: JSON.stringify(['bbq', 'comfort', 'weekend']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Butter Chicken',
        category: 'Asian',
        description: 'Mild, creamy Indian curry with tender chicken in tomato-butter sauce',
        tags: JSON.stringify(['curry', 'mild', 'comfort']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Chicken Caesar Salad',
        category: 'Quick Bites',
        description: 'Romaine, grilled chicken, parmesan, croutons with classic Caesar dressing',
        tags: JSON.stringify(['salad', 'quick', 'light']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Fish and Chips',
        category: 'American',
        description: 'Beer-battered cod with crispy fries, tartar sauce, and malt vinegar',
        tags: JSON.stringify(['seafood', 'comfort', 'classic']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Lamb Gyros',
        category: 'Mediterranean',
        description: 'Slow-roasted lamb in pita with tzatziki, tomato, onion, and fries',
        tags: JSON.stringify(['lamb', 'street-food', 'wrap']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Mac and Cheese',
        category: 'Comfort',
        description: 'Creamy homemade mac with three-cheese blend and breadcrumb topping',
        tags: JSON.stringify(['comfort', 'cheese', 'quick']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Shrimp Stir Fry',
        category: 'Asian',
        description: 'Garlic shrimp with bok choy, snap peas, and ginger soy glaze over rice',
        tags: JSON.stringify(['seafood', 'quick', 'healthy']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Beef Enchiladas',
        category: 'Mexican',
        description: 'Rolled corn tortillas with spiced beef, red chili sauce, and melted cheese',
        tags: JSON.stringify(['enchiladas', 'spicy', 'comfort']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Mushroom Risotto',
        category: 'Italian',
        description: 'Creamy arborio rice with mixed mushrooms, white wine, and parmesan',
        tags: JSON.stringify(['veggie', 'comfort', 'elegant']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'BLT Sandwich',
        category: 'Quick Bites',
        description: 'Toasted sourdough with crispy bacon, heirloom tomato, lettuce, and mayo',
        tags: JSON.stringify(['sandwich', 'quick', 'classic']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Chicken Shawarma',
        category: 'Mediterranean',
        description: 'Marinated rotisserie chicken in flatbread with garlic sauce and pickles',
        tags: JSON.stringify(['wrap', 'street-food', 'quick']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Korean BBQ Bowl',
        category: 'Asian',
        description: 'Bulgogi beef over steamed rice with kimchi, pickled veggies, and gochujang',
        tags: JSON.stringify(['korean', 'spicy', 'bowl']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Pulled Pork Sandwich',
        category: 'American',
        description: 'Slow-smoked pulled pork on brioche with jalapeño slaw and pickles',
        tags: JSON.stringify(['bbq', 'comfort', 'sandwich']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Veggie Curry',
        category: 'Asian',
        description: 'Coconut milk curry with chickpeas, sweet potato, spinach, and basmati rice',
        tags: JSON.stringify(['veggie', 'healthy', 'curry']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Pasta Carbonara',
        category: 'Italian',
        description: 'Silky egg and pecorino sauce with crispy guanciale over rigatoni',
        tags: JSON.stringify(['pasta', 'comfort', 'classic']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Chicken Wings',
        category: 'Comfort',
        description: 'Crispy baked wings with your choice of buffalo, honey garlic, or BBQ sauce',
        tags: JSON.stringify(['wings', 'comfort', 'crowd-pleaser']),
        enabled: true,
      },
    }),
    prisma.meal.create({
      data: {
        name: 'Tuna Melt',
        category: 'Quick Bites',
        description: 'Classic tuna salad with cheddar, melted on sourdough with tomato',
        tags: JSON.stringify(['sandwich', 'quick', 'seafood']),
        enabled: true,
      },
    }),
  ])

  // Create selection history records at various points in time to test cooldown logic
  const now = new Date()
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000)

  // Recent selections (within last 7 days) - will be blocked by 21-day cooldown
  await prisma.selectionHistory.createMany({
    data: [
      {
        mealId: meals[0].id, // Chicken Tikka Masala - 3 days ago
        selectedAt: daysAgo(3),
        confirmed: true,
      },
      {
        mealId: meals[2].id, // Margherita Pizza - 5 days ago
        selectedAt: daysAgo(5),
        confirmed: true,
      },
      {
        mealId: meals[4].id, // Beef Burger - 1 day ago
        selectedAt: daysAgo(1),
        confirmed: true,
      },
    ],
  })

  // Mid-range selections (8-21 days ago) - will be blocked by 21-day cooldown
  await prisma.selectionHistory.createMany({
    data: [
      {
        mealId: meals[7].id, // Spaghetti Bolognese - 10 days ago
        selectedAt: daysAgo(10),
        confirmed: true,
      },
      {
        mealId: meals[10].id, // BBQ Ribs - 15 days ago
        selectedAt: daysAgo(15),
        confirmed: true,
      },
      {
        mealId: meals[14].id, // Lamb Gyros - 18 days ago
        selectedAt: daysAgo(18),
        confirmed: true,
      },
    ],
  })

  // Old selections (>21 days ago) - will NOT be blocked, eligible again
  await prisma.selectionHistory.createMany({
    data: [
      {
        mealId: meals[0].id, // Chicken Tikka Masala - 45 days ago (older than recent)
        selectedAt: daysAgo(45),
        confirmed: true,
      },
      {
        mealId: meals[8].id, // Sushi Rolls - 30 days ago
        selectedAt: daysAgo(30),
        confirmed: true,
      },
      {
        mealId: meals[17].id, // Beef Enchiladas - 25 days ago
        selectedAt: daysAgo(25),
        confirmed: true,
      },
      {
        mealId: meals[24].id, // Pasta Carbonara - 60 days ago
        selectedAt: daysAgo(60),
        confirmed: true,
      },
    ],
  })

  console.log(`✅ Created ${meals.length} meals`)
  console.log('✅ Created selection history records')
  console.log('✅ Created app settings (cooldown: 21 days)')
  console.log('')
  console.log('📊 Cooldown preview:')
  console.log('  Blocked (recent): Chicken Tikka Masala (3d), Margherita Pizza (5d), Beef Burger (1d)')
  console.log('  Blocked (mid): Spaghetti Bolognese (10d), BBQ Ribs (15d), Lamb Gyros (18d)')
  console.log('  Eligible (old): Sushi Rolls (30d), Beef Enchiladas (25d), Pasta Carbonara (60d)')
  console.log('')
  console.log('🎰 Seed complete! Run `npm run dev` to start.')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
