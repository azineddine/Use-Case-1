trigger MovieActorTrigger on MovieActor__c (after insert, before delete) {
    new MovieActorTriggerHandler().run();
}