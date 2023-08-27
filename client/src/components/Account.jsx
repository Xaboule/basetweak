import React, { useEffect, useState } from "react";
import axios from "axios";
import Registration from "./Register";
import "./css/account.css";

import { useDispatch, useSelector } from "react-redux";
import { userOut, userGuitarsSave, userUpdate, userGuitarDelete } from "../features/UserReducer";
import { SignOut, Trash } from "@phosphor-icons/react";
import { addColor, triggerDrop, resetDrop } from "../features/ColorReducer";
import { Toast } from "primereact/toast";
import { Carousel } from "primereact/carousel";
import { ConfirmDialog } from "primereact/confirmdialog";
import { useAuth } from "../context/authContext";
function Account() {
  const userData = useSelector((state) => state.user_data.userData.user);
  const userDataInfo = useSelector(
    (state) => state.user_data.userData.user_info
  );
  const userGuitars = useSelector(
    (state) => state.user_data.userData.user_guitars
  );
  const initialLoginStatus = localStorage.getItem("token") !== null;
  const [loginStatus, setLoginStatus] = useState(initialLoginStatus);
  const [userInfo, setUserInfo] = useState(userData);
  const [userGtrs, setUserGtrs] = useState([]);
  const [visible, setVisible] = useState(false);

  const { isAuthenticated, logoutContext } = useAuth();

  const path = `${import.meta.env.VITE_BACKEND_URL}/stocked/thumbnails/`;

  const toPascalCase = (str) =>
    (str.match(/[a-zA-Z0-9]+/g) || [])
      .map((w) => `${w.charAt(0).toUpperCase()}${w.slice(1)}`)
      .join(" ");

  const dispatch = useDispatch();

  const userAuthenticated = () => {
    axios.get(`${import.meta.env.VITE_BACKEND_URL}/isUserAuth`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
  };

  useEffect(() => {
    setUserInfo(userData);
  }, [isAuthenticated]);


  useEffect(() => {
    if (isAuthenticated) {
      userAuthenticated();
      setUserGtrs(userGuitars);
    }
  }, [isAuthenticated]);

console.log(userGtrs)

  const handleSelectGuitar = async (item) => {
    const gtr = item.id;
    console.log(item)
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/items/fetchguitarcolors`, {
        params: { gtr: gtr },
      })
      .then((res) => {
        let txPath;
        const fetched = res.data.composition;
        const fetchedModel = res.data.model[0].model
  
        console.log(res.data)
        const colorObject = {};
        console.log(fetchedModel)
        fetched.forEach((item) => {
          colorObject[item.name] = item.color;
        });

        const object = Object.values(fetched).reduce((acc, item) => {
      
          acc.model = fetchedModel
          acc[item.name] = item.color;
          acc.id = item.id_guitar;
          acc.gloss = item.gloss;
          acc.wood = parseInt(item.wood, 10);
          acc.scratch = parseInt(item.scratch, 10);

          if (item.id_texture !== "stocked/HD_transparent_picture.png") {
            // axios
            //   .get(`${import.meta.env.VITE_BACKEND_URL}/items/fetchtextures`, {
            //     params: { txID: item.id_texture },
            //   })
            //   .then((tex) => {
            //     console.log(tex.data);
            //     txPath = tex.data[0].path;
            //     return (acc.texture_path = txPath);
            //   });
          } else acc.texture_path = "stocked/HD_transparent_picture.png";

          return acc;
        }, {});

        // setModel(fetched[0].model);
console.log(object)

        dispatch(addColor(object));
      });
  };

  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});

  let baseData;
  if (loginStatus) {
    baseData = {
      username: userData.username,
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      number: userDataInfo.number,
      street: userDataInfo.street,
      postal: userDataInfo.postal,
      city: userDataInfo.city,
      country: userDataInfo.country,
      phone: userDataInfo.phone,
    };
  } else {
    baseData = {};
  }

  const handleEdit = () => {
    setEditMode(true);
    // Initialize editedData with the current user data
    setEditedData(baseData);
  };

  const handleChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const userEdited = {
      user_id: userInfo.id,
      username: editedData.username,
      firstname: editedData.firstname,
      lastname: editedData.lastname,
      email: editedData.email,
      number: editedData.number,
      street: editedData.street,
      postal: editedData.postal,
      city: editedData.city,
      country: editedData.country,
      phone: editedData.phone,
    };
    axios
      .put(`${import.meta.env.VITE_BACKEND_URL}/user/edit`, userEdited)
      .then(() => {
        dispatch(userUpdate(userEdited));
        setUserInfo(userEdited);
      });
    setEditMode(false);
  };
  const logout = () => {
    setLoginStatus(false);
    logoutContext();
    dispatch(userOut(""));
    localStorage.removeItem("token");
  };
  const handleDelete = (id) => {
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/user/delete`, {
        data: { user: id },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        logout();
        localStorage.clear();
        setUserInfo("");
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle error
      });
  };

  const accept = () => {
    handleDelete(userInfo.id);
  };

  const handleDeleteGuitar = (item) => {
    const id_guitar = item.id_guitar;

    dispatch(userGuitarDelete(item))
    axios
      .delete(`${import.meta.env.VITE_BACKEND_URL}/user/deleteguitar`, {
        data: { id_guitar: id_guitar },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        dispatch(userGuitarDelete(item))
      });
  };




  useEffect(() => {
    setUserInfo(userData);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    setUserGtrs(userGuitars);
  }, [userInfo, handleDeleteGuitar]);


  const itemTemplate = (item) => {
    console.log(item)
    return (
      <div className="guitars-all">
        <div
          className="guitar-thb"
          onClick={() => handleSelectGuitar(item)}
          value={item.id_guitar}
        >
          <a href="/">    
              <div className="gtr-name">{item.name}</div> 
            {item.thumbnail && (
              <img
                src={path + `${item.thumbnail}.png`}
                alt={`Guitar ${item.id_guitar}`}
                className="guitar-thb-img"
              />
            )}
   
          </a>
          <div className="guitar-thb-actions">
          <button
            key={item.name}
            className="trash-button"
            type="button"
            value={item.id_guitar}
            onClick={(e) => {
              e.preventDefault(), handleDeleteGuitar(item);
            }}
          >
            <span className="trash-icon">
              <Trash size={26} color={"red"} />
            </span>
          </button></div>
        </div>
      </div>
    );
  };
  return (
    <div className="account-main">
      {!localStorage.getItem("token") && (
        <>
          <Registration
            loginStatus={loginStatus}
            setLoginStatus={setLoginStatus}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        </>
      )}
      {localStorage.getItem("token") && userInfo && (
        <div className="user-auth-true">
          <div className="user-welcome">
            <h1>
              {" "}
              Welcome{" "}
              <span id="username">{toPascalCase(userInfo.username)}</span>
            </h1>
          </div>
          <div className="dashboard">
            <div className="user-infos">
              <div className="personnal-infos">
                <ul id="list">
                  <li>
                    {editMode ? (
                      <input
                        type="text"
                        value={editedData.username}
                        onChange={(e) =>
                          handleChange("username", e.target.value)
                        }
                        placeholder="Username"
                      />
                    ) : (
                      toPascalCase(userInfo.username)
                    )}
                  </li>

                  {editMode ? (
                    <>
                      <li>
                        <input
                          type="text"
                          value={editedData.firstname}
                          onChange={(e) =>
                            handleChange("firstname", e.target.value)
                          }
                          placeholder="Firstname"
                        />
                      </li>{" "}
                      <li>
                        {" "}
                        <input
                          type="text"
                          value={editedData.lastname}
                          onChange={(e) =>
                            handleChange("lastname", e.target.value)
                          }
                          placeholder="Lastname"
                        />
                      </li>{" "}
                      <li>
                        <input
                          type="text"
                          value={editedData.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          placeholder="Email"
                        />
                      </li>
                      <li id="adress">
                        {" "}
                        <input
                          type="text"
                          value={editedData.number}
                          onChange={(e) =>
                            handleChange("number", e.target.value)
                          }
                          placeholder="Number"
                        />
                        <input
                          type="text"
                          value={editedData.street}
                          onChange={(e) =>
                            handleChange("street", e.target.value)
                          }
                          placeholder="Street "
                        />
                        <input
                          type="text"
                          value={editedData.postal}
                          onChange={(e) =>
                            handleChange("postal", e.target.value)
                          }
                          placeholder="Postal "
                        />
                        <input
                          type="text"
                          value={editedData.city}
                          onChange={(e) => handleChange("city", e.target.value)}
                          placeholder="City "
                        />
                        <input
                          type="text"
                          value={editedData.country}
                          onChange={(e) =>
                            handleChange("country", e.target.value)
                          }
                          placeholder="Country"
                        />
                        <input
                          type="text"
                          value={editedData.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          placeholder="Phone"
                        />
                      </li>
                    </>
                  ) : (
                    <>
                      {userInfo.firstname} {userInfo.lastname}
                      <li>{userInfo.email}</li>
                      <li id="adress">
                        {userDataInfo.number} {userDataInfo.street}, <br />
                        {userDataInfo.postal} {toPascalCase(userDataInfo.city)},{" "}
                        <br />
                        {userDataInfo.country.toUpperCase()}
                      </li>
                      <li>{userDataInfo.phone}</li>
                    </>
                  )}
                </ul>{" "}
                <li className="edit-save-delete">
                  {editMode ? (
                    <>
                      <button id="edit-save" onClick={handleSave}>
                        Save
                      </button>
                      <button
                        id="edit-save"
                        onClick={() => {
                          setEditMode(false);
                        }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button id="edit-save" onClick={handleEdit}>
                      Edit
                    </button>
                  )}
                  <ConfirmDialog
                    draggable={false}
                    className="confirm-save"
                    visible={visible}
                    onHide={() => setVisible(false)}
                    message="Are you sure you want to delete your account?"
                    closeOnEscape
                    header="Confirmation"
                    label="Confirm"
                    icon="pi pi-exclamation-triangle"
                    accept={accept}
                    reject={() => console.log("rejjjje")}
                  />
                  <button
                    id="delete-account"
                    onClick={(e) => (e.stopPropagation(), setVisible(true))}
                    //  onClick={handleDelete}
                  >
                    Delete my account
                  </button>
                </li>
              </div>
            </div>
            <div className="user-activities">
              <div className="order-history"> No orders yet</div>

              <div className="saved-guitars">
                {/* "Start tweaking your six strings now! " */}

                {userGuitars.length != 0 ? (
                  <Carousel
                    className="carousel"
                    value={userGtrs}
                    circular
                    itemTemplate={itemTemplate}
                    numVisible={3}
                    numScroll={1}
                    pt
                  />
                ) : (
                  "Start tweaking your six strings now! "
                )}
              </div>
            </div>
          </div>
          <div className="logout-wrap">
            <button className="logout" onClick={logout}>
              Log out <SignOut size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Account;
