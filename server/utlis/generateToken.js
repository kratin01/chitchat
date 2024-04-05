import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  }); //jwt.sign will generate a token with the userId and the secret key and the expiration time of 15 days it is a payload of the token. payload is the data that we want to store in the token

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //15days
    httpOnly: true, //this will make sure that the cookie is only accessible by the client side javascript and prevent xss attack also called as cross site scripting attack
    sameSite: "strict", //this will make sure that the cookie is only sent in the same site that is in the same domain
    secure: process.env.NODE_ENV === "development" ? true : false,
  });
};

export default generateTokenAndSetCookie;
