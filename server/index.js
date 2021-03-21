import express from "express";
import axios from "axios";
import fileUpload from "express-fileupload";
import ipfsClient from "ipfs-http-client";

const ipfs = ipfsClient();

const app = express();

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.post("/add", async (req, res) => {
  try {
    if (!req.files) {
      res.status(500).send({
        message: "no file uploaded",
      });
    } else {
      let nftfile = req.files.nftfile;
      const { cid } = await ipfs.add(nftfile.data);
      res.send({
        message: `Successfully added file to ipfs`,
        cidv1: cid.toV1().toString(),
        cidv0: cid.toV0().toString(),
      });
    }
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

app.post("/pin/:cid", async (req, res) => {
  try {
    const cid = new CID(req.params.cid);
    CID.validateCID(cid);

    await ipfs.pin.add(new CID(req.params.cid));
    res.send({ success: true });
  } catch (e) {
    res.status(500).send({ error: e });
  }
});

app.post("/get_user_collections", async (req, res) => {
  try {
    let addressInDoubleQuotes = req.query.address.replace(/'/g, '"');
    var data = JSON.stringify({
      query: `{
            user(id: "${addressInDoubleQuotes}") {
              id
              collection {
                id
                contentURI
                metadataURI
                createdAtTimestamp
                creator {
                    id
                }
              }
            }
          }`,
      variables: {},
    });

    var config = {
      method: "post",
      url: "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1",
      data: data,
    };

    await axios(config)
      .then(function (response) {
        response.data.data.user.collection.map((media) => {
          const { contentURI } = media;
          const maybeCid = new CID(contentURI.split("/").pop());
          try {
            CID.validateCID(maybeCid);
            ipfs.pin.add(maybeCid);
          } catch (e) {
            console.warn(`CID ${maybeCid} is not a valid CID`);
          }
        });
        res.send({
          message: "Successfully fetched & pinned NFTs",
          data: response.data.data.user.collection,
        });
      })
      .catch(function (error) {
        console.log("ERROR: ", error);
      });
  } catch (e) {
    console.log("something went bad", e);
    res.status(500).send({ error: e });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App is listening on port ${port}.`);
});
