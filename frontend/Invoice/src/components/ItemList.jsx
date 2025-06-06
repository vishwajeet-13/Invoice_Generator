import { useState, useEffect } from "react";

const Itemlist = ({ onItemsChange }) => {
  const [items, setItems] = useState([
    { itemname: "", quantity: "", rate: "", gst: "", selected: false },
  ]);

  const gstOptions = [
    "0% - NIL GST",
    "5% GST",
    "12% GST",
    "18% GST",
    "28% GST",
  ];

  useEffect(() => {
    if (typeof onItemsChange === "function") {
      onItemsChange(items);
    }
  }, [items, onItemsChange]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addRow = () => {
    setItems([
      ...items,
      { itemname: "", quantity: "", rate: "", gst: "", selected: false },
    ]);
  };

  const deleteSelectedRows = () => {
    const filteredItems = items.filter((item) => !item.selected);
    setItems(
      filteredItems.length
        ? filteredItems
        : [{ itemname: "", quantity: "", rate: "", gst: "", selected: false }]
    );
  };

  const handleSelect = (index) => {
    const updatedItems = [...items];
    updatedItems[index].selected = !updatedItems[index].selected;
    setItems(updatedItems);
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setItems(items.map((item) => ({ ...item, selected: checked })));
  };

  const calculateTotal = () => {
  return items
    .reduce((total, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const rate = parseFloat(item.rate) || 0;
      const gstRate = parseFloat(item.gst) || 0;

      const baseAmount = qty * rate;
      const gstAmount = (baseAmount * gstRate) / 100;

      return total + baseAmount + gstAmount;
    }, 0)
    .toFixed(2);
};


  return (
    <div className="p-3 md:p-5 max-w-full overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full bg-[#171717] rounded-lg overflow-hidden mb-3">
          <thead>
            <tr className="text-left bg-[#232323] text-white rounded-lg">
              <th className="px-2 md:px-4 py-2 text-[#C7C7C7]">
                <input
                  type="checkbox"
                  checked={items.every((item) => item.selected)}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-2 md:px-4 py-2 text-[#C7C7C7] font-thin text-sm">No.</th>
              <th className="px-2 md:px-4 py-2 text-[#C7C7C7] font-thin text-sm">Item</th>
              <th className="px-2 md:px-4 py-2 text-[#C7C7C7] font-thin text-sm">Accepted Qty</th>
              <th className="px-2 md:px-4 py-2 text-[#C7C7C7] font-thin text-sm">Rate (INR)</th>
              <th className="px-2 md:px-4 py-2 text-[#C7C7C7] font-thin text-sm">Item Tax Template</th>
            </tr>
          </thead>
          <tbody className="border-t border-[#232323] text-white">
            {items.map((item, index) => (
              <tr key={index}>
                <td className="px-2 md:px-4 py-2 border border-[#232323]">
                  <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => handleSelect(index)}
                    className="accent-white outline-none"
                  />
                </td>
                <td className="px-2 md:px-4 py-2 border border-[#232323]">
                  {index + 1}
                </td>
                <td className="px-2 md:px-4 py-2 border border-[#232323]">
                  <input
                    type="text"
                    value={item.itemname}
                    onChange={(e) =>
                      handleChange(index, "itemname", e.target.value)
                    }
                    className="w-full max-w-[120px] bg-transparent text-white outline-none"
                  />
                </td>
                <td className="px-2 md:px-4 py-2 border border-[#232323]">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(index, "quantity", e.target.value)
                    }
                    className="w-full max-w-[60px] bg-transparent text-white outline-none"
                  />
                </td>
                <td className="px-2 md:px-4 py-2 border border-[#232323]">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleChange(index, "rate", e.target.value)
                    }
                    className="w-full max-w-[80px] bg-transparent text-white outline-none"
                  />
                </td>
                <td className="px-2 md:px-4 py-2 border border-[#232323]">
                  {/* <Autocomplete
                    options={gstOptions}
                    value={item.gst}
                    onSelect={(val) => {
                      const numericGst = val.match(/\d+/g)?.[0] || "0";
                      handleChange(index, "gst", numericGst);
                    }}
                    className="block"
                  > */}
                    <input
                      type="text"
                      value={item.gst}
                      onChange={(e) =>
                        handleChange(index, "gst", e.target.value)
                      }
                      className="w-full max-w-[80px] bg-transparent text-white outline-none"
                    />
                  {/* </Autocomplete> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 md:gap-4 mt-2">
        <button
          onClick={addRow}
          className="px-2 py-2 text-sm bg-[#232323] text-white rounded-lg"
        >
          Add Row
        </button>
        {items.length > 1 && (
          <button
            onClick={deleteSelectedRows}
            className="px-2 py-2 bg-red-700 text-white rounded-lg text-sm"
          >
            Delete Row
          </button>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <div className="relative w-48">
          <label className="block text-sm text-white mb-1">Total (INR)</label>
          <span className="absolute top-1/2 left-3 transform-translate-y-1/2 text-white">
            ₹
          </span>
          <input
            type="text"
            readOnly
            value={calculateTotal()}
            className="bg-[#232323] text-white w-full rounded-md py-1 px-3 pl-6"
          />
        </div>
      </div>
    </div>
  );
};

export default Itemlist;
