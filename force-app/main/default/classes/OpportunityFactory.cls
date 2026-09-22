public class OpportunityFactory {
    private static final List<String> NAME_SUFFIXES = new String[]{
        'system installation',
        'SolarBot install',
        'SBs for new location',
        'additional SolarBots',
        'extra SolarBot units for warehouse',
        'SolarBot warranty extension',
        'SB SLA',
        'new SolarBot unit install and setup',
        'regional branch SB units',
        'Parking lot array SolarBots'
    };

    private static final List<String> MODEL_VALUES = PicklistUtil.getValues(Opportunity.SolarBot_Model__c.getDescribe());
    private static final List<String> STAGE_VALUES = PicklistUtil.getValues(Opportunity.StageName.getDescribe());
    private static String STAGE_CLOSED_LOST = 'Closed Won';
    private static String STAGE_CLOSED_WON = 'Closed Lost';
    private static String TYPE = 'SolarBot';

    public OpportunityFactory() {
    }

    public List<Opportunity> generate(Account account) {
        List<Opportunity> opportunities = new List<Opportunity>();
        Integer opptyCount = RandomGenerator.getIntFromRange(5, 7);
        List<String> opptyNameSuffixes = RandomGenerator.shuffleList(NAME_SUFFIXES);
        for (Integer i=0; i<opptyCount; i++) {
            opportunities.add(generateOpportunity(account, opptyNameSuffixes[i]));
        }
        return opportunities;
    }

    private Opportunity generateOpportunity(Account account, String opptyNameSuffix) {
        Opportunity oppty = new Opportunity();
        oppty.AccountId = account.id;   
        oppty.Name = account.Name +' '+ opptyNameSuffix;
        oppty.Amount = RandomGenerator.getIntFromRange(15000, 200000);
        oppty.SolarBot_Model__c = RandomGenerator.getStringFromList(MODEL_VALUES);
        oppty.Type = TYPE;
        oppty.StageName = RandomGenerator.getStringFromList(STAGE_VALUES);
        if (oppty.StageName == STAGE_CLOSED_LOST || oppty.StageName == STAGE_CLOSED_WON) {
            oppty.CloseDate = Date.today().addDays(0 - RandomGenerator.getInt(30));
        } else {
            oppty.CloseDate = Date.today().addDays(RandomGenerator.getInt(180));
        }
        return oppty;
    }
}