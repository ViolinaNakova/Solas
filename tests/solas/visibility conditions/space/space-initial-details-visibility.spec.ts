import { expect, test } from '../../../../fixtures/pom/test-options';
import { Timeouts } from '../../../../enums/util/timeouts';
import { generateSpaceProgramType } from '../../../../test-data/factories/solas/program.factory';
import {
    spaceDefaultZone,
    spaceInitialDetailsConditionalFields,
    spaceInitialDetailsHiddenFields,
    spaceInitialDetailsVisibleFields,
    spaceVisibilityTriggers,
} from '../../../../test-data/static/solas/space-visibility';

// NGUI-2019 -- Solas Visibility Conditions for Specialty / Space, Initial
// Details section. The wizard holds a new program client-side until it is
// finalized, so these tests never persist a program and need no cleanup.
test.describe('visibility conditions - Space - Initial Details', () => {
    test.beforeEach(async ({ submissionsPage, addProgramPage }) => {
        test.setTimeout(Timeouts.ADD_PROGRAM_WIZARD_TEST);

        const programType = generateSpaceProgramType();
        test.info().annotations.push({
            type: 'Program Type',
            description: programType,
        });

        await submissionsPage.open();
        await submissionsPage.openAddProgramDialog();
        await addProgramPage.createProgram(
            'Space',
            spaceDefaultZone,
            programType
        );
    });

    test(
        'should show only the Space-relevant Initial Details fields',
        { tag: '@regression' },
        async ({ addProgramPage }) => {
            await test.step('THEN every always-visible Space field is shown', async () => {
                for (const label of spaceInitialDetailsVisibleFields) {
                    await expect(
                        addProgramPage.initialDetailsFieldLabel(label),
                        `"${label}" should be visible`
                    ).toBeVisible();
                }
            });

            await test.step('AND the Client and Local Broker add buttons are shown', async () => {
                await expect(addProgramPage.addClientButton).toBeVisible();
                await expect(addProgramPage.addLocalBrokerButton).toBeVisible();
            });

            await test.step('AND conditional fields are hidden while their condition is unmet', async () => {
                for (const label of spaceInitialDetailsConditionalFields) {
                    await expect(
                        addProgramPage.initialDetailsFieldLabel(label),
                        `"${label}" should be hidden by default`
                    ).toBeHidden();
                }
            });

            await test.step('AND fields not used by Space are hidden', async () => {
                for (const label of spaceInitialDetailsHiddenFields) {
                    await expect(
                        addProgramPage.initialDetailsFieldLabel(label),
                        `"${label}" should not be visible for Space`
                    ).toBeHidden();
                }
            });
        }
    );

    test(
        'should show Original Insured and relabel Client as Reinsured when Re is on',
        { tag: '@regression' },
        async ({ addProgramPage }) => {
            await test.step('WHEN Re is toggled on', async () => {
                await addProgramPage.flipSwitch(
                    addProgramPage.reinsuranceSwitch
                );
            });

            await test.step('THEN Original Insured is shown and Client is relabeled', async () => {
                await expect(
                    addProgramPage.initialDetailsFieldLabel('Original Insured')
                ).toBeVisible();
                await expect(
                    addProgramPage.initialDetailsFieldLabel(
                        spaceVisibilityTriggers.reinsuredClientLabel
                    )
                ).toBeVisible();
                await expect(
                    addProgramPage.initialDetailsFieldLabel('Client')
                ).toBeHidden();
            });

            await test.step('WHEN Re is toggled off again', async () => {
                await addProgramPage.flipSwitch(
                    addProgramPage.reinsuranceSwitch
                );
            });

            await test.step('THEN Original Insured is hidden again', async () => {
                await expect(
                    addProgramPage.initialDetailsFieldLabel('Original Insured')
                ).toBeHidden();
                await expect(
                    addProgramPage.initialDetailsFieldLabel('Client')
                ).toBeVisible();
            });
        }
    );

    test(
        'should show Surplus Line Broker and License number when Has Surplus Line Broker is on',
        { tag: '@regression' },
        async ({ addProgramPage }) => {
            await test.step('WHEN Has Surplus Line Broker is toggled on', async () => {
                await addProgramPage.flipSwitch(
                    addProgramPage.hasSurplusLineBrokerSwitch
                );
            });

            await test.step('THEN Surplus Line Broker and License number are shown', async () => {
                await expect(
                    addProgramPage.initialDetailsFieldLabel(
                        'Surplus Line Broker'
                    )
                ).toBeVisible();
                await expect(
                    addProgramPage.initialDetailsFieldLabel('License number')
                ).toBeVisible();
            });
        }
    );

    test(
        'should show MGA Code when Binder / Line Slip is on',
        { tag: '@regression' },
        async ({ addProgramPage }) => {
            await test.step('WHEN Binder / Line Slip is toggled on', async () => {
                await addProgramPage.flipSwitch(
                    addProgramPage.binderLineSlipSwitch
                );
            });

            await test.step('THEN MGA Code is shown', async () => {
                await expect(
                    addProgramPage.initialDetailsFieldLabel('MGA Code')
                ).toBeVisible();
            });
        }
    );

    test(
        'should show CBI Consumer when the Placing Office is FIID',
        { tag: '@regression' },
        async ({ addProgramPage }) => {
            await test.step('WHEN the FIID (Dublin) Placing Office is selected', async () => {
                await addProgramPage.selectPlacingOffice(
                    spaceVisibilityTriggers.fiidPlacingOffice
                );
            });

            await test.step('THEN CBI Consumer is shown', async () => {
                await expect(
                    addProgramPage.initialDetailsFieldLabel('CBI Consumer')
                ).toBeVisible();
            });
        }
    );

    test(
        'should show the TRIA fields for a US zone',
        { tag: '@regression' },
        async ({ addProgramPage }) => {
            await test.step('WHEN a US zone is selected', async () => {
                await addProgramPage.changeZone(spaceVisibilityTriggers.usZone);
            });

            await test.step('THEN TRIA Eligible is shown, its dependants are not', async () => {
                await expect(
                    addProgramPage.initialDetailsFieldLabel('TRIA Eligible')
                ).toBeVisible();
                await expect(
                    addProgramPage.initialDetailsFieldLabel('TRIA Taken up')
                ).toBeHidden();
                await expect(
                    addProgramPage.initialDetailsFieldLabel(
                        'US Business Placement'
                    )
                ).toBeHidden();
            });

            await test.step('WHEN TRIA Eligible is toggled on', async () => {
                await addProgramPage.flipSwitch(
                    addProgramPage.triaEligibleSwitch
                );
            });

            await test.step('THEN TRIA Taken up and US Business Placement are shown', async () => {
                await expect(
                    addProgramPage.initialDetailsFieldLabel('TRIA Taken up')
                ).toBeVisible();
                await expect(
                    addProgramPage.initialDetailsFieldLabel(
                        'US Business Placement'
                    )
                ).toBeVisible();
            });
        }
    );

    // FIXME: NGUI-2019 makes "Surplus Line broker (checkbox)" visible only for
    // a US / North America zone (IsUsZone == true), but QA shows the "Has
    // Surplus Line Broker" switch for every zone (Worldwide, Africa, Canada).
    // Un-skip once the rule is implemented or the ticket is corrected.
    // eslint-disable-next-line playwright/no-skipped-test -- intentional, see FIXME above.
    test.skip(
        'should hide Has Surplus Line Broker for a non-US zone',
        { tag: '@regression' },
        async ({ addProgramPage }) => {
            await expect(
                addProgramPage.initialDetailsFieldLabel(
                    'Has Surplus Line Broker'
                )
            ).toBeHidden();
        }
    );

    // FIXME: NGUI-2019 lists "Cont. Review Status" as Visible in Initial
    // Details for Space, but QA renders no such field -- neither in the Add
    // Program wizard nor on an existing Space program. Un-skip once the field
    // ships or the ticket is corrected.
    // eslint-disable-next-line playwright/no-skipped-test -- intentional, see FIXME above.
    test.skip(
        'should show Cont. Review Status',
        { tag: '@regression' },
        async ({ addProgramPage }) => {
            await expect(
                addProgramPage.initialDetailsFieldLabel('Cont. Review Status')
            ).toBeVisible();
        }
    );
});
