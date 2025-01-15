import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";

const ReportPage: React.FC = () => {
    const [reportData, setReportData] = useState<{ category: string; status: string; count: number }[]>([]);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const email = localStorage.getItem("userEmail");
                if (!email) {
                    console.error("No email found in localStorage.");
                    return;
                }

                const response = await fetch(`${API_BASE_URL}/books/report?email=${encodeURIComponent(email)}`);
                if (!response.ok) throw new Error("Failed to fetch report data");

                const data = await response.json();
                setReportData(data);
            } catch (error) {
                console.error("Error fetching report:", error);
            }
        };

        fetchReport();
    }, []);

    return (
        <div>
            <h1>User Report</h1>
            
            {/* Report Table */}
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr style={{ background: "#b7a57a", color: "#fff", textAlign: "left" }}>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Category</th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Status</th>
                        <th style={{ padding: "10px", border: "1px solid #ddd" }}>Number of Books</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((row, index) => (
                        <tr key={index}>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.category}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.status}</td>
                            <td style={{ padding: "10px", border: "1px solid #ddd" }}>{row.count}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportPage;
