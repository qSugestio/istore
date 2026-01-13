<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        private ProductService $productService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $products = $this->productService->getProducts([
            'category_id' => $request->get('category_id'),
            'search' => $request->get('search'),
            'per_page' => $request->get('per_page', 15),
        ]);

        return response()->json($products);
    }

    public function show(string $id): JsonResponse
    {
        $product = \App\Models\Product::with('category')->findOrFail($id);
        return response()->json($product);
    }
}
