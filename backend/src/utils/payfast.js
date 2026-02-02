import crypto from "crypto";

export function generatePayfastSignature(data, passphrase = "") {

  // PayFast signature = MD5(queryString + passphrase)
  // Important: use the exact fields you send to PayFast.
  const keys = Object.keys(data)
    .filter((k) => data[k] !== undefined && data[k] !== null && data[k] !== "")
    .sort();

  const query = keys
    .map((k) => `${k}=${encodeURIComponent(String(data[k]).trim()).replace(/%20/g, "+")}`)
    .join("&");

  const sigString = passphrase ? `${query}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}` : query;

  return crypto.createHash("md5").update(sigString).digest("hex");
}
