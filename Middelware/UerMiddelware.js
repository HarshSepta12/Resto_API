export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // console.log("🛡️ Token Header: ", authHeader); // 🧪 यह बताएगा token आ रहा है या नहीं

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied, token missing", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token", success: false });
  }
};
