import axios from "axios";

export const getAddressCollection = async (address) => {
  return await axios.post(
    `http://localhost:3000/get_user_collections?address=${address}`
  );
};
