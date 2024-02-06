//BuilIn Imports.
import React, { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";

//Internal Imports.
import useAuthStore from "@/store/authStore";
import NoResults from "@/components/NoResults";
import VideoCard from "@/components/VideoCard";
import { BASE_URL } from "@/utils";
import { IUser, Video } from "@/types";


//External Imports.
import { MdOutlineNoAccounts } from "react-icons/md";
import { GoVerified } from "react-icons/go";
import axios from "axios";


const Search = ({ videos }: { videos: Video[] }) => {

  //State for checking (has any account found with related search.)
  const [isAccounts, setIsAccounts] = useState(false);

  //Using allUsers for filtering accounts process.
  const { allUsers } = useAuthStore();
  //Using route for getting searchTerm as query for the url.
  const router = useRouter();
  const { searchTerm }: any = router.query;

  //Variables for dynamic styling.
  const accounts = isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const isVideos = !isAccounts ? "border-b-2 border-black" : "text-gray-400";

  //Searching, is any account related to search term.
  const searchedAccounts = allUsers.filter((user: IUser) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-whtie w-full">
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`}
          onClick={() => {
            setIsAccounts(true);
          }}
        >
          Accounts
        </p>
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}
          onClick={() => {
            setIsAccounts(false);
          }}
        >
          Videos
        </p>
      </div>
      {isAccounts ? (
        <div className="md:mt-16 ">
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((user: IUser, idx: number) => (
              <Link href={`/profile/${user._id}`} key={idx}>
                <div className=" flex gap-3 p-2 cursor-pointer font-semibold  border-b-2 border-gray-200 rounded">
                  <div className="flex gap-3 hover:bg-primary p-2 cursor-pointer font-semibold rounded">
                    <div>
                      <Image
                        src={user.image}
                        width={50}
                        height={50}
                        className="rounded-full"
                        alt="user profile"
                      />
                    </div>
                    <div className="hidden xl:block">
                      <p className="flex gap-1 items-center lowercase">
                        {user.userName.replace(/\s/g, "")}{" "}
                        <GoVerified className="text-blue-400" />
                      </p>
                      <p className="capitalize  text-gray-400 text-xs">
                        {user.userName}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex flex-col  justify-center h-full w-full text-center text-2xl  lg:ml-28    lg:mt-52">
              <MdOutlineNoAccounts className="text-8xl m-auto block" />
              No accounts found for '{searchTerm}'
            </div>
          )}
        </div>
      ) : (
        <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
          {videos.length ? (
            videos.map((video: Video, idx) => (
              <VideoCard post={video} key={idx} />
            ))
          ) : (
            <div className="lg:ml-48 lg:mt-36">
              <NoResults text={`No video results for '${searchTerm}'`} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};


//Getting Data from an api.
export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) => {
  const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);

  return {
    props: { videos: res.data },
  };
};

export default Search;
