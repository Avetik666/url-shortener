* Update and add documentation for clear readability even though the setup is following best practices.
* The api rate limiter is using nestjs throttler which means it is suitable only for single instance application.
  An improvement to this will be an implementation of redis for the rate limiting to handle distributed systems.
* Refine the log levels and integrate with tools such as Sentry or DataDog.
* Implement built in SWAGGER for nest.js to have a clean view of the api and directly test them through there. 
