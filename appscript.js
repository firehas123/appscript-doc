function FetchAndWrite() {
  Logger.log('Fetching data');
  var apiUrl = 'https://api.lever.co/v1/postings';
  var token = 'bOMxvRKIXAWgLhPoLqkH0CmlGqpx5orBa4NLRhiXLjEmdLOC'; // Replace 'YOUR_TOKEN_HERE' with your actual token
  var authHeader = 'Basic ' + Utilities.base64Encode(token);
  var data;
  Logger.log('Header prepared');
  var headers = {
    'Authorization': authHeader,
  };

  var options = {
    'method': 'GET',
    'headers': headers,
  };

  try {
    Logger.log('Hitting the URL');
    var response = UrlFetchApp.fetch(apiUrl, options);
    data = response.getContentText();
  } catch (error) {
    Logger.log('Error fetching data: ' + error);
    return; // Exit the function if there's an error in fetching data
  }

  // Writing data to the sheet
  var sheetName = 'Sheet1'; // Replace 'Sheet1' with the name of your target sheet
  Logger.log('Sheet Opened');
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    var jsonDataArray;
    jsonDataArray = JSON.parse(data).data; // Access the 'data' property of the response object
    Logger.log('Data Parsed');

    // Define the headers in the order you want them to appear in the sheet
    var headers = [
      "ID",
      "Text",
      "State",
      "Distribution Channels",
      "User",
      "Owner",
      "Hiring Manager",
      "Commitment",
      "Department",
      "Level",
      "Location",
      "Team",
      "Tags",
      "Description",
      "Description HTML",
      "List 1 Text",
      "List 1 Content",
      "List 2 Text",
      "List 2 Content",
      "List 3 Text",
      "List 3 Content",
      "Closing",
      "Closing HTML",
      "Country",
      "Followers",
      "Req Code",
      "Requisition Codes",
      "List URL",
      "Show URL",
      "Apply URL",
      "Confidentiality",
      "Created At",
      "Updated At",
      "Workplace Type",
      "Salary Description",
      "Salary Description HTML",
    ];

    // Write the column names in the first row
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    Logger.log(jsonDataArray.length);
    for (var i = 0; i < jsonDataArray.length; i++) {
      var jsonData = jsonDataArray[i];
      var values = [
       getValue(jsonData, 'id'),
      getValue(jsonData, 'text'),
      getValue(jsonData, 'state'),
      getValue(jsonData, 'distributionChannels'),
      getValue(jsonData, 'user'),
      getValue(jsonData, 'owner'),
      getValue(jsonData, 'hiringManager'),
      getValue(jsonData, 'categories.commitment'),
      getValue(jsonData, 'categories.department'),
      getValue(jsonData, 'categories.level'),
      getValue(jsonData, 'categories.location'),
      getValue(jsonData, 'categories.team'),
      getValue(jsonData, 'tags'),
      getValue(jsonData, 'content.description'),
      getValue(jsonData, 'content.descriptionHtml'),
      getValue(jsonData, 'content.lists.0.text'),
      getValue(jsonData, 'content.lists.0.content'),
      getValue(jsonData, 'content.lists.1.text'),
      getValue(jsonData, 'content.lists.1.content'),
      getValue(jsonData, 'content.lists.2.text'),
      getValue(jsonData, 'content.lists.2.content'),
      getValue(jsonData, 'content.closing'),
      getValue(jsonData, 'content.closingHtml'),
      getValue(jsonData, 'country'),
      getValue(jsonData, 'followers'),
      getValue(jsonData, 'reqCode'),
      getValue(jsonData, 'requisitionCodes'),
      getValue(jsonData, 'urls.list'),
      getValue(jsonData, 'urls.show'),
      getValue(jsonData, 'urls.apply'),
      getValue(jsonData, 'confidentiality'),
      new Date(getValue(jsonData, 'createdAt')),
      new Date(getValue(jsonData, 'updatedAt')),
      getValue(jsonData, 'workplaceType'),
      getValue(jsonData, 'salaryDescription'),
      getValue(jsonData, 'salaryDescriptionHtml'),
      ];

      // Handle null values
      values = values.map(function(value) {
        return value === null ? "" : value;
      });
      values = values.map(handleNullValues);
      // Write to the sheet
      sheet.appendRow(values);
    }

    Logger.log('Data Written Completed');
  } catch (error) {
    Logger.log('Error writing data to Google Sheets: ' + error);
  }
}

// Function to handle nested objects or arrays and return the corresponding value
function getValue(obj, key) {
  var keys = key.split('.'); // Handle nested keys
  var value = obj;
  for (var i = 0; i < keys.length; i++) {
    if (value === null || typeof value !== 'object') {
      return ""; // Return empty string if the value is null or not an object
    }
    value = value[keys[i]];
  }
  return value;
}

function handleNullValues(value) {
  return value === null ? "" : value;
}
