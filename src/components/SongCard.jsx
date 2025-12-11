import Notes from "./Notes";

export default function SongCard({ song }) {
  if (!song) return null;

  return (
    <div className="song-card">
      <h2>{song?.title || "Unknown Title"}</h2>
      <p><strong>Artist:</strong> {song?.artist || "Unknown Artist"}</p>
      <p><strong>Release Date:</strong> {song?.releaseDate || "Unknown"}</p>

      {song?.preview ? (
        <audio controls src={song.preview}></audio>
      ) : (
        <p>No Preview Available</p>
      )}

      {/* Notes Component */}
      <Notes songId={song.id} />
    </div>
  );
}
