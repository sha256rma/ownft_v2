# ownft_v2

Self-hostable IPFS-backed data availability for NFTs, with a hardware wallet
component. Built at
[ETHGlobal NFTHACK 2021](https://hack.ethglobal.co/showcase/ownft-rec5dwI2zHRi0RAss).

Most NFTs point at media somebody else is hosting. ownft moves that storage onto
hardware you control: a Raspberry Pi pins your own media over IPFS, so the asset
stays available without depending on a third-party gateway staying up.

More projects: https://sha512rma.eth.limo/projects/

## Layout

- `contracts/`, `migrations/`: Solidity contracts, deployed with Truffle.
- `src/`: React front end for minting and viewing.
- `server/`: Node service backing the front end.
- `rpi/`: Raspberry Pi provisioning (`bootstrap.sh`, `ssh-cp.sh`).

## Run it

Front end:

```bash
npm install
npm start
```

Server:

```bash
cd server && npm install && npm start
```

Contracts:

```bash
npx truffle migrate
```

## Authors

Alex Matson ([alexmat2on](https://github.com/alexmat2on)),
Kartikeya Sharma ([sha256rma](https://github.com/sha256rma)),
Denny Liang ([denny999222](https://github.com/denny999222)),
Taehun Lim ([kevtae](https://github.com/kevtae))

## License

MIT. See [LICENSE](LICENSE).
