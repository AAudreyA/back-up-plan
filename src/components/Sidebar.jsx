export default function Sidebar({ playlist, setSelectedSong }) {
    return (
      <div className="sidebar flow-circular-regular">
        <h2>Playlist</h2>
        <ul>
          {playlist.map(song => (
            <li key={song.id} onClick={() => setSelectedSong(song)}>
              {song.title} - {song.artist}
            </li>
          ))}
        </ul>
      </div>
    );
  }