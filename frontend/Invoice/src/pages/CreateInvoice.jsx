import { MdMenu } from "react-icons/md";
import Itemlist from "../components/ItemList";
import Autocomplete from "../components/AutoComplete";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";

const CreateInvoice = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [remark, setRemark] = useState("");
  const [sellerOptions, setSellerOptions] = useState([]);
  const [buyerOptions, setBuyerOptions] = useState([]);

  const [invoiceData, setInvoiceData] = useState({
    inv_number: "",
    inv_date: "",
    is_paid: false,
    total_amount: 0,
    seller: { name: "", address: "", contact: "", gst_number: "" },
    buyer: { name: "", address: "", contact: "", gst_number: "" },
  });

  const [itemsData, setItemsData] = useState({ items: [] });
  useEffect(() => {
    const fetchOptions = async () => {
      if (!user?.id) return;
      try {
        const { data } = await axiosInstance.get(`/user/invoice/list/${user.id}`);
        setSellerOptions(data.map((inv) => inv.seller));
        setBuyerOptions(data.map((inv) => inv.buyer));
      } catch (err) {
        console.error("Error loading invoice list:", err);
        toast.error("Failed to load invoice data");
      }
    };

    fetchOptions();
  }, [user]);

  const handleItemsChange = useCallback((items) => {
    setItemsData({ items });
  }, []);

  const handleSelectEntity = (type, name, list) => {
    const match = list.find((entry) => entry.name === name);
    if (!match) return;
    setInvoiceData((prev) => ({
      ...prev,
      [type]: { ...match },
    }));
  };

  const transformItemsWithTotals = (items) =>
    items.map(({ itemname, quantity, rate, gst }) => {
      const qty = parseInt(quantity) || 0;
      const price = parseFloat(rate) || 0;
      return {
        description: itemname,
        quantity: qty,
        unit_price: parseFloat(price.toFixed(2)),
        total_price: parseFloat((qty * price).toFixed(2)),
        gst: gst ? parseInt(gst) : 0,
      };
    });

  const handleSubmit = async () => {
    if (!itemsData.items.length) {
      toast.error("Please add some items before submitting.");
      return;
    }

    const transformedItems = transformItemsWithTotals(itemsData.items);
    const totalAmount = transformedItems.reduce((sum, item) => sum + item.total_price, 0);

    const payload = {
      id: String(user.id),
      invoice: {
        ...invoiceData,
        notes: remark || "",
        total_amount: parseFloat(totalAmount.toFixed(2)),
        items: transformedItems,
      },
    };
    console.log(payload)

    try {
      await axiosInstance.post("/user/invoice/create", payload);
      toast.success("Invoice submitted successfully!");
      navigate("/preview", { state: { invoice: payload.invoice } });
    } catch (err) {
  console.error("Error loading invoice list:", err);
  if (err.response) {
    console.error("Backend response:", err.response.data);
  }
  toast.error("Failed to load invoice data");
}
  };

  return (
    <div className="min-h-screen w-full bg-[#171717] text-white p-4 md:p-7">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-[#232323] pb-4">
        <div className="text-2xl flex items-center gap-3">
          <MdMenu />
          <p>Create New Invoice</p>
        </div>
        <button
          onClick={handleSubmit}
          className="px-2 py-1 bg-[#E2E2E2] text-black rounded-md"
        >
          Save
        </button>
      </div>
      <div className="border border-[#232323] mt-5 px-5 py-7 rounded-md mb-7">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <FormField label="Supplier">
              <Autocomplete
                options={sellerOptions.map((s) => s.name)}
                value={invoiceData.seller.name}
                onSelect={(val) => handleSelectEntity("seller", val, sellerOptions)}
              >
                <input
                  type="text"
                  value={invoiceData.seller.name}
                  onChange={(e) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      seller: { ...prev.seller, name: e.target.value },
                    }))
                  }
                  className="bg-[#232323] w-full rounded-md py-1 px-3 outline-none"
                />
              </Autocomplete>
            </FormField>

            <FormField label="Supplier Invoice No">
              <input
                type="text"
                value={invoiceData.inv_number}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, inv_number: e.target.value })
                }
                className="bg-[#232323] w-full rounded-md py-1 px-3 outline-none"
              />
            </FormField>
            <FormField label="Buyer">
              <Autocomplete
                options={buyerOptions.map((b) => b.name)}
                value={invoiceData.buyer.name}
                onSelect={(val) => handleSelectEntity("buyer", val, buyerOptions)}
              >
                <input
                  type="text"
                  value={invoiceData.buyer.name}
                  onChange={(e) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      buyer: { ...prev.buyer, name: e.target.value },
                    }))
                  }
                  className="bg-[#232323] w-full rounded-md py-1 px-3 outline-none"
                />
              </Autocomplete>
            </FormField>

            <FormField label="Supplier Invoice Date">
              <input
                type="date"
                value={invoiceData.inv_date}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, inv_date: e.target.value })
                }
                className="bg-[#232323] w-full rounded-md py-1 px-3 outline-none"
              />
            </FormField>
          </div>

          <div className="w-full md:w-1/3 flex flex-col gap-4 mt-6 md:mt-0">
            <label className="flex items-center gap-2 text-sm font-thin">
              <input
                type="checkbox"
                checked={invoiceData.is_paid}
                onChange={(e) =>
                  setInvoiceData({ ...invoiceData, is_paid: e.target.checked })
                }
                className="accent-white"
              />
              <span>Is Paid</span>
            </label>
          </div>
        </div>
      </div>

      <Itemlist onItemsChange={handleItemsChange} />

      <div className="mt-7">
        <p className="mb-3 text-white">Remark</p>
        <textarea
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          className="bg-[#232323] w-full h-32 rounded-lg min-h-50 p-5 text-white outline-none"
        />
      </div>
    </div>
  );
};

export default CreateInvoice;

const FormField = ({ label, children }) => (
  <div>
    <label className="block mb-1 text-sm font-thin text-gray-300">{label}</label>
    {children}
  </div>
);
