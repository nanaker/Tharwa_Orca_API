//imports and constants
const base_url = "http:localhost:8080";
var request = require("request");
var expect = require('chai').expect;


//test1


//tester la récupération des info du tableau de bord
describe("GET /users/dashboard", function () {
    it(" Should get the id and the userName of the user and return with code 200", function (done) {
        request.get(
            {
                url: base_url + "/users/dashboard",
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    "token": "KbHuxD34DmAStTxCvQmhDQREJ1D9v5ElMfX0vnXGtv6Gy3xoVNRRgPPoPSZBKcTyAgGDcxuhCFQblLNbT0yNiuBQXxyqQPMMIlbfAkUyyP2r6zO3cmmfavW7OFo7yZf2yKY2QjocefP3uQEpGb5d29sXmQ4udqiwOcsJBpZaZzwK5aw4DkEHETv9txsicudNc9xjrO358QORqYRzj1tJmcS8hnTXQX8sPte56561BXHt7QmRkqa2oo25qgGFmA0"
                }
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(200);

                // done();
            }).then(done());
    });

    it(" Should detect the invalid token and return with code 401", function (done) {
        request.get(
            {
                url: base_url + "/users/dashboard",
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    "token": "hrwNzAfwNqJKrvIBtuLeVF5ADRUMdaWOdCaXRKaXo8KMHWKwLPxdzZ0ju7I4q5RJJYgkmlH8HWe7OlFAJiWrCIRWwDmrhps5is5iHWN0vqaMU1qAKHVQavCA7Kq2Yyfjc12wZZfNtzLHkssmD58AS0U60FAVx2RzgQ2cZo6ptAW6pgEMqbv3Bn8KxIKRRMkM5OvvRPy2UsglkD5W63NIJ1RlIUAXNia0CNL50uuJ8fho7INIHTNavePMaKCmrJC"
                }
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(401);

                // done();
            }).then(done());
    });

    it(" Should verify the unothorized client application for the user and return with code 401", function (done) {
        request.get(
            {
                url: base_url + "/users/dashboard",
                headers: {
                    "Content-Type": 'application/x-www-form-urlencoded',
                    "token": "IukajiUpJ2mbOVcpdlFYoRIXXVvOhcWosEjvoQ977ZCf0gnhiJNcD5VGDMeNzaIWjhYlo86FQpGWLCxg0tchEg5sJ15l8ovvGcHugVyGoePyekHA1kvt1M4XMddHs24ndPekJWz9QAX6Re7zsMyn8NuLYelDWgaTX5qWOk55pzLGhXuJqgBbYRxh7oWZvIBDAvoZ4QhSAQYFqynTFboOjvKDgkXLz4DCw9V1HZn1fAbD3JTIZRBcCHHikVwUT9R"
                }
            },
            function (error, response, body) {
                expect(response.statusCode).to.equal(401);

                //done();
            }).then(done());
    });
});