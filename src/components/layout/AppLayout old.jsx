import React from 'react';
import Header from '../home/Header';
import BottomNav from '../home/BottomNav';

const AppLayout = ({ children, profile, arrivalDays, changeStatus, tab, setTab, packingAutoVisible }) => {
    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #011936 0%, #0A2348 50%, #0F2D5C 100%)", fontFamily: "Arial, sans-serif", color: "#F0F4FF", paddingBottom: 80 }}>
            <style>{`* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; } html, body { overflow-x: hidden; } input, button, textarea { max-width: 100%; }`}</style>

            <Header
                profile={profile}
                arrivalDays={arrivalDays}
                changeStatus={changeStatus}
                tab={tab}
                setTab={setTab}
                packingAutoVisible={packingAutoVisible}
            />

            <div style={{ maxWidth: 640, margin: "0 auto", padding: "16px 20px" }}>
                {children}
            </div>

            <BottomNav tab={tab} setTab={setTab} packingAutoVisible={packingAutoVisible} />
        </div>
    );
};

export default AppLayout;