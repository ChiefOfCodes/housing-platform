<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PropertyController extends Controller
{
    // 🔹 List all properties (with filters)
    public function index(Request $request)
    {
        $query = Property::query();

        // Optional filters
        if ($request->has('city')) {
            $query->where('city', 'like', "%{$request->city}%");
        }

        if ($request->has('state')) {
            $query->where('state', 'like', "%{$request->state}%");
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        $properties = $query->latest()->paginate(10);

        return response()->json($properties);
    }

    // 🔹 Create new property (auth required)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'price' => 'required|numeric',
            'type' => 'required|in:rent,sale',
            'bedrooms' => 'nullable|integer',
            'bathrooms' => 'nullable|integer',
            'size' => 'nullable|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $data = $request->all();
        $data['user_id'] = $request->user()->id;

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('properties', 'public');
            $data['image'] = $path;
        }

        $property = Property::create($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Property created successfully.',
            'property' => $property
        ]);
    }

    // 🔹 View a single property
    public function show($id)
    {
        $property = Property::with('user')->find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found.'], 404);
        }

        return response()->json($property);
    }

    // 🔹 Update property (only owner)
    public function update(Request $request, $id)
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found.'], 404);
        }

        if ($property->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $property->update($request->all());

        return response()->json(['message' => 'Property updated.', 'property' => $property]);
    }

    // 🔹 Delete property (only owner)
    public function destroy(Request $request, $id)
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found.'], 404);
        }

        if ($property->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $property->delete();

        return response()->json(['message' => 'Property deleted successfully.']);
    }
}
