<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;

class ProductController extends Controller
{
    public function index()
    {
        try {
            $products = Product::orderBy('id', 'ASC')->get();

            return response()->json([
                'success' => true,
                'data'    => $products,
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los productos',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function store(StoreProductRequest $request)
    {
        try {
            $product = Product::orderBy('id', 'desc')->first();
            $nextNumber = $product ? $product->id + 1 : 1;

            $code = 'ITEM-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

            $product = Product::create([
                'product_code'  => $code,
                'product_name'  => $request->name,
                'unit_price' => $request->price,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Producto creado exitosamente',
                'data'    => $product,
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al crear el producto',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function show(Product $product)
    {
        try {
            return response()->json([
                'success' => true,
                'data'    => $product
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al obtener el producto',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        try {
            $product->update($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Producto actualizado exitosamente',
                'data'    => $product
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al actualizar el producto',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Producto eliminado correctamente'
            ]);
        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al eliminar el producto',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
