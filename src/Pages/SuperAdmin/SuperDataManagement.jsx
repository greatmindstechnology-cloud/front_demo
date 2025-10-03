import React, { useState } from "react";
import { getAdmins, getStudents, getTrainers, getVendors } from "../../api"; // Adjust import paths

const tableConfigs = {
    admin: { title: "Admin List", fetch: getAdmins, columns: ["id", "name", "email"] },
    student: { title: "Student List", fetch: getStudents, columns: ["id", "name", "email"] },
    trainer: { title: "Trainer List", fetch: getTrainers, columns: ["id", "name", "email"] },
    vendor: { title: "Vendor List", fetch: getVendors, columns: ["id", "name", "email"] },
};

const SuperDataManagement = () => {
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(null);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOpen = async (type) => {
        setCurrent(type);
        setOpen(true);
        setLoading(true);
        try {
            const res = await tableConfigs[type].fetch();
            setData(res.data || []);
        } catch (e) {
            setData([]);
        }
        setLoading(false);
    };

    const handleClose = () => {
        setOpen(false);
        setData([]);
        setCurrent(null);
    };

    return (
        <div>
            <button onClick={() => handleOpen("admin")}>Admin</button>
            <button onClick={() => handleOpen("student")}>Student</button>
            <button onClick={() => handleOpen("trainer")}>Trainer</button>
            <button onClick={() => handleOpen("vendor")}>Vendor</button>

            {open && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>{tableConfigs[current].title}</h2>
                        <button onClick={handleClose}>Close</button>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        {tableConfigs[current].columns.map((col) => (
                                            <th key={col}>{col.toUpperCase()}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((row) => (
                                        <tr key={row.id}>
                                            {tableConfigs[current].columns.map((col) => (
                                                <td key={col}>{row[col]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
            {/* Add minimal CSS for modal */}
            <style>{`
                .modal { position: fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; }
                .modal-content { background:#fff; padding:20px; border-radius:8px; min-width:300px; }
            `}</style>
        </div>
    );
};

export default SuperDataManagement;