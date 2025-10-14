export const getUser = (state) => state.auth.user;
export const getLoadingUser = (state) => state.auth.isLoading;

//Notify
export const getRequestResetStatus = (state) => state.auth.requestResetStatus;
export const getResetStatus = (state) => state.auth.resetStatus;
export const getSignInStatus = (state) => state.auth.signInStatus;
export const getSignUpStatus = (state) => state.auth.signUpStatus;
