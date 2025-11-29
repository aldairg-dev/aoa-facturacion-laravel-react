import { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../services/api";

interface Product {
  id: number;
  product_name: string;
  product_code: string;
  unit_price: string;
  applies_tax: number;
}

interface CartProduct {
  id: number;
  codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
  aplicaIva: boolean | null;
}

interface Client {
  id: string;
  client_identification: string;
  client_name: string;
  email: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onInvoiceCreated?: () => void;
}

export default function PurchasingProcess({
  open,
  onClose,
  onInvoiceCreated,
}: Props) {
  const [step, setStep] = useState(1);

  const [identificacion, setIdentificacion] = useState("");
  const [cliente, setCliente] = useState<Client | null>(null);
  const [clienteNoExiste, setClienteNoExiste] = useState(false);
  const [searchingClient, setSearchingClient] = useState(false);

  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoEmail, setNuevoEmail] = useState("");
  const [registeringClient, setRegisteringClient] = useState(false);

  const [productos, setProductos] = useState<CartProduct[]>([]);
  const [catalogo, setCatalogo] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [invoiceType, setInvoiceType] = useState<"cash" | "credit">("cash");
  const [creatingInvoice, setCreatingInvoice] = useState(false);

  const buscarCliente = async () => {
    if (!identificacion.trim()) return;

    setSearchingClient(true);
    try {
      const res = await api.get(`/clients/${identificacion}`);
      if (res.data.success) {
        setCliente(res.data.data);
        setClienteNoExiste(false);
      }
    } catch (error) {
      setCliente(null);
      setClienteNoExiste(true);
    } finally {
      setSearchingClient(false);
    }
  };

  useEffect(() => {
    if (step === 2) {
      cargarProductos();
    }
  }, [step]);

  const cargarProductos = async () => {
    try {
      setLoadingProducts(true);
      const res = await api.get("/products");

      if (res.data.success) {
        setCatalogo(res.data.data);
      }
    } catch (error) {
      console.error("Error cargando productos:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const registrarCliente = async () => {
    if (!nuevoNombre.trim() || !nuevoEmail.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }

    setRegisteringClient(true);
    try {
      const res = await api.post("/clients", {
        client_identification: identificacion,
        client_name: nuevoNombre,
        email: nuevoEmail,
      });

      setCliente(res.data.data);
      setClienteNoExiste(false);
      setNuevoNombre("");
      setNuevoEmail("");
    } catch (error) {
      console.error("Error registrando:", error);
      alert("Error al registrar el cliente");
    } finally {
      setRegisteringClient(false);
    }
  };

  const agregarProducto = (item: Product) => {
    const existe = productos.find((p) => p.id === item.id);

    if (existe) {
      setProductos(
        productos.map((p) =>
          p.id === item.id ? { ...p, cantidad: p.cantidad + 1 } : p
        )
      );
    } else {
      setProductos([
        ...productos,
        {
          id: item.id,
          codigo: item.product_code,
          nombre: item.product_name,
          precio: parseFloat(item.unit_price),
          cantidad: 1,
          aplicaIva: null,
        },
      ]);
    }
  };

  const setIvaProducto = (id: number, aplicaIva: boolean) => {
    setProductos(productos.map((p) => (p.id === id ? { ...p, aplicaIva } : p)));
  };

  const todosProductosTienenIva = () => {
    return productos.every((p) => p.aplicaIva !== null);
  };

  const eliminarProducto = (id: number) => {
    setProductos(productos.filter((p) => p.id !== id));
  };

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) {
      eliminarProducto(id);
      return;
    }
    setProductos(
      productos.map((p) =>
        p.id === id ? { ...p, cantidad: nuevaCantidad } : p
      )
    );
  };

  const calcularSubtotal = () => {
    return productos.reduce((sum, p) => sum + p.precio * p.cantidad, 0);
  };

  const calcularIVA = () => {
    return productos.reduce((sum, p) => {
      if (p.aplicaIva === true) {
        return sum + p.precio * p.cantidad * 0.19;
      }
      return sum;
    }, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() + calcularIVA();
  };

  const crearFactura = async () => {
    if (!cliente) return;

    setCreatingInvoice(true);
    try {
      const payload = {
        client_id: cliente.id,
        user_id: 1,
        invoice_type: invoiceType,
        details: productos.map((p) => ({
          product_code: p.codigo,
          product_name: p.nombre,
          unit_price: p.precio,
          quantity: p.cantidad,
          applies_tax: p.aplicaIva,
        })),
      };

      const res = await api.post("/invoices", payload);

      if (res.data.success) {
        alert("¡Factura creada exitosamente!");
        if (typeof onInvoiceCreated === "function") {
          onInvoiceCreated();
        }
        handleClose();
      }
    } catch (error) {
      console.error("Error creando factura:", error);
      alert("Error al crear la factura. Por favor intenta de nuevo.");
    } finally {
      setCreatingInvoice(false);
    }
  };

  const resetearModal = () => {
    setStep(1);
    setIdentificacion("");
    setCliente(null);
    setClienteNoExiste(false);
    setNuevoNombre("");
    setNuevoEmail("");
    setProductos([]);
    setCatalogo([]);
    setInvoiceType("cash");
  };

  const handleClose = () => {
    resetearModal();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl shadow-xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {step === 1 && "1. Información del Cliente"}
          {step === 2 && "2. Agregar Productos"}
          {step === 3 && "3. Método de Pago"}
          {step === 4 && "4. Confirmar Compra"}
        </h2>

        {step === 1 && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Número de Identificación
            </label>

            <div className="flex gap-2">
              <input
                type="text"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && buscarCliente()}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="Ej: 1002257008"
              />

              <button
                onClick={buscarCliente}
                disabled={searchingClient || !identificacion.trim()}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searchingClient ? "Buscando..." : "Buscar"}
              </button>
            </div>

            {cliente && (
              <div className="mt-4 p-4 border border-green-200 rounded-lg bg-green-50">
                <p className="text-green-800 font-semibold mb-2">
                  ✓ Cliente encontrado
                </p>
                <p className="text-slate-700">
                  <span className="font-medium">Nombre:</span>{" "}
                  {cliente.client_name}
                </p>
                <p className="text-slate-700">
                  <span className="font-medium">Email:</span> {cliente.email}
                </p>
              </div>
            )}

            {clienteNoExiste && (
              <div className="mt-5 border border-red-200 p-4 rounded-lg bg-red-50">
                <p className="text-red-700 font-semibold mb-4">
                  Cliente no encontrado. Registrar nuevo:
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      value={nuevoNombre}
                      onChange={(e) => setNuevoNombre(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={nuevoEmail}
                      onChange={(e) => setNuevoEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
                      placeholder="juan@ejemplo.com"
                    />
                  </div>

                  <button
                    onClick={registrarCliente}
                    disabled={registeringClient}
                    className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {registeringClient ? "Registrando..." : "Registrar Cliente"}
                  </button>
                </div>
              </div>
            )}

            {cliente && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Catálogo de Productos
            </h3>

            {loadingProducts && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
                <p className="mt-3 text-slate-600">Cargando productos...</p>
              </div>
            )}

            {!loadingProducts && catalogo.length === 0 && (
              <p className="text-center py-8 text-slate-600">
                No hay productos en el catálogo.
              </p>
            )}

            {!loadingProducts && catalogo.length > 0 && (
              <div className="max-h-64 overflow-auto border border-slate-200 rounded-lg">
                <ul className="divide-y divide-slate-200">
                  {catalogo.map((prod) => (
                    <li
                      key={prod.id}
                      className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {prod.product_name}
                        </p>
                        <p className="text-sm text-slate-500">
                          Código: {prod.product_code}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-semibold text-slate-900 text-lg">
                          ${parseFloat(prod.unit_price).toLocaleString()}
                        </p>

                        {prod.applies_tax && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            +IVA
                          </span>
                        )}

                        <button
                          onClick={() => agregarProducto(prod)}
                          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm"
                        >
                          + Agregar
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Carrito ({productos.length})
              </h3>

              {productos.length === 0 && (
                <p className="text-center py-6 text-slate-500">
                  No hay productos en el carrito
                </p>
              )}

              {productos.length > 0 && (
                <>
                  <ul className="space-y-2 mb-4">
                    {productos.map((p) => (
                      <li
                        key={p.id}
                        className="border border-slate-200 p-4 rounded-lg flex items-center justify-between bg-white"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {p.nombre}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-slate-500">
                              ${p.precio.toLocaleString()} c/u
                            </p>
                            {p.aplicaIva && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                +IVA (19%)
                              </span>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="text-sm mr-2">Aplicar IVA:</span>
                            <label className="mr-3">
                              <input
                                type="radio"
                                name={`iva-${p.id}`}
                                checked={p.aplicaIva === true}
                                onChange={() => setIvaProducto(p.id, true)}
                              />{" "}
                              Sí
                            </label>
                            <label>
                              <input
                                type="radio"
                                name={`iva-${p.id}`}
                                checked={p.aplicaIva === false}
                                onChange={() => setIvaProducto(p.id, false)}
                              />{" "}
                              No
                            </label>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                actualizarCantidad(p.id, p.cantidad - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-100"
                            >
                              −
                            </button>
                            <span className="w-12 text-center font-medium">
                              {p.cantidad}
                            </span>
                            <button
                              onClick={() =>
                                actualizarCantidad(p.id, p.cantidad + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-100"
                            >
                              +
                            </button>
                          </div>

                          <p className="font-bold text-slate-900 w-24 text-right">
                            ${(p.precio * p.cantidad).toLocaleString()}
                          </p>

                          <button
                            onClick={() => eliminarProducto(p.id)}
                            className="text-red-600 hover:text-red-700 px-2"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal:</span>
                      <span className="font-medium">
                        ${calcularSubtotal().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>IVA (19%):</span>
                      <span className="font-medium">
                        ${calcularIVA().toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-300">
                      <span className="text-lg font-semibold text-slate-900">
                        Total:
                      </span>
                      <span className="text-2xl font-bold text-slate-900">
                        ${calcularTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                ← Atrás
              </button>

              {productos.length > 0 && (
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Siguiente →
                </button>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Selecciona el método de pago
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setInvoiceType("cash")}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      invoiceType === "cash"
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">💵</div>
                      <p className="font-semibold text-slate-900">Efectivo</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Pago inmediato
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setInvoiceType("credit")}
                    className={`p-6 border-2 rounded-xl transition-all ${
                      invoiceType === "credit"
                        ? "border-slate-900 bg-slate-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">💳</div>
                      <p className="font-semibold text-slate-900">Crédito</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Pago diferido
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Método seleccionado:</span>{" "}
                  {invoiceType === "cash" ? "Efectivo" : "Crédito"}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Resumen de la compra
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Cliente:</span>
                    <span className="font-medium">{cliente?.client_name}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Productos:</span>
                    <span className="font-medium">
                      {productos.length} items
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Subtotal:</span>
                    <span className="font-medium">
                      ${calcularSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>IVA (19%):</span>
                    <span className="font-medium">
                      ${calcularIVA().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-300">
                    <span className="text-lg font-semibold text-slate-900">
                      Total:
                    </span>
                    <span className="text-2xl font-bold text-slate-900">
                      ${calcularTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                ← Atrás
              </button>

              <button
                onClick={() => setStep(4)}
                className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-semibold text-center">
                  ✓ Revisa los detalles antes de confirmar
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Cliente
                </h3>
                <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
                  <p className="text-slate-700">
                    <span className="font-medium">Nombre:</span>{" "}
                    {cliente?.client_name}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-medium">Identificación:</span>{" "}
                    {cliente?.client_identification}
                  </p>
                  <p className="text-slate-700">
                    <span className="font-medium">Email:</span> {cliente?.email}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Método de Pago
                </h3>
                <div className="border border-slate-200 p-4 rounded-lg bg-slate-50">
                  <p className="text-slate-700">
                    <span className="font-medium">Tipo:</span>{" "}
                    {invoiceType === "cash" ? "💵 Efectivo" : "💳 Crédito"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">
                  Productos ({productos.length})
                </h3>
                <ul className="space-y-2">
                  {productos.map((p) => (
                    <li
                      key={p.id}
                      className="border border-slate-200 p-4 rounded-lg bg-white"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-slate-900">
                            {p.nombre}
                          </p>
                          <p className="text-sm text-slate-500">
                            Código: {p.codigo}
                          </p>
                        </div>
                        {p.aplicaIva && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            +IVA
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>
                          ${p.precio.toLocaleString()} × {p.cantidad}
                        </span>
                        <span className="font-bold text-slate-900">
                          ${(p.precio * p.cantidad).toLocaleString()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 bg-slate-900 text-white p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">
                      ${calcularSubtotal().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (19%):</span>
                    <span className="font-medium">
                      ${calcularIVA().toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                    <span className="text-xl font-semibold">Total:</span>
                    <span className="text-3xl font-bold">
                      ${calcularTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(3)}
                disabled={creatingInvoice}
                className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                ← Atrás
              </button>

              <button
                onClick={crearFactura}
                disabled={creatingInvoice}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingInvoice ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creando factura...
                  </span>
                ) : (
                  "✓ Confirmar Compra"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
