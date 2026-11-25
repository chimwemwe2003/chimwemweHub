import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaLock,
  FaCheck,
  FaTrash,
  FaEye,
  FaPen,
  FaArrowLeft,
  FaPlus,
  FaExternalLinkAlt,
  FaUpload,
  FaImages,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { useSite } from "../context/SiteContext";
import {
  publishThought,
  fetchLiveThoughts,
  deleteThought,
  saveSiteSection,
  processAndUploadImage,
} from "../services/firebase";

const DEFAULT_PIN = "2003";

const SECTIONS = [
  { id: "thoughts", label: "Thoughts", icon: "✍️" },
  { id: "projects", label: "Projects", icon: "💼" },
  { id: "about", label: "About & Bio", icon: "👤" },
  { id: "certificates", label: "Certificates", icon: "📜" },
  { id: "socials", label: "Socials", icon: "🔗" },
];

const THOUGHT_CATEGORIES = [
  "Agentic Development",
  "Forward Deployment",
  "Penetration Testing",
  "AI Engineering",
  "Systems Engineering",
  "Personal Insights",
];

export const WriteThought = () => {
  const { data, updateSection } = useSite();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState("thoughts");

  // Global UI feedback
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. THOUGHTS STATE
  const [thoughtTitle, setThoughtTitle] = useState("");
  const [thoughtCategory, setThoughtCategory] = useState(THOUGHT_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [thoughtSummary, setThoughtSummary] = useState("");
  const [thoughtContent, setThoughtContent] = useState("");
  const [thoughtPreviewMode, setThoughtPreviewMode] = useState(false);
  const [liveThoughts, setLiveThoughts] = useState([]);

  // 2. PROJECTS STATE
  const [projectsList, setProjectsList] = useState(data.projects || []);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projTitle, setProjTitle] = useState("");
  const [projFocus, setProjFocus] = useState("");
  const [projImage, setProjImage] = useState("");
  const [projGallery, setProjGallery] = useState([]);
  const [projDesc, setProjDesc] = useState("");
  const [projDemo, setProjDemo] = useState("");
  const [projRepo, setProjRepo] = useState("");
  const [projTags, setProjTags] = useState("");
  const [uploadingProjImage, setUploadingProjImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  // 3. ABOUT STATE
  const [aboutName, setAboutName] = useState(data.profile?.name || "");
  const [aboutLocation, setAboutLocation] = useState(data.profile?.location || "");
  const [aboutImage, setAboutImage] = useState(data.profile?.image || "/profile-pic.jpg");
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);
  const [aboutBio, setAboutBio] = useState(data.profile?.summary || "");
  const [aboutTags, setAboutTags] = useState(data.profile?.tags || []);
  const [newTagInput, setNewTagInput] = useState("");

  // 4. CERTIFICATES STATE
  const [certList, setCertList] = useState(data.certificates?.list || []);
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertLink, setNewCertLink] = useState("");

  // 5. SOCIALS STATE
  const [socialLinkedin, setSocialLinkedin] = useState(data.profile?.linkedin || "");
  const [socialTwitter, setSocialTwitter] = useState(data.profile?.twitter || "");
  const [socialSpotify, setSocialSpotify] = useState(data.profile?.spotify || "");
  const [socialBinance, setSocialBinance] = useState(data.profile?.binance || "");
  const [socialPinterest, setSocialPinterest] = useState(data.profile?.pinterest || "");
  const [socialEmail, setSocialEmail] = useState(data.profile?.email || "");
  const [socialGithub, setSocialGithub] = useState(data.profile?.github || "");

  // Always enforce PIN on page visit
  useEffect(() => {
    localStorage.removeItem("ck_manager_token");
    setIsAuthenticated(false);
  }, []);

  // Sync state when context data updates
  useEffect(() => {
    if (data.projects) setProjectsList(data.projects);
    if (data.profile) {
      setAboutName(data.profile.name || "");
      setAboutLocation(data.profile.location || "");
      setAboutImage(data.profile.image || "/profile-pic.jpg");
      setAboutBio(data.profile.summary || "");
      setAboutTags(data.profile.tags || []);
      setSocialLinkedin(data.profile.linkedin || "");
      setSocialTwitter(data.profile.twitter || "");
      setSocialSpotify(data.profile.spotify || "");
      setSocialBinance(data.profile.binance || "");
      setSocialPinterest(data.profile.pinterest || "");
      setSocialEmail(data.profile.email || "");
      setSocialGithub(data.profile.github || "");
    }
    if (data.certificates?.list) setCertList(data.certificates.list);
  }, [data]);

  // Load thoughts when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadThoughts();
    }
  }, [isAuthenticated]);

  const loadThoughts = async () => {
    try {
      const saved = JSON.parse(localStorage.getItem("ck_dynamic_thoughts") || "[]");
      if (saved && saved.length > 0) {
        setLiveThoughts(saved);
      }
      const posts = await fetchLiveThoughts();
      if (posts && posts.length > 0) {
        setLiveThoughts(posts);
        localStorage.setItem("ck_dynamic_thoughts", JSON.stringify(posts));
      }
    } catch (e) {
      console.warn("Could not load thoughts:", e);
    }
  };

  const notify = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => {
      setStatusMsg({ type: "", text: "" });
    }, 5000);
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput("");
  };

  // --- 1. PUBLISH THOUGHT HANDLER ---
  const handlePublishThought = async (e) => {
    e.preventDefault();
    if (!thoughtTitle.trim() || !thoughtContent.trim()) {
      notify("error", "Title and Content are required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const activeCat = customCategory.trim() ? customCategory.trim() : thoughtCategory;
      const newThought = await publishThought({
        title: thoughtTitle.trim(),
        category: activeCat,
        summary: thoughtSummary.trim() || thoughtContent.trim().substring(0, 160) + "...",
        content: thoughtContent.trim(),
      });

      // Save locally immediately
      try {
        const currentSaved = JSON.parse(localStorage.getItem("ck_dynamic_thoughts") || "[]");
        const updatedSaved = [newThought, ...currentSaved.filter((t) => t.id !== newThought.id)];
        localStorage.setItem("ck_dynamic_thoughts", JSON.stringify(updatedSaved));
        setLiveThoughts(updatedSaved);
      } catch {}

      notify("success", "Thought published live to /thoughts!");
      setThoughtTitle("");
      setThoughtSummary("");
      setThoughtContent("");
      setCustomCategory("");
      setThoughtPreviewMode(false);
    } catch (err) {
      notify("error", "Failed to publish: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteThought = async (id) => {
    if (window.confirm("Delete this thought?")) {
      deleteThought(id).catch(() => {});
      const updated = liveThoughts.filter((t) => t.id !== id);
      setLiveThoughts(updated);
      try {
        localStorage.setItem("ck_dynamic_thoughts", JSON.stringify(updated));
      } catch {}
      notify("success", "Thought deleted.");
    }
  };

  // Upload single image (for cover / profile)
  const handleSingleImageFile = async (e, setUrlCallback, setUploadingCallback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCallback(true);
    try {
      const url = await processAndUploadImage(file);
      setUrlCallback(url);
      notify("success", "Image processed successfully!");
    } catch (err) {
      notify("error", "Failed to process image: " + err.message);
    } finally {
      setUploadingCallback(false);
      e.target.value = "";
    }
  };

  // Upload multiple images for project gallery
  const handleMultipleGalleryFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const url = await processAndUploadImage(file);
        return {
          type: "image",
          src: url,
          caption: file.name.replace(/\.[^/.]+$/, ""),
        };
      });
      const newItems = await Promise.all(uploadPromises);
      setProjGallery((prev) => [...prev, ...newItems]);
      notify("success", `${newItems.length} image(s) added to project gallery!`);
    } catch (err) {
      notify("error", "Error uploading gallery files: " + err.message);
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const handleRemoveGalleryImage = (indexToRemove) => {
    setProjGallery((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleGalleryCaptionChange = (index, newCaption) => {
    setProjGallery((prev) =>
      prev.map((item, i) => (i === index ? { ...item, caption: newCaption } : item))
    );
  };

  // --- 2. PROJECTS HANDLERS ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projTitle.trim()) {
      notify("error", "Project title is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const slug =
        editingProjectId ||
        projTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const updatedProject = {
        id: slug,
        title: projTitle.trim(),
        focus: projFocus.trim() || "Engineering / Technology",
        image: projImage.trim() || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
        thumbnail: projImage.trim() || "",
        gallery: projGallery || [],
        description: projDesc.trim(),
        links: {
          demo: projDemo.trim() || "",
          repo: projRepo.trim() || "",
        },
        tags: projTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      let newProjects;
      if (editingProjectId) {
        newProjects = projectsList.map((p) => (p.id === editingProjectId ? updatedProject : p));
      } else {
        newProjects = [updatedProject, ...projectsList];
      }

      await updateSection("projects", newProjects);
      setProjectsList(newProjects);
      notify("success", editingProjectId ? "Project updated live!" : "New project added live!");
      // Reset form
      setEditingProjectId(null);
      setProjTitle("");
      setProjFocus("");
      setProjImage("");
      setProjGallery([]);
      setProjDesc("");
      setProjDemo("");
      setProjRepo("");
      setProjTags("");
    } catch (err) {
      notify("error", "Failed to save project: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProjectClick = (p) => {
    setEditingProjectId(p.id);
    setProjTitle(p.title || "");
    setProjFocus(p.focus || "");
    setProjImage(p.thumbnail || p.image || "");
    setProjGallery(p.gallery || []);
    setProjDesc(p.description || "");
    setProjDemo(p.links?.demo || "");
    setProjRepo(p.links?.repo || "");
    setProjTags(p.tags ? p.tags.join(", ") : "");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm("Remove this project from Selected Work?")) {
      const filtered = projectsList.filter((p) => p.id !== id);
      try {
        await updateSection("projects", filtered);
        setProjectsList(filtered);
        notify("success", "Project removed.");
      } catch (err) {
        notify("error", err.message);
      }
    }
  };

  // --- 3. ABOUT HANDLER ---
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedProfile = {
        ...data.profile,
        name: aboutName.trim(),
        location: aboutLocation.trim(),
        image: aboutImage.trim() || "/profile-pic.jpg",
        summary: aboutBio.trim(),
        tags: aboutTags,
      };
      await updateSection("profile", updatedProfile);
      notify("success", "About & Bio updated live!");
    } catch (err) {
      notify("error", "Failed to update profile: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && !aboutTags.includes(newTagInput.trim())) {
      setAboutTags([...aboutTags, newTagInput.trim()]);
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setAboutTags(aboutTags.filter((t) => t !== tagToRemove));
  };

  // --- 4. CERTIFICATES HANDLERS ---
  const handleAddCertificate = async (e) => {
    e.preventDefault();
    if (!newCertName.trim()) {
      notify("error", "Certificate name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const newCert = {
        name: newCertName.trim(),
        issuer: newCertIssuer.trim() || "Professional Certification",
        link: newCertLink.trim() || "",
      };
      const updatedList = [newCert, ...certList];
      const updatedCertificates = {
        ...data.certificates,
        list: updatedList,
      };
      await updateSection("certificates", updatedCertificates);
      setCertList(updatedList);
      setNewCertName("");
      setNewCertIssuer("");
      setNewCertLink("");
      notify("success", "Certificate added live!");
    } catch (err) {
      notify("error", "Failed to add certificate: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCertificate = async (idx) => {
    if (window.confirm("Delete this certificate?")) {
      const updatedList = certList.filter((_, i) => i !== idx);
      const updatedCertificates = { ...data.certificates, list: updatedList };
      try {
        await updateSection("certificates", updatedCertificates);
        setCertList(updatedList);
        notify("success", "Certificate deleted.");
      } catch (err) {
        notify("error", err.message);
      }
    }
  };

  // --- 5. SOCIALS HANDLER ---
  const handleSaveSocials = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedProfile = {
        ...data.profile,
        linkedin: socialLinkedin.trim(),
        twitter: socialTwitter.trim(),
        spotify: socialSpotify.trim(),
        binance: socialBinance.trim(),
        pinterest: socialPinterest.trim(),
        email: socialEmail.trim(),
        github: socialGithub.trim(),
      };
      await updateSection("profile", updatedProfile);
      notify("success", "Social links updated live across Navbar & Footer!");
    } catch (err) {
      notify("error", "Failed to update socials: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- UNLOCK SCREEN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-neutral-dark flex items-center justify-center p-6 pt-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 md:p-10 bg-neutral-50 border border-neutral-200 shadow-xl"
        >
          <div className="w-12 h-12 bg-neutral-dark text-white rounded-none flex items-center justify-center mb-6">
            <FaLock size={20} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter mb-2">
            SITE MANAGER
          </h1>
          <p className="text-sm text-neutral-500 mb-6 font-mono">
            Enter your passcode to manage and update your website.
          </p>
          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              inputMode="numeric"
              placeholder="Enter Passcode"
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              className="w-full px-4 py-3 bg-white border border-neutral-300 focus:border-caa-red focus:outline-none font-mono text-lg tracking-widest"
              autoFocus
            />
            {pinError && (
              <p className="text-caa-red text-xs font-mono font-bold">
                Invalid passcode. Please try again.
              </p>
            )}
            <button
              type="submit"
              className="w-full py-4 bg-neutral-dark text-white font-bold tracking-widest uppercase hover:bg-caa-red transition-all"
            >
              UNLOCK
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-xs font-mono text-neutral-400 hover:text-neutral-dark uppercase tracking-wider"
            >
              ← Back to Site
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const thoughtWordCount = thoughtContent.trim()
    ? thoughtContent.trim().split(/\s+/).length
    : 0;
  const thoughtReadTime = `${Math.max(1, Math.ceil(thoughtWordCount / 200))} min read`;

  return (
    <div className="min-h-screen bg-white text-neutral-dark pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="p-3 bg-neutral-100 hover:bg-caa-red hover:text-white transition-colors text-sm"
              title="View Site"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                SITE MANAGER<span className="text-caa-red">.</span>
              </h1>
              <span className="text-xs font-mono text-neutral-400">
                Mobile Admin &amp; Publishing Portal
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="px-3 py-1.5 border border-neutral-300 text-xs font-bold uppercase tracking-wider hover:border-caa-red flex items-center gap-1.5 transition-colors"
            >
              View Site <FaExternalLinkAlt size={10} />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-mono text-neutral-400 hover:text-caa-red underline"
            >
              Lock
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-neutral-100">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveTab(sec.id);
                setStatusMsg({ type: "", text: "" });
              }}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                activeTab === sec.id
                  ? "bg-neutral-dark text-white border-neutral-dark"
                  : "bg-neutral-50 text-neutral-600 border-neutral-200 hover:border-neutral-400"
              }`}
            >
              <span className="mr-1.5">{sec.icon}</span>
              {sec.label}
            </button>
          ))}
        </div>

        {/* Global Notifications */}
        {statusMsg.text && (
          <div
            className={`mb-8 p-4 text-sm font-medium border-l-4 flex items-center justify-between ${
              statusMsg.type === "success"
                ? "bg-green-50 border-green-600 text-green-900"
                : "bg-red-50 border-caa-red text-red-900"
            }`}
          >
            <span className="flex items-center gap-2">
              {statusMsg.type === "success" && <FaCheck />} {statusMsg.text}
            </span>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 1: THOUGHTS                                            */}
        {/* ============================================================== */}
        {activeTab === "thoughts" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">
                Publish a New Thought
              </h2>
              <button
                type="button"
                onClick={() => setThoughtPreviewMode(!thoughtPreviewMode)}
                className="px-3 py-1.5 border border-neutral-300 text-xs font-bold uppercase tracking-wider hover:border-caa-red flex items-center gap-1.5 transition-colors"
              >
                {thoughtPreviewMode ? <FaPen size={10} /> : <FaEye size={10} />}
                {thoughtPreviewMode ? "Edit" : "Preview"}
              </button>
            </div>

            {thoughtPreviewMode ? (
              <div className="bg-neutral-50 p-8 md:p-12 border-t-4 border-caa-red shadow-lg mb-16">
                <div className="text-xs font-mono text-neutral-400 mb-4 flex items-center gap-4">
                  <span className="text-caa-red font-bold uppercase tracking-wider">
                    {customCategory.trim() || thoughtCategory}
                  </span>
                  <span>•</span>
                  <span>
                    {new Date().toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span>•</span>
                  <span>{thoughtReadTime}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-8 leading-tight">
                  {thoughtTitle || "Untitled Thought"}
                </h2>
                <div className="prose prose-lg text-neutral-700 leading-relaxed space-y-6 border-t border-neutral-200 pt-6">
                  {thoughtContent ? (
                    thoughtContent.split("\n\n").map((para, i) => (
                      <p key={i} className="text-base md:text-lg whitespace-pre-line">
                        {para}
                      </p>
                    ))
                  ) : (
                    <p className="text-neutral-400 italic">No content yet.</p>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handlePublishThought} className="space-y-6 mb-16">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                    Title
                  </label>
                  <input
                    type="text"
                    value={thoughtTitle}
                    onChange={(e) => setThoughtTitle(e.target.value)}
                    placeholder="Article title..."
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none font-bold text-xl tracking-tight transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {THOUGHT_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setThoughtCategory(cat);
                          setCustomCategory("");
                        }}
                        className={`px-3 py-1 text-xs font-bold tracking-wider uppercase border transition-all ${
                          thoughtCategory === cat && !customCategory
                            ? "bg-caa-red text-white border-caa-red"
                            : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Or enter custom category..."
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                    Summary (Short card preview)
                  </label>
                  <textarea
                    rows={2}
                    value={thoughtSummary}
                    onChange={(e) => setThoughtSummary(e.target.value)}
                    placeholder="Brief 1-2 sentence hook..."
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-base leading-relaxed transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold tracking-widest uppercase text-neutral-600">
                      Article Body
                    </label>
                    <span className="text-xs font-mono text-neutral-400">
                      {thoughtWordCount} words • ~{thoughtReadTime}
                    </span>
                  </div>
                  <textarea
                    rows={10}
                    value={thoughtContent}
                    onChange={(e) => setThoughtContent(e.target.value)}
                    placeholder="Write freely. Separate paragraphs with an empty line..."
                    className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-base md:text-lg leading-relaxed transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-neutral-dark text-white font-bold tracking-widest uppercase hover:bg-caa-red transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "PUBLISHING..." : "PUBLISH THOUGHT"}
                </button>
              </form>
            )}

            {/* Manage thoughts */}
            {liveThoughts.length > 0 && (
              <div className="pt-8 border-t border-neutral-200">
                <h3 className="text-base font-black tracking-tight mb-4 uppercase">
                  Published Thoughts ({liveThoughts.length})
                </h3>
                <div className="space-y-3">
                  {liveThoughts.map((t) => (
                    <div
                      key={t.id}
                      className="p-4 bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-bold text-sm">{t.title}</h4>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">
                          {t.category} • {t.date}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteThought(t.id)}
                        className="p-2 text-neutral-400 hover:text-caa-red transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 2: PROJECTS                                            */}
        {/* ============================================================== */}
        {activeTab === "projects" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black uppercase tracking-tight">
                {editingProjectId ? "Edit Project" : "Add New Project"}
              </h2>
              {editingProjectId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingProjectId(null);
                    setProjTitle("");
                    setProjFocus("");
                    setProjImage("");
                    setProjDesc("");
                    setProjDemo("");
                    setProjRepo("");
                    setProjTags("");
                  }}
                  className="text-xs font-mono text-caa-red underline"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProject} className="space-y-6 mb-16">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Project Title
                </label>
                <input
                  type="text"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  placeholder="e.g. Pebbles SOC AI Assistant"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none font-bold text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Focus / Subtitle
                </label>
                <input
                  type="text"
                  value={projFocus}
                  onChange={(e) => setProjFocus(e.target.value)}
                  placeholder="e.g. Agentic AI / Cybersecurity & Rapid7 MCP"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm"
                />
              </div>

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Project Cover Image / Thumbnail
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-2">
                  <div className="w-20 h-16 bg-neutral-100 border border-neutral-300 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {projImage ? (
                      <img
                        src={projImage}
                        alt="Cover Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-[10px] text-neutral-400 font-mono">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-caa-red hover:text-white border border-neutral-300 transition-colors text-xs font-bold uppercase tracking-wider">
                      {uploadingProjImage ? (
                        <>
                          <FaSpinner className="animate-spin" /> Processing...
                        </>
                      ) : (
                        <>
                          <FaUpload /> Choose from Device
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleSingleImageFile(e, setProjImage, setUploadingProjImage)
                        }
                      />
                    </label>
                    <input
                      type="text"
                      value={projImage}
                      onChange={(e) => setProjImage(e.target.value)}
                      placeholder="Or enter image URL / asset path..."
                      className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Multiple Gallery Images */}
              <div className="p-4 bg-neutral-50 border border-neutral-200">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-4">
                  <div>
                    <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-800 flex items-center gap-2">
                      <FaImages className="text-caa-red" /> Project Gallery (Multiple Pictures)
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                      Select multiple screenshots or photos from your device at once
                    </p>
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-neutral-dark text-white hover:bg-caa-red transition-colors text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
                    {uploadingGallery ? (
                      <>
                        <FaSpinner className="animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaPlus /> Add Pictures from Device
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleMultipleGalleryFiles}
                    />
                  </label>
                </div>

                {/* Gallery Items Grid */}
                {projGallery.length > 0 ? (
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {projGallery.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative bg-white border border-neutral-300 p-2 shadow-sm group"
                      >
                        <div className="aspect-video bg-neutral-100 overflow-hidden mb-2 relative">
                          <img
                            src={item.src}
                            alt={item.caption || `Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-80 hover:opacity-100 transition-opacity"
                            title="Remove picture"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={item.caption || ""}
                          onChange={(e) => handleGalleryCaptionChange(idx, e.target.value)}
                          placeholder="Optional caption..."
                          className="w-full px-2 py-1 text-xs border border-neutral-200 focus:outline-none focus:border-caa-red font-mono"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 font-mono italic text-center py-4 border border-dashed border-neutral-300">
                    No gallery images added yet. Click &quot;Add Pictures from Device&quot; to pick multiple photos.
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                    Live Demo Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={projDemo}
                    onChange={(e) => setProjDemo(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                    GitHub Repo Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={projRepo}
                    onChange={(e) => setProjRepo(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Tech Stack Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  placeholder="Agentic AI, MCP Server, Python, Streamlit"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Comprehensive description of the system and its architecture..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-base leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-neutral-dark text-white font-bold tracking-widest uppercase hover:bg-caa-red transition-all disabled:opacity-50"
              >
                {isSubmitting
                  ? "SAVING..."
                  : editingProjectId
                  ? "UPDATE PROJECT"
                  : "SAVE PROJECT TO WORK"}
              </button>
            </form>

            {/* Current Projects List */}
            <div className="pt-8 border-t border-neutral-200">
              <h3 className="text-base font-black tracking-tight mb-4 uppercase">
                Active Projects ({projectsList.length})
              </h3>
              <div className="space-y-3">
                {projectsList.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate">{p.title}</h4>
                      <p className="text-xs text-neutral-500 font-mono mt-0.5 truncate">
                        {p.focus}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProjectClick(p)}
                        className="px-3 py-1 bg-white border border-neutral-300 text-xs font-bold uppercase hover:border-caa-red transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-2 text-neutral-400 hover:text-caa-red transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 3: ABOUT & BIO                                         */}
        {/* ============================================================== */}
        {activeTab === "about" && (
          <form onSubmit={handleSaveAbout} className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6">
              Edit About &amp; Bio
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Full Name
                </label>
                <input
                  type="text"
                  value={aboutName}
                  onChange={(e) => setAboutName(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none font-bold text-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Location &amp; Base
                </label>
                <input
                  type="text"
                  value={aboutLocation}
                  onChange={(e) => setAboutLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none font-bold text-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                Profile Picture
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 bg-neutral-100 border border-neutral-300 overflow-hidden flex-shrink-0 shadow-sm">
                  <img
                    src={aboutImage || "/profile-pic.jpg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "/profile-pic.jpg";
                    }}
                  />
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-caa-red hover:text-white border border-neutral-300 transition-colors text-xs font-bold uppercase tracking-wider">
                    {uploadingAboutImage ? (
                      <>
                        <FaSpinner className="animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <FaUpload /> Choose from Device
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleSingleImageFile(e, setAboutImage, setUploadingAboutImage)
                      }
                    />
                  </label>
                  <input
                    type="text"
                    value={aboutImage}
                    onChange={(e) => setAboutImage(e.target.value)}
                    placeholder="Or enter image URL / asset path..."
                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                Who I Am (Bio Paragraphs)
              </label>
              <textarea
                rows={8}
                value={aboutBio}
                onChange={(e) => setAboutBio(e.target.value)}
                placeholder="Separate paragraphs with an empty line..."
                className="w-full px-4 py-4 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-base md:text-lg leading-relaxed"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                Core Expertise &amp; Disciplines ({aboutTags.length})
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {aboutTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-300 text-xs font-bold tracking-wide"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-400 hover:text-caa-red font-black"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="Add new discipline (e.g. AI Engineering)..."
                  className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-neutral-200 hover:bg-caa-red hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  Add
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-neutral-dark text-white font-bold tracking-widest uppercase hover:bg-caa-red transition-all disabled:opacity-50"
            >
              {isSubmitting ? "SAVING..." : "SAVE ABOUT & BIO"}
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* SECTION 4: CERTIFICATES                                        */}
        {/* ============================================================== */}
        {activeTab === "certificates" && (
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-6">
              Add Certificate
            </h2>
            <form onSubmit={handleAddCertificate} className="space-y-6 mb-16">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Certificate Name
                </label>
                <input
                  type="text"
                  value={newCertName}
                  onChange={(e) => setNewCertName(e.target.value)}
                  placeholder="e.g. INE CERTIFIED PENETRATION TESTER"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none font-bold text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Issuer / Organization
                </label>
                <input
                  type="text"
                  value={newCertIssuer}
                  onChange={(e) => setNewCertIssuer(e.target.value)}
                  placeholder="e.g. INE Security"
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                  Verification URL (Optional)
                </label>
                <input
                  type="url"
                  value={newCertLink}
                  onChange={(e) => setNewCertLink(e.target.value)}
                  placeholder="https://certs.ine.com/..."
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-neutral-dark text-white font-bold tracking-widest uppercase hover:bg-caa-red transition-all disabled:opacity-50"
              >
                {isSubmitting ? "ADDING..." : "ADD CERTIFICATE"}
              </button>
            </form>

            <div className="pt-8 border-t border-neutral-200">
              <h3 className="text-base font-black tracking-tight mb-4 uppercase">
                Active Certificates ({certList.length})
              </h3>
              <div className="space-y-3">
                {certList.map((c, i) => {
                  const name = typeof c === "object" ? c.name : c;
                  const issuer = typeof c === "object" ? c.issuer : "Professional Certification";
                  return (
                    <div
                      key={i}
                      className="p-4 bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-4"
                    >
                      <div>
                        <h4 className="font-bold text-sm">{name}</h4>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">{issuer}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCertificate(i)}
                        className="p-2 text-neutral-400 hover:text-caa-red transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SECTION 5: LINKS & SOCIALS                                     */}
        {/* ============================================================== */}
        {activeTab === "socials" && (
          <form onSubmit={handleSaveSocials} className="space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight mb-6">
              Update Socials &amp; Profiles
            </h2>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={socialLinkedin}
                onChange={(e) => setSocialLinkedin(e.target.value)}
                placeholder="https://www.linkedin.com/in/..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                X (Twitter) URL
              </label>
              <input
                type="url"
                value={socialTwitter}
                onChange={(e) => setSocialTwitter(e.target.value)}
                placeholder="https://x.com/..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                Spotify Profile URL
              </label>
              <input
                type="url"
                value={socialSpotify}
                onChange={(e) => setSocialSpotify(e.target.value)}
                placeholder="https://open.spotify.com/user/..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                Binance Referral / Profile URL
              </label>
              <input
                type="url"
                value={socialBinance}
                onChange={(e) => setSocialBinance(e.target.value)}
                placeholder="https://account.binance.com/..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                Pinterest Profile URL
              </label>
              <input
                type="url"
                value={socialPinterest}
                onChange={(e) => setSocialPinterest(e.target.value)}
                placeholder="https://pin.it/..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={socialGithub}
                onChange={(e) => setSocialGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase mb-2 text-neutral-600">
                Contact Email
              </label>
              <input
                type="email"
                value={socialEmail}
                onChange={(e) => setSocialEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 focus:border-caa-red focus:bg-white focus:outline-none text-sm font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-neutral-dark text-white font-bold tracking-widest uppercase hover:bg-caa-red transition-all disabled:opacity-50"
            >
              {isSubmitting ? "SAVING..." : "SAVE SOCIAL LINKS"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default WriteThought;
