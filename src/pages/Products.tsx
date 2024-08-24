import React, { useEffect, useState } from 'react';
import axios from "axios";
import NumberInput from "../components/NumberInput";
import Cart from "../components/Cart";

type Product = {
  title: string,
  price: number,
  isAvailable: boolean,
  favourite: boolean,
  total?: number,
  assigned?: number,
  free?: number,
  quantity?: number,
  totalPrice?: number
}

function Products() {

  const [products, setProducts] = useState<never[]>([]);
  const [productsToBuy, setProductsToBuy] = useState<Product[]>([]);

  useEffect(() => {
    getData().then((res: any) => {
      setProducts(res.data);
    }).catch((error: any) => console.log(error));
  }, []);

  const getData = async () => {
    try {
      return axios.get('http://localhost:3001/getProducts');
    } catch (error: any) {
      console.error('Error fetching data:', error);
    }
  }

  const addToFavorites = (product: any) => {
    product.favorite = product.favorite !== undefined ? !product.favorite : true;
    sortProducts();
  }

  const sortProducts = (productsToSort: any = products) => {
    const sortedProducts = [...products].sort((a: any, b: any) => {
      if (a.favorite && !b.favorite) {
        return -1;
      } else if (!a.favorite && b.favorite) {
        return 1;
      } else if (a.isAvailable && !b.isAvailable) {
        return -1;
      } else if (!a.isAvailable && b.isAvailable) {
        return 1;
      }
      return 0;
    });

    setProducts(sortedProducts);
  }

  const inputOnChange = (product: any, value: number) => {
    const productIndex = productsToBuy.findIndex((productToBuy: any) => productToBuy.title === product.title);
    let newProducts: Product[] = [...productsToBuy];
    if (productIndex !== -1) {
      if (value > 0) {
        newProducts[productIndex] = {
          ...newProducts[productIndex],
          quantity: value,
          totalPrice: value * product.price
        }
      } else {
        newProducts = newProducts.filter((product: Product, index: number) => index !== productIndex);
      }
    } else {
      newProducts.push({
        ...product,
        quantity: value,
        totalPrice: value * product.price
      });
    }

    setProductsToBuy(newProducts);
  }

  return (
    <div className="Products">
      <table style={{ float: 'left' }}>
        <thead>
        <tr>
          <th>Omiljeni</th>
          <th>Proizvod</th>
          <th>Ukupno</th>
          <th>Dodeljeno</th>
          <th>Slobodno</th>
          <th>Dostupan</th>
          <th>Cena</th>
          <th>Za nabavku</th>
        </tr>
        </thead>
        <tbody>
        {products.map((product: any, index: number) => {
          return (<tr id={`product${index}`} key={index}>
            <td>
              <button
                disabled={!product.isAvailable || product.assigned}
                onClick={() => addToFavorites(product)}
                style={{ border: '1px', borderColor: 'black', color: product.favorite ? 'red' : 'black' }}
              >
                ★
              </button>
            </td>
            <td>{product.title}</td>
            <td>{product.favorite && (product.total ? product.total : 0)}</td>
            <td>{product.favorite && (product.assigned ? product.assigned : 0)}</td>
            <td>{product.favorite && (product.free ? product.free : 0)}</td>
            <td>{product.isAvailable ? 'DA' : 'NE'}</td>
            <td>{product.price}</td>
            <td>{product.isAvailable && <NumberInput onChange={(value: any) => inputOnChange(product, value)} />}</td>
          </tr>);
        })}
        </tbody>
      </table>
      <Cart products={productsToBuy} />
    </div>
  );
}

export default Products;
