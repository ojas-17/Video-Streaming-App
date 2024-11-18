import React, { useEffect } from 'react'
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import '@videojs/themes/dist/fantasy/index.css';
import '@videojs/themes/dist/forest/index.css';
import './CustomTheme.scss'

function VideoPlayer({ options, themename = "fantasy" }) {
  const videoRef = React.useRef(null);
  const playerRef = React.useRef(null);

  useEffect(() => {
    // Initialize the player only if it's not already initialized
    const videoElement = videoRef.current;
    if (!videoElement) return; // If the video element doesn't exist, exit
    videoRef.current.style.borderRadius = '10px'
    videoRef.current.style.aspectRatio = '16/9'
    videoRef.current.style.width = '100%'
    if (!playerRef.current) {
      playerRef.current = videojs(videoElement, options);
    } else {
      if(playerRef?.current?.src() !== options?.sources?.[0]?.src) {
        playerRef.current.src(options.sources[0].src)
      }
      // If player already exists, update the player options (e.g., video source)
      // playerRef.current.src(options.sources);
    }
    // playerRef.current.style.borderRadius = '10px'

    // return () => {
    //   if(player) {
    //     player.dispose()
    //     playerRef.current = null
    //   }
    // }
    // console.log(options.sources[0].src)

  }, [options, videoRef, playerRef]);


  return (
    <div data-vjs-player className='w-fit relative flex inline-box' style={{aspectRatio: 16/9}}>
      {/* <div className='absolute top-0 left-0 rounded-2xl w-full bg-white' style={{aspectRatio: 16/9}}></div> */}
      {
        options.sources[0].src && (
          <video ref={videoRef} className={`video-js w-full vjs-big-play-centered aspect-[16/9] outline-none border-none vjs-theme-${themename} w-full`} />
        )
      }
    </div>
  );
}

export default VideoPlayer