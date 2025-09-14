import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Welcome from "./pages/Welcome";
import FoodCategoriesPage from "./pages/FoodCategoriesPage";
import BookletPage from "./pages/BookletPage";
import RecommendedCategories from "./pages/RecommendedCategories";
import MaaChat from "./pages/MaaChat";
import KmcProgress from "./pages/KmcProgress";
import BabyGrowthProgress from "./pages/BabyGrowthProgress";
function App() {
  return (
    <Router>
      <Header />

      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/categories" element={<FoodCategoriesPage />} />
          <Route path="/guide/:month" element={<BookletPage />} />
          <Route path="/recommendedCategories" element={<RecommendedCategories />} />
          <Route path="/chat" element={<MaaChat />} />
          <Route path="/kmc-progress" element={<KmcProgress />} />
          <Route path="/baby-growth-progress" element={<BabyGrowthProgress />} />

        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
