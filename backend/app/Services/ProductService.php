<?php

namespace App\Services;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ProductService
{
    public function getProducts(array $filters = []): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $cacheKey = 'products_' . md5(serialize($filters));
        
        return Cache::remember($cacheKey, 3600, function () use ($filters) {
            $query = Product::with('category');

            if (isset($filters['category_id'])) {
                $query->where('category_id', $filters['category_id']);
            }

            if (isset($filters['search'])) {
                $query->where(function ($q) use ($filters) {
                    $q->where('name', 'like', '%' . $filters['search'] . '%')
                      ->orWhere('description', 'like', '%' . $filters['search'] . '%');
                });
            }

            return $query->paginate($filters['per_page'] ?? 15);
        });
    }

    public function createProduct(array $data): Product
    {
        return Product::create($data);
    }

    public function updateProduct(Product $product, array $data): Product
    {
        $product->update($data);
        Cache::forget('products_*');
        return $product->fresh();
    }

    public function deleteProduct(Product $product): bool
    {
        Cache::forget('products_*');
        return $product->delete();
    }
}
