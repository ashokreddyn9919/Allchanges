public class SolarBotStatusFactory {
    private static final List<String> MODEL_VALUES = PicklistUtil.getValues(SolarBot__c.SolarBot_Model__c.getDescribe());
    
    private static final Integer STATUS_HISTORY_DAYS = 140; // 20 weeks
    private static final Integer STATUS_INTERVAL_DAYS = 7; // Weekly status
    
    private static final Integer TEMP_MIN = 54;
    private static final Integer TEMP_MAX = 97;
    private static final Integer TEMP_DELTA = 6;

    private static List<Double> modelKWhModifiers;    
    private Integer lastTemperature;
    private Boolean isTempTrendUp;

    public SolarBotStatusFactory() {
        initModelKWhModifiers();
    }

    public List<SolarBot_Status__c> generate(SolarBot__c bot) {
        lastTemperature = RandomGenerator.getIntFromRange(TEMP_MIN, TEMP_MAX);
        isTempTrendUp = RandomGenerator.getBoolean();
        
        List<SolarBot_Status__c> statuses = new List<SolarBot_Status__c>();
        for (Integer i=0; i<STATUS_HISTORY_DAYS; i = i + STATUS_INTERVAL_DAYS) {
            statuses.add(generateSolarBotStatus(bot, i));
        }
        return statuses;
    }

    private SolarBot_Status__c generateSolarBotStatus(SolarBot__c bot, Integer daysAgo) {
        Integer temperature = getTemperature();
        SolarBot_Status__c status = new SolarBot_Status__c();
        status.SolarBot__c = bot.Id;
        status.Status_Date__c = Date.today().addDays(0 - daysAgo);
        status.Percent_Obscured__c = RandomGenerator.getIntFromRange(2, 36);
        status.Panel_Temperature__c = temperature;
        status.Kilowatt_Hours__c = getKWh(bot, temperature);
        return status;
    }

    private Integer getTemperature() {
        Integer tempDelta = RandomGenerator.getIntFromRange(1, TEMP_DELTA);
        Integer temperature = (isTempTrendUp) ? lastTemperature + tempDelta : lastTemperature - tempDelta;
        if (temperature < TEMP_MIN) {
            temperature = TEMP_MIN;
            isTempTrendUp = !isTempTrendUp;
        } else if (temperature > TEMP_MAX) {
            temperature = TEMP_MAX;
            isTempTrendUp = !isTempTrendUp;
        } else if (RandomGenerator.getInt(10) == 0) {
            isTempTrendUp = !isTempTrendUp;
        }
        lastTemperature = temperature;
        return temperature;
    }

    private Double getKWh(SolarBot__c bot, Integer temperature) {
        Double modelModifier = getKWhModelModifier(bot);
        return (-0.002724469 * temperature * temperature + 0.392557634 * temperature - 11.20356016) * modelModifier;
    }

    private void initModelKWhModifiers() {
        modelKWhModifiers = new List<Double>();
        for (Integer i=0; i<MODEL_VALUES.size(); i++) {
            Double modifier = 1 + i * 0.1 + RandomGenerator.getDouble(0.1);
            modelKWhModifiers.add(modifier);
        }
    }

    private Double getKWhModelModifier(SolarBot__c bot) {
        Integer modelIndex = MODEL_VALUES.indexOf(bot.SolarBot_Model__c);
        if (modelIndex == -1) {
            return 1;
        }
        return modelKWhModifiers[modelIndex];
    }
}