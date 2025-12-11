import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

import Sidebar from "../components/Sidebar";
import SearchBar from "../components/Searchbar";
import SongCard from "../components/SongCard";
import Notes from "../components/Notes";
import "../App.css"

export default function Home() {
  const [playlist, setPlaylist] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);

  // Load playlist on login
  useEffect(() => {
    async function loadPlaylist() {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setPlaylist(snap.data().playlist || []);
        }
      } catch (err) {
        console.error("Failed to load playlist:", err);
      }
    }
    loadPlaylist();
  }, []);

  // Save playlist when changed
  useEffect(() => {
    async function savePlaylist() {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const ref = doc(db, "users", user.uid);

        const normalizedPlaylist = playlist.map(s => ({
            id: s.id,
            title: s.title || "",
            artist: s.artist || "",
            preview: s.preview || "",
            releaseDate: s.releaseDate || ""
          }));
          
        await setDoc(ref, { playlist: normalizedPlaylist }, { merge: true });
          
      } catch (err) {
        console.error("Failed to save playlist:", err);
      }
    }

    if (playlist.length > 0) {
        savePlaylist();
      }
  }, [playlist]);

  // Add song from Deezer API
  function handleAddSong(apiSong) {
    const song = {
      id: apiSong.id,
      title: apiSong.title,
      artist: apiSong.artist?.name ?? "",
      preview: apiSong.preview,
      releaseDate: (apiSong.release_date || apiSong.album?.release_date) ?? ""
    };

    if (!playlist.find((s) => s.id === song.id)) {
      setPlaylist([...playlist, song]);
    }

    setSelectedSong(song);
  }

  return (
    <div className="app-container">

  {/* LEFT SIDEBAR */}
  <Sidebar
    playlist={playlist}
    setSelectedSong={setSelectedSong}
  />

  {/* SEARCH PANEL */}
  <div className="search-panel">
        <SearchBar onSelect={handleAddSong} />
    </div>

  {/* MAIN CONTENT */}
  <main className="main">
    <div className="header">
      <h1>My Music Journal</h1>
      <button className="btn" onClick={() => signOut(auth)}>Logout</button>
    </div>

    {selectedSong && (
      <>
        <SongCard song={selectedSong} />
      </>
    )}
  </main>
</div>
  );
}
