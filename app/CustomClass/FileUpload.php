<?php

namespace App\CustomClass;

use App\Product;

class FileUpload {

  public static function upload($payload) 
  {
      $file = $payload['file'];

      $file_name =  $file->getClientOriginalName();

      $file_path = $payload['id'].'/'.$file_name;

      $file->storeAs('public/attachments', $file_path);

      Product::find($payload['id'])->update(['file' => $file_path]);

      return $file_name;
  }

}