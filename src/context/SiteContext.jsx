import { createContext, useContext, useState, useEffect } from "react";
import { portfolioData } from "../data";
import { db, saveSiteSection } from "../services/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  // 1. Initialize from local storage immediately (0ms start)
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

  // 2. Real-time live listener with Cloud Firestore
  useEffect(() => {
    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(
        doc(db, "content", "site"),
        (docSnap) => {
          if (docSnap.exists()) {
            const cloudOverrides = docSnap.data();
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
        },
        (error) => {
          console.warn("Realtime listener notice:", error.message);
        }
      );
    } catch (err) {
      console.warn("Realtime setup notice:", err);
    }

    return () => unsubscribe();
  }, []);

  // 3. Update section: updates state, writes to localStorage, and saves live to Cloud Firestore
  const updateSection = async (sectionKey, newSectionData) => {
    // Immediate local update
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

    // Cloud Firestore live save
    await saveSiteSection(sectionKey, newSectionData);
  };

  return (
    <SiteContext.Provider value={{ data, setData, updateSection, isLoading }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);
