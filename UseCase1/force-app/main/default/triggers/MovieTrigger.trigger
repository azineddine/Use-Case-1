trigger MovieTrigger on Movie__c (before insert) {
    new MovieTriggerHandler().run();
}