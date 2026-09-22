public class CaseFactory {
    
    private static final List<String> SUBJECT_VALUES = new String[]{
        'SolarBot shutting down unexpectedly',
        'SB cleaning efficiency is declining',
        'Cradle for SolarBot no longer nesting properly',
        'Frequent mechanical breakdowns',
        'Installation was unsuccessful',
        'Assembly instructions unclear/not followed correctly',
        'SolarBot will not begin daily cleaning routine',
        'SB “whirring” now sounds more of a “clanging”',
        'Panels are no longer fully wiped after scrub cycle',
        'SolarBot brushes are wearing out quickly'
    };

    private static final List<String> STATUS_VALUES = PicklistUtil.getValues(Case.Status.getDescribe());
    private static final List<String> ORIGIN_VALUES = PicklistUtil.getValues(Case.Origin.getDescribe());
    private static final List<String> REASON_VALUES = PicklistUtil.getValues(Case.Reason.getDescribe());
    
    private static final String REASON_COMPLEXITY = 'Equipment Complexity';
    private static final Double REASON_COMPLEXITY_RATE = 0.35;

    private static String TYPE = 'SolarBot';

    static {
        // Get rid of 'Complexity reason' because there is a special rule for it
        REASON_VALUES.remove(REASON_VALUES.indexOf(REASON_COMPLEXITY));
    }

    public CaseFactory() {
    }

    public List<Case> generate(Account account) {
        List<Case> cases = new List<Case>();
        Integer caseCount = RandomGenerator.getIntFromRange(3, 5);
        for (Integer i=0; i<caseCount; i++) {
            cases.add(generateCase(account));
        }
        return cases;
    }

    private Case generateCase(Account account) {
        Case newCase = new Case();
        newCase.AccountId = account.id;
        newCase.Subject = RandomGenerator.getStringFromList(SUBJECT_VALUES);
        newCase.Status = RandomGenerator.getStringFromList(STATUS_VALUES);
        newCase.Origin = RandomGenerator.getStringFromList(ORIGIN_VALUES);
        // Have up to 35% of Reason = Equipment Complexity
        if (RandomGenerator.getDouble(1) < REASON_COMPLEXITY_RATE) {
            newCase.Reason = REASON_COMPLEXITY;
        }
        else {
            newCase.Reason = RandomGenerator.getStringFromList(REASON_VALUES);
        }
        newCase.Type = TYPE;
        return newCase;
    }
}