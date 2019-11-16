import * as c from "./constants";

export const addHeadlines = (headlines) => ({
    type: c.HEADLINES_AVAILABLE,
    headlines
});

export const addCategoryHeadlines = (category, headlines, page = 1) => ({
    type: c.CATEGORY_HEADLINES_AVAILABLE,
    category,
    headlines,
    page
});