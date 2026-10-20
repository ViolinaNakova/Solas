export enum Timeouts {
    // The Financial Layers grid can take well over the default 10s expect
    // timeout to render after entering the step or after a save.
    LAYER_GRID_LOAD = 30_000,
    // QA intermittently shows a blank page for well over the default 10s
    // expect timeout before rendering a route (Submissions landing page, the
    // Add Program wizard), especially with several workers running.
    APP_RENDER = 40_000,
    // Test timeout for checks that open the Add Program wizard: loading
    // Submissions and the wizard alone can each take 10-30s on QA.
    ADD_PROGRAM_WIZARD_TEST = 120_000,
    // Click-to-edit layer fields switch out of readonly almost instantly; a
    // short wait lets a field that lost its edit state be re-clicked quickly.
    FIELD_EDITABLE = 3_000,
    // Test timeout for a 20-financial-layer program: ~15 field interactions
    // per layer against a slow, flaky live app (a passing run takes ~9-10
    // minutes), far beyond the default 60s test timeout.
    TWENTY_LAYER_PROGRAM_TEST = 1_200_000,
    // Tasks are generated server-side after the action that triggers them and
    // the header task counter only updates after a reload, so a task can take
    // a while (and several reloads) to show up.
    TASK_APPEAR = 90_000,
    // Status changes, header buttons and post-save popups re-render after a
    // server round-trip that regularly exceeds the default 10s expect timeout.
    STATUS_CHANGE = 45_000,
    // Test timeout for the full create -> Bound (Signed Off) lifecycle: a
    // passing exploratory walk-through took ~10 minutes of live app time, and
    // every status gate adds reload-and-retry waits on top.
    PROGRAM_LIFECYCLE_TEST = 1_800_000,
}
