import React from 'react';
import { useNavigate } from "react-router-dom";

function Header() {
  const navigation = useNavigate();

  const onClickHandler = () => {
    sessionStorage.removeItem('logged');
    navigation('/login');
  }

  return (
    <div className={'header'}>
      <div>Ardunent</div>
      {sessionStorage.getItem('logged') &&
        <div>
          <span>Ime i prezime</span>
          <button onClick={onClickHandler}>Odjavi se</button>
        </div>
      }
    </div>
  );
}

export default Header;
