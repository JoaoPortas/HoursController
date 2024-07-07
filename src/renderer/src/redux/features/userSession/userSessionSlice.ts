import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
// Is required to export to the typeof store.getState in the store.ts recognize the type and prevent a erro because of the type
export interface UserSessionState {
  userId: number | null
}

// Define the initial state using that type
const initialState: UserSessionState = {
  userId: null,
}

export const userSessionSlice = createSlice({
  name: 'userSession',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUserSession: (state, action: PayloadAction<number>) => {
        state.userId = action.payload
    },
    clearUserSession: (state) => {
      state.userId = null
    },
  },
})

export const { setUserSession, clearUserSession } = userSessionSlice.actions

export default userSessionSlice.reducer
