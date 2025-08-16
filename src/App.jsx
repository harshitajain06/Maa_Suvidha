import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Welcome from "./pages/Welcome";
import FoodCategoriesPage from "./pages/FoodCategoriesPage";
import BookletPage from "./pages/BookletPage";
import RecommendedCategories from "./pages/RecommendedCategories";
import MaaChat from "./pages/MaaChat";

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

        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
