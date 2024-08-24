import React, { useState } from 'react';

type CartProps = {
  products: any
};

const Cart: React.FC<CartProps> = ({ products }) => {

  const sumProducts = () => {
    return products.reduce((acc: number, product: any) => {
      return acc + product.totalPrice;
    }, 0);
  }

  return (
    <div style={{ float: 'left', margin: '10px', textAlign: 'right' }}>
      {
        products.length ? <div>
          {
            products.map((product: any) => {
              return <div>{`${ product.title } ${product.price} x${product.quantity} = ${product.totalPrice}`}</div>
            })
          }
          -----------
          <div>{`Ukupno: ${sumProducts()} RSD`}</div>
        </div> : <div>Korpa je prazna</div>
      }
    </div>
  );
}

export default Cart;
