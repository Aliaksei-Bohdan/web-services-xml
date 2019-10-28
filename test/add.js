const chai = require("chai");
const chaiXml = require('chai-xml');
const expect = chai.expect;
const sendRequest = require("../lib/sendRequest");
const someRequests = require("../data/someRequests");
const env = require("../endpoint/test");
const fetch = require("node-fetch");
const DOMParser = require('xmldom').DOMParser;

chai.use(chaiXml);

describe('Get product by id', () => {

    // console.log(someRequests);
    // const getUsers = someRequests.slice(0,2);

    someRequests.map((data) => {
        let response, parser, xmlDoc;
        let id = data.uri.split('/')[3];

        before(async () => {
            data.uri = env.uri + data.uri;
            response = await sendRequest(data);
            res = await fetch(data.uri);
            
            if(data.method == 'GET') {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(response,"application/xml");
            }
        });
        
        it('should be valid ' , () => {
            expect(response).xml.to.be.valid();
        });

        it('Verifying response status 200 ', async () => {
            expect(res.status).to.match(/^20\d/);
        });
        
        console.log(data.method);
        if(data.method == 'GET') {
            it('Verifying id ' + id, async () => {
                let checkId = xmlDoc.getElementsByTagName('ID')[0].childNodes[0].nodeValue;
                expect(checkId).to.eql(id);
            });
        }
    });
});