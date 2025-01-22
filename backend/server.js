const express = require('express');
const session = require('express-session');
const Keycloak = require('keycloak-connect');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const port = 2311;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const memoryStore = new session.MemoryStore();

app.use(
    session({
        secret: 'mySecret',
        resave: false,
        saveUninitialized: true,
        httpOnly: true
    })
);

const kcConfig = {
    clientId: 'test-cli',
    bearerOnly: true,
    serverUrl: 'http://localhost:4884',
    realm: 'quickstart',
    realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvJlGdFmatD/+DFLtRQGL3nME2E9hlsAL2FmUPcw9Wigx0se3wDZ4A1HysQXk84sulNrSY6sa/0TIfmQdoqeaawZticI4TenuninV+Mn5vMIiHiJuOb9EMl2Y3Dzsi6dQuJvFBa0evARjfCgFdNCG6KRIuItckcN9tehmheoYEBJtEjKygnXhkQkih64C3CrWBH+ebQjOZGCiXH3h14nv1jhTRR98zViJKPbmrZyEbqVP7diFXhHPyE9suOiTwk3quG+0caxgYj9+/j4jyrZ7Q3CNurzsPypcbhgRcu2vPn2pSXB7H81knhDlTbWqLZquyy/flmblGW/h2qOXxHHsHQIDAQAB'
};


const keycloak = new Keycloak({ store: memoryStore }, kcConfig);

app.use(keycloak.middleware());

app.get('/', (req, res) => {
    res.send('Welcome to the public route. No authentication required.');
});

app.get('/login', (req, res) => {
    res.redirect('/protected');
});


app.get('/protected', keycloak.protect(), (req, res) => {
    const userId = req.kauth.grant.access_token.content.sub
    console.log(userId)
    res.status(200).json({
        message: "Access granted to protected resource",
        user: {
            id: 1,
            name: "John Doe",
            email: "johndoe@example.com",
            role: "admin",
            permissions: ["read", "write", "delete"],
            last_login: "2023-07-18T10:30:45Z"
        },
        protected_data: {
            documents: [
                {
                    id: 1001,
                    title: "Confidential Report",
                    category: "Finance",
                    last_modified: "2023-06-12T09:00:00Z"
                },
                {
                    id: 1002,
                    title: "Employee Handbook",
                    category: "HR",
                    last_modified: "2023-05-05T15:30:00Z"
                }
            ],
            api_keys: [
                {
                    key_id: "AK123456789",
                    status: "active",
                    created_at: "2023-04-01T12:00:00Z"
                },
                {
                    key_id: "AK987654321",
                    status: "revoked",
                    created_at: "2023-01-15T08:00:00Z"
                }
            ]
        }
    });
});

app.get('/admin', keycloak.protect('realm:admin'), (req, res) => {
    res.send('Welcome, Admin! You have the correct role.');
});

app.get('/callback', keycloak.protect(), (req, res) => {
    res.redirect('/protected')
})

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            res.status(500).send('Error logging out.');
        } else {
            res.redirect('http://localhost:4884/realms/demo/protocol/openid-connect/logout?redirect_uri=http://localhost:2311');
        }
    });
});

app.use('*', (req, res) => {
    res.send('Not found!');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
