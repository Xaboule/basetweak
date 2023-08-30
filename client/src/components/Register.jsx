import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userIn } from "../features/UserReducer";
import { useAuth } from "../context/authContext";

export default function Registration({
  loginStatus,
  setLoginStatus,
  userInfo,
  setUserInfo,
}) {
  const [firstnameReg, setFirstnameReg] = useState("");
  const [lastnameReg, setLastnameReg] = useState("");
  const [emailReg, setEmailReg] = useState("");
  const [usernameReg, setUsernameReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [numberReg, setNumberReg] = useState("");
  const [streetReg, setStreetReg] = useState("");
  const [postalReg, setPostalReg] = useState("");
  const [cityReg, setCityReg] = useState("");
  const [countryReg, setCountryReg] = useState("");
  const [phoneReg, setPhoneReg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const { loginContext } = useAuth();
  Axios.defaults.withCredentials = true;

  const userData = useSelector((state) => state.user_data.userData);

  const dispatch = useDispatch();

  const resetInputs = () => {
    console.log("RESET")
setFirstnameReg("");
setLastnameReg("");
setEmailReg("");
setUsernameReg("");
setPasswordReg("");
setNumberReg("");
setStreetReg("");
setPostalReg("");
setCityReg("");
setCountryReg("");
setPhoneReg("")}


  const register = () => {
    Axios.post(`${import.meta.env.VITE_BACKEND_URL}/register`, {
      firstname: firstnameReg,
      lastname: lastnameReg,
      email: emailReg,
      username: usernameReg,
      password: passwordReg,
      number: numberReg,
      street: streetReg,
      postal: postalReg,
      city: cityReg,
      country: countryReg,
      phone: phoneReg,
    }).then(userAuthenticated)
  };


  const userAuthenticated = () => {
    Axios.get(`${import.meta.env.VITE_BACKEND_URL}/isUserAuth`, {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
  };
  useEffect(() => {
resetInputs()
  }, [userAuthenticated])


  const login = () => {
    Axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      username: username,
      password: password,
    })
      .then((response) => {
        if (response.data.auth == false) {
          setLoginError("Invalid username or password"), setLoginStatus(false);
          setTimeout(() => setLoginError(null), 3000);
        } else {
          const user = response.data.result[0];
          const user_info = response.data.otherData[0];
          const user_guitars = response.data.guitars;
          localStorage.setItem("token", response.data.token);
          setLoginStatus(true);
          dispatch(userIn({ user, user_info, user_guitars }));
          loginContext();
        }
      })
      .then(userAuthenticated);
  };

  useEffect(() => {
    if (userAuthenticated) {
      Axios.get(`${import.meta.env.VITE_BACKEND_URL}/login`).then(
        (response) => {;
          setUserInfo(userData);
        }
      );
    } else if (!userAuthenticated) {
      setLoginStatus(false);
    }
  }, [loginStatus]);

  return (
    <div className="login-register-wrap">
      <div className="login-register">
        <div className="login">
          <h2>Login</h2>
          <label>Username</label>
          <input
            type="text"
            // placeholder="Username..."
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <label>Password</label>
          <input
            type="password"
            // placeholder="..."
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button className="login-register-button" onClick={login}>
            Login
          </button>
          {loginError && (
            <p className="error-message" style={{ color: "red" }}>
              {loginError}
            </p>
          )}
        </div>
        <div className="registration">
          <h2>Sign up</h2>
          <div>
            <label>Firstname</label>
            <input
              type="text"
              onChange={(e) => {
                setFirstnameReg(e.target.value);
              }}
            />
            <label>Lastname</label>
            <input
              type="text"
              onChange={(e) => {
                setLastnameReg(e.target.value);
              }}
            />
            <label>Email</label>
            <input
              type="text"
              onChange={(e) => {
                setEmailReg(e.target.value);
              }}
            />
            <label>Username</label>
            <input
              type="text"
              onChange={(e) => {
                setUsernameReg(e.target.value);
              }}
            />
            <label>Password</label>
            <input
              type="password"
              onChange={(e) => {
                setPasswordReg(e.target.value);
              }}
            />
            <h4>Address & phone</h4>
            <div className="address-register">
              <br />
              <div className="address-register-inputs" style={{ width: "6vw" }}>
                <label>Number</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setNumberReg(e.target.value);
                  }}
                />
              </div>
              <div className="address-register-inputs" style={{ width: "70%" }}>
                <label>Street</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setStreetReg(e.target.value);
                  }}
                />
              </div>
              <br />
              <div className="address-register-inputs" style={{ width: "30%" }}>
                <label>Postal</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setPostalReg(e.target.value);
                  }}
                />
              </div>
              <div className="address-register-inputs" style={{ width: "65%" }}>
                <label>City</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setCityReg(e.target.value);
                  }}
                />
              </div>
              <br />
              <div className="address-register-inputs" style={{ width: "30%" }}>
                <label>Country</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setCountryReg(e.target.value);
                  }}
                />
              </div>
              <div className="address-register-inputs" style={{ width: "65%" }}>
                <label>Phone</label>
                <input
                  type="text"
                  onChange={(e) => {
                    setPhoneReg(e.target.value);
                  }}
                />
              </div>
            </div>
            <button className="login-register-button" onClick={() => register}>
              Register
            </button>
          </div>{" "}
        </div>
      </div>
      <div className="otherlog">
        <p>
          Signing up allows you to save your custom guitar(s) and will keep you
          updated on all new features!
        </p>
      </div>
    </div>
  );
}
