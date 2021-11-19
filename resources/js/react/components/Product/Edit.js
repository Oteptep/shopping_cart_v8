import React, { useState, useRef, useEffect }  from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import getErrorMessage from '../../utils/getErrorMessage';
import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

function Edit({show, productId, onClose, onSuccess}) {

  const uploader = useRef(null);
  const { addToast } = useToasts();
  const [show_modal, setShowModal] = useState(false);
  const [product, setProduct] = useState({
    name: null,
    price: null,
    quantity: null,
    file: null
  });
  const [errors, setErrors] = useState({});

  const NOT_INCLUDED_FIELDS = [
    'created_at',
    'updated_at',
    'file_details',
    'id'
  ];

  const get = async () => {
    try {
      const response = await axios.get(`api/product/${productId}`);
      setProduct(response.data.product);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if(productId) {
      get()
    }
  }, [productId]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setProduct(previous => ({
      ...previous,
      [name]: value
    }))
  }

  const handleImageUpload = (event) => {
    const { files } = event.currentTarget;
    setProduct(previous => ({
      ...previous,
      file: files[0]
    }))
  }

  const submit = async () => {
    try {
      let data = new FormData();
      for(let i = 0; i < Object.keys(product).length; i++) {
        if(NOT_INCLUDED_FIELDS.includes(Object.keys(product)[i])) continue;
        if(Object.keys(product)[i] === 'file' && Object.values(product)[i] instanceof File === false) continue;
        data.append(Object.keys(product)[i], Object.values(product)[i]);
      }
      const response = await axios.post(`api/product/${productId}?_method=PUT`, data);
      const { result, message } = response.data;
      if(result === 'success') {
        addToast(message, { appearance: 'success' });
        clearFields()
        onSuccess()
      } else {
        addToast(message, { appearance: 'error' });
      }
      setShowModal(false);
    } catch (error) {
      const { status, data } = error.response;
      if(status === 422) {
        setErrors(data.errors)
      }
    }
  }

  const clearFields = () => {
    setProduct({
      name: null,
      price: null,
      quantity: null,
      file: null
    });
  }

  return (
    <>
      <Modal
        animation={false}
        centered
        scrollable
        backdrop="static"
        className=""
        show={show}
        onHide={() => onClose()}>
        <Modal.Header closeButton>
          <Modal.Title>
            Update Product
          </Modal.Title>    
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Group className="">
              <Form.Label className="" htmlFor="name">Name</Form.Label>
              <Form.Control 
                name="name"
                type="text"
                value={product.name || ''}
                onChange={handleOnChange}
                className={getErrorMessage('name', errors) && 'is-invalid'}
              />    
              {getErrorMessage('name', errors) &&
              <div className="invalid-feedback">
                {getErrorMessage('name', errors)}
              </div>}            
            </Form.Group>
            <Form.Group className="">
              <Form.Label className="" htmlFor="name">Price</Form.Label>
              <Form.Control
                min="0"  
                name="price"
                type="number"
                value={product.price || ''}
                onChange={handleOnChange}
                className={getErrorMessage('name', errors) && 'is-invalid'}
              />    
              {getErrorMessage('price', errors) &&
              <div className="invalid-feedback">
                {getErrorMessage('price', errors)}
              </div>}                 
            </Form.Group>
            <Form.Group className="">
              <Form.Label className="" htmlFor="name">Quantity</Form.Label>
              <Form.Control
                min="0" 
                name="quantity"
                type="number"
                value={product.quantity || ''}
                onChange={handleOnChange}
                className={getErrorMessage('name', errors) && 'is-invalid'}
              />  
              {getErrorMessage('quantity', errors) &&
              <div className="invalid-feedback">
                {getErrorMessage('quantity', errors)}
              </div>}                 
            </Form.Group>
            <div className="my-3">
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  uploader.current.click();
                }}>
                Upload Image
              </Button>
              <input 
                type="file" 
                ref={uploader}
                style={{ 
                  display: 'none' 
                }}
                onChange={handleImageUpload}
              />
            </div>
            {getErrorMessage('file', errors) &&
            <div className="invalid-feedback d-block">
              {getErrorMessage('file', errors)}
            </div>}
            <span>{product?.file?.name || product?.file_details?.name}</span>    
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-end">
          <Button
            size="md"
            style={{
              fontSize: 12
            }}
            onClick={() => submit()}
            variant="success">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Edit;