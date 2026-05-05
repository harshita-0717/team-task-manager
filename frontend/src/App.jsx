// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import PrivateRoute from "./components/PrivateRoute";


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} /> */}

//         {/* Redirect everything to dashboard */}
//         <Route path="/" element={<Navigate to="/dashboard" />} />

//         {/* Direct access */}
//         <Route path="/dashboard" element={<Dashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  useEffect(() => {
    // fake admin login for testing
    localStorage.setItem("role", "Admin");
    localStorage.setItem("userId", "demo-user");
    localStorage.setItem("name", "Admin User");
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;