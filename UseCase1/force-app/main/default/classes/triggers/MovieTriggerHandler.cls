public with sharing class MovieTriggerHandler extends TriggerHandler {
  private List<Movie__c> newMovieList;

  public MovieTriggerHandler() {
    newMovieList = (List<Movie__c>) Trigger.new;
  }

  protected override void beforeInsert() {
    MovieTriggerHelper.updateDescription(newMovieList);
  }
}
