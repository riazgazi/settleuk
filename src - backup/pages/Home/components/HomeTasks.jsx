import React, { useState } from 'react';
import InfoExpand from '../../../components/home/InfoExpand';
import { insightMeta } from '../../../utils/insightMeta';
import { taskRank } from '../../../utils/taskRank';

const HomeTasks = ({ sg, taskDone, toggleTask, statusId, setTab }) => {
    const [expandedTask, setExpandedTask] = useState(null);
    const completedTasksCount = sg.tasks.filter(t => taskDone[t.id]).length;
    const sortedTasks = [...sg.tasks].sort((a, b) => taskRank(a) - taskRank(b));

    return (
        <div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 800 }}>{sg.name} tasks</h2>
            <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(255,255,255,0.38)" }}>{completedTasksCount} of {sg.tasks.length} completed · {sg.deadline}</p>

            {statusId === 4 && (
                <div onClick={() => setTab("packing")} style={{ marginBottom: 14, padding: "14px 16px", borderRadius: 14, cursor: "pointer", background: "rgba(91,141,239,0.08)", border: "1px solid rgba(91,141,239,0.3)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 22 }}>🧳</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: "#4A90D9" }}>Start Your Packing Planner</div>
                            <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>Visa submitted! Time to plan what to pack for UK.</div>
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#4A90D9", background: "rgba(91,141,239,0.15)", padding: "3px 10px", borderRadius: 20 }}>UNLOCK NOW</span>
                        <span style={{ fontSize: 13, color: "#4A90D9", fontWeight: 700 }}>Open Packing Planner →</span>
                    </div>
                </div>
            )}

            {sortedTasks.map(task => {
                const isExpanded = expandedTask === task.id;
                return (
                    <div key={task.id} style={{ marginBottom: 7 }}>
                        <div style={{ display: "flex", gap: 12, padding: "13px 14px", background: taskDone[task.id] ? "rgba(61,184,139,0.06)" : "rgba(255,255,255,0.03)", border: `1px solid ${taskDone[task.id] ? "#1D9E6A44" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, alignItems: "flex-start" }}>
                            <div onClick={() => toggleTask(task.id)} style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 2, cursor: "pointer", border: `2px solid ${taskDone[task.id] ? "#1D9E6A" : "rgba(255,255,255,0.2)"}`, background: taskDone[task.id] ? "#1D9E6A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                                {taskDone[task.id] && "✓"}
                            </div>
                            <div onClick={() => toggleTask(task.id)} style={{ flex: 1, cursor: "pointer" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 13.5, fontWeight: 700, textDecoration: taskDone[task.id] ? "line-through" : "none", color: taskDone[task.id] ? "rgba(255,255,255,0.28)" : "#F0F4FF" }}>{task.text}</span>
                                    {task.priority && !taskDone[task.id] && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#CF142B", background: "rgba(207,20,43,0.14)", padding: "2px 7px", borderRadius: 8 }}>PRIORITY</span>}
                                    {task.autoAdvance && !taskDone[task.id] && <span style={{ fontSize: 9.5, fontWeight: 700, color: "#4A90D9", background: "rgba(74,144,217,0.15)", padding: "2px 7px", borderRadius: 8 }}>AUTO-ADVANCE</span>}
                                </div>
                            </div>
                            {task.desc && (
                                <button onClick={(e) => { e.stopPropagation(); setExpandedTask(isExpanded ? null : task.id); }} style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: isExpanded ? "rgba(91,141,239,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${isExpanded ? "#4A90D9" : "rgba(255,255,255,0.12)"}`, color: isExpanded ? "#4A90D9" : "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>ℹ️</button>
                            )}
                        </div>
                        {isExpanded && task.desc && <InfoExpand desc={task.desc} link={task.link} accent="#4A90D9" />}
                    </div>
                );
            })}

            <div style={{ marginTop: 16, padding: "11px 14px", background: "rgba(61,184,139,0.05)", border: "1px solid rgba(61,184,139,0.14)", borderRadius: 12, fontSize: 11.5, color: "rgba(255,255,255,0.38)", textAlign: "center" }}>
                ✨ <strong style={{ color: "#4A90D9" }}>AUTO-ADVANCE</strong> tasks will prompt to update your status automatically when completed.
            </div>

            {sg.insights && sg.insights.length > 0 && (
                <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>Insights & Risk Alerts</div>
                    {sg.insights.map((ins, i) => {
                        const meta = insightMeta(ins.type);
                        return (
                            <div key={i} style={{ display: "flex", gap: 11, padding: "12px 14px", marginBottom: 8, background: meta.bg, border: `1px solid ${meta.border}`, borderRadius: 12 }}>
                                <span style={{ fontSize: 18, flexShrink: 0 }}>{meta.icon}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 3 }}>
                                        <span style={{ fontSize: 13.5, fontWeight: 800, color: meta.color }}>{ins.title}</span>
                                        <span style={{ fontSize: 9, fontWeight: 700, color: meta.badge.c, background: meta.badge.bg, padding: "2px 8px", borderRadius: 8, whiteSpace: "nowrap" }}>{meta.badge.label}</span>
                                    </div>
                                    <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{ins.sub}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default HomeTasks;