import express from "express";
import { getAllPlaylists, getPlaylist, createPlaylist, updatePlaylist, deletePlaylist, removeProblemFromPlaylist } from "../controllers/playlist.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const playlistRouter = express.Router();

playlistRouter.get("/get-playlists", authMiddleware, getAllPlaylists);
playlistRouter.get("/get-playlist/:id", authMiddleware, getPlaylist);
playlistRouter.post("/create-playlist", authMiddleware, createPlaylist);
playlistRouter.put("/update-playlist/:id", authMiddleware, updatePlaylist);
playlistRouter.delete("/delete-playlist/:id", authMiddleware, deletePlaylist);
playlistRouter.delete("/:playlistId/remove-problem/:problemId", authMiddleware, removeProblemFromPlaylist);

export default playlistRouter;