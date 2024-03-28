# converter

npm config set registry https://artifacthub-phx.oci.oraclecorp.com/api/npm/npmjs-remote`
npm --proxy http://www-proxy.us.oracle.com:80 --noproxy artifacthub-phx.oci.oraclecorp.com install
node index.js

curl -v --noproxy "*" -X POST -H "Content-Type:application/json" -d '{"frequency": "daily", "time": "09:00", "schedule": "repeat", "email": "robert@gmail.com", "reportAbsolutePath": "/chetan/simple/report.xdo"}' http://localhost:3000/api/convert/bip

curl -X PUT -u admin:welcome1 -H "X-BI-SERVICE-INSTANCE-KEY:sikt1s1" -H "Content-Type:application/json" -v -d '{"userJobName":"copilot","startDate":"2024-03-29T11:45:00.000","endDate":"2024-03-29T19:45:00.000","recurrenceExpression":"0 0 12 * * ?","reportRequest":{"reportAbsolutePath":"/chetan/simple/report.xdo","attributeTemplate":"report.xpt","attributeFormat":"pdf"}}' http://localhost:8080/xmlpserver/services/rest/v1/jobs/scheduleJob


curl -X PUT -u admin:welcome1 -H "X-BI-SERVICE-INSTANCE-KEY:sikt1s1" -H "Content-Type:application/json" -v -d '{"userJobName":"copilot","startDate":"2024-03-29T11:45:00.000","endDate":"2024-03-29T19:45:00.000","recurrenceExpression":"0 0 12 * * ?","reportRequest":{"reportAbsolutePath":"/chetan/simple/report.xdo"}}' http://localhost:8080/xmlpserver/services/rest/v1/jobs/scheduleJob


curl -X PUT -u admin:welcome1 -H "X-BI-SERVICE-INSTANCE-KEY:sikt1s1" -H "Content-Type:application/json" -v -d '{"userJobName":"CoPilot-daily-20240328153833","startDate":"2024-03-28T10:09:33.918","endDate":"2024-03-31T10:09:33.918","reportRequest":{"reportAbsolutePath":"/chetan/simple/report.xdo"},"recurrenceExpression":"00 09 12 * * ?"}' http://localhost:8080/xmlpserver/services/rest/v1/jobs/scheduleJob