<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Building;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class PropertyController extends Controller
{
    // 🔹 List all properties (with filters)
    public function index(Request $request)
    {
        $query = Property::with('images');

        if ($request->city) {
            $query->where('city', 'like', "%{$request->city}%");
        }

        if ($request->state) {
            $query->where('state', 'like', "%{$request->state}%");
        }

        if ($request->type) {
            $query->where('type', $request->type);
        }

        if ($request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        $properties = $query->latest()->paginate(10);
        return response()->json($properties);
    }

    // 🔹 Create new property (auth required)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'          => 'required|string|max:255',
            'description'    => 'nullable|string',
            'address'        => 'required|string',
            'city'           => 'required|string',
            'state'          => 'required|string',
            'price'          => 'required|numeric',
            'property_type'  => 'required|string',   // house, estate, plaza, land, building, shop, apartment
            'status'         => 'required|in:available,sold,rented',

            // images
            'images.*'       => 'nullable|image|mimes:jpeg,png,jpg,gif|max:4096',

            // buildings and units as JSON
            'buildings'      => 'nullable|string',
            'units'          => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $property = Property::create([
            'title'         => $request->title,
            'description'   => $request->description,
            'address'       => $request->address,
            'city'          => $request->city,
            'state'         => $request->state,
            'price'         => $request->price,
            'property_type' => $request->property_type,
            'status'        => $request->status,
            'owner_id'      => Auth::id(),
            'manager_id'    => Auth::id(),
        ]);

        /* ----------------------------------------------------
         *  SAVE IMAGES
         * ---------------------------------------------------- */
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $img) {
                $path = $img->store("property_images", "public");

                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path'  => $path
                ]);
            }
        }

        /* ----------------------------------------------------
         *  SAVE BUILDINGS
         * ---------------------------------------------------- */
        if ($request->buildings) {
            $buildings = json_decode($request->buildings, true);

            foreach ($buildings as $b) {
                Building::create([
                    'property_id'   => $property->id,
                    'building_name' => $b['building_name'],
                    'floors'        => $b['floors'] ?? 1,
                ]);
            }
        }

        /* ----------------------------------------------------
         *  SAVE UNITS / APARTMENTS / SHOPS
         * ---------------------------------------------------- */
        if ($request->units) {
            $units = json_decode($request->units, true);

            foreach ($units as $u) {

                $buildingId = $u['building_id'] ?? null;

                // If ESTATE and no building ID provided, attach units to 1st building
                if (!$buildingId && $property->property_type === "estate") {
                    $firstBuilding = $property->buildings()->first();
                    if ($firstBuilding) {
                        $buildingId = $firstBuilding->id;
                    }
                }

                Unit::create([
                    'property_id' => $property->id,
                    'building_id' => $buildingId,
                    'unit_name'   => $u['unit_name'],
                    'floor'       => $u['floor'] ?? null,
                    'bedrooms'    => $u['bedrooms'] ?? null,
                    'bathrooms'   => $u['bathrooms'] ?? null,
                    'size'        => $u['size'] ?? null,
                    'rent_price'  => $u['rent_price'] ?? null,
                ]);
            }
        }

        return response()->json([
            'success'  => true,
            'message'  => 'Property created successfully.',
            'property' => $property->load('images', 'buildings', 'units'),
        ], 201);
    }

    // 🔹 View single property
    public function show($id)
    {
        $property = Property::with('images', 'buildings.units')->find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found.'], 404);
        }

        return response()->json($property);
    }

    // 🔹 Update property
    public function update(Request $request, $id)
    {
        $property = Property::find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        $property->update($request->except('images'));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('property_images', 'public');

                PropertyImage::create([
                    'property_id' => $property->id,
                    'image_path'  => $path,
                ]);
            }
        }

        return response()->json([
            'message'  => 'Property updated successfully.',
            'property' => $property->load('images')
        ]);
    }

    // 🔹 Delete property
    public function destroy(Request $request, $id)
    {
        $property = Property::with('images')->find($id);

        if (!$property) {
            return response()->json(['message' => 'Property not found'], 404);
        }

        foreach ($property->images as $img) {
            Storage::disk('public')->delete($img->image_path);
            $img->delete();
        }

        $property->delete();
        return response()->json(['message' => 'Property deleted successfully']);
    }

    // 🔹 Fetch properties owned by logged-in user
    public function myProperties(Request $request)
    {
        $properties = Property::where('owner_id', Auth::id())
            ->with('images')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status'     => true,
            'properties' => $properties,
        ]);
    }
}
