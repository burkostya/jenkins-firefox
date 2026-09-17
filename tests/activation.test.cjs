const {test}=require('node:test');
const assert=require('node:assert/strict');
const activation=require('../src/activation.js');

test('job URL detection accepts Jenkins job/build paths on http(s)',()=>{
  assert.equal(activation.isJobUrl('https://jenkins.test/job/team/job/service/42/'),true);
  assert.equal(activation.isJobUrl('https://jenkins.test/jenkins/job/service/'),true);
  assert.equal(activation.isJobUrl('http://localhost:8080/job/service/'),true);
});

test('job URL detection rejects other protocols and non-job pages',()=>{
  for(const value of ['https://jenkins.test/','https://jenkins.test/manage/','file:///tmp/job/x/','javascript:alert(1)','not a url'])
    assert.equal(activation.isJobUrl(value),false,value);
});

test('origin permission pattern is exact to the current Jenkins origin',()=>{
  assert.equal(activation.originFromUrl('https://jenkins.test:8443/jenkins/job/x/2/'),'https://jenkins.test:8443');
  assert.equal(activation.patternFromOrigin('https://jenkins.test:8443'),'https://jenkins.test:8443/*');
  assert.equal(activation.patternFromOrigin('https://jenkins.test:8443/path'),null);
});

test('stored auto origins are normalized, deduplicated and invalid entries are dropped',()=>{
  assert.deepEqual(activation.normalizeOrigins([
    'https://jenkins.test','https://jenkins.test','http://localhost:8080','https://jenkins.test/path','file://host','oops'
  ]),['https://jenkins.test','http://localhost:8080']);
});
