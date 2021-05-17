//Step 5
import { FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/actionTypes';
export default (posts = [],action) => {
    switch(action.type) {
        case DELETE:
            return posts.filter((post) => post._id !== action.payload);
        case UPDATE:
            //if the post id is equal to the action payload id return the action payload
            return posts.map((post) => post._id === action.payload._id ? action.payload : post); 
        case FETCH_ALL:
            return action.payload;
        case CREATE:
            return [...posts, action.payload];
        default:
            return posts;
    }
}