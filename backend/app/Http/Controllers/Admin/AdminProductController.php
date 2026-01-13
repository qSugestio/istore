<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Services\ProductService;
use Illuminate\Http\JsonResponse;

class AdminProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    public function index(): JsonResponse
    {
        $products = \App\Models\Product::with('category')->paginate(15);
        return response()->json($products);
    }

    public function store(CreateProductRequest $request): JsonResponse
    {
        $product = $this->productService->createProduct($request->validated());
        return response()->json($product->load('category'), 201);
    }

    public function show(string $id): JsonResponse
    {
        $product = \App\Models\Product::with('category')->findOrFail($id);
        return response()->json($product);
    }

    public function update(UpdateProductRequest $request, string $id): JsonResponse
    {
        $product = \App\Models\Product::findOrFail($id);
        $product = $this->productService->updateProduct($product, $request->validated());
        return response()->json($product->load('category'));
    }

    public function destroy(string $id): JsonResponse
    {
        $product = \App\Models\Product::findOrFail($id);
        $this->productService->deleteProduct($product);
        return response()->json(['message' => 'Product deleted']);
    }
}
