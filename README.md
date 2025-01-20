## auth-demo
a simple express-js and react frontend example to learn the concepts of the OAuth 2.0 authorization grant as per RFC 6749 

see https://datatracker.ietf.org/doc/html/rfc6749#section-1.3.1

## how to start
run ```docker-compose.yml -p auth_demo up -d```

create a new keycloak realm using this json 

https://github.com/keycloak/keycloak-quickstarts/blob/main/nodejs/resource-server/config/realm-import.json

**in keycloak:**

go to Realm Settings -> Keys -> RS256 (RSA, SIG) -> copy the public key and paste it into ./backend/server.js at line 30

go to ```localhost:3000```

use ```alice``` or ```admin``` as username and password

enjoy.

