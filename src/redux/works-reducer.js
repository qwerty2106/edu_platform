import { WorksAPI } from "../service/api";

const SET_WORKS = 'works/SET-WORKS';
const SET_LOADING = "rooms/SET-LOADING";

const initialState = {
    works: [],
    isLoading: true,
}

export const worksReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_WORKS:
            return {
                ...state,
                works: action.works
            }
        case SET_LOADING:
            return {
                ...state,
                isLoading: action.isLoading
            }
        default:
            return state
    }
}

export const setWorks = (works) => ({ type: SET_WORKS, works });
export const setLoading = (isLoading) => ({ type: SET_LOADING, isLoading });


export const requestWorks = (currentPage, pageSize) => {
    return async (dispatch) => {
        dispatch(setLoading(true));
        try {
            const data = await WorksAPI.getWorks(currentPage, pageSize);
            dispatch(setWorks(data));
        }
        catch (error) {
            console.log('Get works error', error);
        }
        dispatch(setLoading(false));
    };
};