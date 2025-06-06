import { useNavigate } from "react-router-dom";

const inputClass = "bg-[#232323] w-full rounded-md py-2 px-3 outline-none text-white";

const NewSupplier = () => {
  const navigate = useNavigate();
  const onCloseHandler = () => navigate("/create-invoice");

  return (
    <main className="flex items-center justify-center bg-[#171717] text-white min-h-screen p-4">
      <section className="p-6 border border-gray-600 rounded-md w-full max-w-2xl bg-[#171717] shadow-lg">

        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">New Customer</h2>
          <button 
            onClick={onCloseHandler} 
            aria-label="Close"
            className="text-lg cursor-pointer bg-transparent border-none"
          >
            X
          </button>
        </header>

        <hr className="border-t border-gray-800 my-6" />

        <div className="mb-4">
          <label htmlFor="gstin" className="font-thin mb-1 block">GSTIN</label>
          <input id="gstin" type="text" className={inputClass} />
        </div>

        <div className="mb-4">
          <label htmlFor="customerName" className="font-thin mb-1 block">Customer Name</label>
          <input id="customerName" type="text" className={`${inputClass} mb-2`} />
        </div>

        <hr className="border-t border-gray-800 my-6" />

        <section className="mb-4">
          <h3 className="text-md font-medium mb-3">Primary Contact Details</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="contact" className="font-thin mb-1 block">Contact</label>
              <input id="contact" type="text" className={inputClass} />
            </div>
            <div className="flex-1">
              <label htmlFor="email" className="font-thin mb-1 block">Email ID</label>
              <input id="email" type="email" className={inputClass} />
            </div>
          </div>
        </section>

        <hr className="border-t border-gray-800 my-6" />

        <section className="mb-6">
          <h3 className="text-md font-medium mb-3">Primary Address Details</h3>
          <label htmlFor="address" className="font-thin mb-1 block">Address</label>
          <input id="address" type="text" className={inputClass} />
        </section>

        <button
          className="w-full py-2 font-semibold text-lg bg-[#E2E2E2] text-black rounded-md hover:bg-white transition-colors"
          type="submit"
        >
          Save
        </button>
      </section>
    </main>
  );
};

export default NewSupplier;
