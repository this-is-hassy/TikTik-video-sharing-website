//Internal Imports
import { Video } from "../types";
import VideoCard from "@/components/VideoCard";
import NoResults from "@/components/NoResults";
import { BASE_URL } from "@/utils";

//External Imports
import axios from "axios";


// Interface for type assigning to the video prop.
interface IProps {
  videos: Video[];
}

//Main Component (which has videos)
const Home = ({ videos }: IProps) => {
  return (
    <div className="flex flex-col mt-20 lg:mt-0 gap-10 videos h-full overflow-scroll">
      {videos.length ? (
        videos.map((video: Video) => <VideoCard post={video} key={video._id} />)
      ) : (
        <div className="flex ml-10 mt-24 lg:ml-60 lg:mt-60 ">
          <NoResults text={"No Videos"} />
        </div>
      )}
    </div>
  );
};

//Getting data from an api.
export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let response = null;
  if (topic) {
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
  } else {
    response = await axios.get(`${BASE_URL}/api/post`);
  }

  return {
    props: {
      videos: response.data,
    },
  };
};

export default Home;
