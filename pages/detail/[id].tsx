//BuiltIn imports
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Head from "next/head";

//Internal imports
import useAuthStore from "@/store/authStore";
import Comments from "@/components/Comments";
import LikeButton from "@/components/LikeButton";
import { BASE_URL } from "@/utils";
import { Video } from "@/types";

//External imports
import { BsFillPlayFill } from "react-icons/bs";
import axios from "axios";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import { GoVerified } from "react-icons/go";

//Interface for type assigning to the props.
interface IProps {
  postDetails: Video;
}

const Detail = ({ postDetails }: IProps) => {
  //getting userProfile for authenticating user.
  const { userProfile }: any = useAuthStore();

  //State for setting received video in the video component.
  const [post, setPost] = useState(postDetails);

  //State for checking playing status of the video.
  const [playing, setPlaying] = useState(false);

  //State for checking volume status of the video.
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  //State for giving comment as a prop in Comment component.
  const [comment, setComment] = useState("");

  //State for checking posting status.
  const [isPostingComment, setIsPostingComment] = useState(false);

  //ref used to connect and control video from buttons.
  const videoRef = useRef<HTMLVideoElement>(null);

  //Router used in Back button to move on previous page.
  const router = useRouter();

  //function for adding comment.
  const addComment = async (e: any) => {
    e.preventDefault();
    if (userProfile && comment) {
      setIsPostingComment(true);
      const { data } = await axios.put(`${BASE_URL}/api/post/${post._id}`, {
        userId: userProfile._id,
        comment,
      });

      setPost({ ...post, comments: data.comments });
      setComment("");
      setIsPostingComment(false);
    }
  };

  //function for play/pause video onClick.
  const onVideoClick = () => {
    if (playing) {
      videoRef?.current?.pause();
      setPlaying(false);
    } else {
      videoRef?.current?.play();
      setPlaying(true);
    }
  };

  //effect for mute/unmute volume of the video.
  useEffect(() => {
    if (post && videoRef?.current) {
      videoRef.current.muted = isVideoMuted;
    }
  }, [post, isVideoMuted]);

  //handle function for liking videos
  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const { data } = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like,
      });
      setPost({ ...post, likes: data.likes });
    }
  };

  //if fetching postDetails failed return nothing.
  if (!post) return null;

  return (
    <div className="flex w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap z-20">
      <Head>
        <title>TIKTIK - {postDetails.caption} </title>
      </Head>
      <div className="relative flex-2 w-full lg:w-9/12 flex justify-center items-center bg-blurred-img bg-no-repeat bg-cover bg-center">
        <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
          <p className="cursor-pointer" onClick={() => router.back()}>
            <AiOutlineArrowLeft className="text-white text-[35px] hover:text-[#3b48f7]" />
          </p>
        </div>
        <div className="relative">
          <div className="lg:h-[100vh] h-[60vh]">
            <video
              ref={videoRef}
              loop
              onClick={onVideoClick}
              src={post.video.asset.url}
              className="h-full cursor-pointer"
            ></video>
          </div>
          <div
            className="absolute top-[45%] left-[45%]
          cursor-pointer"
          >
            {!playing && (
              <button onClick={onVideoClick}>
                <BsFillPlayFill className="text-indigo-300 text-6xl lg:text-8xl" />
              </button>
            )}
          </div>
        </div>

        <div className="absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer">
          {isVideoMuted ? (
            <button onClick={() => setIsVideoMuted(false)}>
              <HiVolumeOff className="text-white text-2xl lg:text-4xl" />
            </button>
          ) : (
            <button onClick={() => setIsVideoMuted(true)}>
              <HiVolumeUp className="text-white hover:text-[#3b48f7] text-2xl lg:text-4xl" />
            </button>
          )}
        </div>
      </div>

      <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
        <div className="lg:mt-20 mt-10">
          <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
            <div className="ml-4 md:w-20 md:h-20  w-auto lg:w-16 h-16">
              <Link href={`/profile/${post.userId}`}>
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
              <Link href={`/profile/${post.userId}`}>
                <div
                  className="mt-3 flex flex-col
             gap-2"
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

          <p className="px-10 text-lg text-gray-600">{post.caption}</p>

          <div className="mt-10 px-10">
            {userProfile && (
              <LikeButton
                likes={post.likes}
                handleLike={() => handleLike(true)}
                handleDislike={() => handleLike(false)}
              />
            )}
          </div>

          <Comments
            comment={comment}
            setComment={setComment}
            addComment={addComment}
            comments={post.comments}
            isPostingComment={isPostingComment}
          />
        </div>
      </div>
    </div>
  );
};

//getting data form api.
export const getServerSideProps = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`);

  return {
    props: { postDetails: data },
  };
};

export default Detail;
