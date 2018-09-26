import Action from '../others/action';
import * as twitter from '../others/twitter';


const initialState = {
};
export default function reducer(state = initialState,action: Action) {
  switch (action.type) {
    case UPDATE:
      return action.payload
    default:
      return state
  }
}

export const DISPLAY_USER_TIMELINE = 'subcontents/DISPLAY_USER_TIMELINE'
export const displayUserTimeline = (name: string) => ({
  type: DISPLAY_USER_TIMELINE,
  payload: {name: name},
  meta: null,
  error: false,
})

const UPDATE = 'subcontents/UPDATE'
export const update = (tweets: twitter.Tweet[]|null) => ({
  type: UPDATE,
  payload: {tweets: tweets},
  meta: null,
  error: false,
})
