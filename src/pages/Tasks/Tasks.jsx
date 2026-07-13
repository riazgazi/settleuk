import React from 'react';
import { useJourneyContext } from '../../context/JourneyContext';
import { STAGES } from '../../data/stages';
import './Tasks.css';

export default function Tasks() {
    const { taskDone, toggleTask, profile } = useJourneyContext();
    const currentStatusId = profile?.statusId ?? 0;

    return (
        <div className="tsk-screen">
            <h1 className="tsk-page-title">All Tasks</h1>
            <p className="tsk-page-subtitle">Every step of your UK journey, in one place.</p>

            {STAGES.map((stage) => {
                const isCurrentStage = stage.id === currentStatusId;
                const totalTasks = stage.tasks.length;
                const doneCount = stage.tasks.filter((t) => taskDone[t.id]).length;

                return (
                    <section
                        key={stage.id}
                        className={`tsk-stage-card ${isCurrentStage ? 'tsk-stage-card-active' : ''}`}
                    >
                        <div className="tsk-stage-header">
                            <h2 className="tsk-stage-title">{stage.name}</h2>
                            {isCurrentStage && <span className="tsk-current-badge">Current stage</span>}
                            <span className="tsk-stage-count">{doneCount}/{totalTasks}</span>
                        </div>

                        <ul className="tsk-task-list">
                            {stage.tasks.map((task) => {
                                const checked = !!taskDone[task.id];
                                return (
                                    <li key={task.id} className="tsk-task-row">
                                        <label className="tsk-task-label">
                                            <input
                                                type="checkbox"
                                                className="tsk-checkbox"
                                                checked={checked}
                                                onChange={() => toggleTask(task.id)}
                                            />
                                            <span className={`tsk-task-text ${checked ? 'tsk-task-text-done' : ''}`}>
                                                {task.text}
                                            </span>
                                            {task.priority && <span className="tsk-priority-dot" title="Priority task" />}
                                        </label>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                );
            })}
        </div>
    );
}
