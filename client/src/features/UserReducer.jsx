import { createSlice, createAction } from "@reduxjs/toolkit";

 const initialState= { 
    userData : {},
    guitarsList : []
   }

export const userSlice = createSlice({
  name: "user_data",
initialState,

 reducers : {
  userIn : (state, action) => {

state.userData = action.payload
  },
  userOut : (state) => {
    state.userData = {}
  },
  userGuitarsSave : (state, action) => {

    const newGtr = action.payload
    return{
...state,
    userData : {
      ...state.userData, user_guitars :[ ...state.userData.user_guitars, newGtr ]
    }}
  },
  userUpdate : (state, action) => {
 
    state.userData.user = {
      username: action.payload.username,
      firstname: action.payload.firstname,
      lastname: action.payload.lastname,
      email: action.payload.email, 
  },
  state.userData.user_info ={
    number: action.payload.number,
    street: action.payload.street,
    postal: action.payload.postal,
    city: action.payload.city,
    country: action.payload.country,
    phone: action.payload.phone,
  }

},
userGuitarDelete : (state, action) => {
  // delete action.payload

  const updatedUserGuitars = state.userData.user_guitars.filter(guitar => guitar.id_guitar !== action.payload.id_guitar);
    
return { ...state,
  userData: {
    ...state.userData,
    user_guitars: updatedUserGuitars}}

},
userGuitarRename : (state, action) => {
  console.log(action.payload)
  const id_guitar = action.payload.id_guitar
  const newname = action.payload.editedName
  const updatedUserGuitars = state.userData.user_guitars.filter((guitar) => guitar.id_guitar == id_guitar ? {...guitar, name: newname} : guitar);
    console.log(updatedUserGuitars)
return { ...state,
  userData: {
    ...state.userData,
    user_guitars: updatedUserGuitars}}

}
  }
  
});
export const { userIn, userOut, userGuitarsSave, userUpdate, userGuitarDelete, userGuitarRename } = userSlice.actions;

export default userSlice.reducer;