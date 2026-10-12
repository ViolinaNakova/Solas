/** Solas API endpoint paths (relative to the API base) that UI flows wait on. */
export enum ApiEndpoints {
    /** Saves the Checks tab state; sent once per check clicked (Program, Perils, Layer and Underwriting checks). */
    UPSERT_PROGRAM_CHECKS = '/uwsub/upsertprogramchecks',
}
