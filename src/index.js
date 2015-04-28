/*** Zapier Functionality ***/

var RESERVED_QUERY_KEYS = {
  auth_key: true,
  auth_timestamp: true,
  auth_version: true,
  auth_signature: true,
  body_md5: true
};

function toOrderedArray(map) {
  return Object.keys(map).map(function(key) {
    return [key, map[key]];
  }).sort(function(a, b) {
    return a[0] > b[0];
  }).map(function(pair) {
    return pair[0] + "=" + pair[1];
  });
}

function sign(secret, toSign) {
  var signed = crypto.createHmac('sha256', secret).update(toSign).digest('hex');
  return signed;
}

var Pusher = function(credentials) {
  this.credentials = credentials;
};

Pusher.prototype.createSignedQueryString = function(options) {
  console.log('createSignedQueryString');
  var timestamp = parseInt(new Date().getTime() / 1000, 10);

  var params = {
    auth_key: this.credentials.key,
    auth_timestamp: timestamp,
    auth_version: '1.0'
  };

  if (options.body) {
     params.body_md5 = crypto.createHash('md5').update(options.body, 'utf8').digest('hex');
  }

  if (options.params) {
    for (var key in options.params) {
      if (RESERVED_QUERY_KEYS[key] !== undefined) {
        throw Error(key + ' is a required parameter and cannot be overidden');
      }
      params[key] = options.params[key];
    }
  }

  var method = options.method.toUpperCase();
  var sortedKeyVal = toOrderedArray(params);
  var queryString = sortedKeyVal.join('&');

  var signData = [method, options.path, queryString].join('\n');
  queryString += '&auth_signature=' + sign(this.credentials.secret, signData);

  return queryString;
};

var Zap = {
  
    /* Public Interface */
    trigger_pre_write: function(bundle) {
    /*
      The one and only argument:

        bundle.request.url: <string>
        bundle.request.method: <string> # 'POST'
        bundle.request.auth: <array> # [username, password]
        bundle.request.headers: <object>
        bundle.request.params: <object> # mapped as querystring
        bundle.request.data: <string> # str or null

        bundle.url_raw: <string>
        bundle.auth_fields: <object>
        bundle.trigger_data: <object> # unlikely you'll need this (the raw read data object)
        bundle.action_fields: <object> # replaced users' variable fields
        bundle.action_fields_full: <object> # before we replace users' variables

      The response should be an object of:

        url: <string>
        method: <string> # 'GET', 'POST', 'PATCH', 'PUT', 'DELETE'
        auth: <array> # [username, password]
        headers: <object>
        params: <object> # this will be mapped into the querystring
        data: <string> or null # request body: optional if POST, not needed if GET
    */

    var credentials = {
      appId: bundle.auth_fields.app_id,
      key: bundle.auth_fields.app_key,
      secret: bundle.auth_fields.app_secret
    };
    console.log('creating Pusher instance');
    var pusher = new Pusher( credentials );
    
    var data = bundle.action_fields[ 'eventData' ];
    if(data) {
      try {
        // This is massively hacky...
        // but... makes it easier to track down if thing don't
        // get spit out of Pusher as JSON
        data = JSON.parse(data);
        data = JSON.stringify(data);
      }
      catch(e) {
        // doesn't have to be JSON
        console.log("eventData was not JSON: " + e);
      }
    }
    else {
      // Use full trigger_data if no eventData has been supplied
      // stringify trigger_data object to make rest of code more consistent
      data = JSON.stringify(bundle.trigger_data);
    }
    
    var requestData = {
      name: bundle.action_fields[ 'eventName' ],
      data: data,
      channels: bundle.action_fields[ 'channels' ].split(',')
    };
    
    console.log('<request-data>');
    console.log(requestData);
    console.log('</request-data>');  
    
    var stringifiedRequestData = JSON.stringify(requestData);
    
    var options = {
      method: bundle.request.method,
      path: '/apps/' + credentials.appId + '/events',
      body: stringifiedRequestData
    };

    var queryString = pusher.createSignedQueryString( options );

    bundle.request.headers[ 'Content-Type' ] = 'application/json';
    bundle.request.url += '?' + queryString;

    var request = {
      url: bundle.request.url,
      method: bundle.request.method,
      auth: bundle.request.auth,
      headers: bundle.request.headers,
      params: bundle.request.params,
      data: stringifiedRequestData
    };

    return request;
  }
    
};

if( typeof module !== 'undefined' ) {
  module.exports = Zap;
}
