import React, {useEffect, useState} from 'react'
import logo from './logo.svg';
import './App.css';

function App() {

    const login = async (e) => {
        e.preventDefault()
        console.log('---> clicked login')
        const requestOptions = {
            method: 'GET',
            mode: 'no-cors',
        }
        await fetch('/auth/login', requestOptions).then(r => console.log(r))

        //window.location.href = '/auth/login'
    }

    const getData = async () => {
        console.log('---> getData')
        const requestOptions = {
            method: 'GET',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json'
            },
        }

        await fetch('/query', requestOptions)
            .then((res) => {
                console.log('---> res ', res)
                setData(res)
            })
            .catch(err => {
                console.log('---> err ', err)
                setData(err)
            })
    }

    const logout = () => {
        console.log('---> logout')
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

          <button onClick={getData}>
              Get Data
          </button>

          <button onClick={logout}>
              Logout
          </button>
      </header>
    </div>
  );
}

export default App;
