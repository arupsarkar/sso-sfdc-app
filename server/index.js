const express = require('express')
const path = require('path')
const jsforce = require('jsforce')
const session = require('express-session')
const PORT = process.env.PORT || 8080


require('dotenv').config()

console.log(process.env.loginUrl)

if(!process.env.loginUrl && !process.env.consumerkey){
    console.error('Cannot start app')
    process.exit(-1)
}

const oauth2 = jsforce.OAuth2({
    loginUrl: process.env.loginUrl,
    clientId: process.env.consumerkey,
    clientSecret: process.env.consumerSecret,
    redirectUri: process.env.callbackUrl
})

const app = express()

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

app.use(express.static(path.resolve(__dirname, '../client/build')))
app.get('/api', async (req, res, next) => {
    console.log('calling api endpoint')
    res.json({message: 'hello from server 2'})
})
app.get('*', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
})


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
