//BuiltIn imports
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

//Internal imports
import useAuthStore from "@/store/authStore";
import { client } from "../utils/client";
import { topics } from "../utils/constants";
import { BASE_URL } from "@/utils";

//External imports
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { SanityAssetDocument } from "@sanity/client";

const Upload = () => {
  //router for redirecting user to the homePage after uploading file.
  const router = useRouter();

  //function for dynamic change caption.
  const handleChangeCaption = (e: any) => {
    setCaption(e.target.value);
  };

  //function for dynamic change category.
  const handleChangeCategory = (e: any) => {
    setCategory(e.target.value);
  };

  //function for posting uploaded content and saving in dataBase.
  const handlePost = async () => {
    if (caption && videoAsset?._id && category) {
      setSavingPost(true);
      const document = {
        _type: "post",
        caption,
        video: {
          _type: "file",
          asset: {
            _type: "reference",
            _ref: videoAsset?._id,
          },
        },
        userId: userProfile?._id,
        postedBy: {
          _type: "postedBy",
          _ref: userProfile?._id,
        },
        topic: category,
      };
      await axios.post(`${BASE_URL}/api/post`, document);

      router.push("/");
    }
  };

  //getting userProfile to authenticate user.
  const { userProfile }: { userProfile: any } = useAuthStore();

  //State for setting loading status.
  const [isLoading, setIsLoading] = useState(false);

  //State for setting wrong file status.
  const [wrongFileType, setWrongFileType] = useState(false);

  //State for checking video upload status to the server.
  const [videoAsset, setVideoAsset] = useState<
    SanityAssetDocument | undefined
  >();

  //handling caption value dynamically.
  const [caption, setCaption] = useState("");

  //handling caption value dynamically.
  const [category, setCategory] = useState(topics[0]);

  //State for checking save status of the uploaded content
  const [savingPost, setSavingPost] = useState(false);

  //function for uploading video.
  const uploadVideo = async (e: any) => {
    const selectedFile = e.target.files[0];
    const fileTypes = ["video/mp4", "video/webm", "video/ogg"];
    if (fileTypes.includes(selectedFile.type)) {
      setIsLoading(true);
      client.assets
        .upload("file", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((data) => {
          setVideoAsset(data);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setWrongFileType(true);
    }
  };

  //used to put in dependency array of effect(used for redirecting non logged user to the previous a page)
  const [isUserActive, setIsUserActive] = useState(true);

  //function for redirecting user to the previous page from upload page.
  const redirectUser = () => {
    if (userProfile === null) {
      router.back();
    }
  };

  //effect which runs redirectUser function on logging out.
  useEffect(() => {
    redirectUser();
  }, [isUserActive, userProfile]);

  return (
    <div className="flex w-full h-full absolute left-0 top-[60px] mb-10 pt-10 lg:pt-20 bg-[#f8f8f8] justify-center">
      <Head>
        <title>TIKTIK - Upload Video</title>
      </Head>
      <div className="bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap justify-around items-center p-14 pt-6 w-[80%]">
        <div>
          <div>
            <p className="text-2xl font-bold text-center md:text-left">
              Upload Video
            </p>

            <p className="text-md text-gray-400 mt-1 text-center md:text-left">
              Post a video to your account
            </p>
          </div>
          <div className="border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center outline-none mt-10 w-[260px] h-[460px] p-10 cursor-pointer hover:border-indigo-300 hover:bg-gray-100">
            {isLoading ? (
              <p>Uploading...</p>
            ) : (
              <div>
                {videoAsset ? (
                  <div>
                    <video
                      src={videoAsset.url}
                      loop
                      controls
                      className="rounded-xl h-[430px] w-full  bg-black "
                    ></video>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex flex-col items-center justify-center ">
                        <p>
                          <FaCloudUploadAlt className="text-gray-300 text-6xl" />
                        </p>
                        <p>Upload Video </p>
                      </div>
                      <p className="text-gray-400 text-center mt-10 text-sm leading-10">
                        Mp4 or WebM or ogg <br />
                        720x1280 or higher <br />
                        Up to 10 minutes <br />
                        Less than 2GB
                      </p>
                      <p
                        className="bg-[#3b48f7] text-center hover:bg-white border-2 border-[#3b48f7] hover:text-[#3b48f7]
                      mt-10 rounded text-white text-md font-medium p-2 w-52 outline-none"
                      >
                        "Select File"
                      </p>
                      <input
                        type="file"
                        name="upload-video"
                        className="w-0 h-0"
                        onChange={uploadVideo}
                      />
                    </div>
                  </label>
                )}
              </div>
            )}
            {wrongFileType && (
              <p className="text-center text-xl text-red-400 font-semibold mt-4 w-[250px]">
                Please select a video file
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 pb-10">
          <label className="text-md font-medium">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={handleChangeCaption}
            className="rounded outline-none text-md border-2 border-gray-200 p-2"
          />
          <label className="text-md font-medium">Choose a Category</label>
          <select
            onChange={handleChangeCategory}
            className="outline-none border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer"
          >
            {topics.map((topic) => (
              <option
                key={topic.name}
                value={topic.name}
                className="outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300"
              >
                {topic.name}
              </option>
            ))}
          </select>
          <div className="flex gap-6 mt-10">
            <button
              onClick={() => {
                router.push("/");
              }}
              type="button"
              className=" border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none hover:bg-red-500 hover:text-white hover:border-white"
            >
              Discard
            </button>
            <button
              onClick={handlePost}
              type="button"
              className=" bg-[#3b48f7] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none border-2 border-[#3b48f7]  hover:bg-white hover:text-[#3b48f7]"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
