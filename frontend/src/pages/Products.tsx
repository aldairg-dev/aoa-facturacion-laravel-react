import { useState } from "react";
import ProductModal from "../components/ProductModal";
import { Plus, FileText } from "lucide-react";
import ProductList from "../components/ProductList";

export default function Product() {
  const [openProductModal, setOpenProductModal] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  const handleProductSaved = () => {
    setRefreshKey((prev) => prev + 1);

    setOpenProductModal(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-stone-100">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">
                  Facturas
                </h1>
                <p className="text-sm text-slate-500">
                  Gestiona tus documentos
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpenProductModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg 
             bg-black text-white text-sm
             hover:bg-neutral-900 transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nuevo Producto
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <ProductList refreshKey={refreshKey} />
        </div>
      </main>

      <ProductModal
        open={openProductModal}
        onClose={() => setOpenProductModal(false)}
        onSaved={handleProductSaved}
      />
    </div>
  );
}
