/** Underwriting statuses shown in the program header badge, in lifecycle order. */
export enum UnderwritingStatus {
    OPPORTUNITY = 'Opportunity',
    PARTIAL_SUBMISSION = 'Partial Submission',
    SUBMISSION_READY = 'Submission Ready',
    QUOTED_AWAITING_FOT = 'Quoted/Awaiting FOT',
    BOUND = 'Bound',
    BOUND_PRE_SIGN_OFF = 'Bound (Pre Sign-Off)',
    BOUND_SIGNED_OFF = 'Bound (Signed Off)',
}

/** Program header buttons that move a program to its next underwriting status. */
export enum StatusButton {
    SUBMISSION_READY = 'Submission Ready',
    QUOTED_AWAITING_FOT = 'Quoted/Awaiting FOT',
    FOT_RECEIVED = 'FOT Received',
    BOUND = 'Bound',
    PRE_SIGN_OFF = 'Pre Sign-Off',
    SIGN_OFF = 'Sign-Off',
}

/** File drop spots offered in the Files tab "Edit File Properties" dialog. */
export enum DropSpot {
    SUBMISSION = 'Submission',
    QUOTE = 'Quote',
    SIGNING = 'Signing',
}

/** Task names shown on task cards in the program Tasks panel. */
export enum TaskName {
    COMPLIANCE_LICENSE_CHECK = 'Compliance License check',
    PRICING = 'Pricing',
    RISK_CARD_UMCC_NOTES = 'Risk Card - Add UMCC Notes',
    REFERRAL = 'Referral to capacity providers',
    HOTLINE = 'Populate hotline outcome',
    UMCC_OUTCOME = 'Populate UMCC outcome',
}

/** Option labels picked while moving a program through its lifecycle. */
export enum LifecycleOption {
    COMPLIANCE_RESOLUTION = 'Risk permitted correctly flagged',
    REFERRAL_APPROVED = 'Approved',
    HOTLINE_PROCEED = 'Proceed',
    NOTE_TEMPLATE_UMCC = 'UMCC',
    UMCC_REVIEWED = 'Reviewed',
    UMCC_DECLINED = 'Declined',
    UMCC_BRING_BACK = 'Bring Back',
    PLACEMENT_TYPE_NA = 'N/A',
    CLIENT_SIZE_LARGE_RISK = 'Large Risk / Reinsurance',
    CONTRACT_DRAFT_RECEIVED = 'Draft Received',
    CONTRACT_NO_REVIEW_REQUIRED = 'No Review Required',
}

/** UI feedback text shown during the program lifecycle. */
export enum LifecycleMessage {
    FINANCIAL_LAYERS_SAVED = 'Financial layers saved',
    FILE_NAME_EXISTS = 'File name already exists',
    BROKER_CONTACT_REQUIRED = 'At least one broker contact must be added.',
    CLIENT_SIZE_REQUIRED = 'Client Size is required',
    CHANGE_OF_RISK_STATUS = 'Change of Risk Status',
}
