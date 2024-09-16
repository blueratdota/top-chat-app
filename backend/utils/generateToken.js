import jwt from "jsonwebtoken";

const genToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
  console.log(token);

  res.cookie("jwt", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV !== "development",
    sameSite: process.env.SAME_SITE,
    maxAge: 1000 * 60 * 60 * 24 * 30
  });

  // console.log("decrpyt", jwt.verify(token, process.env.JWT_SECRET));
};

export { genToken };
