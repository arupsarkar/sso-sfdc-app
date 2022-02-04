const express = require('express')
const path = require('path')
const jsforce = require('jsforce')
const session = require('express-session')
const cors = require('cors')
const PORT = process.env.PORT || 8080


require('dotenv').config()

console.log(process.env.loginUrl)

if(!process.env.loginUrl && !process.env.consumerkey){
    console.error('Cannot start app')
    process.exit(-1)
}

const oauth2 = new jsforce.OAuth2({
    loginUrl: process.env.loginUrl,
    clientId: process.env.consumerkey,
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
            cookie: {secure: process.env.isHttps === 'true'},
            resave: false,
            saveUninitialized: false
        }
    )
)

const getSession = (req, res) => {
    const session = req.session

}


app.get('/api', async (req, res, next) => {
    console.log('calling api endpoint')
    res.json({message: 'hello from server 2'})
})

app.get('/auth/login', async (req, res, next) => {
    console.log('calling oauth login')
    res.set('Access-Control-Allow-Origin', '*')
    res.redirect(oauth2.getAuthorizationUrl({scope: 'api web refresh_token'}))
})

app.get('/auth/callback', async (req, res, next) => {
    if(!req.query.code) {
        res.status(500).send('failed to get code from server callback')
        return
    }

    // authenticate with OAuth
    const conn = new jsforce.Connection({
        oauth2: oauth2,
        version: process.env.apiVersion
    })

    conn.authorize( req.query.code, (error, userInfo) => {
        if(error){
            console.log('salesforce auth error: ' + JSON.stringify(error))
            res.status(500).json(error)
            return
        }

        req.session.sfdcAuth = {
            instanceUrl: conn.instanceUrl,
            accessToken: conn.accessToken
        }

        return res.redirect('/index.html')
    })

})

app.use(express.static(path.resolve(__dirname, '../client/build')))

app.get('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})




app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
