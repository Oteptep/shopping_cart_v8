<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\AddProductRequest;
use App\Models\Product;
use App\CustomClass\FileUpload;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
        $products = Product::all();

        return json_encode([
            'result' => 'success',
            'products' => $products
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(AddProductRequest $request)
    {
        //
        $product = Product::create($request->except(['file']));

        $product['file'] = $request->file('file');

        FileUpload::upload($product);

        return json_encode([
            'result' => 'success',
            'message' => 'Successfully Added'
        ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        return json_encode([
            'product' => Product::find($id)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
        $product = Product::find($id);

        if($request->has('file')) {
            \Storage::delete('public/attachments/'.$product->file);
            FileUpload::upload(['file' => $request->file('file'), 'id' => $product->id]);
        }

        $product->update($request->except(['_method', 'file']));

        return json_encode([
            'result' => 'success',
            'message' => 'Successfully Updated'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
        Product::find($id)->delete();

        return json_encode([
            'result' => 'success',
            'message' => 'Successfully Deleted'
        ]);
    }
}
