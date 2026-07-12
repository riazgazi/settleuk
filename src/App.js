import React from "react";
import { JourneyProvider, useJourneyContext } from "./context/JourneyContext";

import Onboarding from "./pages/Onboarding/Onboarding";
import Home from "./pages/Home/Home";
import MyJourney from "./pages/Journey/MyJourney";
import StepDetails from "./pages/Journey/StepDetails/StepDetails";
import AppLayout from "./components/layout/AppLayout";

import AdvanceModal from "./components/modals/AdvanceModal";
import SkipModal from "./components/modals/SkipModal";
import SettingsModal from "./components/modals/SettingsModal";

const AppContent = () => {
  const {
    screen,
    setScreen,
    setProfile,
    tab,
    setTab,
    advancePrompt,
    skipWarning,
    showSettings,
  } = useJourneyContext();

  // Onboarding is full-screen, no persistent shell/Bottom Nav — per
  // "Only full-screen onboarding or temporary modals should hide the
  // Bottom Navigation."
  if (screen === "onboard") {
    return (
      <Onboarding
        onComplete={(result) => {
          if (result.profile) {
            setProfile((p) => ({
              ...p,
              name: result.profile.name,
              statusId: result.profile.statusId,
              arrival: result.profile.intake,
            }));
          }
          setScreen("home");
        }}
      />
    );
  }

  function renderPrimaryScreen() {
    switch (screen) {
      case "journey":
        return <MyJourney />;

      case "step-details":
        return <StepDetails />;

      case "home":
      default:
        return <Home />;
    }
  }

  return (
    <>
      {/* Home, My Journey, and Step Details all render inside the same
          AppLayout shell now, so Bottom Navigation stays persistent across
          all three — Journey/Step Details keep their own existing headers
          and content untouched; only the shell around them changed. */}
      <AppLayout screen={screen} setScreen={setScreen} tab={tab} setTab={setTab}>
        {renderPrimaryScreen()}
      </AppLayout>

      {advancePrompt && <AdvanceModal />}
      {skipWarning && <SkipModal />}
      {showSettings && <SettingsModal />}
    </>
  );
};

export default function App() {
  return (
    <JourneyProvider>
      <AppContent />
    </JourneyProvider>
  );
}