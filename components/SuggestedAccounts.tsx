//BuiltIn Imports
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

//Internal Imports
import useAuthStore from "@/store/authStore";
import { IUser } from "@/types";

//External Imports
import { GoVerified } from "react-icons/go";

const SuggestedAccounts = () => {
  //getting data from AuthStore
  const { fetchAllUsers, allUsers } = useAuthStore();

  //fetching users on every time user add.
  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <div className="lg:border-b-2  border-gray-200 pb-4">
      <p
        className="text-gray-500 font-semibold m-3 mt-4 
      hidden lg:block"
      >
        Suggested Accounts
      </p>
      <div>
        {allUsers.slice(0, 6).map((user: IUser) => (
          <Link href={`/profile/${user._id}`} key={user._id}>
            <div
              className="flex gap-3 hover:bg-primary p-2 cursor-pointer font-semibold rounded
              "
            >
              <div className="w-8 h-8">
                <Image
                  src={user.image}
                  width={34}
                  height={34}
                  className="rounded-full"
                  alt="user profile"
                />
              </div>
              <div className="hidden lg:block">
                <p
                  className="flex gap-1 items-center lowercase
                "
                >
                  {user.userName.replace(/\s/g, "")}{" "}
                  <GoVerified className="text-blue-400" />
                </p>
                <p className="capitalize  text-gray-400 text-xs">
                  {user.userName}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SuggestedAccounts;
