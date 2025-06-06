import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  const toggle = () => setOpen((prev) => !prev);
  const first = user?.username?.[0]?.toUpperCase() || "";
  const second = user?.username?.[1]?.toUpperCase() || "";

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/");
    setOpen(false);
  };

  return (
    <>
      <nav className="flex justify-end text-white">
        <button
          onClick={toggle}
          className="w-9 h-9 rounded-full bg-rose-600 text-white text-lg flex items-center justify-center font-semibold hover:bg-rose-700 transition"
          aria-label="User menu"
        >
          {first}{second}
        </button>
      </nav>

      <aside
        ref={panelRef}
        className={`fixed top-18 right-8 h-1/2 w-52 bg-[#171717] border border-gray-500 shadow-lg rounded-xl z-50 p-2 ${
          open ? "block" : "hidden"
        }`}
      >
        <div>
          <p className=" hover:text-gray-200 text-sm hover:bg-gray-600 rounded-lg px-1 py-1 my-3 ">My Profile</p>
          <p className=" hover:text-gray-200 text-sm hover:bg-gray-600 rounded-lg px-1 py-1 mb-3">My Settings</p>
          <p className=" hover:text-gray-200 text-sm hover:bg-gray-600 rounded-lg px-1 py-1 mb-3">Add New Supplier</p>
          <p className="hover:text-gray-200 text-sm hover:bg-gray-600 rounded-lg px-1 py-1 mb-15">Add New Buyer</p>
        </div>
        <button
          onClick={handleLogout}
          className=" bg-red-600 hover:bg-red-700 text-white py-1 px-2 w-full rounded-md"
        >
          Logout
        </button>
      </aside>
    </>
  );
}
