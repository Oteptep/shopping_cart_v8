<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {

        $mimes = [
          'jpg',
          'jpeg',
          'png',
          'gif',
        ];

        return [
            'name' => 'required',
            'price' => 'required',
            'quantity' => 'required',
            'file' => 'required|mimes:'.implode(',',$mimes)
        ];
    }

    public function messages() 
    {
        return [
            'name.required' => 'The product name field is required',
            'path.required' => 'The image is required',
            'file.mimes' => 'Invalid file format'
        ];
    }
}
