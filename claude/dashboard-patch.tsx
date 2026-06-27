/**
 * DASHBOARD PATCH — src/app/dashboard/page.tsx
 *
 * This file shows ONLY the changes needed. Apply them to your existing
 * dashboard/page.tsx. Full file not repeated to avoid confusion.
 *
 * CHANGE 1 — Add import at top (after existing imports)
 * CHANGE 2 — Add state variables inside Dashboard()
 * CHANGE 3 — Replace handleCreate() with the version below
 * CHANGE 4 — Add <KoFiModal> at the bottom of the JSX return, before closing </div>
 * CHANGE 5 — Remove AdSense from sidebar bottom, replace with KoFiWidget
 * CHANGE 6 — Remove AdSense from dashboard_project_middle slot
 */

// ─── CHANGE 1: ADD TO IMPORTS ──────────────────────────────────────────────
// Add these two lines alongside your existing imports:

import KoFiModal from "@/components/KoFiModal";
import KoFiWidget from "@/components/KoFiWidget";
// Remove this line (keep AdSense only for overview_middle):
// import AdSense from "@/components/AdSense";   ← keep this, just stop using it in sidebar/project


// ─── CHANGE 2: ADD STATE VARIABLES ────────────────────────────────────────
// Inside Dashboard(), alongside your existing useState declarations, add:

const [showKoFiModal, setShowKoFiModal] = useState(false);
const [createdEndpointUrl, setCreatedEndpointUrl] = useState("");
const [createdProjectName, setCreatedProjectName] = useState("");


// ─── CHANGE 3: REPLACE handleCreate ───────────────────────────────────────
// Replace your existing handleCreate function with this version.
// The only addition is the 3 lines after "setActiveTab('projects')"

const handleCreate = async () => {
  if (!newName || !newSlug || isCreating) return;
  setIsCreating(true);
  setError(null);
  try {
    const res = await fetch("/api/project/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid: user.uid,
        name: newName,
        slug: newSlug,
        emailTo: user.email || "",
        theme: newTheme,
      }),
    });
    const data = await res.json();
    if (data.id || data.success) {
      trackProjectCreate(newName);
      setSelectedProjectId(data.id);
      setIsCreatingNew(false);
      setNewName("");
      setNewSlug("");
      setActiveTab("projects");

      // ── NEW: trigger Ko-fi modal after endpoint is created ──────────────
      const newEndpointUrl = `${origin}/api/f/${newSlug}`;
      setCreatedEndpointUrl(newEndpointUrl);
      setCreatedProjectName(newName);
      // Small delay so the dashboard tab transition completes first
      setTimeout(() => setShowKoFiModal(true), 600);
      // ────────────────────────────────────────────────────────────────────

    } else {
      setError(data.error || "Failed to create project.");
    }
  } catch {
    setError("Network error. Please try again.");
  } finally {
    setIsCreating(false);
  }
};


// ─── CHANGE 4: ADD MODAL TO JSX RETURN ────────────────────────────────────
// Add this JUST BEFORE the final closing </div> of the return statement:

<KoFiModal
  isOpen={showKoFiModal}
  onClose={() => setShowKoFiModal(false)}
  endpointUrl={createdEndpointUrl}
  projectName={createdProjectName}
/>


// ─── CHANGE 5: SIDEBAR — swap AdSense for KoFiWidget ──────────────────────
// Find this block in the sidebar section (~line 291):
//
//   <div className="px-4 pb-4">
//     <AdSense adSlot="dashboard_sidebar_bottom" adFormat="vertical" />
//   </div>
//
// Replace with:

<div className="px-4 pb-4">
  <KoFiWidget variant="inline" />
</div>


// ─── CHANGE 6: PROJECT VIEW — remove AdSense from middle of project view ───
// Find this in the project tab left column (~line 552):
//
//   <AdSense adSlot="dashboard_project_middle" />
//
// Delete it entirely. The project view should be clean — no ads mid-content.
// The overview tab AdSense (dashboard_overview_middle) can stay.
