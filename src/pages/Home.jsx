import React from 'react';
import {
    Bell,
    FileText,
    Wallet,
    GraduationCap,
    Bot,
    Backpack,
    BookOpen,
    Clock,
    Home as HomeIcon,
    Plane,
    CheckCheck,
    ArrowRight,
    Search,
    BadgeCheck,
    MapPin,
    CircleUser
} from 'lucide-react';

const profileAvatar = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><defs><linearGradient id='bg' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%231e3a8a'/><stop offset='100%' stop-color='%233b82f6'/></linearGradient></defs><circle cx='100' cy='100' r='100' fill='url(%23bg)'/><circle cx='100' cy='80' r='32' fill='%23ffffff'/><path d='M 100 50 L 135 65 L 100 80 L 65 65 Z' fill='%23ffffff' opacity='0.9'/><rect x='128' y='62' width='4' height='15' fill='%23ffffff' opacity='0.9'/><circle cx='130' cy='77' r='3' fill='%23ffffff' opacity='0.9'/><path d='M 45 180 C 45 130, 155 130, 155 180 Z' fill='%23ffffff'/></svg>";

const Home = () => {
    const daysLeft = 58;
    const completedTasks = 12;
    const pendingTasks = 5;
    const readinessScore = "87%";
    const journeyProgress = 46;

    const journeySteps = [
        { name: 'Research', status: 'done', icon: Search },
        { name: 'Apply', status: 'done', icon: GraduationCap },
        { name: 'Offer', status: 'active', icon: FileText },
        { name: 'CAS', status: 'pending', icon: BadgeCheck },
        { name: 'Visa', status: 'pending', icon: Plane },
        { name: 'UK', status: 'pending', icon: MapPin }
    ];

    const exploreItems = [
        { icon: FileText, title: 'Documents', subtitle: 'Manage required files', color: '#3b82f6' },
        { icon: Wallet, title: 'Costs', subtitle: 'Estimate your expenses', color: '#10b981' },
        { icon: GraduationCap, title: 'Universities', subtitle: 'Find your perfect match', color: '#f59e0b' },
        { icon: Bot, title: 'AI Assistant', subtitle: 'Ask anything', color: '#8b5cf6' },
        { icon: Backpack, title: 'Packing', subtitle: 'Checklist & tips', color: '#ef4444' },
        { icon: BookOpen, title: 'Resources', subtitle: 'Guides & links', color: '#06b6d4' }
    ];

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#050816',
            display: 'flex',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
            margin: 0,
            padding: 0
        }}>
            <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes growWidth {
          from { width: 0%; }
        }
        .anim-card {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .anim-btn {
          transition: transform 0.1s ease, background-color 0.1s ease;
        }
        .anim-btn:active {
          transform: scale(0.96);
        }
        .explore-card:active {
          transform: scale(0.95);
          background-color: rgba(255,255,255,0.12) !important;
        }
        .anim-progress {
          animation: growWidth 1.2s ease-out forwards;
        }
      `}</style>

            <div style={{
                width: '100%',
                maxWidth: '430px',
                minHeight: '100vh',
                position: 'relative',
                backgroundColor: '#050816',
                backgroundImage: `
          radial-gradient(circle at 100% 0%, #1e3a8a 0%, transparent 40%),
          radial-gradient(circle at 0% 100%, #172554 0%, transparent 40%)
        `,
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: '40px',
                boxSizing: 'border-box'
            }}>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '50px 24px 20px',
                    opacity: 0,
                    animation: 'fadeUp 0.5s ease-out forwards'
                }}>
                    <div>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '14px', fontWeight: '500' }}>
                            Good Morning,
                        </p>
                        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>
                            Riaz Gazi 👋
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{
                            background: 'rgba(59, 130, 246, 0.15)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            padding: '8px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#60a5fa',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                        }}>
                            <Clock size={14} />
                            {daysLeft} Days Left
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}>
                            <Bell size={20} color="#fff" />
                        </div>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: '2px solid #3b82f6',
                            boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#1e293b'
                        }}>
                            <img
                                src={profileAvatar}
                                alt="Riaz Gazi Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                </div>

                <div className="anim-card" style={{
                    margin: '10px 24px 24px',
                    animationDelay: '0.1s',
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '24px',
                    padding: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>Your UK Journey</h2>
                    </div>

                    <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', padding: '0 4px' }}>
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            right: '20px',
                            height: '2px',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            zIndex: 0
                        }} />
                        <div style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            width: '38%',
                            height: '2px',
                            background: '#3b82f6',
                            boxShadow: '0 0 12px #3b82f6',
                            zIndex: 1
                        }} />

                        {journeySteps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', zIndex: 2, width: '48px' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: step.status === 'done' ? '#3b82f6' : step.status === 'active' ? '#ffffff' : '#1e293b',
                                        border: step.status === 'active' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.2)',
                                        boxShadow: step.status === 'active' ? '0 0 16px rgba(59, 130, 246, 0.8)' : 'none',
                                        boxSizing: 'border-box',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <Icon
                                            size={18}
                                            color={step.status === 'pending' ? 'rgba(255,255,255,0.4)' : step.status === 'active' ? '#3b82f6' : '#ffffff'}
                                            strokeWidth={2.5}
                                        />
                                    </div>
                                    <span style={{
                                        fontSize: '10px',
                                        color: step.status === 'pending' ? 'rgba(255,255,255,0.4)' : '#fff',
                                        fontWeight: '600',
                                        textAlign: 'center'
                                    }}>
                                        {step.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>Progress</span>
                            <span style={{ fontSize: '12px', color: '#60a5fa', fontWeight: '700' }}>{journeyProgress}%</span>
                        </div>
                        <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div className="anim-progress" style={{
                                width: `${journeyProgress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                borderRadius: '3px',
                                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                            }} />
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                        padding: '14px',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                        <div>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Current Stage</span>
                            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '600' }}>Offer Letter</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Time Remaining</span>
                            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '600', color: '#60a5fa' }}>{daysLeft} Days</p>
                        </div>
                    </div>

                    <button className="anim-btn" style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '16px',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        background: 'rgba(59, 130, 246, 0.1)',
                        color: '#60a5fa',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        View My Journey <ArrowRight size={16} />
                    </button>
                </div>

                <div className="anim-card" style={{
                    margin: '0 24px 24px',
                    animationDelay: '0.2s'
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 12px 6px' }}>Today's Focus</h3>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        borderRadius: '20px',
                        padding: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <span style={{ color: '#60a5fa', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Task
                            </span>
                            <h4 style={{ margin: '6px 0 10px 0', fontSize: '16px', fontWeight: '600' }}>
                                Write Personal Statement
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Clock size={14} color="rgba(255,255,255,0.6)" />
                                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                                    Estimated Time: 25 Minutes
                                </span>
                            </div>
                        </div>
                        <button className="anim-btn" style={{
                            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '24px',
                            color: 'white',
                            fontWeight: '700',
                            cursor: 'pointer',
                            fontSize: '13px',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                        }}>
                            Continue
                        </button>
                    </div>
                </div>

                <div className="anim-card" style={{
                    padding: '0 24px',
                    marginBottom: '28px',
                    animationDelay: '0.3s'
                }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 16px 6px' }}>Explore</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {exploreItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.title} className="explore-card anim-btn" style={{
                                    background: 'rgba(255, 255, 255, 0.06)',
                                    backdropFilter: 'blur(12px)',
                                    WebkitBackdropFilter: 'blur(12px)',
                                    borderRadius: '20px',
                                    padding: '20px',
                                    border: '1px solid rgba(255, 255, 255, 0.08)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    gap: '16px',
                                    cursor: 'pointer'
                                }}>
                                    <div style={{
                                        width: '44px',
                                        height: '44px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255,255,255,0.08)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        boxShadow: `0 0 20px ${item.color}20`
                                    }}>
                                        <Icon size={20} color={item.color} />
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff', display: 'block' }}>
                                            {item.title}
                                        </span>
                                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', display: 'block' }}>
                                            {item.subtitle}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="anim-card" style={{
                    margin: '0 24px',
                    animationDelay: '0.4s'
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '24px',
                        padding: '24px 16px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <div>
                            <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#3b82f6' }}>{completedTasks}</h2>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Completed</span>
                        </div>
                        <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#f59e0b' }}>{pendingTasks}</h2>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Pending</span>
                        </div>
                        <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#10b981' }}>{daysLeft}</h2>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Days Left</span>
                        </div>
                        <div style={{ width: '1px', height: '40px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                        <div>
                            <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#06b6d4' }}>{readinessScore}</h2>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: '500' }}>Readiness</span>
                        </div>
                    </div>
                </div>

                <div style={{
                    position: 'sticky',
                    bottom: 0,
                    width: '100%',
                    background: 'rgba(5, 8, 22, 0.8)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: '14px 0 30px',
                    boxSizing: 'border-box',
                    zIndex: 10,
                    marginTop: '24px'
                }}>
                    {[
                        { icon: HomeIcon, label: 'Home', active: true },
                        { icon: Plane, label: 'Journey', active: false },
                        { icon: CheckCheck, label: 'Tasks', active: false },
                        { icon: CircleUser, label: 'Profile', active: false }
                    ].map((nav) => {
                        const Icon = nav.icon;
                        return (
                            <div key={nav.label} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                color: nav.active ? '#3b82f6' : 'rgba(255,255,255,0.4)',
                                cursor: 'pointer',
                                padding: '0 10px'
                            }}>
                                <Icon size={22} />
                                <span style={{ fontSize: '11px', fontWeight: '600' }}>{nav.label}</span>
                                {nav.active && (
                                    <div style={{
                                        width: '20px',
                                        height: '3px',
                                        borderRadius: '2px',
                                        backgroundColor: '#3b82f6',
                                        marginTop: '2px',
                                        boxShadow: '0 0 8px #3b82f6'
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default Home;