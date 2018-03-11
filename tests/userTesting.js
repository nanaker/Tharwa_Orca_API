//imports and constants
const base_url = "http://api-tharwaa.cleverapps.io";
var request = require("request");
var expect  = require('chai').expect;

//tester la récupération des info du tableau de bord
describe("GET /users/dashboard", function () {
        it(" Should get the id and the userName of the user return with code 200", function (done) {
           request.get(
               {url : base_url + "/users/dashboard",
                headers : {
                    "Content-Type" : 'application/x-www-form-urlencoded',
                    "token" : "m7t9OqBHOmw2CYnuGHrrhfCiOAMMSaSYoPPR8KLWATIV8KnnkOWAFFIR2ToSqapz6ttnoNXfUeBTdijfnI6PaxkVyv8qYXMkj8vv0R0Eu9o0wyrQqvxj0lSf8ASU49FLUElkzaAot3FGfoLF8g7raNaux8OHQ5HDU5c2udeKDp46uZz5nWPH0X3O6vKq1srKciExpTN0dFw7JjKfugvSzvRI3tOhgag0hoSHa6MrTu8ouW1GVlHX9KgSbXOXTjJ"
                }},
              function (error, response, body) {
              expect(response.statusCode).to.equal(200);
              
             // done();
            }).then(done());
        });

        it(" Should verify the invalid token and return with code 401", function (done) {
            request.get(
                {url : base_url + "/users/dashboard",
                 headers : {
                     "Content-Type" : 'application/x-www-form-urlencoded',
                     "token" : "hrwNzAfwNqJKrvIBtuLeVF5ADRUMdaWOdCaXRKaXo8KMHWKwLPxdzZ0ju7I4q5RJJYgkmlH8HWe7OlFAJiWrCIRWwDmrhps5is5iHWN0vqaMU1qAKHVQavCA7Kq2Yyfjc12wZZfNtzLHkssmD58AS0U60FAVx2RzgQ2cZo6ptAW6pgEMqbv3Bn8KxIKRRMkM5OvvRPy2UsglkD5W63NIJ1RlIUAXNia0CNL50uuJ8fho7INIHTNavePMaKCmrJC"
                 }},
               function (error, response, body) {
               expect(response.statusCode).to.equal(401);
               
              // done();
             }).then(done());
        });

        it(" Should verify the unothorized client application for the user and return with code 401", function (done) {
            request.get(
                {url : base_url + "/users/dashboard",
                 headers : {
                     "Content-Type" : 'application/x-www-form-urlencoded',
                     "token" : "IukajiUpJ2mbOVcpdlFYoRIXXVvOhcWosEjvoQ977ZCf0gnhiJNcD5VGDMeNzaIWjhYlo86FQpGWLCxg0tchEg5sJ15l8ovvGcHugVyGoePyekHA1kvt1M4XMddHs24ndPekJWz9QAX6Re7zsMyn8NuLYelDWgaTX5qWOk55pzLGhXuJqgBbYRxh7oWZvIBDAvoZ4QhSAQYFqynTFboOjvKDgkXLz4DCw9V1HZn1fAbD3JTIZRBcCHHikVwUT9R"
                 }},
               function (error, response, body) {
               expect(response.statusCode).to.equal(401);
               
               //done();
             }).then(done());
        });
});