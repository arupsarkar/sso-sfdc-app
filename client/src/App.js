import React, {useEffect, useState} from 'react'
import logo from './logo.svg';
import './App.css';
import axios from "axios";

function App() {

    const login = async (e) => {
        e.preventDefault()
        console.log('---> clicked login')
        window.location = '/auth/login'
        // axios.get('/auth/login', {
        //     method: 'GET',
        //     headers: {
        //         'Access-Control-Allow-Origin': '*',
        //     }
        // })
        //     .then(res => {
        //         console.log(res)
        //     })
    }

    const getData = async () => {
        console.log('---> getData')
        axios.get('/query')
            .then(res => {
                console.log('---> data from server ', JSON.stringify(res.data.records))
                setData(JSON.stringify(res.data.records))
            })
    }

    const logout = async (e) => {
        e.preventDefault()
        console.log('---> logout')
        window.location = '/auth/logout'
    }

    const gotoCommunity = (e) => {
        e.preventDefault()
        window.location.href ='https://linkedin-customer-developer-edition.na85.force.com/css/s/'
        // window.open('https://linkedin-customer-developer-edition.na85.force.com/css/s/', '_blank')
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

          <button
            onClick={gotoCommunity}
          >
            Goto Community
          </button>

      </header>
    </div>
  );
}

export default App;
