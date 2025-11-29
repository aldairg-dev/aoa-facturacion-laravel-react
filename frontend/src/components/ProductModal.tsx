import { useState } from "react";
import api from "../services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export default function ProductModal({ open, onClose, onSaved }: Props) {
  const [productName, setProductName] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  if (!open) return null;

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const saveProduct = async () => {
    if (!productName || !unitPrice) {
      showMessage("Todos los campos son obligatorios.", "error");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/products", {
        product_name: productName,
        unit_price: Number(unitPrice),
      });

      if (res.data?.success) {
        showMessage(res.data.message || "Producto creado.", "success");

        setProductName("");
        setUnitPrice("");

        if (onSaved) onSaved();

        setTimeout(() => {
          onClose();
        }, 5000);
      }
    } catch (error) {
      console.error("Error:", error);
      showMessage("Ocurrió un error al guardar.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">
          Crear Producto
        </h2>

        {message && (
          <div
            className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${
              messageType === "success"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <label className="block mb-3">
          <span className="text-sm text-slate-600">Nombre del producto</span>
          <input
            type="text"
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 
            text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Laptop Dell Inspiron"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm text-slate-600">Precio unitario</span>
          <input
            type="number"
            className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 
            text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="2500000"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-200 text-red-700 hover:bg-red-300 
            transition font-medium"
          >
            Cancelar
          </button>

          <button
            onClick={saveProduct}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white 
            hover:bg-indigo-700 transition font-medium"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
