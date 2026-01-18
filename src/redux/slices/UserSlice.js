import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: null,
    firstName: "",
    lastName: "",
    address: "",
    contact: null,
    email: "",
    username: "",
    image: "",
    createdAt: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user.id = action.payload.id;
      state.user.firstName = action.payload.firstName;
      state.user.lastName = action.payload.lastName;
      state.user.address = action.payload.address;
      state.user.contact = action.payload.contact;
      state.user.email = action.payload.email;
      state.user.username = action.payload.username;
      state.user.image = action.payload.image;
      state.user.createdAt = action.payload.createdAt;
    },
    removeUser: (state, action) => {
      state.user = state.user.filter((u) => u.id !== action.payload.id);
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
