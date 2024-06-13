import "./topbar.css";
// import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { FaSearch, FaUser, FaComments, FaBell } from "react-icons/fa";

import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";





export default function Topbar() {
const[users,setUsers]=useState([])
const[searchInput,setSearchInput]=useState("");
    const[filteredusers,setFilteredusers]=useState(users);


  const { user, dispatch } = useContext(AuthContext);
  const PF = "http://localhost:8800/images/";
  const history=useHistory();
  const handleLogout = () => {
    // Clear user data from context
    dispatch({ type: "LOGOUT" });
    // Redirect to login page
    history.push("/login");
  };

  useEffect(()=>{
    const fetchuser=async()=>{
      const res=await axios.get("http://localhost:8800/api/users/all");
        setUsers(res.data);
        console.log(res.data)
    }
    fetchuser();
  },[])
console.log(users)
 const handlesearch =(e)=>{
const searchterm=e.target.value;
setSearchInput(searchterm);

const filtered=users.filter((u)=>
  u.username.toLowerCase().includes(searchterm.toLowerCase()));
  setFilteredusers(filtered);
 }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Facebook</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <FaSearch className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            id="search"
            value={searchInput}
            onChange={handlesearch} 
          />
        </div>
        <ul className="lab-ul">
                {
                searchInput && filteredusers.map((u,i)=><li key={i}>
                  <img className="topbarImg" src={u.profilePicture} alt="" />
                    <Link to={`/profile/${u.username}`} className="username">{u.username}</Link>
                    
                </li>)
                }
            </ul>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <FaUser />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <FaComments />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <FaBell />
            <span className="topbarIconBadge">1</span>
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ?  user.profilePicture
                : PF+ "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
        <button className="logoutButton" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}
