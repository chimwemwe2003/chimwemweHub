import { createContext, useContext, useState, useEffect } from "react";
import { portfolioData } from "../data";
import { fetchSiteOverrides, saveSiteSection } from "../services/firebase";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const [data, setData] = useState(portfolioData);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const overrides = await fetchSiteOverrides();
      if (overrides) {
        setData((prev) => ({
          ...prev,
          profile: overrides.profile ? { ...prev.profile, ...overrides.profile } : prev.profile,
          projects: overrides.projects || prev.projects,
          certificates: overrides.certificates || prev.certificates,
        }));
      }
    } catch (err) {
      console.warn("Using offline portfolio data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateSection = async (sectionKey, newSectionData) => {
    await saveSiteSection(sectionKey, newSectionData);
    setData((prev) => ({
      ...prev,
      [sectionKey]: newSectionData,
    }));
  };

  return (
    <SiteContext.Provider value={{ data, setData, updateSection, reloadData: loadData, isLoading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
