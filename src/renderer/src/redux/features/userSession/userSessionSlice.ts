import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
// Is required to export to the typeof store.getState in the store.ts recognize the type and prevent a erro because of the type
export interface UserSessionState {
  userId: number | null,
  name: string | null
}

// Define the initial state using that type
const initialState: UserSessionState = {
  userId: null,
  name: null,
}

export const userSessionSlice = createSlice({
  name: 'userSession',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserSession: (state, action: PayloadAction<UserSessionState>) => {
        state.userId = action.payload.userId
        state.name = action.payload.name
    },
    clearUserSession: (state) => {
      state.userId = null
      state.name = null
    },
  },
})

export const { setUserSession, clearUserSession } = userSessionSlice.actions

export default userSessionSlice.reducer
