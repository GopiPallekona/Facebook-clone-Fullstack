import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";




export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
const { user } = useContext(AuthContext);

useEffect(() => {
  const fetchPosts = async () => {
    const res = username
     ? await axios.get("http://localhost:8800/api/posts/profile/"+username )
      : await axios.get("http://localhost:8800/api/posts/timeline/" + user._id);

    // Check if res.data is an array before calling sort
    if (Array.isArray(res.data)) {
      setPosts(
        res?.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    } else {
      console.log("res.data is not an array");
    }
  };
  fetchPosts();
}, [username, user._id]);
// useEffect(() => {
//   const fetchPosts = async () => {
//     try {
//       // Fetch all posts regardless of the username
//       const res = await axios.get("http://localhost:8800/api/posts/");

//       // Check if res.data is an array before calling sort
//       if (Array.isArray(res.data)) {
//         setPosts(
//           res.data.sort((p1, p2) => {
//             return new Date(p2.createdAt) - new Date(p1.createdAt);
//           })
//         );
//       } else {
//         console.log("res.data is not an array");
//       }
//     } catch (error) {
//       console.error("Failed to fetch posts", error);
//     }
//   };
//   fetchPosts();
// }, [username]);
const handleDelete = (postId) => {
  setPosts(posts.filter((post) => post._id !== postId));
};

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
}
