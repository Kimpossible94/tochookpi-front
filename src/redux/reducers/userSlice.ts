import {UserInfo, UserSetting} from "../types/user";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState {
    user: UserInfo | null;
}

const initialState: UserState = {
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginSuccess(state, action: PayloadAction<UserInfo>) {
            state.user = action.payload;
        },
        logout(state) {
            state.user = null;
        },
        setUserInfo: (state, action: PayloadAction<UserInfo>) => {
            state.user = action.payload;
        },
        setUserSetting: (state, action: PayloadAction<UserSetting>) => {
            if (state.user) {
                state.user.userSetting = action.payload;
            }
        },
    },
});

export const { loginSuccess, logout, setUserInfo, setUserSetting } = userSlice.actions;

export default userSlice.reducer;
