//BuiltIn Imports
import { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";

//InternalImports
import Discover from "./Discover";
import SuggestedAccounts from "./SuggestedAccounts";
import Footer from "./Footer";

//External Imports
import { AiFillHome, AiOutlineMenu } from "react-icons/ai";
import { ImCancelCircle } from "react-icons/im";

const Sidebar: NextPage = () => {

  //used to create show/hide sideBar in small devices
  const [showSidebar, setShowSidebar] = useState(true);

  //styling for non-focused homeIcon.
  const normalLink =
    "flex items-center gap-3 hover:bg-primary p-3 justify-center xl:justify-start cursor-pointer font-semibold text-[#3B48F7] rounded";

  return (
    <div>
      <div
        className="block lg:hidden m-2 ml-4 mt-24  text-xl "
        onClick={() => setShowSidebar((prev) => !prev)}
      >
        {showSidebar ? <ImCancelCircle /> : <AiOutlineMenu />}
      </div>
      {showSidebar && (
        <div className="overflow-scroll h-full lg:mt-28 lg:w-400 w-20 flex-col justify-start mb-10 border-r-2 border-[#3b48f7] lg:border-0  p-3 lg:fixed">
          <div className="lg:border-b-2 border-[#3b48f7] lg:pb-4 mt-6lg:mt-0">
            <Link href="/">
              <div className={normalLink}>
                <p className="text-2xl">
                  <AiFillHome />
                </p>
                <span className="text-xl hidden lg:block">For You</span>
              </div>
            </Link>
          </div>
          <Discover />
          <SuggestedAccounts />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
