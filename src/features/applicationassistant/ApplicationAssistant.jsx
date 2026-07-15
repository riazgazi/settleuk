import React from "react";
import {
    MessageCircle,
    ArrowUpRight,
    GraduationCap,
    FileText,
    PenLine,
    ClipboardCheck,
    Stamp,
    Plane,
    Home,
    Globe2,
    ListChecks,
    ShieldCheck,
} from "lucide-react";

/**
 * ============================================================
 * Application Assistant — Quick Tool
 * ============================================================
 * A community & support hub (NOT an AI chatbot, NOT a live chat).
 * Pure front-end, no backend / auth / database.
 *
 * STYLING NOTE
 * This component ships its own scoped CSS (see <style> block at
 * the bottom of the render) instead of relying on Tailwind utility
 * classes. That's intentional: if your app's Tailwind content
 * config doesn't scan this file's path, Tailwind classes silently
 * produce zero CSS and everything falls back to unstyled default
 * HTML — which is what caused the mismatch you saw. Scoped CSS
 * guarantees this renders the same everywhere, with no build
 * config to worry about. All classnames are prefixed with `aa-`
 * so they won't collide with the rest of your app.
 *
 * The only thing you should ever need to edit is the constant
 * below when your WhatsApp invite link changes.
 * ============================================================
 */

const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/your-invite-code";

const HELP_TOPICS = [
    { icon: GraduationCap, title: "University Selection", description: "Narrow down universities that fit your goals and budget." },
    { icon: FileText, title: "Application Guidance", description: "Understand what UK universities expect from applicants." },
    { icon: PenLine, title: "SOP & Personal Statement", description: "Get guidance on structuring a strong personal statement." },
    { icon: ClipboardCheck, title: "CAS Preparation", description: "Learn what's needed to prepare your CAS documentation." },
    { icon: Stamp, title: "Visa Guidance", description: "General guidance on the UK student visa process." },
    { icon: Plane, title: "Pre-Departure Support", description: "Tips and checklists to prepare before you fly." },
    { icon: Home, title: "Accommodation Advice", description: "Shared experiences on finding a place to stay." },
    { icon: Globe2, title: "Life in the UK", description: "Everyday guidance on settling into UK student life." },
];

const BEFORE_YOU_ASK = [
    "University name",
    "Intended course",
    "Intake (month & year)",
    "IELTS score (if available)",
    "Your specific question",
];

const GUIDELINES = [
    "Be respectful.",
    "Avoid spam.",
    "Protect your personal information.",
    "Use English or Bangla.",
    "Search previous discussions before asking.",
];

function HelpTopicCard({ icon: Icon, title, description }) {
    return (
        <div className="aa-topic-card">
            <div className="aa-icon-box">
                <Icon size={20} strokeWidth={2} color="#22c55e" />
            </div>
            <h3 className="aa-topic-title">{title}</h3>
            <p className="aa-topic-desc">{description}</p>
        </div>
    );
}

export default function ApplicationAssistant() {
    const handleJoinWhatsApp = () => {
        window.open(WHATSAPP_COMMUNITY_URL, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="aa-page">
            <div className="aa-container">
                {/* Page Header */}
                <header className="aa-header">
                    <h1 className="aa-title">Application Assistant</h1>
                    <p className="aa-subtitle">
                        Need help with your UK study journey? Join our community and get guidance.
                    </p>
                </header>

                {/* Section 1 — WhatsApp Community */}
                <section className="aa-section">
                    <div className="aa-whatsapp-card">
                        <div className="aa-whatsapp-icon">
                            <MessageCircle size={26} strokeWidth={2} color="#0a0a0a" />
                        </div>
                        <h2 className="aa-whatsapp-title">Join Our WhatsApp Community</h2>
                        <p className="aa-whatsapp-desc">
                            Join our WhatsApp Community to ask questions, share experiences, and
                            receive guidance throughout your UK application journey.
                        </p>
                        <button className="aa-btn-primary" onClick={handleJoinWhatsApp}>
                            Join WhatsApp Community
                            <ArrowUpRight size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                </section>

                {/* Section 2 — How We Can Help */}
                <section className="aa-section">
                    <h2 className="aa-section-label">How We Can Help</h2>
                    <div className="aa-topics-grid">
                        {HELP_TOPICS.map((topic) => (
                            <HelpTopicCard key={topic.title} {...topic} />
                        ))}
                    </div>
                </section>

                {/* Section 3 — Before You Ask */}
                <section className="aa-section">
                    <h2 className="aa-section-label">Before You Ask</h2>
                    <div className="aa-info-card">
                        <div className="aa-info-header">
                            <div className="aa-icon-box aa-icon-box-sm">
                                <ListChecks size={16} strokeWidth={2} color="#22c55e" />
                            </div>
                            <p className="aa-info-intro">Before asking a question, please prepare:</p>
                        </div>
                        <ul className="aa-list">
                            {BEFORE_YOU_ASK.map((item) => (
                                <li key={item} className="aa-list-item">
                                    <span className="aa-dot" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <p className="aa-info-footnote">This helps our community assist you faster.</p>
                    </div>
                </section>

                {/* Section 4 — Community Guidelines */}
                <section className="aa-section">
                    <h2 className="aa-section-label">Community Guidelines</h2>
                    <div className="aa-info-card">
                        <div className="aa-info-header">
                            <div className="aa-icon-box aa-icon-box-sm">
                                <ShieldCheck size={16} strokeWidth={2} color="#22c55e" />
                            </div>
                            <p className="aa-info-intro">A few simple rules to keep things useful for everyone:</p>
                        </div>
                        <ul className="aa-list">
                            {GUIDELINES.map((rule) => (
                                <li key={rule} className="aa-list-item">
                                    <span className="aa-dot" />
                                    {rule}
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Footer */}
                <footer className="aa-footer">
                    <p className="aa-footer-text">
                        This community is intended to support students by sharing information
                        and experiences. Always verify important information through official
                        university or UK government sources.
                    </p>
                </footer>
            </div>

            <style>{`
        .aa-page {
          min-height: 100vh;
          background: #0a0a0f;
          color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .aa-container {
          max-width: 480px;
          margin: 0 auto;
          padding: 24px 16px 64px;
          box-sizing: border-box;
        }
        .aa-header { margin-bottom: 24px; }
        .aa-title {
          font-size: 26px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
          color: #ffffff;
        }
        .aa-subtitle {
          font-size: 14px;
          color: #a1a1aa;
          margin: 8px 0 0;
          line-height: 1.5;
        }
        .aa-section { margin-bottom: 32px; }
        .aa-section-label {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #22c55e;
          margin: 0 0 12px;
        }

        .aa-whatsapp-card {
          border-radius: 20px;
          padding: 22px;
          background: linear-gradient(180deg, rgba(34,197,94,0.14) 0%, #15151b 100%);
          border: 1px solid rgba(34,197,94,0.25);
          box-sizing: border-box;
        }
        .aa-whatsapp-icon {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: #22c55e;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .aa-whatsapp-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 8px;
          color: #ffffff;
        }
        .aa-whatsapp-desc {
          font-size: 14px;
          color: #d4d4d8;
          line-height: 1.6;
          margin: 0 0 20px;
        }
        .aa-btn-primary {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #22c55e;
          color: #0a0a0a;
          font-weight: 700;
          font-size: 14px;
          border: none;
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          box-sizing: border-box;
          transition: background 0.15s ease;
        }
        .aa-btn-primary:hover { background: #16a34a; }

        .aa-topics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .aa-topic-card {
          border-radius: 18px;
          background: #16161d;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 16px;
          box-sizing: border-box;
        }
        .aa-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: rgba(34,197,94,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 12px;
        }
        .aa-icon-box-sm { width: 32px; height: 32px; border-radius: 10px; margin-bottom: 0; flex-shrink: 0; }
        .aa-topic-title {
          font-size: 13px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 4px;
          line-height: 1.3;
        }
        .aa-topic-desc {
          font-size: 12px;
          color: #a1a1aa;
          line-height: 1.5;
          margin: 0;
        }

        .aa-info-card {
          border-radius: 18px;
          background: #16161d;
          border: 1px solid rgba(255,255,255,0.08);
          padding: 18px;
          box-sizing: border-box;
        }
        .aa-info-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }
        .aa-info-intro {
          font-size: 14px;
          color: #d4d4d8;
          line-height: 1.5;
          margin: 4px 0 0;
        }
        .aa-list {
          list-style: none;
          margin: 0;
          padding: 0 0 0 44px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .aa-list-item {
          font-size: 13px;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .aa-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          flex-shrink: 0;
        }
        .aa-info-footnote {
          font-size: 12px;
          color: #71717a;
          margin: 16px 0 0;
          line-height: 1.5;
        }

        .aa-footer { margin-top: 8px; }
        .aa-footer-text {
          font-size: 12px;
          color: #71717a;
          line-height: 1.6;
          text-align: center;
          margin: 0;
          padding: 0 8px;
        }

        @media (max-width: 380px) {
          .aa-topics-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
}
