import { createSelector } from "reselect";

export const getUserProgress = (state) => state.profile.userProgress;
export const getProfileLoading = (state) => state.profile.isLoading;
export const getCurrentPage = (state) => state.profile.currentPage;
export const getCoursesCount = (state) => state.profile.coursesCount;

export const getUserCompletionStats = createSelector([getUserProgress], (userProgress) => {
    if (userProgress.statistics.length === 0)
        return ({ completedCount: 0, inProcessCount: 0 })
    const completedCount = userProgress.statistics.filter(course => course.completion_percent == 100).length;
    const inProcessCount = userProgress.statistics.filter(course => course.completion_percent != 100).length;
    return ({ completedCount, inProcessCount })
});