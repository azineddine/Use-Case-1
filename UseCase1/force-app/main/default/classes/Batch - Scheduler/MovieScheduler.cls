public with sharing class MovieScheduler implements Schedulable{
    public void execute(SchedulableContext sc) {
        MovieBatch movieBatch = new MovieBatch();
        Database.executeBatch(movieBatch);
    }
}