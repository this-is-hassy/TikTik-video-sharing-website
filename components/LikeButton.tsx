//BuiltIn Imports
import React, { useState, useEffect } from "react";

//Internal Imports
import useAuthStore from "@/store/authStore";

//External Imports
import { MdFavorite } from "react-icons/md";

//Interface for type assigning to the props
interface IProps {
  likes: any[];
  handleLike: () => void;
  handleDislike: () => void;
}

const LikeButton = ({ likes, handleLike, handleDislike }: IProps) => {
  //State for user like record with specific post.
  const [alreadyLiked, setAlreadyLiked] = useState(false);

  //Getting data from AuthStore
  const { userProfile }: any = useAuthStore();

  //Checking how many likes have by the post.
  const filterLikes = likes?.filter((item) => item._ref === userProfile?._id);

  //use to change instant like status.
  useEffect(() => {
    if (filterLikes?.length > 0) {
      setAlreadyLiked(true);
    } else {
      setAlreadyLiked(false);
    }
  }, [filterLikes, likes]);

  return (
    <div className=" flex gap-6">
      <div className="mt-4 flex flex-col justify-center items-center cursor-pointer">
        {alreadyLiked ? (
          <div
            className="bg-primary rounded-full p-2 md:p-4 text-[#F51997]"
            onClick={handleDislike}
          >
            <MdFavorite className="text-lg md:text-2xl" />
          </div>
        ) : (
          <div
            className="bg-primary rounded-full p-2 md:p-4 "
            onClick={handleLike}
          >
            <MdFavorite className="text-lg md:text-2xl" />
          </div>
        )}
        <p className="text-md font-semibold">{likes ? likes.length : "0"}</p>
      </div>
    </div>
  );
};

export default LikeButton;
