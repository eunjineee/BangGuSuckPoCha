import AudioPlayer from "react-h5-audio-player";

const Player = ({player} : {player: any}) => {
  const pochaBGM = "Talk1.mp3";

  return (
    <AudioPlayer
      ref={player}
      autoPlay={true}
      src={`/RoomBGM/${pochaBGM}`}
      loop
      onPlay={(e) => console.log("onPlay")}
      style={{ display: "none" }}
      volume={0.2}
      // other props here
    />
  )
};

export default Player;