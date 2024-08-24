import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  useEffect(() => {
    let password = Cookies.get('password');
    let username = Cookies.get('username');

    if (username && password) {
      setUsername(username);
      setPassword(password);
    }
  }, []);

  const onClickHandler = (event: any) => {
    sessionStorage.setItem('logged', 'true');
    if (username || password) {

      Cookies.set('username', username);
      Cookies.set('password', password);

      navigate('/student');
    } else {
      navigate('/professor');
    }
  }
  return (
    <div>
      <div style={{ margin: '30px', }}>
        <h2>Login</h2>
        <div>
          <label htmlFor="username">Korisničko ime:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Šifra:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button onClick={onClickHandler}>Login</button>
        </div>
        <div>
          <input type="checkbox" id="rememberMe" name="rememberMe" checked={rememberMe}
                 onChange={() => setRememberMe(!rememberMe)} />
          <label htmlFor="rememberMe">Zapamti me</label>
        </div>
      </div>
    </div>
  );
}

export default Login;
