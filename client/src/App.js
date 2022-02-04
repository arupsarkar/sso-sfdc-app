import React, {useEffect, useState} from 'react'
import logo from './logo.svg';
import './App.css';

function App() {

    const login = (e) => {
        e.preventDefault()
        console.log('---> clicked login')
        window.location.href = '/auth/login'
    }
    const [data, setData] = useState(null)

    useEffect(() => {
        fetch('/api')
            .then((res) => {
                res.json()
                    .then(r => setData(r.message))
            })
    })

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <p>{!data ? "Loading " : data}</p>
          <button onClick={login}>
              Login
          </button>
      </header>
    </div>
  );
}

export default App;
