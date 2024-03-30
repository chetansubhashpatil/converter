# converter

## Installation

### Install nodejs and npm
Instructions for Oracle Linux 7
```
sudo yum install nodejs
sudo yum install npm
```

### Cloning converter nodejs app git repository
```
git clone https://github.com/chetansubhashpatil/converter.git
```

### Install npm dependency modules
```
cd converter
npm config set registry https://artifacthub-phx.oci.oraclecorp.com/api/npm/npmjs-remote
npm --proxy http://www-proxy.us.oracle.com:80 --noproxy artifacthub-phx.oci.oraclecorp.com install
```

## Development

### Running converter nodejs app
Converter app requires [Node.js](https://nodejs.org/) v16+ to run.

Install the dependencies and start the server.
```
cd converter
node index.js
```

## Testing

### BIP job submission convert
```
curl -v --noproxy "*" -X POST -H "Content-Type:application/json" -d '{"userJobName":"CoPilot-Job","frequency": "daily", "time": "09:00", "schedule": "repeat", "email": "chetan.subhash.patil@gmail.com", "reportAbsolutePath": "/chetan/simple/report.xdo"}' http://<hostname>:3000/api/convert/bip
```

### BIP job history search
```
curl -v --noproxy "*" -H "Content-Type:application/json" -d '{"text":"give me failed jobs in last 10 days"}' -X POST http://<hostname>:3000/api/search/bip
```