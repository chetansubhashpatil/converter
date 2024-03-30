const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const moment = require('moment');
const axios = require('axios');
const app = express();
app.use(cors()); // Allow access from all origins
const PORT = process.env.PORT || 3000;

const bip_daily_cron_exp = "@@min@@ @@hour@@ 12 * * ?";
var bip_job_template = '{"userJobName":"@@userJobName@@","startDate":"@@startDate@@","endDate":"@@endDate@@","reportRequest":{"reportAbsolutePath":"@@reportAbsolutePath@@"}}';
const dummy_input_convert = '{"userJobName":"CoPilot-Job","frequency": "daily", "time": "09:00", "schedule": "repeat", "email": "robert@gmail.com", "reportAbsolutePath": "/chetan/simple/report.xdo"}';

const llm_endpoint = 'http://phoenix431339.private5.oaceng02phx.oraclevcn.com:5004/getSearch';
const bip_job_history_search_prompt = '{"text":"give me failed jobs in last 10 days"}';
var bip_job_history_search_template = '{"status":"@@status@@","startDate":"@@startDate@@","endDate":"@@endDate@@"}';
const dummy_input_search = '{"status": "complete", "startDate": "2024-01-10", "endDate": "2024-01-20"}';

// Middleware
app.use(bodyParser.json());

// POST convert request
app.post('/api/convert/:component', async (req, res) => {
    const component = req.params.component;
    console.log("Component: " + component);
    const request = req.body;
    //const request = JSON.parse(dummy_input_convert);
    console.log("Request: " + JSON.stringify(request));
    var response = "{}";
    var errorMsg = "";
    var responseCode = 200;
    if (component && component.toLowerCase() === "bip" && request)
    {
        console.log("BIP component conversion begin");

        // Read the request data
        // time
        var time = "00:00";
        if (request.time)
        {
            time = request.time;
            console.log("Setting time " + time);
        }

        // frequency
        var recurrenceExpressionCron = "";
        var frequency = "daily";
        if (request.frequency)
        {
            frequency = request.frequency;
            console.log("Setting frequency " + frequency);
            recurrenceExpressionCron = bip_daily_cron_exp;
        }

        // recurrence
        if (recurrenceExpressionCron.length !== 0)
        {
            //var recur = {recurrenceExpression: ""};
            var timeSplit = time.split(":");
            var hour = timeSplit[0];
            var min = timeSplit[1];
            recurrenceExpressionCron = recurrenceExpressionCron.replace("@@hour@@", hour).replace("@@min@@", min);
            //recurrenceExpression = JSON.stringify(recur);
            console.log("Setting recurrence expression " + recurrenceExpressionCron);
        }

        // report path
        var reportAbsolutePath = "";
        if (request.reportAbsolutePath)
        {
            reportAbsolutePath = request.reportAbsolutePath;
            console.log("Setting report absolute path " + reportAbsolutePath);
        }

        const currentDate = new Date();
        // Start after 1 minute
        var startDate = new Date(currentDate.getTime() + 60000);
        // End after 3 days
        var endDate = new Date(startDate.getTime() + 259200000);
        const startDateStr = startDate.toISOString().replace('Z', '');
        console.log("Setting start date " + startDateStr);
        const endDateStr = endDate.toISOString().replace('Z', '');
        console.log("Setting end date " + endDateStr);

        var jobName = "CoPilot-" + frequency + "-" + moment(currentDate).format("YYYYMMDDHHmmss");
        if (request.userJobName)
        {
          jobName = request.userJobName;
          console.log("Setting userJobName " + jobName);
        }        

        if (reportAbsolutePath.length !== 0)
        {
            response = bip_job_template.replace("@@userJobName@@", jobName).replace("@@startDate@@", startDateStr).replace("@@endDate@@", endDateStr).replace("@@reportAbsolutePath@@", reportAbsolutePath);
            console.log("Initial job json " + response);
            if (recurrenceExpressionCron.length !== 0)
            {
                var responseObj = JSON.parse(response);
                responseObj.recurrenceExpression = recurrenceExpressionCron;
                response = JSON.stringify(responseObj);
                console.log("Job json after appending recurrence exp " + response);
            }
        }
        else
        {
            errorMsg = "Report path is empty";
        }
        
        console.log("BIP component conversion end");
    }

    if (errorMsg.length !== 0)
    {
        var errorObj = {error: errorMsg};
        response = JSON.stringify(errorObj);
        responseCode = 400;
    }

    console.log("Sending response " + responseCode + " " + response);
    res.status(responseCode).json(JSON.parse(response));
  });


// POST search request
app.post('/api/search/:component', async (req, res) => {
    const component = req.params.component;
    console.log("Component: " + component);
    const request = req.body;
    //const request = JSON.parse(dummy_input_search);
    console.log("Request: " + JSON.stringify(request));
    var response = "{}";
    var errorMsg = "";
    var responseCode = 200;

    var responseData = {}; 
    if (request && request.text)
    {
      responseData = await searchQuery(JSON.stringify(request));
      //responseData = JSON.parse(dummy_input_search);
    }
    else
    {
      errorMsg = "No prompt recieved";
    }

    if (!responseData || responseData.error) 
    {
        errorMsg = "Error calling LLM model";
    }

    if (component && component.toLowerCase() === "bip" && responseData && !responseData.error)
    {
        console.log("BIP component searching begin");

        // Read the request data
        const currentDate = new Date();

        // end date
        // End date default current time minus 1 minute
        var endDate = new Date(currentDate.getTime() - 60000);
        if (responseData.endDate)
        {
            var tempEndDate = responseData.endDate;
            if(tempEndDate.indexOf('T') === -1)
            {
              tempEndDate = tempEndDate + "T00:00:00.000";
            }
            endDate = new Date(tempEndDate);            
        }
        const formattedEndDate = endDate.toLocaleDateString('en-US', {
          month: 'short', // Short month name (e.g., "Mar")
          day: '2-digit', // Two-digit day of the month (e.g., "22")
          year: 'numeric' // Full year (e.g., "2024")
        });
        const formattedEndTime = endDate.toLocaleTimeString('en-US', {
          hour: '2-digit', // Two-digit hour (e.g., "08")
          minute: '2-digit', // Two-digit minute (e.g., "46")
          second: '2-digit', // Two-digit second (e.g., "32")
          hour12: true // Use 12-hour clock format (AM/PM)
        });
        const endDateStr = `${formattedEndDate} ${formattedEndTime}`;
        console.log("Setting end date " + endDateStr);

        // start date
        // Start date default end time minus 3 days
        var startDate = new Date(endDate.getTime() - 259200000);
        if (responseData.startDate)
        {
          var tempStartDate = responseData.endDate;
          if(tempStartDate.indexOf('T') === -1)
          {
            tempStartDate = tempStartDate + "T00:00:00.000";
          }
          startDate = new Date(tempStartDate);            
        }
        const formattedStartDate = startDate.toLocaleDateString('en-US', {
          month: 'short', // Short month name (e.g., "Mar")
          day: '2-digit', // Two-digit day of the month (e.g., "22")
          year: 'numeric' // Full year (e.g., "2024")
        });
        const formattedStartTime = startDate.toLocaleTimeString('en-US', {
          hour: '2-digit', // Two-digit hour (e.g., "08")
          minute: '2-digit', // Two-digit minute (e.g., "46")
          second: '2-digit', // Two-digit second (e.g., "32")
          hour12: true // Use 12-hour clock format (AM/PM)
        });
        const startDateStr = `${formattedStartDate} ${formattedStartTime}`;
        console.log("Setting start date " + startDateStr);

        
        // status
        var status = "complete";
        if (responseData.status)
        {
            status = responseData.status;
            console.log("Setting status " + status);
        }

        // Make status compatible with BIP status
        if (status.toLowerCase() === "complete")
        {
          status = "S";
        }
        else if (status.toLowerCase() === "error")
        {
          status = "F";
        }
        else
        {
          status = "F";
        }
        
        response = bip_job_history_search_template.replace("@@status@@", status).replace("@@startDate@@", startDateStr).replace("@@endDate@@", endDateStr);
        console.log("Job history search json " + response);
                
        console.log("BIP component searching end");
    }


    if (errorMsg.length !== 0)
    {
        var errorObj = {error: errorMsg};
        response = JSON.stringify(errorObj);
        responseCode = 400;
    }

    console.log("Sending response " + responseCode + " " + response);
    res.status(responseCode).json(JSON.parse(response));
});


async function searchQuery(prompt) 
{
    console.error("LLM search query starting");
    var res = {};
    try 
    {
      // Make call to llm with post data with timeout set to 30 seconds (30000 milliseconds)
      const response = await axios.post(llm_endpoint, JSON.parse(prompt), {timeout: 30000});
      //const response = await axios.post("http://localhost:3000/api/convert/bip", JSON.parse(dummy_input_convert));
      console.log("LLM search query response: " + JSON.stringify(response.data));
      // Return the response data
      res = response.data; 
    } 
    catch (err) 
    {
      console.error("LLM search query error: " + JSON.stringify(err));
      res = {error: err};
      // Re-throw the error to handle it outside this function if needed
      //throw err; 
    }
    console.error("LLM search query ending");
    return res;
}


/*
// Sample data (you can replace this with a database)
let todos = [
  { id: 1, text: 'Learn Node.js', done: false },
  { id: 2, text: 'Build a REST API', done: false }
];

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET todo by ID
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === id);
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  res.json(todo);
});

// POST a new todo
app.post('/api/todos', (req, res) => {
  const todo = req.body;
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT (update) a todo by ID
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  todos[index] = { ...todos[index], ...req.body };
  res.json(todos[index]);
});

// DELETE a todo by ID
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.status(204).end();
});
*/

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
