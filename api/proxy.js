export default async function handler(req, res) {
  try {
    const path = req.url.replace("/api/proxy", "");
    const url = "https://api.tempmail.lol" + path;

    const upstream = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": "application/json" }
    });

    const data = await upstream.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: "Proxy failed",
      details: err.message
    });
  }
}
