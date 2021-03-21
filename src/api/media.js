import axios from "axios";

export const getAddressCollection = async (address) => {
  var data = JSON.stringify({
    query: `{
        user(id: ${address}) {
          id
          collection {
            id
            contentURI
            metadataURI
            ownerBidShare
            createdAtTimestamp
            currentAsk {
              id
            }
            currentBids {
              id
            }
          }
        }
      }`,
    variables: {},
  });

  //   var config = {
  //     method: "post",
  //     url: "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1",
  //     headers: {
  //       authtoken:
  //         "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYxMDgzMDRiYWRmNDc1MWIyMWUwNDQwNTQyMDZhNDFkOGZmMWNiYTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHlwZW1vYmlsZWFwcGxpY2F0aW9uLWRldmVsb3AiLCJhdWQiOiJkeXBlbW9iaWxlYXBwbGljYXRpb24tZGV2ZWxvcCIsImF1dGhfdGltZSI6MTYxMzA4MDc0MCwidXNlcl9pZCI6InFjMzZCOXFvZDJZY1R0YWhuTm5lVkQ5NThYZzEiLCJzdWIiOiJxYzM2Qjlxb2QyWWNUdGFobk5uZVZEOTU4WGcxIiwiaWF0IjoxNjEzMDgwOTgzLCJleHAiOjE2MTMwODQ1ODMsImVtYWlsIjoia2FydGlrZXlhc2hhcm1hMDRAZ21haWwuY29taGZoZmhmIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImthcnRpa2V5YXNoYXJtYTA0QGdtYWlsLmNvbWhmaGZoZiJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Maak575mnkwES43g3lzqbAmoQZLE-Hvl9h41ThpnHLbrurKEVY5jERwFpjP5wC0ziSGBhNiucJ1rN_xoJU_KOk_k3XtfvFmRqaiJ_Z5LooHyhLlITTltXNU2feXWJbVuFI3w1PHjU2fqhS5MrxrsCXRwaL1S8dP7_pXq_xE92P9oicVhx21F2nv6qZvvfplBkSAkVRQH5wtJyCXjrEoGYaLk0FT2kDgoIsxDJAdm-MIoNeG-FtwDzn5NlkW1W3DpswIifSUOAwjg5E4dbI4Tq1a-TB6hlmkL-LU7G0FQbJqK9AMpui_FUbfYmeANN-aVWL1CQbpZmbXbNTSkLHgKsQ",
  //       "Content-Type": "application/json",
  //       Cookie: "__cfduid=dfaafa2ebf7f38468b68f2ba8c390144d1616260114",
  //     },
  //     data: data,
  //   };

  return axios.post(
    "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1",
    { data },
    {
      headers: {
        authtoken:
          "eyJhbGciOiJSUzI1NiIsImtpZCI6IjYxMDgzMDRiYWRmNDc1MWIyMWUwNDQwNTQyMDZhNDFkOGZmMWNiYTgiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZHlwZW1vYmlsZWFwcGxpY2F0aW9uLWRldmVsb3AiLCJhdWQiOiJkeXBlbW9iaWxlYXBwbGljYXRpb24tZGV2ZWxvcCIsImF1dGhfdGltZSI6MTYxMzA4MDc0MCwidXNlcl9pZCI6InFjMzZCOXFvZDJZY1R0YWhuTm5lVkQ5NThYZzEiLCJzdWIiOiJxYzM2Qjlxb2QyWWNUdGFobk5uZVZEOTU4WGcxIiwiaWF0IjoxNjEzMDgwOTgzLCJleHAiOjE2MTMwODQ1ODMsImVtYWlsIjoia2FydGlrZXlhc2hhcm1hMDRAZ21haWwuY29taGZoZmhmIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImthcnRpa2V5YXNoYXJtYTA0QGdtYWlsLmNvbWhmaGZoZiJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.Maak575mnkwES43g3lzqbAmoQZLE-Hvl9h41ThpnHLbrurKEVY5jERwFpjP5wC0ziSGBhNiucJ1rN_xoJU_KOk_k3XtfvFmRqaiJ_Z5LooHyhLlITTltXNU2feXWJbVuFI3w1PHjU2fqhS5MrxrsCXRwaL1S8dP7_pXq_xE92P9oicVhx21F2nv6qZvvfplBkSAkVRQH5wtJyCXjrEoGYaLk0FT2kDgoIsxDJAdm-MIoNeG-FtwDzn5NlkW1W3DpswIifSUOAwjg5E4dbI4Tq1a-TB6hlmkL-LU7G0FQbJqK9AMpui_FUbfYmeANN-aVWL1CQbpZmbXbNTSkLHgKsQ",
      },
    }
  );
  //   await axios(config)
  //     .then(function (response) {
  //       console.log(JSON.stringify(response.data));
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
};
