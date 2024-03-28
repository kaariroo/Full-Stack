import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
      changeNotification(state, action) {
        return action.payload
      },
    },
  })

  export const { changeNotification, removeNotification } = notificationSlice.actions

  export const setNotification = (message, time) => {
    return (dispatch) => {
      dispatch(changeNotification(message))
        setTimeout(() => {
        dispatch(changeNotification(null))
      }, time * 1000)
    }
  }

  export default notificationSlice.reducer