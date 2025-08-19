import axios from "axios";
import FormData from "form-data";
import fetch from "node-fetch";

// Roblox creds
const API_KEY = process.env.ROBLOX_API_KEY;
const UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID; // example: "112748094619423"
const USER_ID = process.env.ROBLOX_USER_ID; // your user/group id

export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "Missing ?url param" });
    }

    // fetch the image bytes from external url
    const imgResp = await fetch(url);
    if (!imgResp.ok) throw new Error("Failed to fetch image");
    const buffer = Buffer.from(await imgResp.arrayBuffer());

    // metadata for Roblox
    const metadata = {
      assetType: "Decal",
      creationContext: {
        creator: { userId: USER_ID }
      },
      description: "Uploaded via API",
      displayName: "UploadedImage"
    };

    const form = new FormData();
    form.append("request", JSON.stringify(metadata), {
      contentType: "application/json"
    });
    form.append("fileContent", buffer, {
      filename: "upload.png",
      contentType: "image/png"
    });

    const headers = {
      "x-api-key": API_KEY,
      ...form.getHeaders()
    };

    // upload asset
    const response = await axios.post(
      `https://apis.roblox.com/assets/v1/assets?universeId=${UNIVERSE_ID}`,
      form,
      { headers }
    );

    const { operationId } = response.data;
    if (!operationId) {
      return res.status(500).json({ error: "Failed to get operationId", data: response.data });
    }

    // check status loop
    const statusUrl = `https://apis.roblox.com/assets/v1/operations/${operationId}`;
    let assetId = null;

    for (let i = 0; i < 20; i++) {
      const statusResp = await axios.get(statusUrl, { headers: { "x-api-key": API_KEY } });
      if (statusResp.data.done && statusResp.data.response?.assetId) {
        assetId = statusResp.data.response.assetId;
        break;
      }
      await new Promise(r => setTimeout(r, 2000));
    }

    if (!assetId) {
      return res.status(500).json({ error: "Asset creation timed out" });
    }

    // send back asset link
    return res.json({
      assetId,
      assetUrl: `https://www.roblox.com/library/${assetId}`
    });
  } catch (err) {
    console.error("Upload failed:", err.response?.data || err.message);
    return res.status(500).json({ error: "Upload failed", detail: err.message });
  }
}
