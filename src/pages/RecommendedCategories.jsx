import { useState } from "react";

const foodCategories = [
  { title: "Vegetables 🥦", items: "Spinach, Cauliflower, Bell Peppers" },
  { title: "Fruits 🍓", items: "Strawberries, Blueberries, Pears" },
  { title: "Proteins 🥚", items: "Eggs, Chicken, Tofu, Fish" },
  { title: "Whole Grains 🌾", items: "Oats, Brown Rice, Quinoa" },
  { title: "Legumes 🫘", items: "Lentils, Chickpeas, Kidney Beans" },
  { title: "Nuts & Seeds 🥜", items: "Almonds, Walnuts, Chia Seeds" },
  { title: "Low-Fat Dairy 🥛", items: "Skim Milk, Greek Yogurt" },
  { title: "Herbs & Spices 🌿", items: "Turmeric, Cinnamon, Garlic" },
  { title: "Fish 🐟", items: "Salmon, Sardines, Tuna" },
  { title: "Leafy Greens 🥬", items: "Kale, Arugula, Romaine" },
  { title: "Fermented Foods 🧂", items: "Yogurt, Kimchi, Sauerkraut" },
  { title: "Healthy Oils 🛢️", items: "Olive Oil, Flaxseed Oil" },
  { title: "Citrus Fruits 🍊", items: "Oranges, Lemons, Grapefruits" },
  { title: "Soups & Stews 🍲", items: "Lentil Soup, Veggie Broth" },
  { title: "Sugar Substitutes 🍯", items: "Stevia, Erythritol" },
];

const ITEMS_PER_PAGE = 4;

const RecommendedCategories = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(foodCategories.length / ITEMS_PER_PAGE);

  const paginatedItems = foodCategories.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <section className="mt-12 px-4 mb-10 ">
      <h3 className="text-2xl font-semibold text-pink-700 mb-4 flex justify-center">
        Recommended Food Categories 🍽️
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {paginatedItems.map((cat, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-md text-center hover:shadow-lg"
          >
            <h4 className="text-lg font-semibold text-pink-700">{cat.title}</h4>
            <p className="mt-2 text-gray-700 text-sm">{cat.items}</p>
          </div>
        ))}
      </div>

      {/* Dot Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx)}
            className={`h-3 w-3 rounded-full ${
              idx === currentPage
                ? "bg-pink-500"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedCategories;
