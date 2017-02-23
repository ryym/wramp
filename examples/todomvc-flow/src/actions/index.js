
// type ActionType = string
// type Action = {
//   type: ActionType,
//   payload: any,
// }

// const action = (type: ActionType): (payload: any) => Action => ({ type, payload })
// const action = (type: ActionType) => (payload: any) => ({ type, payload })
// const action = (type: ActionType, makePayload: )

export const ADD_TODO = 'ADD_TODO'
export const addTodo = title => ({
  type: ADD_TODO,
  payload: { title },
})
