public with sharing class MovieActorTriggerHandler extends TriggerHandler{
    
    List<MovieActor__c> newMovieActorsList = new List<MovieActor__c> (); 
    List<MovieActor__c> oldMovieActorsList = new List<MovieActor__c> ();

    Boolean isDelete;

    public MovieActorTriggerHandler() {
        newMovieActorsList = (List<MovieActor__c>) Trigger.new;
        oldMovieActorsList = (List<MovieActor__c>) Trigger.old;
    }

    protected override void afterInsert() {
        MovieActorTriggerHelper.updateNumberOfMovies(newMovieActorsList,false);
        MovieActorTriggerHelper.updateGenderPercentage(newMovieActorsList);
    }

    protected override void beforeDelete() {
        isDelete = true;
        MovieActorTriggerHelper.updateNumberOfMovies(oldMovieActorsList, true);
    }
}