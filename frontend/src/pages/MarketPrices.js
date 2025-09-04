import React, { useState } from "react";
import { useTranslation } from "react-i18next";

function MarketPrices() {
  const { t } = useTranslation();
  const [crop, setCrop] = useState("");
  const [stateLoc, setStateLoc] = useState("");
  const [district, setDistrict] = useState("");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 15;

  // Search/Filter states
  const [search, setSearch] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch("https://krushiraah.onrender.com/market-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crop, state: stateLoc, district }),
      });

      const data = await response.json();
      if (data.prices) {
        // Convert dd/mm/yyyy → yyyy-mm-dd and then sort
        const sorted = data.prices.sort((a, b) => {
          const [da, ma, ya] = a.Arrival_Date.split("/");
          const [db, mb, yb] = b.Arrival_Date.split("/");
          const dateA = new Date(`${ya}-${ma}-${da}`);
          const dateB = new Date(`${yb}-${mb}-${db}`);
          return dateB - dateA; // latest first
        });
        setPrices(sorted);
        setCurrentPage(1);
      } else {
        setPrices([]);
        alert(data.error || t("marketPricesPage.noData"));
      }
    } catch (error) {
      console.error("Error fetching market prices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Apply search filter
  const filteredPrices = prices.filter((p) =>
    [p.Commodity, p.State, p.District]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Pagination logic
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
        <h2>{t("marketPricesPage.title")}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder={t("marketPricesPage.cropPlaceholder")}
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="inputField"
          />
          <input
            type="text"
            placeholder={t("marketPricesPage.statePlaceholder")}
            value={stateLoc}
            onChange={(e) => setStateLoc(e.target.value)}
            className="inputField"
          />
          <input
            type="text"
            placeholder={t("marketPricesPage.districtPlaceholder")}
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="inputField"
          />
          <button type="submit">{t("marketPricesPage.submit")}</button>
        </form>

        {loading && <p>{t("marketPricesPage.loading")}</p>}

        {/* Search Bar for Filtering */}
        {prices.length > 0 && (
          <input
            type="text"
            placeholder={t("marketPricesPage.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginTop: "10px", width: "100%" }}
          />
        )}

        {currentRecords.length > 0 && (
          <div className="card" style={{ marginTop: "15px" }}>
            <h3>
              {t("marketPricesPage.showingFor", { 
                crop: crop || "All", 
                state: stateLoc ? `- ${stateLoc}` : "", 
                district: district ? `- ${district}` : "" 
              })}
            </h3>

            {/* Table Wrapper for Scroll */}
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
                  minWidth: "800px", // keeps structure when scrolling
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: "#27ae60", color: "white" }}>
                    <th style={cellStyle}>{t("marketPricesPage.table.market")}</th>
                    <th style={cellStyle}>{t("marketPricesPage.table.district")}</th>
                    <th style={cellStyle}>{t("marketPricesPage.table.commodity")}</th>
                    <th style={cellStyle}>{t("marketPricesPage.table.state")}</th>
                    <th style={cellStyle}>{t("marketPricesPage.table.variety")}</th>
                    <th style={cellStyle}>{t("marketPricesPage.table.min")}</th>
                    <th style={cellStyle}>{t("marketPricesPage.table.max")}</th>
                    <th style={cellStyle}>{t("marketPricesPage.table.modal")}</th>
                    <th style={cellStyle}>{t("marketPricesPage.table.date")}</th>
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

            {/* Pagination Controls */}
            <div style={{ marginTop: "15px" }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                {t("marketPricesPage.prev")}
              </button>
              <span style={{ margin: "0 10px" }}>
                {t("marketPricesPage.pageXofY", { current: currentPage, total: totalPages })}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                {t("marketPricesPage.next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Local cell style
const cellStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

export default MarketPrices;
