import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SiteProvider, useSite } from "./context/SiteContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Portfolio } from "./pages/Portfolio";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Certificates } from "./pages/Certificates";
import { Thoughts } from "./pages/Thoughts";
import { WriteThought } from "./pages/WriteThought";
import { Contact } from "./pages/Contact";

const AppContent = () => {
  const { data } = useSite();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased text-neutral-dark selection:bg-caa-red selection:text-white">
      <Navbar profile={data.profile} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About profile={data.profile} />} />
          <Route
            path="/portfolio"
            element={<Portfolio projects={data.projects} />}
          />
          <Route path="/portfolio/:id" element={<ProjectDetail />} />
          <Route
            path="/certificates"
            element={<Certificates certificates={data.certificates} />}
          />
          <Route path="/thoughts" element={<Thoughts />} />
          <Route path="/write" element={<WriteThought />} />
          <Route path="/publish" element={<WriteThought />} />
          <Route path="/admin" element={<WriteThought />} />
          <Route
            path="/contact"
            element={<Contact profile={data.profile} />}
          />
        </Routes>
      </main>
      <Footer profile={data.profile} />
    </div>
  );
};

export const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <SiteProvider>
        <AppContent />
      </SiteProvider>
    </Router>
  );
};

export default App;
