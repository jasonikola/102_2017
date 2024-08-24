import React, { useState } from 'react';
import Products from "./Products";

function Professor() {
  const [page, setPage] = useState('products');

  const onClickHandler = (event: any) => {
    setPage(event.target.value);
  }

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <button onClick={onClickHandler} value={'products'}>Komponente</button>
        <button onClick={onClickHandler} value={'students'}>Studenti</button>
      </div>
      {
        page === 'products' ? <Products /> : <div>Studenti</div>
      }
    </div>
  );
}

export default Professor;
