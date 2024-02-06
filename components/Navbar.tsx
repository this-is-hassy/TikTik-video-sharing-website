//BuiltIn Imports
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

//Internal Imports
import logo from "../utils/tiktik-logo.png";
import useAuthStore from "@/store/authStore";
import { createOrGetUser } from "@/utils";

//External Imports
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { IoMdAdd } from "react-icons/io";
import { GrLogout } from "react-icons/gr";
import { BiSearch } from "react-icons/bi";

const Navbar = () => {
  //used for rendering searchResults on search.
  const router = useRouter();

  //getting data from AuthStore.
  const { userProfile, addUser, removeUser }: any = useAuthStore();

  //handling searchValue dynamically.
  const [searchValue, setSearchValue] = useState("");

  //Search function for submitting search form.
  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (searchValue) {
      router.push(`/search/${searchValue}`);
    }
  };

  return (
    <div className="backdrop-blur-xl  fixed w-full lg:w-[70rem]  flex  justify-between  border-b-2 border-gray-200 py-3 px-4 z-10">
      <Link href="/" title="Tiktik logo">
        <div className="w-[100px] md:w-[130px] mr-2 md:mr-0 mt-1">
          <Image priority className="cursor-pointer" src={logo} alt="TikTik" />
        </div>
      </Link>
      <div title="search from here" className=" relative hidden md:block">
        <form
          onSubmit={handleSearch}
          className=" absolute md:static top-10 -left-20 "
        >
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search accounts and videos"
            className="bg-primary p-3 md:text-md font-medium  focus:outline-none   w-[300px] md:w-[20rem] rounded-full md:top-0"
          />
          <button
            onClick={handleSearch}
            className="absolute md:right-5 right-6 top-3 border-l-2 border-gray-300 pl-4 text-2xl text-gray-400"
          >
            <BiSearch />
          </button>
        </form>
      </div>
      <div>
        {userProfile ? (
          <div className="flex gap-5 md:gap-10">
            <Link href="/upload">
              <button
                title="Upload Video from here"
                className="border-2  border-[#3b48f7] bg-[#3b48f7] hover:bg-transparent  text-white hover:text-[#3b48f7]   px-2 py-2 md:px-4 text-md font-semibold flex items-center gap-2 rounded-md"
              >
                <IoMdAdd className="text-xl" />{" "}
                <span className="hidden md:block">Upload</span>
              </button>
            </Link>
            {userProfile.image && (
              <Link href={`/`}>
                <>
                  <Image
                    src={userProfile.image}
                    width={40}
                    height={40}
                    className="rounded-full"
                    alt="profile photo"
                  />
                </>
              </Link>
            )}
            <button type="button" className="pr-5 md:pr-0 lg:px-2 text-red">
              <GrLogout
                color="red"
                title="logout"
                style={{ color: "red" }}
                fontSize={21}
                onClick={() => {
                  googleLogout();
                  removeUser();
                }}
              />
            </button>
          </div>
        ) : (
          <div className="mt-2">
            <GoogleLogin
              useOneTap
              size="medium"
              shape="circle"
              onSuccess={(response) => createOrGetUser(response, addUser)}
              onError={() => console.log("Error")}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
