import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Notes({ songId }) {
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function loadNote() {
      const user = auth.currentUser;
      if (!user || !songId) return;

      const ref = doc(db, "users", user.uid, "notes", String(songId));

      try {
        const snap = await getDoc(ref);
        setNote(snap.exists() ? snap.data().text || "" : "");
      } catch (err) {
        console.error("Load error:", err);
      }
    }

    loadNote();
  }, [songId]);

  async function saveNote() {
    const user = auth.currentUser;
    if (!user || !songId) {
      setStatus("You must be logged in to save notes.");
      return;
    }
  
    try {
      // Save the note in the user's notes collection
      await setDoc(doc(db, "users", user.uid, "notes", String(songId)), {
        text: note,
        updatedAt: new Date()
      });
  
      // Now update the playlist to include this song (or its updated note)
      const playlistRef = doc(db, "users", user.uid);
      const playlistSnap = await getDoc(playlistRef);
  
      let playlist = [];
      if (playlistSnap.exists()) {
        playlist = playlistSnap.data().playlist || [];
      }
  
      // Check if the song is already in the playlist
      const songIndex = playlist.findIndex((s) => s.id === songId);
  
      if (songIndex >= 0) {
        // Update existing song entry with note
        playlist[songIndex] = { ...playlist[songIndex], note };
      } else {
        // Add a new entry for this song with just the note
        playlist.push({ id: songId, title: "Unknown", artist: "Unknown", note });
      }
  
      // Save the updated playlist
      await setDoc(playlistRef, { playlist }, { merge: true });
  
      setStatus("Note saved and playlist updated!");
    } catch (err) {
      console.error("Failed to save note:", err);
      setStatus("Failed to save note.");
    }
  }
  

  return (
    <div className="notes-section flow-circular-regular">
      <h3>Notes</h3>
      <textarea
        className="text_area"
        value={note}
        placeholder="Write your thoughts on this track..."
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="btn" onClick={saveNote}>Save</button>
      {status && <p style={{ color: "green" }}>{status}</p>}
    </div>
  );
}
