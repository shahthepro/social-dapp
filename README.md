# social-dapp

## Running the DApp on local machine
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