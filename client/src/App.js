import React, {useEffect, useState} from 'react'
import logo from './logo.svg';
import './App.css';
import axios from "axios";

function App() {

    const login = async (e) => {
        e.preventDefault()
        console.log('---> clicked login')
        window.location = '/auth/login'
        axios.get('/auth/login', {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        })
            .then(res => {
                console.log(res)
            })
        //window.location.href = '/auth/login'
    }

    const getData = async () => {
        console.log('---> getData')
        axios.get('/query')
            .then(res => {
                console.log('---> data from server ', JSON.stringify(res.data.records))
                setData(JSON.stringify(res.data.records))
            })
    }

    const logout = () => {
        console.log('---> logout')
        axios.get('/auth/logout')
            .then(res => {
                console.log('---> data from server ', JSON.stringify(res))
                setData("User Logged Out.")
            })
            .catch(err => {
                setData("User Logged Out error." + err)
            })
    }

    const [data, setData] = useState(null)

    useEffect(() => {
        // fetch('/api')
        //     .then((res) => {
        //         res.json()
        //             .then(r => setData(r.message))
        //     })
    }, [data])

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
