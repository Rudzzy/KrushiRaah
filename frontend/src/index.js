// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import App from "./App";
// import "./index.css";
// import "./global.css";


// // i18n setup
// import "./i18n";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// 🌐 Global styles
import "./index.css";
import "./global.css";

// 🌍 i18n setup for multilingual support
import "./i18n";

// 🧩 Root App component
import App from "./App";

// 🚀 Mount React app
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 🔌 Future-ready: wrap with providers here (Theme, Auth, Analytics, etc.) */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
