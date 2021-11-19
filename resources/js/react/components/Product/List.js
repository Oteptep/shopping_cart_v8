import React, { useState, useEffect } from 'react';
import Create from './Create';
import { Card, Image, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import moneyFormat from '../../utils/moneyFormat';
import { useToasts } from 'react-toast-notifications';
import Edit from './Edit';

function List() {

  const [products, setProducts] = useState([]);
  const [is_loaded, setIsloaded] = useState(false);
  const [show_edit_modal, setShowEditModal] = useState(false);
  const [product_id, setProductId] = useState(null);
  const { addToast } = useToasts();

  const get = async () => {
    try {
      const response = await axios.get('api/product');
      setProducts(response.data.products);
      setIsloaded(true)
    } catch (error) {
      console.error(error);
    }
  }

  const remove = async (id) => {
    try {
      const response = await axios.delete(`api/product/${id}`);
      const { result, message } = response.data;
      if(result === 'success') {
        addToast(message, { appearance: 'success' });
        get();
      } else {
        addToast(message, { appearance: 'error' });
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    get();
  }, []);

  const handleOnSuccess = () => {
    setShowEditModal(false);
    setProductId(null);
    get();
  }

  return (
    <>
      <Container className="mt-3">
        <Create
          onSuccess={() => get()} 
        />
        <div className="d-flex flex-wrap">
          {is_loaded && products.map(product => (
            <Card
              key={product.id} 
              className="product-card shadow me-2 mt-2">
              <Card.Body>
                <div className="d-flex justify-content-around">
                  <div
                    style={{
                      flex: 1
                    }}>
                    <Image
                      height={100}
                      width={100}
                      src={product?.file_details?.path}
                    />
                  </div>
                  <div
                    className="d-flex align-items-center"
                    style={{
                      flex: 1
                    }}>
                    <div>
                      <h6>
                        Name: {product.name}
                      </h6>
                      <h6>
                        Price: {moneyFormat(product.price)}
                      </h6>
                      <h6>
                        Quantity: {product.quantity}
                      </h6>
                    </div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end">
                <Button
                  onClick={() => remove(product.id)}
                  className="me-2"
                  size="md"
                  variant="danger">
                  Delete
                </Button>
                <Button
                  onClick={() => {
                    setShowEditModal(true);
                    setProductId(product?.id);
                  }}
                  size="md"
                  variant="success">
                  Update
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
        <Edit 
          show={show_edit_modal}
          productId={product_id}
          onClose={() => {
            setShowEditModal(false);
          }}
          onSuccess={handleOnSuccess}
        />
      </Container>
    </>
  )
}

export default List