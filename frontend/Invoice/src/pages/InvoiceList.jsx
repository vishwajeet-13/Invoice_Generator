import { MdMenu } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/SideBar";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { useUser } from "../context/UserContext";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

 useEffect(() => {
  if (user === undefined) return;

  if (!user?.id) {
    const timeoutId = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => clearTimeout(timeoutId);
  }
  console.log("User:", user);
  console.log(invoices.length)
  const fetchInvoices = async () => {
    try {
      const res = await axiosInstance.get(`/user/invoice/list/${user.id}`);
      console.log(typeof(res.data))
      console.log(res.data)
      setInvoices(res.data || []);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    }
  };

  fetchInvoices();
}, [user, navigate]);



  const handleAddInvoice = () => {
    localStorage.setItem("auth", "true");
    navigate("/create-invoice");
  };

  return (
    <div className="min-h-screen w-full bg-[#171717] text-white p-4 md:p-7">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[#232323] pb-4">
        <div className="text-2xl flex items-center gap-2">
          <MdMenu />
          <p>My Invoices</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={handleAddInvoice} className="px-2 py-1 cursor-pointer bg-[#E2E2E2] text-black rounded-md">
            <strong className="text-xl">+</strong> Add Invoice
          </button>
          <Navbar />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <aside className="w-full md:w-1/4">
          <p className="my-5 font-semibold">Filter by</p>
          {["Assigned to", "Created By", "Tags"].map((placeholder, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={placeholder}
              className="bg-[#232323] w-full rounded-md py-2 px-3 outline-none mb-3"
            />
          ))}
          <p className="my-3 font-semibold">Edit Filters</p>
          <input type="text" placeholder="Tags" className="bg-[#232323] w-full rounded-md py-2 px-3 mb-3" />
          <p className="my-3 font-semibold">Show Tags</p>
        </aside>

        <main className="w-full md:w-3/4 border border-[#232323] p-4 rounded-md">
          <div className="flex flex-wrap gap-3 mb-5">
            {["Supplier", "Status", "Date"].map((placeholder, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={placeholder}
                className="px-3 py-2 bg-[#232323] rounded-lg outline-none w-full md:w-auto"
              />
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[600px] w-full bg-[#171717] rounded-lg">
              <thead className="bg-[#232323] text-left">
                <tr>
                  {["Title", "Status", "Date", "ID"].map((head, idx) => (
                    <th key={idx} className="px-4 py-2 text-[#C7C7C7]">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-[#999]">No invoices found.</td>
                  </tr>
                ) : (
                  invoices.map((inv, idx) => (
                    <tr key={idx} className="border-t border-[#232323] hover:bg-[#383838]">
                      <td className="px-4 py-2">{inv.seller.name}</td>
                      <td className="px-4 py-2">{inv.is_paid ? "Paid" : "Unpaid"}</td>
                      <td className="px-4 py-2">{inv.inv_date}</td>
                      <td className="px-4 py-2">{inv.inv_number}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InvoiceList;
