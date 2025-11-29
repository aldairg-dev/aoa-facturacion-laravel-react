import { useEffect, useState } from "react";
import api from "../services/api";

interface Product {
  id: number;
  product_code: string;
  product_name: string;
  unit_price: string;
  created_at: string;
}

export default function ProductList({ refreshKey }: { refreshKey: number }) {
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductos = async () => {
    try {
      const res = await api.get("/products");
      setProductos(res.data.data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [refreshKey]); // 👈 Se recarga automáticamente

  if (loading)
    return (
      <p className="text-center py-6 text-slate-600">Cargando productos...</p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-slate-200 rounded-xl shadow-md">
        <thead>
          <tr className="bg-slate-100 text-slate-700 text-sm">
            <th className="p-3 border border-slate-200 text-left">Código</th>
            <th className="p-3 border border-slate-200 text-left">Nombre</th>
            <th className="p-3 border border-slate-200 text-left">Precio</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p, i) => (
            <tr
              key={p.id}
              className={`${
                i % 2 === 0 ? "bg-white" : "bg-slate-50"
              } hover:bg-slate-100 transition-colors`}
            >
              <td className="p-3 border border-slate-200 font-medium text-slate-700">
                {p.product_code}
              </td>

              <td className="p-3 border border-slate-200 text-slate-700">
                {p.product_name}
              </td>

              <td className="p-3 border border-slate-200 text-slate-700">
                ${parseFloat(p.unit_price).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
