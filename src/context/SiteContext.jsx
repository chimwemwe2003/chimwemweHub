import { createContext, useContext, useState, useEffect } from "react";
import { portfolioData } from "../data";
import { fetchSiteOverrides, saveSiteSection } from "../services/firebase";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  // 1. Initialize from local overrides immediately (0ms latency!)
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("ck_site_overrides");
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...portfolioData,
          profile: parsed.profile ? { ...portfolioData.profile, ...parsed.profile } : portfolioData.profile,
          projects: parsed.projects || portfolioData.projects,
          certificates: parsed.certificates || portfolioData.certificates,
        };
      }
    } catch (e) {
      console.warn("Could not read local overrides:", e);
    }
    return portfolioData;
  });

  const [isLoading, setIsLoading] = useState(false);

  // 2. Background sync with cloud if available
  useEffect(() => {
    async function syncCloud() {
      try {
        const cloudOverrides = await fetchSiteOverrides();
        if (cloudOverrides) {
          setData((prev) => {
            const merged = {
              ...prev,
              profile: cloudOverrides.profile ? { ...prev.profile, ...cloudOverrides.profile } : prev.profile,
              projects: cloudOverrides.projects || prev.projects,
              certificates: cloudOverrides.certificates || prev.certificates,
            };
            try {
              localStorage.setItem("ck_site_overrides", JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
      } catch (err) {
        // Fallback to local
      }
    }
    syncCloud();
  }, []);

  // 3. Update section: instant UI update + instant local storage + background cloud sync
  const updateSection = async (sectionKey, newSectionData) => {
    setData((prev) => {
      const updated = {
        ...prev,
        [sectionKey]: newSectionData,
      };
      try {
        localStorage.setItem("ck_site_overrides", JSON.stringify(updated));
      } catch (e) {
        console.warn("Could not save to localStorage:", e);
      }
      return updated;
    });

    // Background cloud sync
    saveSiteSection(sectionKey, newSectionData).catch(() => {});
  };

  return (
    <SiteContext.Provider value={{ data, setData, updateSection, isLoading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
