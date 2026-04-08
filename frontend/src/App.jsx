import Signup from "./pages/Signup";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Reset from "./pages/Reset";
import VerifyEmail from "./components/verification/VerifyEmail";
import VerifyInvitation from "./components/verification/VerifyInvitation";
import PrivateRoute from "./components/privateRoute";
import Dashboard from "./pages/Dashboard";
import WorkSpace from "./pages/WorkSpace";
import Organization from "./components/Organization";
import Board from "./pages/Board";
import Profile from "./pages/Profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/reset-password" element={<Reset/>}/>
        <Route path="/invite/accept/:token" element={<VerifyInvitation />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/workspace/work" element={<WorkSpace />} />
          <Route path="/workspace/work/:orgId" element={<Organization />} />
          <Route path="/board/:boardId" element={<Board/>}/>
        </Route>
        <Route path="*" element={<h1>Page not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
