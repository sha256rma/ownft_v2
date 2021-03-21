import { useEffect, useState } from "react";
import { providers } from "ethers";
import {
  constructBidShares,
  constructMediaData,
  sha256FromBuffer,
  generateMetadata,
  approveERC20,
  signer,
  Decimal,
  Zora,
  constructBid,
} from "@zoralabs/zdk";

import {
  AppBar,
  Tabs,
  Tab,
  GridList,
  GridListTile,
  GridListTileBar,
  Button,
  TextField,
  Box,
  Typography,
  Modal,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";
import ImageUploader from "react-images-upload";

import "./App.css";
import getWeb3 from "./getWeb3";

import { MaxUint256 } from "@ethersproject/constants";

import { getAddressCollection } from "./api/media";

function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function App() {
  const [tab, setTab] = useState(0);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [balance, setBalance] = useState(null);
  // const [signer, setSigner] = useState({});
  const [bid, setBid] = useState({});
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState({});
  const [wallet, setWallet] = useState({});
  const [zora, setZora] = useState({});

  const [item, setItem] = useState({
    contentURI: "",
    createdAtTimestamp: "",
    creator: { id: "" },
    id: "",
    metadataURI: {
      description: "",
      mimeType: "",
      name: "",
      version: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [myBid, setMyBid] = useState(0);

  useEffect(() => {
    try {
      (async () => {
        // Get network provider and web3 instance.
        // const web3 = await getWeb3();
        // // Use web3 to get the user's accounts.
        // const accounts = await web3.eth.getAccounts();

        // // setAddress(getAccount[0]);

        // // const getBalance = await web3.eth.getBalance(getAccount[0]);

        // // setBalance(getBalance * 1e-18);

        // const provider = new providers.Web3Provider(window.ethereum);

        // const signer = provider.getSigner();

        // // setSigner(signer);

        // const myAddress = await signer.getAddress();

        // const zora = new Zora(signer, 4);

        // setAddress(myAddress);

        // console.log("add", address);

        // setZora(zora);

        // console.log("zora", zora);

        const web3 = await getWeb3();

        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();

        const provider = new providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        const myAddress = await signer.getAddress();

        console.log("add", myAddress);

        const zora = new Zora(signer, 4);

        setAddress(myAddress);
        setSigner(signer);
        setZora(zora);
        console.log(zora);
        console.log(address);
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

  const bidding = async () => {
    const dai = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";

    console.log(address);
    // grant approval
    await approveERC20(signer, dai, zora.marketAddress, MaxUint256);

    const decimal100 = Decimal.new(bid);

    const bid = constructBid(
      dai, // currency
      // Decimal.new(10).value, // amount 10*10^18
      decimal100.value, // amount 10*10^18
      address, // bidder address
      address, // recipient address (address to receive Media if bid is accepted)
      10 // sellOnShare
    );

    const tx = await zora.setBid(546, bid);
    await tx.wait(8); // 8 confirmations to finalize
    console.log(tx);
  };

  const acceptBid = async () => {
    const dai = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";

    console.log(address);
    // grant approval
    await approveERC20(signer, dai, zora.marketAddress, MaxUint256);

    const tx = await zora.acceptBid(546, bid);
    await tx.wait(8); // 8 confirmations to finalize
    console.log(tx);
  };

  const renderScreen = () => {
    if (tab === 0) {
      return renderCollection();
    } else if (tab === 1) {
      return renderCreate();
    }
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
          paddingBottom: 1000,
        }}
        cols={5}
      >
        {collectionData.data.user.collection.map((nft) => {
          const { contentURI, metadataURI } = nft;
          const { name } = metadataURI;
          return (
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
              <GridListTile
                onClick={() => {
                  setItem(nft);
                  setOpen(true);
                }}
                key={contentURI}
                cols={1}
              >
                <img
                  style={{ height: 180, width: "100%", borderRadius: 10 }}
                  src={contentURI}
                  alt={name}
                />
                <GridListTileBar title={name} />
              </GridListTile>
              <Button
                style={{ height: 40, width: "100%" }}
                variant="outlined"
                color="secondary"
              >
                Sell
              </Button>
            </div>
          );
        })}
      </GridList>
    );
  };

  const renderCreate = () => {
    return (
      <Box
        style={{
          flex: 1,
          height: 2000,
          backgoundColor: "white",
          paddingLeft: 150,
          paddingRight: 150,
        }}
      >
        <Typography style={{ marginBottom: 20, marginTop: 50 }} variant="h4">
          Create a collectible
        </Typography>
        <Box m={1} p={2} style={{ border: "1px solid white" }}>
          <Typography style={{ marginBottom: 20 }} variant="h6">
            Upload a File
          </Typography>
          <ImageUploader
            withPreview
            withIcon={true}
            singleImage
            buttonText="Upload File"
            onChange={(pictureFiles, pictureDataURLs) => setFiles(pictureFiles)}
            imgExtension={[".jpg", ".gif", ".png"]}
            maxFileSize={5242880}
          />
        </Box>

        <Box m={1} p={1} style={{ marginTop: 50 }}>
          <Typography style={{ marginBottom: 20 }} variant="h6">
            Details
          </Typography>
          <Box
            p={2}
            style={{ backgroundColor: "white", border: "1px solid white" }}
          >
            <TextField
              style={{ marginRight: 10 }}
              value={name}
              onChange={(event) => setName(event.target.value)}
              id="name"
              label="Name"
              variant="outlined"
              color="secondary"
            />
            <TextField
              style={{ marginRight: 10 }}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              id="description"
              label="Description"
              variant="outlined"
              color="secondary"
            />
            <TextField
              style={{ marginRight: 10 }}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              id="price"
              label="Price"
              variant="outlined"
              color="secondary"
            />
          </Box>
          <Button
            onPress={() => console.log("create nft")}
            style={{ marginTop: 30, width: "100%" }}
            variant="contained"
            color="secondary"
          >
            Create
          </Button>
        </Box>
      </Box>
    );
  };

  const renderModal = () => {
    console.log("itemmm", item);
    const { contentURI, createdAtTimestamp, creator, metadataURI } = item;
    const { description, name } = metadataURI;
    console.log("creator", creator);
    return (
      <Modal
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Box p={2} style={{ backgroundColor: "black" }}>
          <Typography variant="h5" style={{ color: "white", marginBottom: 5 }}>
            {name}
          </Typography>
          <Typography
            variant="body1"
            style={{ color: "white", marginBottom: 5 }}
          >
            Created By: {creator.id}
          </Typography>
          <Typography variant="caption" style={{ color: "white" }}>
            {timeConverter(createdAtTimestamp)}
          </Typography>

          <Box display="flex" style={{ marginTop: 20 }} flexDirection="row">
            <img
              style={{ height: 350, marginRight: 15 }}
              src={contentURI}
              alt={name}
            />
            <Box>
              <Typography variant="body1" style={{ color: "white" }}>
                Description
              </Typography>
              <Typography variant="caption" style={{ color: "white" }}>
                {description}
              </Typography>
              <div
                style={{
                  border: "1px solid white",
                  marginTop: 15,
                  marginBottom: 15,
                }}
              />
              <Typography variant="body1" style={{ color: "white" }}>
                Current Bids
              </Typography>
              <Paper
                style={{
                  maxHeight: 300,
                  overflow: "auto",
                  backgroundColor: "black",
                }}
              >
                <List style={{ color: "white" }}>
                  {[
                    {
                      price: 13.3,
                      bidder: "0x4153614ec1836e8916020aee69d67a9e1e495dbf",
                    },
                    {
                      price: 13.3,
                      bidder: "0x4153614ec1836e8916020aee69d67a9e1e495dbf",
                    },
                    {
                      price: 13.3,
                      bidder: "0x4153614ec1836e8916020aee69d67a9e1e495dbf",
                    },
                    {
                      price: 13.3,
                      bidder: "0x4153614ec1836e8916020aee69d67a9e1e495dbf",
                    },
                    {
                      price: 13.3,
                      bidder: "0x4153614ec1836e8916020aee69d67a9e1e495dbf",
                    },
                    {
                      price: 13.3,
                      bidder: "0x4153614ec1836e8916020aee69d67a9e1e495dbf",
                    },
                  ].map((bid) => {
                    return (
                      <ListItem style={{ border: "1px solid white" }}>
                        <ListItemText
                          primary={
                            <Typography
                              style={{ color: "white" }}
                              variant="body2"
                            >
                              {bid.price}
                            </Typography>
                          }
                          secondary={
                            <Typography
                              style={{ color: "white" }}
                              variant="caption"
                            >
                              {bid.bidder}
                            </Typography>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </Paper>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ padding: 10, backgroundColor: "white" }}
              >
                <TextField
                  style={{
                    marginTop: 10,
                    width: "40%",
                    backgroundColor: "white",
                  }}
                  value={myBid}
                  onChange={(event) => setMyBid(event.target.value)}
                  id="bidamount"
                  label="Bid Amount"
                  variant="outlined"
                  color="secondary"
                />
                <Button
                  style={{
                    width: "60%",
                    height: 55,
                    marginLeft: 10,
                    marginTop: 7,
                  }}
                  variant="contained"
                  color="secondary"
                >
                  Bid Now
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  };

  return (
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
            label="Create NFT"
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
            {/* <div className="address">Address: {address}</div> */}
            <div className="eth"> ETH: {balance} </div>
          </div>
        </div>
      </AppBar>
      {renderScreen()}

      {renderModal()}
    </div>
  );
}

export default App;

const collectionData = {
  data: {
    user: {
      collection: [
        {
          contentURI:
            "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
          createdAtTimestamp: "1616190458",
          creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
          id: "2335",
          metadataURI: {
            description:
              "CONTEXT: https://niallashley.com/gcheck/nAcrylic, oil stick and spray paint on NFT.",
            mimeType: "image/jpeg",
            name: "G-check",
            version: "zora-20210101",
          },
        },
        {
          contentURI:
            "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
          createdAtTimestamp: "1616190458",
          creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
          id: "2335",
          metadataURI: {
            description:
              "CONTEXT: https://niallashley.com/gcheck/nAcrylic, oil stick and spray paint on NFT.",
            mimeType: "image/jpeg",
            name: "G-check",
            version: "zora-20210101",
          },
        },
        {
          contentURI:
            "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
          createdAtTimestamp: "1616190458",
          creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
          id: "2335",
          metadataURI: {
            description:
              "CONTEXT: https://niallashley.com/gcheck/nAcrylic, oil stick and spray paint on NFT.",
            mimeType: "image/jpeg",
            name: "G-check",
            version: "zora-20210101",
          },
        },
        {
          contentURI:
            "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
          createdAtTimestamp: "1616190458",
          creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
          id: "2335",
          metadataURI: {
            description:
              "CONTEXT: https://niallashley.com/gcheck/nAcrylic, oil stick and spray paint on NFT.",
            mimeType: "image/jpeg",
            name: "G-check",
            version: "zora-20210101",
          },
        },
        {
          contentURI:
            "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
          createdAtTimestamp: "1616190458",
          creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
          id: "2335",
          metadataURI: {
            description:
              "CONTEXT: https://niallashley.com/gcheck/nAcrylic, oil stick and spray paint on NFT.",
            mimeType: "image/jpeg",
            name: "G-check",
            version: "zora-20210101",
          },
        },
        {
          contentURI:
            "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
          createdAtTimestamp: "1616190458",
          creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
          id: "2335",
          metadataURI: {
            description:
              "CONTEXT: https://niallashley.com/gcheck/nAcrylic, oil stick and spray paint on NFT.",
            mimeType: "image/jpeg",
            name: "G-check",
            version: "zora-20210101",
          },
        },
        {
          contentURI:
            "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
          createdAtTimestamp: "1616190458",
          creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
          id: "2335",
          metadataURI: {
            description:
              "CONTEXT: https://niallashley.com/gcheck/nAcrylic, oil stick and spray paint on NFT.",
            mimeType: "image/jpeg",
            name: "G-check",
            version: "zora-20210101",
          },
        },
        {
          contentURI:
            "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
          createdAtTimestamp: "1616190458",
          creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
          id: "2335",
          metadataURI: {
            description:
              "CONTEXT: https://niallashley.com/gcheck/nAcrylic, oil stick and spray paint on NFT.",
            mimeType: "image/jpeg",
            name: "G-check",
            version: "zora-20210101",
          },
        },
        {
          contentURI:
            "https://ipfs.fleek.co/ipfs/bafybeiflgb6o7m6hyj7qethlsjmkzmorug2bwkeglrf3qexl54mgz2dmbe",
          createdAtTimestamp: "1616190458",
          creator: { id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf" },
          id: "2335",
          metadataURI: {
            description:
              "CONTEXT: https://niallashley.com/gcheck/nAcrylic, oil stick and spray paint on NFT.",
            mimeType: "image/jpeg",
            name: "G-check",
            version: "zora-20210101",
          },
        },
      ],
      id: "0x4153614ec1836e8916020aee69d67a9e1e495dbf",
    },
  },
};

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
