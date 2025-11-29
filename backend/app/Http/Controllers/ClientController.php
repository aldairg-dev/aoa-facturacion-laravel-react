<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClienteStorageRequest;
use App\Http\Requests\StoreClientRequest;
use App\Models\Client;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\HttpCache\Store;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $client = Client::all();
            return response()->json([
                'success' => true,
                'data' => $client,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los clientes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreClientRequest $request)
    {
        try {
            $client = Client::create($request->validated());

            return response()->json([
                'success' => true,
                'message' => 'Cliente creado exitosamente',
                'data'    => $client,
            ], 201);
        } catch (\Exception $e) {
            logger($e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el cliente',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $client_identification)
    {
        try {
            $client = Client::where('client_identification', $client_identification)->firstOrFail();

            return response()->json([
                'success' => true,
                'data'    => $client
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cliente no encontrado',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error interno del servidor',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        //
    }
}
