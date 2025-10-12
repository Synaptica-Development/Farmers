import React from "react";
import styles from "./FarmerVideo.module.scss";

interface FarmerVideoProps {
  videoLink: string;
}

const FarmerVideo = ({ videoLink }: FarmerVideoProps) => {
  if (!videoLink) return null;

 const embedUrl = videoLink
    .replace("watch?v=", "embed/")
    .replace("youtu.be/", "youtube.com/embed/");
  return (
    <div className={styles.videoWrapper}>
      <iframe
        width="560"
        height="320"
        src={embedUrl}
        title="Farmer Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default FarmerVideo;
