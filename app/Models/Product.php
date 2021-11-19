<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = [
        'name',
        'price',
        'quantity',
        'file'
    ];

    protected $appends = [
        'file_details'
    ];

    public function getFileDetailsAttribute()
    {
        $name = explode('/', $this->attributes['file']);
        return [
            'name' => end($name),
            'path' => 'storage/attachments/'.$this->attributes['file']
        ];
    }
}
