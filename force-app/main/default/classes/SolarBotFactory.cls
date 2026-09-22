public class SolarBotFactory {
    private static final List<String> MODEL_VALUES = PicklistUtil.getValues(SolarBot__c.SolarBot_Model__c.getDescribe());
    
    public SolarBotFactory() {
    }

    public List<SolarBot__c> generate(Account account) {
        List<SolarBot__c> bots = new List<SolarBot__c>();
        Integer botCount = RandomGenerator.getIntFromRange(3, 5);
        for (Integer i=0; i<botCount; i++) {
            bots.add(generateSolarBot(account));
        }
        return bots;
    }

    private SolarBot__c generateSolarBot(Account account) {
        SolarBot__c bot = new SolarBot__c();
        bot.Account__c = account.Id;
        bot.SolarBot_Model__c = RandomGenerator.getStringFromList(MODEL_VALUES);
        Integer warrantyDays = RandomGenerator.getInt(90);
        bot.Warranty_Expiration__c = Date.today().addDays(warrantyDays - 45);
        return bot;
    }
}