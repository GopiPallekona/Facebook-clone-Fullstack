// import "./post.css";
// // import { MoreVert } from "@material-ui/icons";
// import { BsThreeDots } from "react-icons/bs";
// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { format } from "timeago.js";
// import { Link } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import { AiFillDelete } from "react-icons/ai"; 

// export default function Post({ post,onDelete }) {
//   const [like, setLike] = useState(post.likes.length);
//   const [isLiked, setIsLiked] = useState(false);
//   const [user, setUser] = useState({});
//   const PF = "http://localhost:8800/images/";
//   const { user: currentUser } = useContext(AuthContext);

//   useEffect(() => {
//     setIsLiked(post.likes.includes(currentUser._id));
//   }, [currentUser._id, post.likes]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const res = await axios.get(`http://localhost:8800/api/users?userId=${post.userId}`);
//       setUser(res.data);
//     };
//     fetchUser();
//   }, [post.userId]);

//   const likeHandler = () => {
//     try {
//       axios.put("http://localhost:8800/api/posts/" + post._id + "/like", { userId: currentUser._id });
//     } catch (err) {}
//     setLike(isLiked ? like - 1 : like + 1);
//     setIsLiked(!isLiked);
//   };

//   const deleteHandler = async () => {
//     try {
//       await axios.delete(`http://localhost:8800/api/posts/${post._id}`, { data: { userId: currentUser._id } });
//       onDelete(post._id);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="post">
//       <div className="postWrapper">
//         <div className="postTop">
//           <div className="postTopLeft">
//             <Link to={`/profile/${user.username}`}>
//               <img
//                 className="postProfileImg"
//                 src={
//                   user.profilePicture
//                     ?  user.profilePicture
//                     :  "person/noAvatar.png"
//                 }
//                 alt=""
//               />
//             </Link>
//             <span className="postUsername">{user.username}</span>
//             <span className="postDate">{format(post.createdAt)}</span>
//           </div>
//           <div className="postTopRight">
//             <BsThreeDots />
//             {post.userId === currentUser._id && (
//               <AiFillDelete className="deleteIcon" onClick={deleteHandler} />
//             )}
//           </div>
//         </div>
//         <div className="postCenter">
//           <span className="postText">{post?.desc}</span>
//           <img className="postImg" src={post.img} alt="" />
//         </div>
//         <div className="postBottom">
//           <div className="postBottomLeft">
//             <img
//               className="likeIcon"
//               src={`${PF}like.png`}
//               onClick={likeHandler}
//               alt=""
//             />
//             <img
//               className="likeIcon"
//               src={`${PF}heart.png`}
//               onClick={likeHandler}
//               alt=""
//             />
//             <span className="postLikeCounter">{like} people like it</span>
//           </div>
//           <div className="postBottomRight">
//             <span className="postCommentText">{post.comment} comments</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import "./post.css";
import { BsThreeDots } from "react-icons/bs";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { AiFillDelete } from "react-icons/ai"; 
import { IoSend } from "react-icons/io5";
import { TiDelete } from "react-icons/ti";


export default function Post({ post, onDelete }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const PF = "http://localhost:8800/images/";
  const { user: currentUser } = useContext(AuthContext);
 

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`http://localhost:8800/api/users?userId=${post.userId}`);
      setUser(res.data);
    };
    fetchUser();
  }, [post.userId]);

  useEffect(() => {
    const savedComments = localStorage.getItem(`comments_${post._id}`);
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [post._id]);

  

  const likeHandler = () => {
    try {
      axios.put(`http://localhost:8800/api/posts/${post._id}/like`, { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const deleteHandler = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/posts/${post._id}`, { data: { userId: currentUser._id } });
      onDelete(post._id);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const submitCommentHandler = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        username: currentUser.username,
        text: newComment,
      };
      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      localStorage.setItem(`comments_${post._id}`, JSON.stringify(updatedComments));
      setNewComment("");
    }
  };

  const deleteCommentHandler = (index) => {
    const updatedComments = comments.filter((_, i) => i !== index);
    setComments(updatedComments);
    localStorage.setItem(`comments_${post._id}`, JSON.stringify(updatedComments));
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : "person/noAvatar.png"
                }
                alt=""
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <BsThreeDots />
            {post.userId === currentUser._id && (
              <AiFillDelete className="deleteIcon" onClick={deleteHandler} />
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={post.img} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <img
              className="likeIcon"
              src={`${PF}heart.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText" onClick={toggleComments}>
              {comments.length} comments
            </span>
          </div>
        </div>
        {showComments && (
          <div className="commentSection">
           
            <div className="input-send">
            <input
              type="text"
              className="commentInput"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          <IoSend onClick={submitCommentHandler} className="commentButton" />
              
          
            </div>
            <div className="commentsList">
              {comments.map((comment, index) => (
                <div key={index} className="comment">
                  <span className="commentUser">{comment.username}:</span>
                  <span className="commentText">{comment.text}</span>
                  {comment.username === currentUser.username && (
                    <TiDelete className="commentDeleteIcon" onClick={() => deleteCommentHandler(index)} />
                  )}
                </div>
              ))}
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

