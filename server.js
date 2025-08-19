import express from "express";
import axios from "axios";
import FormData from "form-data";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";

const app = express();
const PORT = process.env.PORT || 3000;

const ROBLOSECURITY = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_CAEaAhAB.67F7017038A1EB2177287C950DCFD04A06324AA25FCE3F3BC94E1D8A341B9F7592976195E6EF0FD7934AA88AAD119CADBE7EB2C4D9539230B21481DC30866E85514523A0BC67A5C3996800371893D87A074AC592CA37F7F94A9301E19FE639148DBD8839436538BAAF6593380EB4F9460D48D8AA979A1792268E68C5121C296765CC02C894A5C27BB6414D41A4B2F978189C2FCDD1DF918802BB9FFCAC45C85A7045EA117F4A63743F91570B8856DDD68BD70615CA42F0A7C742115E97179124AB14D5AC8708C57E9DEBE1268F8B4ED90541185F79840473C43C59122C617A4B707296430B0390D89F21D125722A09ABE37E17B0ED55D4C25F1D5C2A04B6588640D6634513FE3C892E7C2F44BE8E38DDE25505E0FCFB3D2A8B63A6E5BD78E29289FC1D161C027E57710735D2FEA3E1DC40D2DF95749FF5F619A160CE5720AFF53F6321D00A8CB4B523BC9A0025BE4563A17D8561E396F710F3C7F0BEBD2DD04AFFB4E90A52A7EA1FC2F1549A643E33E5FDDAAE6EAE70CB17F5663DBB237A558A9AB7179F500531098102CC279A6A5C58B9A8EDC94481A55D2A0231506DBFEF84F5984A95487101FBA78D7D02F5A728A791FC9B235D61F724F511F8CA866A10F8E9DBB454AEC48E4A67007144AE9C3C7CDD6F70993C3747F35DC269645E8AA030D626039149A1CE0C61831A80D712E1773876C3148EE20F6088F126D428B6281B4A9FD79A86D019841C2112D0544386A2CC9B1C11E58850FE117F00E6124624D6158D60471B54E0AE6219BE5274DA2CCD78B0A54DD658B360A7E1737201F9A2B7C5F4CCFD313BBC19F256F0FC5E39D61026C0DAC52DCE464547C3BA194AD99902FEB5D990A9A16E800C3F404D57481287DD676C9A5100ED031BEBC79AF212A605D9E8C11810B76B796CFBE75A76D8BB0870A5C7CF819B541916251573E16A2CAF093E390E08799607CFCDE4E43C03EE6CAC960F1E8B63320E66FF146017F5A6C520F241D6DF8B1AD0787DDD9004950AFFFB60B1B2E48B39F58153835C9C892EA5E93145F10AD74653A9BCB10C8BDCFB8D9487BF5A25CC1E2C3F6958380712C72FFB3EB031BF8E65FAA27DEA498C53FDFFF5B2DF03C4E27CED427D62252517050050E6ABB3AB7E3337A6F4DD2D1726CE3CE65568DFC5D00BFC826FAB282DEF9C4C5F206505A857A7BF76882955FE9421235B15EE6BA513AABDE54643A7238CB96B85BE6EF9";

const API_KEY = "IWmE9uQpT0a0xdJE/b5MVg7y2HXSOPX+soEO3bibW+I7jieOZXlKaGJHY2lPaUpTVXpJMU5pSXNJbXRwWkNJNkluTnBaeTB5TURJeExUQTNMVEV6VkRFNE9qVXhPalE1V2lJc0luUjVjQ0k2SWtwWFZDSjkuZXlKaVlYTmxRWEJwUzJWNUlqb2lTVmR0UlRsMVVYQlVNR0V3ZUdSS1JTOWlOVTFXWnpkNU1raFlVMDlRV0N0emIwVlBNMkpwWWxjclNUZHFhV1ZQSWl3aWIzZHVaWEpKWkNJNklqVTJPRFF4TkRNM016TWlMQ0poZFdRaU9pSlNiMkpzYjNoSmJuUmxjbTVoYkNJc0ltbHpjeUk2SWtOc2IzVmtRWFYwYUdWdWRHbGpZWFJwYjI1VFpYSjJhV05sSWl3aVpYaHdJam94TnpVMU5UWXpPRFUzTENKcFlYUWlPakUzTlRVMU5qQXlOVGNzSW01aVppSTZNVGMxTlRVMk1ESTFOMzAuWTRJMXI3cHlmV0VhZ2ZWVGo1aFZnNFBPMlQ2ejIyeXBQR2pFNHdSVVR4aExxanZraDdvSFlvWXlvcmFzOEhsYkdNRnR1SXhvM2pwNWxrS3JjaGF4TWtldzVQMVBIQkhPczBsbzU2LUhUMlNpWEhTOEREY3RsZktDRHh3bElQYmRidDdTdzZSWGdoSWxsZXFRRGVEd3ZLY084eDB1cV9DLUl2bWZnRDJOdkJZaHM2VHFUMWdiUlg3RTJ0U3ZHX0FYaWVtd1FPd2xyelJOYVE3S1RnaHVxZmhybFpOTzhsUEEzaDdxanZhVzRtb1ZWNE41TGswb1pYb2VDNzUtNVA5bm5mMkdmSnMwcEY5aDB1eDZ1OTB4LWhpdXllaDV5QVA2cE9UeGI1WUJsc05hRTFEUEhrUlgweERZbEg0cFlIZGVBOGZ4MllwdklZWkp2R1dHR1Rab3pn";
const UNIVERSE_ID = "112748094619423";
const USER_ID = "5684143733";

app.get("/api/main", async (req, res) => {
  try {
    const { prompt } = req.query;
    if (!prompt) return res.status(400).json({ error: "Missing ?prompt" });
    console.log("🔥 Prompt received:", prompt);

    // --- Step 1: base image ---
    const baseUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}_?&nologo=true&safe=true`;
    const fetchResp = await fetch(baseUrl);
    if (!fetchResp.ok) throw new Error("Failed to fetch base image");
    const imgBuffer = Buffer.from(await fetchResp.arrayBuffer());
    console.log("📦 Image fetched:", imgBuffer.length, "bytes");

    // --- Step 2: Upload to Roblox ---
    const metadata = {
      assetType: "Decal",
      creationContext: { creator: { userId: USER_ID } },
      description: `Generated: ${prompt}`,
      displayName: prompt
    };
    const robloxForm = new FormData();
    robloxForm.append("request", JSON.stringify(metadata), { contentType: "application/json" });
    robloxForm.append("fileContent", imgBuffer, { filename: "upload.png", contentType: "image/png" });
    const headers = { "x-api-key": API_KEY, ...robloxForm.getHeaders() };

    console.log("🚀 Uploading image to Roblox...");
    const uploadResp = await axios.post(
      `https://apis.roblox.com/assets/v1/assets?universeId=${UNIVERSE_ID}`,
      robloxForm,
      { headers }
    );
    const { operationId } = uploadResp.data;
    if (!operationId) return res.status(500).json({ error: "No operationId", data: uploadResp.data });

    // --- Step 3: Poll Roblox for assetId ---
    let assetId = null;
    for (let i = 0; i < 20; i++) {
      console.log(`🔄 Checking Roblox operation attempt ${i + 1}...`);
      const statusResp = await axios.get(
        `https://apis.roblox.com/assets/v1/operations/${operationId}`,
        { headers: { "x-api-key": API_KEY } }
      );
      if (statusResp.data.done && statusResp.data.response?.assetId) {
        assetId = statusResp.data.response.assetId;
        console.log("🎯 Asset ready! ID:", assetId);
        break;
      }
      await new Promise(r => setTimeout(r, 2000));
    }
    if (!assetId) return res.status(500).json({ error: "Asset creation timed out" });

    // --- Step 4: Launch browser and log in Roblox ---
    console.log("🤖 Launching browser (non-headless)...");
    const browser = await puppeteer.launch({ headless: true, defaultViewport: null });
    const page = await browser.newPage();
    await page.setCookie({ name: ".ROBLOSECURITY", value: ROBLOSECURITY, domain: ".roblox.com", httpOnly: true, secure: true });
    await page.goto("https://www.roblox.com", { waitUntil: "networkidle2" });
    await new Promise(r => setTimeout(r, 5000));
    console.log("✅ Logged in! Check the browser.");

    // --- Step 5: Fetch asset XML via Axios ---
    console.log("🌐 Fetching asset XML via Axios...");
    const xmlResp = await axios.get(
      `https://assetdelivery.roblox.com/v1/asset?id=${assetId}`,
      {
        headers: { Cookie: `.ROBLOSECURITY=${ROBLOSECURITY}` },
        responseType: "text"
      }
    );

    console.log("📄 Asset XML fetched, length:", xmlResp.data.length);

    // --- Step 6: Extract inner asset ID ---
    const match = xmlResp.data.match(/asset\/\?id=(\d+)/);
    const linkId = match ? match[1] : null;
    console.log("🔗 Extracted inner asset ID:", linkId);

    return res.json({ decalId: assetId, link: linkId });

  } catch (err) {
    console.error("💀 Main route failed:", err.response?.data || err.message);
    res.status(500).json({ error: "Main route failed", detail: err.message });
  }
});

app.listen(PORT, () => console.log(`🔥 Server running on http://localhost:${PORT}`));
