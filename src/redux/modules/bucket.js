// bucket.js
import {db} from "../../firebase";
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";


// Actions (프로젝트 이름/리듀서명/액션)
const LOAD = "bucket/LOAD";
const CREATE = "bucket/CREATE";
const UPDATE = "bucket/UPDATE"
const DELETE = "bucket/DELETE";
const LOADED = "bucket/LOADED";

const initialState = {
  is_loaded: false, 
  list: [],
  //초기값은 딕셔너리 형태로 들어간다
  // list: ["영화관 가기", "매일 책읽기", "수영 배우기", "석우오빠랑 코딩하기"],
};

// Action Creators (타입별로 액션 만듦)
export function loadBucket(bucket_list) {
  console.log("액션을 생성할거야!")
return { type: LOAD, bucket_list };
}

export function createBucket(bucket) {
    console.log("액션을 생성할거야!")
  return { type: CREATE, bucket: bucket }; //그냥 bucket만 입력해도 됨
}

export function updateBucket(bucket_index){
  return { type: UPDATE, bucket_index };
}

export function deleteBucket(bucket_index) {
    console.log("지울 버킷 인덱스", bucket_index);
    return { type: DELETE, bucket_index };
}

export function isLoaded(loaded){
  return { type: LOADED, loaded };
}

// middlewares
export const loadBucketFB = () => {
  return async function (dispatch) { //비동기통신이라 async 붙임
    const bucket_data = await getDocs((collection(db, "bucket"))); // 한 컬렉션 내 데이터 모두 가지고 올 수 있음
    console.log(bucket_data);

    let bucket_list = [];

    bucket_data.forEach((bucket) => {
      console.log(bucket.data());
      bucket_list.push({id: bucket.id, ...bucket.data()});
    });

    console.log(bucket_list)

    dispatch(loadBucket(bucket_list));
  };
};

export const addBucketFB = (bucket) => {
  return async function (dispatch) {
    dispatch(isLoaded(false));
    const docRef = await addDoc(collection(db, "bucket"), bucket);
    const _bucket = await getDoc(docRef);
    const bucket_data = {id: _bucket.id, ..._bucket.data()};

    dispatch(createBucket(bucket_data));
  }
}

export const updateBucketFB = (bucket_id) => {
  return async function (dispatch, getState) {
    const docRef = doc(db, "bucket", bucket_id);
    await updateDoc(docRef, { completed: true });

    console.log(getState().bucket);
    const _bucket_list = getState().bucket.list;
    const bucket_index = _bucket_list.findIndex((b) => {
      return b.id === bucket_id;
    })
    dispatch(updateBucket(bucket_index));
  };
};

export const deleteBucketFB = (bucket_id) => {
  return async function (dispatch, getState) {
    if(!bucket_id) {
      window.alert("아이디가 없습니다!")
      return;
    }
    const docRef = doc(db, "bucket", bucket_id);
    await deleteDoc(docRef);

    const _bucket_list = getState().bucket.list;
    const bucket_index = _bucket_list.findIndex((b) => {
      return b.id === bucket_id;
    });

    dispatch(deleteBucket(bucket_index));
  }
}


// Reducer
export default function reducer(state = initialState, action = {}) {
  //파라미터에 어떤 값을 주는 것을 기본값을 주는 것이라고 한다 / 파라미터에 값이 들어오지 않으면 {} 이렇게 비워줌
  switch (action.type) {
    case "bucket/LOAD": {
      return {list: action.bucket_list, is_loaded: true};
    }
    case "bucket/CREATE": {
      console.log("이제 값을 바꿀거야!");
      const new_bucket_list = [...state.list, action.bucket]; //list에 들어갈 새로운 배열 추가
      return { ...state, list: new_bucket_list, is_loaded: true };
    }

    case "bucket/UPDATE": {

      const new_bucket_list = state.list.map((l, idx) => {
        if(parseInt(action.bucket_index) === idx){
          return {...l, completed: true};
        } else {
          return l;
        }
    });
    console.log({list: new_bucket_list});
    return { ...state, new_bucket_list}
  };

    case "bucket/DELETE": {
        console.log(state, action);
        const new_bucket_list = state.list.filter((l, idx) => {
            return parseInt(action.bucket_index) !== idx;
        });
        
        return { ...state, new_bucket_list};
    }

    case "bucket/LOADED": {
      
      return { ...state, is_loaded: action.loaded} ;
  }

    // do reducer stuff (리듀서가 하는 일)
    default:
      return state;
  }
}
