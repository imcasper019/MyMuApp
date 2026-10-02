const express = require("express");
const yts = require("yt-search");
const { spawn } = require("child_process");

const app = express();

app.use(express.static("public"));

app.get("/search", async (req, res) => {
  try {

    const q = req.query.q;

    const result = await yts(q);

    const songs = result.videos.slice(0, 20).map((v) => ({
      title: v.title,
      artist: v.author.name,
      thumbnail: v.thumbnail,
      videoId: v.videoId,
      duration: v.timestamp
    }));

    res.json(songs);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Search failed"
    });
  }
});

app.get("/stream/:id", async (req, res) => {
  try {

    const id = req.params.id;

    const url = `https://www.youtube.com/watch?v=${id}`;

    res.setHeader("Content-Type", "audio/mp4");

    const yt = spawn("yt-dlp", [
      "-f",
      "bestaudio",
      "-o",
      "-",
      url
    ]);

    yt.stdout.pipe(res);

    yt.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    yt.on("close", () => {
      res.end();
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Audio error");
  }
});

app.listen(3001, () => {
  console.log("Server running on http://MyMuApp");
});
