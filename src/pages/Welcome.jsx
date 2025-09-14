import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RecommendedCategories from "../pages/RecommendedCategories";

const MaaSuvidhaContent = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [firstPeriodDate, setFirstPeriodDate] = useState("");
  const [error, setError] = useState("");
  const [registeredUser, setRegisteredUser] = useState(null);

  // KMC States
  const [showKmcForm, setShowKmcForm] = useState(false);
  const [kmcHours, setKmcHours] = useState("");
  const [kmcSavedMsg, setKmcSavedMsg] = useState("");

  // Baby Growth States
  const [showGrowthForm, setShowGrowthForm] = useState(false);
  const [showGrowthHistory, setShowGrowthHistory] = useState(false);
  const [babyWeight, setBabyWeight] = useState("");
  const [babyAge, setBabyAge] = useState("");
  const [growthSavedMsg, setGrowthSavedMsg] = useState("");
  const [growthHistory, setGrowthHistory] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("maasuvidhaUser"));
    if (savedUser) {
      setRegisteredUser(savedUser);
      loadGrowthHistory(savedUser.phone);
    }
  }, []);

  const loadGrowthHistory = (phone) => {
    const growthData = JSON.parse(localStorage.getItem("babyGrowthData")) || {};
    const userGrowth = growthData[phone] || [];
    setGrowthHistory(userGrowth);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const firstDate = new Date(firstPeriodDate);
    const today = new Date();

    if (isNaN(firstDate.getTime())) {
      setError("Please enter a valid date.");
      return;
    }

    if (firstDate > today) {
      setError("The date of your last missed period cannot be in the future.");
      return;
    }

    const diffInDays = Math.floor((today - firstDate) / (1000 * 60 * 60 * 24));
    const approxMonth = Math.floor(diffInDays / 30.5);
    const pregnancyMonth = Math.min(9, Math.max(1, approxMonth + 1));

    const userData = { name, phone, firstPeriodDate, pregnancyMonth };
    localStorage.setItem("maasuvidhaUser", JSON.stringify(userData));

    navigate(`/guide/${pregnancyMonth}`, {
      state: userData,
    });
  };

  const handleReset = () => {
    localStorage.removeItem("maasuvidhaUser");
    setRegisteredUser(null);
    setName("");
    setPhone("");
    setFirstPeriodDate("");
  };

  const handleKmcSubmit = (e) => {
    e.preventDefault();
    
    // Validate hours input
    if (!kmcHours || kmcHours <= 0) {
      setKmcSavedMsg("❌ Please enter valid hours for KMC");
      setTimeout(() => setKmcSavedMsg(""), 3000);
      return;
    }

    const kmcData = {
      date: new Date().toLocaleDateString(),
      hours: parseFloat(kmcHours),
      timestamp: new Date().toISOString()
    };

    let savedKmc = JSON.parse(localStorage.getItem("kmcData")) || {};
    savedKmc[registeredUser.phone] = [
      ...(savedKmc[registeredUser.phone] || []),
      kmcData,
    ];
    localStorage.setItem("kmcData", JSON.stringify(savedKmc));

    setShowKmcForm(false);
    setKmcHours("");
    setKmcSavedMsg(`✅ KMC data saved successfully! ${kmcHours} hours recorded.`);
    setTimeout(() => setKmcSavedMsg(""), 5000);
  };

  const handleGrowthSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!babyWeight || babyWeight <= 0) {
      setGrowthSavedMsg("❌ Please enter valid baby weight");
      setTimeout(() => setGrowthSavedMsg(""), 3000);
      return;
    }

    if (!babyAge || babyAge < 0) {
      setGrowthSavedMsg("❌ Please enter valid baby age");
      setTimeout(() => setGrowthSavedMsg(""), 3000);
      return;
    }

    const growthData = {
      date: new Date().toLocaleDateString(),
      weight: parseFloat(babyWeight),
      age: parseFloat(babyAge),
      timestamp: new Date().toISOString()
    };

    let savedGrowth = JSON.parse(localStorage.getItem("babyGrowthData")) || {};
    savedGrowth[registeredUser.phone] = [
      ...(savedGrowth[registeredUser.phone] || []),
      growthData,
    ];
    localStorage.setItem("babyGrowthData", JSON.stringify(savedGrowth));

    // Reload history
    loadGrowthHistory(registeredUser.phone);

    setShowGrowthForm(false);
    setBabyWeight("");
    setBabyAge("");
    setGrowthSavedMsg(`✅ Baby growth data saved! Weight: ${babyWeight}kg, Age: ${babyAge} months`);
    setTimeout(() => setGrowthSavedMsg(""), 5000);
  };

  return (
    <div className="bg-pink-50 min-h-screen text-gray-900 flex flex-col relative">
      <main className="container mx-auto px-4 py-8 flex flex-col lg:flex-row items-start gap-10">
        {/* Left Section */}
        <section className="flex-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-pink-700 mb-4">
            Welcome to <span className="text-green-600">MaaSuvidha</span>! 🤱
          </h2>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
            MaaSuvidha is your rural maternal health companion designed for mothers, ASHAs, and caregivers with low digital and health literacy.
            Get month-wise pregnancy guidance, essential health info, and visual tips in multiple languages.
          </p>
          <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed">
            Enter your details to get personalized information, videos, and resources based on your pregnancy stage.
            Your wellness journey starts here.
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 text-base sm:text-lg space-y-2">
            <li>Track your pregnancy month-wise</li>
            <li>Access breastfeeding, immunization & hygiene info</li>
            <li>Use Ask Maa voice assistant for help</li>
            <li>Offline access & reminders for ASHA workers</li>
          </ul>
        </section>

        {/* Right Section */}
        <section className="flex-1 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          {registeredUser ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Hello, {registeredUser.name}! 👋
              </h3>
              <p className="text-gray-700">
                You are already registered with phone number:{" "}
                <strong>{registeredUser.phone}</strong>
              </p>
              <p className="text-gray-700">
                Pregnancy month:{" "}
                <strong>{registeredUser.pregnancyMonth}</strong>
              </p>
              <button
                onClick={() =>
                  navigate(`/guide/${registeredUser.pregnancyMonth}`, {
                    state: registeredUser,
                  })
                }
                className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700"
              >
                View My Pregnancy Guide 📘
              </button>

              {/* New Track KMC Button */}
              <button
                onClick={() => setShowKmcForm(true)}
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700"
              >
                Track my KMC 🍼
              </button>

              {showKmcForm && (
                <form onSubmit={handleKmcSubmit} className="space-y-3 mt-4">
                  <label className="block text-sm font-medium text-gray-700">
                    How many hours of KMC did you give today?
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={kmcHours}
                    onChange={(e) => setKmcHours(e.target.value)}
                    placeholder="e.g., 2.5 hours"
                    className="w-full p-2 border rounded-md"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    💡 You can enter decimal values (e.g., 1.5 for 1 hour 30 minutes)
                  </p>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
                  >
                    Save KMC Data 💾
                  </button>
                </form>
              )}

              {kmcSavedMsg && (
                <p className="text-green-600 font-semibold">{kmcSavedMsg}</p>
              )}

              {/* Baby Growth Tracking Button */}
              <button
                onClick={() => setShowGrowthForm(true)}
                className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700"
              >
                Track Baby Growth 📈
              </button>

              {showGrowthForm && (
                <form onSubmit={handleGrowthSubmit} className="space-y-3 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Baby's Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={babyWeight}
                      onChange={(e) => setBabyWeight(e.target.value)}
                      placeholder="e.g., 3.5 kg"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Baby's Age (months)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={babyAge}
                      onChange={(e) => setBabyAge(e.target.value)}
                      placeholder="e.g., 2.5 months"
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    💡 Track your baby's growth by recording weight and age regularly
                  </p>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
                  >
                    Save Growth Data 📊
                  </button>
                </form>
              )}

              {growthSavedMsg && (
                <p className="text-green-600 font-semibold">{growthSavedMsg}</p>
              )}

              {/* Growth History Section */}
              {growthHistory.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowGrowthHistory(!showGrowthHistory)}
                    className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
                  >
                    {showGrowthHistory ? 'Hide' : 'Show'} Growth History 📋
                  </button>
                  
                  {showGrowthHistory && (
                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                      {growthHistory.slice(-5).reverse().map((entry, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-md text-sm">
                          <div className="font-medium text-gray-800">
                            {entry.date} - {entry.age} months old
                          </div>
                          <div className="text-gray-600">
                            Weight: <strong>{entry.weight}kg</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Navigate to Progress Pages */}
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => navigate("/kmc-progress")}
                  className="w-full bg-purple-600 text-white py-3 rounded-md hover:bg-purple-700"
                >
                  View KMC Progress 📊
                </button>
                
                <button
                  onClick={() => navigate("/baby-growth-progress")}
                  className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700"
                >
                  View Baby Growth Progress 📈
                </button>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
              >
                Register as a Different User
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Register Yourself 👩‍🍼
              </h3>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border rounded-md"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border rounded-md"
                required
              />
              <label className="block text-sm font-medium text-gray-700">
                First Day of Last Menstrual Period
              </label>
              <input
                type="date"
                value={firstPeriodDate}
                onChange={(e) => setFirstPeriodDate(e.target.value)}
                className="w-full p-3 border rounded-md"
              />
              {error && (
                <p className="text-red-600 font-semibold text-sm">{error}</p>
              )}
              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-3 rounded-md hover:bg-pink-700"
              >
                Get My Pregnancy Guide 📘
              </button>
            </form>
          )}
        </section>
      </main>

      {/* Recommended Categories */}
      <RecommendedCategories />

      {/* Floating Ask Maa Chat Button */}
      <button
        onClick={() => navigate("/chat")}
        className="fixed bottom-5 right-5 bg-pink-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-pink-700 transition-all z-50"
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        💬 Ask Maa
      </button>
    </div>
  );
};

export default MaaSuvidhaContent;
