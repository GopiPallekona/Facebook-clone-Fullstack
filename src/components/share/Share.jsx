import "./share.css";
import { FaPhotoVideo, FaTag, FaSmile, FaTimes } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = "http://localhost:8800/images/";
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [posts, setPosts] = useState([]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!user || !user._id) {
      console.error("User is not defined or does not have an _id property");
      return;
    }

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;

      try {
        const uploadRes = await axios.post("http://localhost:8800/api/upload", data);
        console.log('Upload response:', uploadRes.data);
        if (uploadRes.status === 200) {
          newPost.img = fileName;
        } else {
          console.error('Failed to upload image');
          return;
        }
      } catch (err) {
        console.error('Upload error:', err);
        return;
      }
    }

    try {
      const postRes = await axios.post("http://localhost:8800/api/posts", newPost);
      console.log('Post response:', postRes.data);
      setPosts([postRes.data, ...posts]);
      window.location.reload(); // Reload page after post submission
    } catch (err) {
      console.error('Post error:', err);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={user.profilePicture ? user.profilePicture : PF + "person/noAvatar.png"}
            alt=""
          />
          <input
            placeholder={`What's in your mind ${user.username}?`}
            className="shareInput"
            ref={desc}
            disabled={!user}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <IoLocationSharp className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <FaPhotoVideo htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <FaTag htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <FaTimes htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <FaSmile htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit" disabled={!user}>
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
