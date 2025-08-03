import React, { useState } from "react";
import {
  Apple,
  Leaf,
  Wheat,
  Drumstick,
  Cookie,
  Fish,
  GlassWater,
  Salad,
  IceCream,
  UtensilsCrossed,
  CupSoda,
  Pizza,
  Egg,
  Cake,
} from "lucide-react";

const foodCategories = [
  {
    name: "Fruits",
    description:
      "Fruits like apples, berries, and citrus are rich in fiber and essential nutrients.",
    icon: <Apple className="w-12 h-12 text-pink-500" />,
    details: `Common fruits include:
- 🍎 Apples: Rich in fiber and vitamin C
- 🍓 Berries: High in antioxidants and low in sugar
- 🍊 Oranges, lemons: High in vitamin C
- 🍌 Bananas: Good source of potassium

Health Benefits:
- Improve heart health
- Support digestion
- Provide essential vitamins (A, C, K)`
  },
  {
    name: "Vegetables",
    description:
      "Non-starchy vegetables like spinach, kale, and bell peppers are low in carbs and high in fiber.",
    icon: <Leaf className="w-12 h-12 text-green-600" />,
    details: `Examples:
- 🥬 Spinach: High in iron and calcium
- 🫑 Kale: Antioxidants and vitamins A, C, K
- 🫐 Bell peppers: Rich in vitamin C

Health Benefits:
- Lowers inflammation
- Regulates blood sugar
- Supports eye and skin health`
  },
  {
    name: "Whole Grains",
    description:
      "Brown rice, quinoa, and oats are slow-digesting and help maintain stable glucose levels.",
    icon: <Wheat className="w-12 h-12 text-yellow-600" />,
    details: `Examples:
- 🌾 Brown rice: Fiber and B vitamins
- Quinoa: High-protein grain
- Oats: Beta-glucan for heart health

Health Benefits:
- Maintain blood sugar
- Improve digestion
- Boost satiety`
  },
  {
    name: "Proteins",
    description:
      "Lean meat, eggs, tofu, and lentils support muscle health and stabilize sugar levels.",
    icon: <Drumstick className="w-12 h-12 text-blue-600" />,
    details: `Sources:
- 🍗 Chicken: Lean protein
- Tofu & lentils: Plant-based protein
- 🥚 Eggs: Complete protein

Benefits:
- Support muscle health
- Keeps you full longer
- Minimal impact on blood sugar`
  },
  {
    name: "Snacks",
    description:
      "Healthy options like nuts, seeds, and Greek yogurt are great between meals.",
    icon: <Cookie className="w-12 h-12 text-orange-500" />,
    details: `Good Choices:
- Almonds, walnuts: Healthy fats
- Greek yogurt: High protein
- Roasted chickpeas: Crunchy and satisfying

Benefits:
- Keeps energy stable
- Reduces cravings
- Nutrient-dense`
  },
  {
    name: "Seafood",
    description:
      "Salmon, sardines, and mackerel are rich in omega-3s and support heart health.",
    icon: <Fish className="w-12 h-12 text-blue-400" />,
    details: `Sources:
- Salmon: Omega-3s and protein
- Sardines: Calcium and vitamin D
- Mackerel: Anti-inflammatory

Benefits:
- Supports heart and brain
- Lowers triglycerides
- Reduces inflammation`
  },
  {
    name: "Hydration",
    description:
      "Water, infused water, and herbal teas are essential for detox and balance.",
    icon: <GlassWater className="w-12 h-12 text-cyan-500" />,
    details: `Options:
- Water: Always best
- Herbal tea: Anti-inflammatory
- Infused water: Adds taste and antioxidants

Benefits:
- Flushes toxins
- Supports kidney health
- Improves metabolism`
  },
  {
    name: "Salads",
    description:
      "Greens, seeds, protein, and healthy dressings create nutrient-rich meals.",
    icon: <Salad className="w-12 h-12 text-lime-600" />,
    details: `Build a Salad:
- Base: Spinach, kale, lettuce
- Protein: Chicken, tofu, beans
- Toppings: Nuts, seeds, avocado

Benefits:
- Low-calorie nutrition
- Full of fiber
- Easy to customize`
  },
  {
    name: "Low Sugar Desserts",
    description:
      "Dark chocolate, fruit sorbets, and natural sweeteners offer sweet alternatives.",
    icon: <IceCream className="w-12 h-12 text-fuchsia-500" />,
    details: `Options:
- Dark chocolate (70%+)
- Fruit sorbets
- Stevia or monk fruit desserts

Benefits:
- Enjoy without glucose spikes
- Antioxidant-rich
- Diabetic friendly`
  },
  {
    name: "Balanced Meals",
    description:
      "Combining protein, fats, and carbs helps keep glucose levels steady.",
    icon: <UtensilsCrossed className="w-12 h-12 text-gray-700" />,
    details: `Balance Includes:
- Protein: Chicken, tofu
- Fat: Avocado, nuts
- Carbs: Whole grains, vegetables

Benefits:
- Prevents sugar spikes
- Sustains energy
- Improves satiety`
  },
  {
    name: "Beverages to Avoid",
    description:
      "Sugary drinks like soda and energy drinks spike blood sugar rapidly.",
    icon: <CupSoda className="w-12 h-12 text-red-500" />,
    details: `Avoid:
- Soda and energy drinks
- Sugary lattes
- Artificial sweeteners (in excess)

Reasons:
- Cause sugar crashes
- Empty calories
- Promote insulin resistance`
  },
  {
    name: "Fast Food",
    description:
      "Limit processed meals which contain hidden sugars, trans fats, and sodium.",
    icon: <Pizza className="w-12 h-12 text-red-600" />,
    details: `Examples:
- Burgers, fries, pizzas
- Deep-fried snacks
- Processed meats

Risks:
- Weight gain
- High blood sugar
- Increased inflammation`
  },
  {
    name: "Eggs",
    description:
      "A complete protein with minimal sugar impact—supports muscle and fullness.",
    icon: <Egg className="w-12 h-12 text-yellow-500" />,
    details: `Nutrition:
- High-quality protein
- Vitamin D and B12
- Healthy fats

Benefits:
- Stable energy
- No sugar impact
- Versatile food`
  },
  {
    name: "Cakes & Pastries",
    description:
      "Indulge occasionally and use sugar substitutes when possible.",
    icon: <Cake className="w-12 h-12 text-rose-400" />,
    details: `Consider:
- Almond flour or oats in recipes
- Use stevia or dates
- Portion control is key

Risks:
- Glucose spikes
- Cravings and weight gain
- High in refined carbs`
  },
];

const FoodCategoriesPage = () => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="bg-pink-50 min-h-screen text-gray-900">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-6">
          Food Categories
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {foodCategories.map((item, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300 cursor-pointer"
              onClick={() => setSelected(item)}
            >
              <div className="flex justify-center mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-pink-600 text-center">
                {item.name}
              </h3>
              <p className="mt-3 text-gray-700 text-sm text-justify leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white max-w-lg w-full rounded-lg p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
            <div className="flex justify-center mb-4">{selected.icon}</div>
            <h3 className="text-2xl font-bold text-pink-600 mb-3 text-center">
              {selected.name}
            </h3>
            <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {selected.details}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodCategoriesPage;
