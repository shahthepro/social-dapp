# social-dapp

## Running the DApp on local machine
### 0. Configuration
* Add `socialdapp.dev` to your `/etc/hosts` file as loopback address
* Generate SSL certificate:
```
$ cd server/security
$ openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```
* Disable StrictTransportSecurity in your browser. Eg: In firefox, change `network.stricttransportsecurity.preloadlist` value to `false` in `about:config`.
* Rename `sample.env` to `.env` and update values as necessary in both `server` and `client` directories

### 1. Compile and deploy contracts
```
$ truffle compile
$ truffle deploy
$ truffle migrate
```

### 2. Start redis
```
$ docker run -p 6379:6379 redis
```

### 3. Start server
```
$ cd server && yarn start
```

### 4. Start client
```
$ cd client && yarn start
```