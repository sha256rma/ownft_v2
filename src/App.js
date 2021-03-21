import { useEffect, useState } from "react";
import { providers } from "ethers";
import { approveERC20, Decimal, Zora, constructBid } from "@zoralabs/zdk";
import axios from "axios";
import {
  AppBar,
  Tabs,
  Tab,
  GridList,
  GridListTile,
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
  const [bid, setBid] = useState({});
  const [address, setAddress] = useState("");
  const [signer, setSigner] = useState({});
  const [zora, setZora] = useState({});
  const [collectionData, setCollectionData] = useState([]);
  const [metadata, setMetadata] = useState({});

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

        // setAddress(await signer.getAddress());
        setSigner(signer);
        setZora(zora);
        console.log("ZORA: ", zora);
        console.log("address: ", address);
        setAddress("0x1ba919573d46464a24e636c8966b61e947e3ed25");
      })();
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);

  useEffect(() => {
    console.log("reached here 1");
    getAddressCollection(address)
      .then((res) => {
        console.log("reached here 2");
        console.log("RES: ", res.data.data);
        setCollectionData(res.data.data);
      })
      .catch((error) => {
        console.error("error while fetching address collection: ", error);
      });
  }, [address]);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const bidding = async () => {
    const dai = "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea";

    // grant approval
    await approveERC20(signer, dai, zora.marketAddress, MaxUint256);

    const decimal100 = Decimal.new(100);

    const bid = constructBid(
      dai, // currency
      // Decimal.new(10).value, // amount 10*10^18
      decimal100.value, // amount 10*10^18
      "0x270Cb494f93E7d89A58AF505406400036251F762", // bidder address
      "0x270Cb494f93E7d89A58AF505406400036251F762", // recipient address (address to receive Media if bid is accepted)
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

  const fetchMetadata = async (metadataURI) => {
    var config_2 = {
      method: "get",
      url: metadataURI,
    };

    await axios(config_2)
      .then(function (response) {
        setMetadata(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const renderScreen = () => {
    if (tab === 0) {
      return renderCollection();
    } else if (tab === 1) {
      return renderCreate();
    }
  };

  const renderCollection = () => {
    if (collectionData) {
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
          {collectionData.map((nft) => {
            const { contentURI, metadataURI } = nft;
            return (
              <div
                style={{
                  height: 180,
                  width: 180,
                  margin: ".5%",
                  border: ".1px solid white",
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <GridListTile
                  onClick={() => {
                    fetchMetadata(metadataURI);
                    setItem(nft);
                    setOpen(true);
                  }}
                  key={contentURI}
                  cols={1}
                >
                  <img
                    style={{
                      height: 180,
                      width: 180,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://image.flaticon.com/icons/png/128/337/337946.png"; // some replacement image
                    }}
                    // {() =>
                    //   (contentURI =
                    //     "https://img.flaticon.com/icons/png/512/337/337946.png?size=1200x630f&pad=10,10,10,10&ext=png&bg=FFFFFFFF")
                    // }
                    src={contentURI}
                    alt={"content image"}
                  />
                </GridListTile>
              </div>
            );
          })}
        </GridList>
      );
    }
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
        <Box m={1} p={2} style={{ border: "1px solid white" }}>
          <Typography
            style={{
              marginBottom: 20,
              textAlign: "center",
              fontFamily: "Helvetica Neue",
            }}
            variant="h6"
          >
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
          <Typography
            style={{ marginBottom: 20, fontFamily: "Helvetica Neue" }}
            variant="h6"
          >
            Details
          </Typography>
          <Box
            p={2}
            style={{ backgroundColor: "white", border: "1px solid white" }}
          >
            <TextField
              style={{ marginRight: 10, fontFamily: "Helvetica Neue" }}
              value={name}
              onChange={(event) => setName(event.target.value)}
              id="name"
              label="Name"
              variant="outlined"
              color="secondary"
              autoComplete={false}
            />
            <TextField
              style={{ marginLeft: 10, fontFamily: "Helvetica Neue" }}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              id="description"
              label="Description"
              variant="outlined"
              color="secondary"
              autoComplete={false}
            />
            <TextField
              style={{ marginLeft: 20, fontFamily: "Helvetica Neue" }}
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              id="price"
              label="Creator Share Percentage"
              variant="outlined"
              color="secondary"
              autoComplete={false}
            />
          </Box>
          <Button
            onPress={() => console.log("create nft")}
            style={{
              marginTop: 30,
              width: "100%",
              fontFamily: "Helvetica Neue",
            }}
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
    const { contentURI, createdAtTimestamp, creator } = item;
    const { description, name } = metadata;
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
          <Typography
            variant="h5"
            style={{
              color: "white",
              marginBottom: 5,
              fontFamily: "Helvetica Neue",
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body1"
            style={{
              color: "white",
              marginBottom: 5,
              fontFamily: "Helvetica Neue",
            }}
          >
            Created By: {creator.id}
          </Typography>
          <Typography
            variant="caption"
            style={{ color: "white", fontFamily: "Helvetica Neue" }}
          >
            {timeConverter(createdAtTimestamp)}
          </Typography>

          <Box display="flex" style={{ marginTop: 20 }} flexDirection="row">
            <img
              style={{ height: 350, marginRight: 15 }}
              src={contentURI}
              alt={name}
            />
            <Box>
              <Typography
                variant="body1"
                style={{ color: "white", fontFamily: "Helvetica Neue" }}
              >
                Description
              </Typography>
              <Typography
                variant="caption"
                style={{ color: "white", fontFamily: "Helvetica Neue" }}
              >
                {description}
              </Typography>

              <Typography
                variant="body1"
                style={{
                  color: "white",
                  marginTop: 50,
                  fontFamily: "Helvetica Neue",
                }}
              >
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
                  <ListItem style={{ border: "1px solid white" }}>
                    <ListItemText
                      primary={
                        <Typography
                          style={{
                            color: "white",
                            fontFamily: "Helvetica Neue",
                          }}
                          variant="body2"
                        >
                          No bids currently :(
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Paper>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ marginTop: 30, padding: 10, backgroundColor: "black" }}
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
                  focused={true}
                  variant="filled"
                  color="secondary"
                />
                <Button
                  style={{
                    width: "60%",
                    height: 55,
                    marginLeft: 10,
                    marginTop: 7,
                    fontFamily: "Helvetica Neue",
                  }}
                  variant="contained"
                  color="secondary"
                  onClick={bidding}
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
      </AppBar>
      {/* <Button
        style={{ height: 40, width: "100%" }}
        variant="outlined"
        color="secondary"
        onClick={() => {
          // 0x78913e6a689233360dc828d6b618f01033e19dc7
          // 0x789e8dd02ffccd7a753b048559d4fbea1e1a1b7c
          setAddress("0x1ba919573d46464a24e636c8966b61e947e3ed25");
          console.log("address after setting: ", address);
        }}
      >
        get collection
      </Button> */}
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
