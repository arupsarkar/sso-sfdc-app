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

    const gotoCommunity = () => {
        //e.preventDefault()
        let url = 'https://login.salesforce.com'
        const retURL = 'https://linkedin-customer-developer-edition.na85.force.com/css/s/'
        window.open(retURL, '_blank')
        // axios.get('/community')
        //     .then(res => {
        //         url = url + '/secur/frontdoor.jsp?sid='+res.data.token+'&retURL='+retURL
        //         console.log('res' , JSON.stringify(res.data))
        //         console.log('url' , url)
        //         window.open(url, '_blank')
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })

    }

    const [data, setData] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        console.log('---> user ', user)
        console.log('---> calling getUser ')
        axios.get('/getUser')
            .then(res => {
                if(!user) {
                    console.log('---> setting user ', JSON.stringify(res))
                    setUser(res.data)
                }
            })
            .then(data => {
                console.log('---> data ', JSON.stringify(data))
            })
            .catch(err => {
                console.log('Error getting User', err)
            })
    }, [data, user])



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
          Welcome {user}
      </header>
    </div>
  );
}

export default App;
