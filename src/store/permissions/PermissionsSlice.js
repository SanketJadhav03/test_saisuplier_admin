import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    permissionsList: []
}

const permissionsSlice = createSlice({
    name: 'PERMISSIONSSLICESS',
    initialState: initialState,
    reducers: {
        storePermissions: (state, action) => {
            state.permissionsList = action.payload
        },
    }
})

export const { storePermissions } = permissionsSlice.actions

export default permissionsSlice.reducer