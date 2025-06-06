import { useLocation, useNavigate } from "react-router-dom";
import { useRef, useMemo,useEffect } from "react";
import { useReactToPrint } from "react-to-print";

const PreviewInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoice = location.state?.invoice;
  const componentRef = useRef();

  if (!invoice) {
    return (
      <div className="p-5 text-white bg-black min-h-screen flex flex-col items-start">
        <h2 className="text-2xl mb-4">No Invoice Data</h2>
        <button
          onClick={() => navigate("/create-invoice")}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Calculate item total including GST
  const calculateItemTotal = (item) => {
    const baseTotal = item.quantity * item.unit_price;
    const gstAmount = (baseTotal * item.gst) / 100;
    return baseTotal + gstAmount;
  };

  // Memoized totals
  const subtotal = useMemo(
    () =>
      invoice.items.reduce(
        (acc, item) => acc + item.quantity * item.unit_price,
        0
      ),
    [invoice.items]
  );

  const totalGST = useMemo(
    () =>
      invoice.items.reduce(
        (acc, item) => acc + (item.quantity * item.unit_price * item.gst) / 100,
        0
      ),
    [invoice.items]
  );

  const totalAmount = useMemo(() => subtotal + totalGST, [subtotal, totalGST]);

  // React-to-print handler

const handlePrint = useReactToPrint({
  content: () => componentRef.current,
});



 useEffect(() => {
  console.log('Component ref (article) on mount:', componentRef.current);
}, []);


  return (
    <div className="p-5 text-white bg-gray-600 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoice Preview</h1>
        <button
          onClick={handlePrint}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Download PDF
        </button>
      </header>

      <article
        ref={componentRef}
        className="bg-white text-black p-8 rounded-lg w-full max-w-4xl mx-auto shadow-xl flex flex-col"
        style={{ minHeight: "297mm", width: "210mm", maxWidth: "210mm" }}
      >
        <section className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-semibold mb-1">
            Invoice #{invoice.inv_number}
          </h2>
          <p className="text-sm text-gray-600">
            <strong>Date:</strong> {invoice.inv_date}
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Seller</h3>
            <address className="not-italic">
              <p>{invoice.seller.name}</p>
              <p>{invoice.seller.address}</p>
              <p>Phone: {invoice.seller.contact_number}</p>
              <p>GSTIN: {invoice.seller.gst_number}</p>
            </address>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Buyer</h3>
            <address className="not-italic">
              <p>{invoice.buyer.name}</p>
              <p>{invoice.buyer.address}</p>
              <p>Phone: {invoice.buyer.contact_number}</p>
              <p>GSTIN: {invoice.buyer.gst_number}</p>
            </address>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-3">Items</h3>
          <table className="w-full text-sm border border-gray-300">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="border px-3 py-2">Description</th>
                <th className="border px-3 py-2">Qty</th>
                <th className="border px-3 py-2">Rate</th>
                <th className="border px-3 py-2">GST</th>
                <th className="border px-3 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">{item.description}</td>
                  <td className="border px-3 py-2">{item.quantity}</td>
                  <td className="border px-3 py-2">₹{item.unit_price}</td>
                  <td className="border px-3 py-2">{item.gst}%</td>
                  <td className="border px-3 py-2">
                    ₹{calculateItemTotal(item).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="flex justify-end mt-8">
          <div className="bg-gray-100 border-2 border-gray-300 rounded-lg shadow-md px-8 py-4 w-full max-w-xs text-right">
            <div className="flex justify-between items-center mb-2 text-base">
              <span className="font-semibold text-gray-700">Subtotal:</span>
              <span className="text-gray-800">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2 text-base">
              <span className="font-semibold text-gray-700">Total GST:</span>
              <span className="text-gray-800">₹{totalGST.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-400 my-2"></div>
            <div className="flex justify-between items-center text-md font-bold text-gray-900">
              <span>Total:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <div className="flex-grow"></div>

        {invoice.notes && (
          <section className="mb-20 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 p-4 rounded">
            <p className="font-medium">Notes:</p>
            <p className="text-sm">{invoice.notes}</p>
          </section>
        )}
      </article>
    </div>
  );
};

export default PreviewInvoice;
