import React, { useState } from "react";
import api from "../services/api";

interface Item {
  codigo: string;
  nombre: string;
  valor: number;
  cantidad: number;
  aplicaIVA: boolean;
}

interface InvoiceFormData {
  cedula: string;
  nombre: string;
  email: string;
  tipo: "Contado" | "Crédito";
  items: Item[];
}

export default function InvoiceForm() {
  const [form, setForm] = useState<InvoiceFormData>({
    cedula: "",
    nombre: "",
    email: "",
    tipo: "Contado",
    items: [
      { codigo: "", nombre: "", valor: 0, cantidad: 1, aplicaIVA: false },
    ],
  });

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        { codigo: "", nombre: "", valor: 0, cantidad: 1, aplicaIVA: false },
      ],
    });
  };

  const updateItem = (index: number, field: keyof Item, value: any) => {
    const updatedItems = [...form.items];
    const updatedItem = { ...updatedItems[index], [field]: value };
    updatedItems[index] = updatedItem;
    setForm({ ...form, items: updatedItems });
  };

  const calcularTotales = () => {
    let subtotal = 0;
    let ivaTotal = 0;

    form.items.forEach((item) => {
      const itemSubtotal = item.valor * item.cantidad;
      subtotal += itemSubtotal;
      if (item.aplicaIVA) {
        ivaTotal += itemSubtotal * 0.19;
      }
    });

    return {
      subtotal,
      ivaTotal,
      total: subtotal + ivaTotal,
    };
  };

  const { subtotal, ivaTotal, total } = calcularTotales();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/facturas", form);
      alert("Factura creada con éxito");
      setForm({
        cedula: "",
        nombre: "",
        email: "",
        tipo: "Contado",
        items: [
          { codigo: "", nombre: "", valor: 0, cantidad: 1, aplicaIVA: false },
        ],
      });
    } catch (error) {
      console.error(error);
      alert("Error al crear factura");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded shadow-md"
    >
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Cédula"
          value={form.cedula}
          onChange={(e) => setForm({ ...form, cedula: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <select
          value={form.tipo}
          onChange={(e) =>
            setForm({ ...form, tipo: e.target.value as "Contado" | "Crédito" })
          }
          className="border p-2 rounded"
        >
          <option value="Contado">Contado</option>
          <option value="Crédito">Crédito</option>
        </select>
      </div>

      <h2 className="text-xl font-bold mt-4">Items</h2>
      {form.items.map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-2 mb-2">
          <input
            type="text"
            placeholder="Código"
            value={item.codigo}
            onChange={(e) => updateItem(index, "codigo", e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Nombre"
            value={item.nombre}
            onChange={(e) => updateItem(index, "nombre", e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Valor"
            value={item.valor}
            onChange={(e) =>
              updateItem(index, "valor", parseFloat(e.target.value))
            }
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={item.cantidad}
            onChange={(e) =>
              updateItem(index, "cantidad", parseInt(e.target.value))
            }
            className="border p-2 rounded"
            required
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={item.aplicaIVA}
              onChange={(e) => updateItem(index, "aplicaIVA", e.target.checked)}
            />
            <span>IVA</span>
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        + Agregar Item
      </button>

      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>
          Subtotal: <strong>${subtotal.toFixed(2)}</strong>
        </p>
        <p>
          IVA: <strong>${ivaTotal.toFixed(2)}</strong>
        </p>
        <p>
          Total: <strong>${total.toFixed(2)}</strong>
        </p>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-4"
      >
        Crear Factura
      </button>
    </form>
  );
}
