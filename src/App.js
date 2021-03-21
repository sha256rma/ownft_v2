import { useEffect, useState } from "react";
import { Zora } from "@zoralabs/zdk";
import { providers } from "ethers";
import {
  constructBidShares,
  constructMediaData,
  sha256FromBuffer,
  generateMetadata,
} from "@zoralabs/zdk";

import {
  AppBar,
  Tabs,
  Tab,
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
} from "@material-ui/core";

import "./App.css";
import getWeb3 from "./getWeb3";

import { getAddressCollection } from "./api/media";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const [tab, setTab] = useState(0);
  const [address, setAddress] = useState("0x");
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    try {
      (async () => {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        // Use web3 to get the user's accounts.
        const getAccount = await web3.eth.getAccounts();

        setAddress(getAccount[0]);

        const getBalance = await web3.eth.getBalance(getAccount[0]);

        setBalance(getBalance * 1e-18);

        const provider = new providers.Web3Provider(window.ethereum);

        console.log(provider);

        const zora = new Zora(provider, 4);

        console.log("zora", zora);
      })();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const renderScreen = () => {
    if (tab === 0) {
      return renderCollection();
    } else if (tab === 1) {
      return renderMarketplace();
    }
  };

  const renderMarketplace = () => {
    return (
      <GridList
        cellHeight={300}
        style={{ height: "100%", width: "100%", backgroundColor: "black" }}
        cols={5}
      >
        {marketplaceData.map((nft) => (
          <GridListTile
            style={{
              height: 300,
              width: "19%",
              margin: ".5%",
              border: "0.5px solid white",
              borderRadius: 10,
              padding: 10,
            }}
            key={nft.img}
            cols={1}
          >
            <img
              style={{ height: 180, width: "100%", borderRadius: 10 }}
              src={nft.image}
              alt={nft.name}
            />
            <Button variant="outlined" color="primary">
              Purchase
            </Button>
            <GridListTileBar
              style={{ height: 40 }}
              title={nft.name}
              subtitle={`${nft.cost} ETH`}
            />
          </GridListTile>
        ))}
      </GridList>
    );
  };

  const renderCollection = () => {
    return (
      <GridList
        cellHeight={300}
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
        cols={5}
      >
        {marketplaceData.map((nft) => (
          <div
            style={{
              height: 220,
              width: "17%",
              margin: ".5%",
              border: ".2px solid white",
              borderRadius: 10,
              padding: 10,
            }}
          >
            <GridListTile key={nft.img} cols={1}>
              <img
                style={{ height: 180, width: "100%", borderRadius: 10 }}
                src={nft.image}
                alt={nft.name}
              />
              <GridListTileBar title={nft.name} />
            </GridListTile>
            <Button
              style={{ height: 40, width: "100%" }}
              variant="outlined"
              color="secondary"
            >
              Sell
            </Button>
          </div>
        ))}
      </GridList>
    );
  };

  const getCollection = () => {
    getAddressCollection("0x4153614ec1836e8916020aee69d67a9e1e495dbf").then(
      (res) => {
        console.log("res: ", res);
      }
    );
  };

  return (
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <button onClick={minting}>Mint cryptomedia</button>
    //     <button onClick={getCollection}>Get Collection</button>
    //   </header>
    <div className="App">
      <AppBar
        style={{
          backgroundColor: "black",
          paddingBottom: 40,
          paddingTop: 40,
          alignItems: "center",
          justifyContent: "center",
        }}
        position="static"
      >
        <Tabs value={tab} style={{}} onChange={handleChange} aria-label="Tabs">
          <Tab
            style={{
              fontSize: 24,
              marginRight: 20,
              fontFamily: "Helvetica Neue",
            }}
            label="My Collection"
            {...a11yProps(0)}
          />
          <Tab
            style={{
              fontSize: 24,
              marginLeft: 20,
              fontFamily: "Helvetica Neue",
            }}
            label="Marketplace"
            {...a11yProps(1)}
          />
        </Tabs>
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            textAlign: "right",
          }}
        >
          {/* <i className="material-icons">account_balance_wallet</i> */}

          <div className="myAccountBox">
            <div className="address">Address: {address}</div>
            <div className="eth"> ETH: {balance} </div>
          </div>
        </div>
      </AppBar>
      {renderScreen()}
    </div>
  );
}

export default App;

const collectionData = [];

const marketplaceData = [
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://deepart-io.s3.amazonaws.com/cache/60/9b/609babec66cdce0c1a6fefc69db84099.jpg",
    name: "Faceless Puzzle",
    cost: 0.56,
  },
  {
    data: {
      user: {
        collection: [
          {
            contentURI:
              "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
            createdAtTimestamp: "1616190458",
            creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
            id: "2335",
            metadataURI:
              "https://ipfs.fleek.co/ipfs/bafybeidh3ulflblijfokbajig54sntinymboufmhnkf5rzr45zaejg4maa",
          },
        ],
        id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf",
      },
    },
  },

  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image: "https://nwn.blogs.com/.a/6a00d8341bf74053ef022ad3bc5b52200d-600wi",
    name: "Deep Trip",
    cost: 100.56,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://pbs.twimg.com/profile_images/665598894626070528/7nxQxc6s_400x400.png",
    name: "Wave Runner",
    cost: 20.3,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image: "https://i.ytimg.com/vi/olj6rktnr40/maxresdefault.jpg",
    name: "E=mc^2",
    cost: 0.23,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://c4.wallpaperflare.com/wallpaper/829/227/702/cat-artwork-eyes-deep-art-wallpaper-preview.jpg",
    name: "Hopeless Cat",
    cost: 0.59,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://render.fineartamerica.com/images/rendered/search/print/5.5/8/break/images/artworkimages/medium/1/imagination-soosh.jpg",
    name: "Unemployed Santa",
    cost: 5.99,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://res.cloudinary.com/cook-becker/image/fetch/q_auto:best,f_auto,w_1920,e_sharpen/https://candb.com/site/candb/images/artwork/cathedral-of-the-deep-dark-souls-3-from-software.jpg",
    name: "Cracks in the wall",
    cost: 7.22,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://lh3.googleusercontent.com/proxy/dOBcmmJSne8Y3usggR9VfPObb5HpeGkzVX8VD9dg9xP9qMgmvvANWAxDiTd7W2O7Qbla-ThfuT_thEm8sIuV1xRBFCPjyiwjWzjxvz9M-sLe-ringQHPXldkCEI3qxkORB00c22MRU_Lfv3Zi3i0paro6bG-SOCL9vg9",
    name: "Siren's Lust",
    cost: 512.34,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://i.etsystatic.com/9170597/r/il/d3ccd3/564403805/il_570xN.564403805_771l.jpg",
    name: "Predator",
    cost: 1.23,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://artist.com/photos/arts/big/deep-conversation-1494857212.jpg",
    name: "Beneath it all",
    cost: 3.21,
  },
  {
    ownerAddress: "0x4d4f3a34293fe7d32974fdde1248e8b6f52bdc66",
    ownerUsername: "OArts.it",
    creatorAddress: "0xd387a6e4e84a6c86bd90c158c6028a58cc8ac459",
    creatorUsername: "Pranksy",
    collectionAddress: "0xd07dc4262bcdbf85190c01c996b4c06a461d2430",
    collectionUsername: "Rarible",
    image:
      "https://i.pinimg.com/originals/d2/fc/c7/d2fcc7580f641b5fdf2a854b937f1902.jpg",
    name: "Back in my day",
    cost: 4.56,
  },
];
