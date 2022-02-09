const express = require('express')
const path = require('path')
const jsforce = require('jsforce')
const session = require('express-session')
const cors = require('cors')
const PORT = process.env.PORT || 8080
const axios = require('axios')

require('dotenv').config()

console.log(process.env.loginUrl)

if(!process.env.loginUrl && !process.env.consumerkey){
    console.error('Cannot start app')
    process.exit(-1)
}

const oauth2 = new jsforce.OAuth2({
    loginUrl: process.env.loginUrl,
    clientId: process.env.consumerKey,
    clientSecret: process.env.consumerSecret,
    redirectUri: process.env.callbackUrl
})

const app = express()
app.use(cors())
app.options('*', cors())
app.use(
    session(
        {
            secret: process.env.sessionSecretKey,
            cookie: {secure: process.env.isHttps === true},
            resave: false,
            saveUninitialized: false
        }
    )
)

const getSession = (req, res) => {
    const sess = req.session
    console.log('---> session : ', sess)
    if(!sess.sfdcAuth) {
        res.status(401).send('no active session')
        return null
    }
    return sess
}

const resumeSalesforceConnection = (sess) => {
    return new jsforce.Connection({
        instanceUrl: sess.sfdcAuth.instanceUrl,
        accessToken: sess.sfdcAuth.accessToken,
        version: process.env.apiVersion
    })
}


app.get('/api', async (req, res, next) => {
    console.log('calling api endpoint')
    res.json({message: 'hello from server 2'})
})

app.get('/auth/login', async (req, res, next) => {
    console.log(new Date(), 'calling oauth login')
    res.header("Access-Control-Allow-Origin", "*");
    res.redirect(oauth2.getAuthorizationUrl({scope: 'api web refresh_token'}))
})

app.get('/auth/callback', async (req, res, next) => {
    console.log('---> code :', req.query.code)
    if(!req.query.code) {
        res.status(500).send('failed to get code from server callback')
        return
    }

    // authenticate with OAuth
    const conn = await new jsforce.Connection({
        oauth2: oauth2,
        version: process.env.apiVersion
    })



    conn.authorize( req.query.code, (error, userInfo) => {
        if(error){
            console.log('salesforce auth error: ' + JSON.stringify(error))
            res.status(500).json(error)
            return
        }
        console.log('---> token :', conn.accessToken)
        console.log('---> instance url :', conn.instanceUrl)

        req.session.sfdcAuth = {
            instanceUrl: conn.instanceUrl,
            accessToken: conn.accessToken
        }

        return res.redirect('/index.html')
    })

})

const gotoCommunity = (token, url) => {
    const retURL = 'https://linkedin-customer-developer-edition.na85.force.com/css/s/'
    const community_url = url + '/secur/frontdoor.jsp?sid='+token+'&retURL='+retURL
    axios.post(community_url)
        .then(res => {
            console.log('---> community post res ' + JSON.stringify(res.data))
        })
        .then(data => {
            console.log('---> community post data ' + data)
        })
        .catch(err => {
            console.log('---> community error ' + err)
        })
}

app.get('/community', async (req, res, next) => {

    //ensure session is active
    const session = await getSession(req, res)
    if(session == null) {
        return
    }
    console.log('---> session ', session)
    //query
    const conn = await resumeSalesforceConnection(session)
    const response = gotoCommunity(conn.accessToken, conn.instanceUrl)
    console.log(response)
    //res.send(response)
    // const url = conn.instanceUrl + '/secur/frontdoor.jsp?sid=' + conn.accessToken + '&retURL=https://linkedin-customer-developer-edition.na85.force.com/css/s/'
    // res.redirect('https://linkedin-customer-developer-edition.na85.force.com/css/s/')

})

app.get('/query', async (req, res, next) => {
    //ensure session is active
    const session = await getSession(req, res)
    if(session == null) {
        return
    }
    console.log('---> session ', session)
    //query
    const conn = await resumeSalesforceConnection(session)
    console.log('---> conn ', conn)
    const query = 'SELECT Id FROM Account LIMIT 2'
    await conn.query(query, (error, result) => {
        if(error) {
            console.error('salesforce data api error ' + JSON.stringify(error))
            return
        }else{
            console.log('---> result ', result)
            res.send(result)
        }

    })

})

app.get('/auth/logout', async (req, res, next) => {
    const session = await getSession(req, res)
    if(session == null) {
        return
    }
    const conn = await resumeSalesforceConnection(session)
    await conn.logout((error) => {
        if(error) {
            console.error(new Date() + '-> conn logout error -> ', JSON.stringify(error))
            return
        }
    })

    await session.destroy((error) => {
        if(error) {
            console.error(new Date() + '-> session destroy error -> ', JSON.stringify(error))
        }
    })

    return res.redirect('/index/html')

})

app.use(express.static(path.resolve(__dirname, '../client/build')))

app.get('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})




app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
