/** Top-level application routes for the Solas platform. */
export enum Routes {
    HOME = '/',
    SUBMISSIONS = '/submissions',
    CLAIMS = '/claims',
    USERS = '/users',
    TRACKER = '/tracker',
    UMCC = '/umcc',
    TASKS = '/tasks',
    NOTES = '/notes',
    PROGRAM_ADD = '/programs/add',
    /** Base path for an existing program's edit view; build as `${PROGRAM_EDIT}/{id}/edit?tab=details`. */
    PROGRAM_EDIT = '/programs',
}
