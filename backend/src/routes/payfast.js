import express from "express";
import { generatePayfastSignature } from "../utils/payfast.js";

const router = express.Router();

router.post("/create-payment", async (req, res) => {
  try {
    const {
      childName,
      parentName,
      parentEmail,
      parentPhone,
      packageName,
      amount,
    } = req.body;

    if (!childName || !parentName || !parentEmail || !packageName || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1) Create an enrollment/order in your DB here (status: pending)
    // const enrollment = await Enrollment.create({ ... });

    const orderId = `ENR-${Date.now()}`; // replace with DB id

    const mode = process.env.PAYFAST_MODE || "sandbox";
    const payfastUrl =
      mode === "sandbox"
        ? "https://sandbox.payfast.co.za/eng/process"
        : "https://www.payfast.co.za/eng/process";

    const data = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID,
      merchant_key: process.env.PAYFAST_MERCHANT_KEY,
      return_url: `${process.env.APP_BASE_URL}/payment/success?orderId=${orderId}`,
      cancel_url: `${process.env.APP_BASE_URL}/payment/cancel?orderId=${orderId}`,
      notify_url: `${process.env.API_BASE_URL}/api/payfast/itn`, // must be public for live

      name_first: parentName,
      email_address: parentEmail,

      m_payment_id: orderId,
      amount: Number(amount).toFixed(2),
      item_name: `Flaviction Enrollment - ${packageName}`,
      item_description: `Child: ${childName} | Phone: ${parentPhone || "n/a"}`,
    };

    const signature = generatePayfastSignature(data, process.env.PAYFAST_PASSPHRASE);

    return res.json({ payfastUrl, fields: { ...data, signature } });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create payment", error: err.message });
  }
});

router.post("/itn", express.urlencoded({ extended: false }), async (req, res) => {
  
  try {
    const itnData = req.body;

    // 1) Validate signature (basic integrity check)
    const receivedSig = itnData.signature;
    const { signature, ...dataWithoutSig } = itnData;

    const expectedSig = generatePayfastSignature(dataWithoutSig, process.env.PAYFAST_PASSPHRASE);

    if (receivedSig !== expectedSig) {
      // Still respond 200 to avoid retries storm, but do not mark paid
      return res.status(200).send("OK");
    }

    // 2) OPTIONAL but recommended: "valid data" check + source IP checks
    // PayFast support: security check fails if notify_url doesn't respond 200
    // or the valid-data check fails. :contentReference[oaicite:6]{index=6}

    // 3) Update your DB using m_payment_id
    // if (itnData.payment_status === "COMPLETE") { mark paid }
    // await Enrollment.updateOne({ orderId: itnData.m_payment_id }, { status: "paid", itn: itnData });

    return res.status(200).send("OK");
  } catch (err) {
    return res.status(200).send("OK");
  }
});

export default router;
