import React, { useState, useEffect } from 'react';
import { Card, Image, Button, Container, Table } from 'react-bootstrap';
import axios from 'axios';
import moneyFormat from '../../utils/moneyFormat';

function List() {

  const [products, setProducts] = useState([]);
  const [is_loaded, setIsloaded] = useState(false);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')) || []);

  const get = async () => {
    try {
      const response = await axios.get('api/product');
      setProducts(response.data.products)
      const mapped = response.data.products.map(product => (
        {
          ...product,
          quantity: Object.keys(getItem(product)).length === 0 ? product.quantity : product.quantity - getItem(product)['quantity']
        }
      ))
      setProducts(mapped)
      setIsloaded(true)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    get();
  }, []);

  const getItem = product => {
    if(localStorage.getItem('cart') === null) return {};
    let index = cart.findIndex(item => item.id === product.id);
    if(index === -1) return {};
    return cart[index];
  }

  const handleAddToCart = (product) => {
    const _cart = cart;
    let cart_index = _cart.findIndex(item => item.id === product.id);
    let product_index= products.findIndex(item => item.id === product.id);
    if(cart_index === -1) {
      _cart.push({
         id: product.id,
         name: product.name,
         price: product.price,
         quantity: 1
      })
    } else {
      _cart[cart_index].quantity += 1
    }
    localStorage.setItem('cart', JSON.stringify(_cart))
    setCart(_cart);
    get()
  }

  const handleOnRemove = (product) => {
    let _cart = cart;
    let index = _cart.findIndex(item => item.id === product.id);
    let _quantity = _cart[index].quantity -= 1;
    if(_quantity === 0) {
      _cart = _cart.filter(item => item.id !== product.id);
    }
    localStorage.setItem('cart', JSON.stringify(_cart))
    setCart(_cart)
    get()
  }

  if(!is_loaded) return 'Loading...'

  return (
    <>
      <Container>
        <div className="d-flex flex-wrap">
          {products.map(product => (
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
                  onClick={() => {
                    handleAddToCart(product)
                  }}
                  size="md"
                  disabled={product.quantity === 0}
                  variant="success">
                  Add To Cart
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>
        <div>
          <Table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(data => 
                <tr key={data.id}>
                  <td>{data.name}</td>
                  <td>{moneyFormat(data.price)}</td>
                  <td>{data.quantity}</td>
                  <td>{moneyFormat(data.quantity * data.price)}</td>
                  <td>
                    <Button
                      onClick={() => {
                        handleOnRemove(data)
                      }}
                      size="md"
                      variant="danger">
                      Remove
                    </Button>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {moneyFormat(cart.map(item => item.price * item.quantity).reduce((a, b) => a + b, 0))}
        </div>
      </Container>
    </>
  )
}

export default List;