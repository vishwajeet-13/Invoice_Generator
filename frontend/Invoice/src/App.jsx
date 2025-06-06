import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateInvoice from "./pages/CreateInvoice";
import Invoices from "./pages/InvoiceList";
import Login from "./pages/Login";
import ProtectedRoute from "./auth/ProtectedRoutes";
import NewSupplier from "./pages/NewSupplier";
import PreviewInvoice from "./pages/PreviewInvoice";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/create-invoice" element={<CreateInvoice />} />
          <Route path="/new-supplier" element={<NewSupplier />} />
          <Route path="/preview" element={<PreviewInvoice />} />
        </Route>

        {/* Optional: 404 Route */}
        <Route path="*" element={<h1 className="p-5 text-center text-2xl">404 - Page Not Found</h1>} />
      </Routes>

      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
        className="toastify-custom"
      />
    </Router>
  );
};

export default App;
