import {UserInfo} from "../types/user";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface UserState {
    user: UserInfo | null;
}

const initialState: UserState = {
    user: null,
};

// createSlice로 리듀서 정의
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
    },
});

export const { loginSuccess, logout, setUserInfo } = userSlice.actions;

export default userSlice.reducer;
