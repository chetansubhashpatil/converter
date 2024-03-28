# converter

npm install
node index.js

curl -v --noproxy "*" -d '{"test":"value"}' -X POST http://localhost:3000/api/convert

curl -X PUT -u admin:welcome1 -H "X-BI-SERVICE-INSTANCE-KEY:sikt1s1" -H "Content-Type:application/json" -v -d '{"dataModelUrl":"/chetan/simple/datamodel.xdm","startDate":"2024-03-028T11:45:00.000","endDate":"2024-03-29T19:45:00.000","recurrenceExpression":"0 0 12 * * ?","reportRequest":{"reportAbsolutePath":"/chetan/simple/report.xdo"}}' http://localhost:8080/xmlpserver/services/rest/v1/jobs/scheduleJob
