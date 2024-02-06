//BuiltIn Imports
import { NextPage } from "next";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

//Internal Imports
import { Video } from "@/types";

//External Imports
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";
import { GoVerified } from "react-icons/go";

//Interface for assinging types to the props.
interface IProps {
  post: Video;
}

const VideoCard: NextPage<IProps> = ({ post }) => {
  //State for checking hover state on the video.
  const [isHover, setIsHover] = useState(false);

  //State for checking playing status of the video.
  const [playing, setPlaying] = useState(false);

  //State for checking volume status of the video.
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  //Video ref for connecting and to control video from buttons.
  const videoRef = useRef<HTMLVideoElement>(null);

  //function used to play and pause video.
  const onVideoPress = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  //Effect for changing volume status.
  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [isVideoMuted]);

  return (
    <div
      className="flex flex-col
     border-b-2 border-gray-200  pb-6  "
    >
      <div>
        <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
          <div className="md:w-16 md:h-16 w-10 h-10">
            <Link href={`/profile/${post.postedBy._id}`}>
              <>
                <Image
                  src={post.postedBy.image}
                  width={62}
                  height={62}
                  className="rounded-full"
                  alt="profile photo"
                />
              </>
            </Link>
          </div>
          <div>
            <Link href={`/profile/${post.postedBy._id}`}>
              <div
                className=" flex
                items-center gap-2"
              >
                <p className="flex gap-2 items-center md:text-md font-bold text-primary">
                  {post.postedBy.userName}{" "}
                  <GoVerified className="text-blue-400 text-md" />
                </p>
                <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">
                  {post.postedBy.userName}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="lg:ml-20 flex gap-4 relative  ">
        <div
          className={`rounded-3xl bg-black bg-opacity-5 `}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <Link href={`/detail/${post._id}`}>
            <video
              ref={videoRef}
              src={post.video.asset.url}
              loop
              className="lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px] w-[200px] rounded-2xl cursor-pointer py-1 lg:py-0  "
            ></video>
          </Link>
          {isHover && (
            <div className="absolute bottom-6 cursor-pointer left-8 md:left-14 lg:left-0  hidden md:flex gap-10 lg:justify-evenly w-[100px] md:w-full p-3">
              {playing ? (
                <button onClick={onVideoPress}>
                  <BsFillPauseFill className="text-[#3b48f7] text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={onVideoPress}>
                  <BsFillPlayFill className="text-[#3b48f7] text-2xl lg:text-4xl" />
                </button>
              )}
              {isVideoMuted ? (
                <button onClick={() => setIsVideoMuted(false)}>
                  <HiVolumeOff className="text-[#3b48f7] text-2xl lg:text-4xl" />
                </button>
              ) : (
                <button onClick={() => setIsVideoMuted(true)}>
                  <HiVolumeUp className="text-[#3b48f7] text-2xl lg:text-4xl" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
