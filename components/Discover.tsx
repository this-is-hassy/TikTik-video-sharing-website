//BuiltIn Imports
import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";


//Internal Imports
import { topics } from "../utils/constants";

const Discover = () => {

  //router for getting topic query from url.
  const router = useRouter();
  const { topic } = router.query;

  //Styling for active topic button.
  const activeTopicStyle =
    "lg:border-2 hover:bg-primary lg:border-[#3B48F7] px-3 py-2 rounded lg:rounded-full flex items-center gap-2 justify-center cursor-pointer text-[#3B48F7]";

  //Styling for default topic button
  const topicStyle =
    "lg:border-2 hover:bg-primary lg:border-gray-300 px-3 py-2 rounded lg:rounded-full flex items-center gap-2 justify-center cursor-pointer text-black";

  return (
    <div className="lg:border-b-2 xl:border-gray-200 pb-6 ">
      <p className="text-gray-500 font-semibold m-3 mt-4 hidden lg:block">
        Popular Topics
      </p>
      <div className="flex gap-3 flex-wrap">
        {topics.map((item) => (
          <Link href={`/?topic=${item.name}`} key={item.name}>
            <div
              className={topic === item.name ? activeTopicStyle : topicStyle}
            >
              <span className="font-bold text-2xl lg:text-md">{item.icon}</span>
              <span className="font-medium  text-md hidden lg:block capitalize">
                {item.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Discover;
