import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function ProfitabilityDashboard() {
  const { t } = useTranslation();
  const [crop, setCrop] = useState("");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  // Search
  const [search, setSearch] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("https://krushiraah.onrender.com/profitability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop }),
      });

      const data = await response.json();
      if (data.prices) {
        // Sort by date (latest first)
        const sorted = data.prices.sort((a, b) => {
          const [da, ma, ya] = a.Arrival_Date.split("/");
          const [db, mb, yb] = b.Arrival_Date.split("/");
          const dateA = new Date(`${ya}-${ma}-${da}`);
          const dateB = new Date(`${yb}-${mb}-${db}`);
          return dateB - dateA;
        });
        setPrices(sorted);
        setCurrentPage(1);
      } else {
        setPrices([]);
        alert(data.error || "No data found");
      }
    } catch (error) {
      console.error("Error fetching profitability:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Filter
  const filteredPrices = prices.filter((p) =>
    [p.Commodity, p.State, p.District]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 📄 Pagination logic
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredPrices.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );
  const totalPages = Math.ceil(filteredPrices.length / recordsPerPage);

  return (
    <div className="container">
      <div className="card">
        <h2>💰 {t("profitabilityPage.title")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t("profitabilityPage.inputPlaceholder")}
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="inputField"
          />
          <button type="submit">{t("profitabilityPage.submit")}</button>
        </form>

        {loading && <p>{t("profitabilityPageloading")}...</p>}

        {/* Search Bar */}
        {prices.length > 0 && (
          <input
            type="text"
            placeholder="🔍 Search Crop/State/District"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginTop: "10px", width: "100%" }}
          />
        )}

        {/* Table Results */}
        {currentRecords.length > 0 && (
          <div className="card" style={{ marginTop: "15px" }}>
            <h3>
              {t("profitabilityPage.profit_result_title")} {crop || "All"}
            </h3>

            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                  background: "#fff",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0px 2px 6px rgba(0,0,0,0.1)",
                  minWidth: "800px",
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#27ae60", color: "white" }}>
                    <th style={cellStyle}>{t("profitabilityPage.market")}</th>
                    <th style={cellStyle}>{t("profitabilityPage.district")}</th>
                    <th style={cellStyle}>{t("profitabilityPage.commodity")}</th>
                    <th style={cellStyle}>{t("profitabilityPage.state")}</th>
                    <th style={cellStyle}>{t("profitabilityPage.variety")}</th>
                    <th style={cellStyle}>{t("profitabilityPage.min_price")}</th>
                    <th style={cellStyle}>{t("profitabilityPage.max_price")}</th>
                    <th style={cellStyle}>{t("profitabilityPage.modal_price")}</th>
                    <th style={cellStyle}>{t("profitabilityPage.date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((p, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "#fff",
                      }}
                    >
                      <td style={cellStyle}>{p.Market}</td>
                      <td style={cellStyle}>{p.District}</td>
                      <td style={cellStyle}>{p.Commodity}</td>
                      <td style={cellStyle}>{p.State}</td>
                      <td style={cellStyle}>{p.Variety}</td>
                      <td style={cellStyle}>{p.Min_Price}</td>
                      <td style={cellStyle}>{p.Max_Price}</td>
                      <td style={cellStyle}>{p.Modal_Price}</td>
                      <td style={cellStyle}>{p.Arrival_Date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{ marginTop: "15px" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ⬅ Prev
              </button>
              <span style={{ margin: "0 10px" }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next ➡
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Local style
const cellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

export default ProfitabilityDashboard;

