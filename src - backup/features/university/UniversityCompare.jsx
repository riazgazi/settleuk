import React from "react";

/**
 * @param {object[]} universities - up to 3 full university records
 * @param {(id: string) => void} onRemove
 */
function UniversityCompare({ universities, onRemove }) {
    if (universities.length === 0) {
        return (
            <div className="ue-compare-empty">
                No universities selected yet. Go to the Universities tab and tap
                "⚖ Compare" on up to 3 cards.
            </div>
        );
    }

    const rows = [
        { label: "Ranking", render: (u) => u.ranking },
        { label: "Tuition", render: (u) => `£${u.tuitionPerYear.toLocaleString()}/yr` },
        { label: "Living Cost", render: (u) => `£${u.livingCostPerYear.toLocaleString()}/yr` },
        { label: "IELTS", render: (u) => u.ieltsMin },
        {
            label: "Duration",
            render: (u) => u.duration[u.studyLevels[0]] || "—",
        },
        { label: "Scholarships", render: (u) => u.scholarships.join(", ") },
        { label: "Location", render: (u) => `${u.city}, ${u.country}` },
    ];

    return (
        <div style={{ overflowX: "auto" }}>
            <table className="ue-compare-table">
                <thead>
                    <tr>
                        <th></th>
                        {universities.map((u) => (
                            <th key={u.id}>
                                {u.name}
                                <button
                                    type="button"
                                    className="ue-compare-remove"
                                    onClick={() => onRemove(u.id)}
                                >
                                    Remove
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.label}>
                            <th>{row.label}</th>
                            {universities.map((u) => (
                                <td key={u.id}>{row.render(u)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UniversityCompare;
