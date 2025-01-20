import Keycloak from "keycloak-js";

let options = {
    url: 'http://localhost:4884',
    realm: 'quickstart',
    clientId: 'test-cli',
    onLoad: 'check-sso',
    tokenStorage: 'sessionStorage'
}
const _kc = new Keycloak(options)

const initKeycloak = (onAuthenticatedCallback) => {
    _kc.init({ onLoad: options.onLoad })
        .then((authenticated) => {
            if (!authenticated) {
                console.log("user is not authenticated..!");
            }
            onAuthenticatedCallback();
        })
        .catch(console.error);
};


const doLogin = _kc.login;

const doLogout = _kc.logout;

const isLoggedIn = () => !!_kc.token;

// for access tokens - for recurring backend requests we need to store the bearer token somehow
const getToken = () => _kc.token;

const getTokenParsed = () => _kc.tokenParsed;

const updateToken = (successCallback) => { // from the http server (200)
    _kc.updateToken(5)
        .then(successCallback)
        .catch(doLogin)
}

const getUsername = () => _kc.tokenParsed?.preferred_username;

const getFirstName = () => _kc.tokenParsed?.given_name;

const getEMail = () => _kc.tokenParsed?.email;

const hasRole = (roles) => roles.some((role) => _kc.hasRealmRole(role));

const UserService = {
    initKeycloak,
    doLogin,
    doLogout,
    isLoggedIn,
    getToken,
    getTokenParsed,
    updateToken,
    getUsername,
    getFirstName,
    getEMail,
    hasRole,
};

export default UserService;