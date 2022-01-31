import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import bucket from "./modules/bucket";

const middleWares = [thunk];
const rootReducer = combineReducers({ bucket }); //리듀서를 묶은것이 root
const enhancer = applyMiddleware(...middleWares);

//스토어 만들기
const store = createStore(rootReducer, enhancer);

export default store;
