define({ "api": [
  {
    "type": "get",
    "url": "/experiments",
    "title": "1. Request a list of registered experiments",
    "version": "2.0.0",
    "name": "GetExperiments",
    "group": "Experiments",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "experimentID",
            "description": "<p>identifier of an experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experimentID.href",
            "description": "<p>link to the experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"AVUWoIRDGMPeuCn4l-cl\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v2/mf/experiments/AVUWoIRDGMPeuCn4l-cl?workflow=hpcfapix\"\n  },\n  \"AVNXMbaBGMPeuCn4bMfv\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v2/mf/experiments/AVNXMbaBGMPeuCn4bMfv?workflow=hoppe\"\n  },\n  \"AVNXMsA_GMPeuCn4bMj7\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v2/mf/experiments/AVNXMsA_GMPeuCn4bMj7?workflow=dmitry\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "details",
            "description": "<p>if set, more detailed information for each experiment is given</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "workflow",
            "description": "<p>filters results by the given user, e.g. 'hpcfapix'</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/experiments\ncurl -i http://mf.excess-project.eu:3030/v2/mf/experiments?workflow=hpcfapix&details",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Not Found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 NotFound\n{\n  \"error\": \"Not Found.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/experiments.js",
    "groupTitle": "Experiments"
  },
  {
    "type": "get",
    "url": "/experiments/:experimentID",
    "title": "2. Request a registered experiment with given experiment ID",
    "version": "2.0.0",
    "name": "GetExperimentsID",
    "group": "Experiments",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>identifier of an experiment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflow",
            "description": "<p>the username the given experiment is associated with, e.g. 'hpcfapix'</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "extends",
            "description": "<p>returns detailed information about tasks, if present</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "application",
            "description": "<p>application name of the experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "host",
            "description": "<p>hostname of the system</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "user",
            "description": "<p>user identifier of the experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "timestamp",
            "description": "<p>timestamp, when the experiment is registered</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "job_id",
            "description": "<p>job identifier of the experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"application\":\"vector_scal01\",\n  \"host\":\"fe.excess-project.eu\",\n  \"user\":\"hpcfapix\",\n  \"@timestamp\":\"2016-02-15T12:42:22.000\",\n  \"job_id\":\"143249.fe.excess-project.eu\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/experiments/AVNXMXcvGMPeuCn4bMe0?workflow=hpcfapix",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoWorkflow",
            "description": "<p>No workflow is given.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 NoWorkflow\n{\n  \"error\": \"URL parameter 'workflow' is missing\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/experiments.js",
    "groupTitle": "Experiments"
  },
  {
    "type": "post",
    "url": "/experiments/:workflowID",
    "title": "3. Create a new experiment with given workflow ID",
    "version": "2.0.0",
    "name": "PostExperiments",
    "group": "Experiments",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifier of a workflow for which an experiment shall be created, e.g. 'hpcfapix'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "application",
            "description": "<p>application name, provided while registering a new experiment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "host",
            "description": "<p>hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "user",
            "description": "<p>username, like who is registering the experiment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "timestamp",
            "description": "<p>timestamp, when the experiment is registered</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "job_id",
            "description": "<p>job identifier, provided while registering a new experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"application\": \"vector_scal01\",\n  \"host\": \"fe.excess-project.eu\",\n  \"user\": \"hpcfapix\",\n  \"@timestamp\": \"2016-02-15T12:42:22.000\",\n  \"job_id\": \"143249.fe.excess-project.eu\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/experiments/hpcfapix",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "experimentID",
            "description": "<p>identifier of an experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experimentID.href",
            "description": "<p>link to the experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"AVXt3coOz5chEwIt8_Ma\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v2/mf/experiments/AVXt3coOz5chEwIt8_Ma?workflow=hpcfapix\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/experiments.js",
    "groupTitle": "Experiments"
  },
  {
    "type": "post",
    "url": "/metrics",
    "title": "1. Send bulk of metrics",
    "version": "2.0.0",
    "name": "PostBulkMetrics",
    "group": "Metrics",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "WorkflowID",
            "description": "<p>identifier of a workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "task",
            "description": "<p>identifier of a task</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ExperimentID",
            "description": "<p>identifier of an experiment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>type of the metric, e.g. power, temperature, and so on</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "host",
            "description": "<p>hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "timestamp",
            "description": "<p>timestamp, when the metric is collected</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "metric",
            "description": "<p>value of the metric</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "[\n    {\n         \"WorkflowID\":\"hpcfapix\",\n         \"task\":\"vector_scal01\",\n         \"ExperimentID\":\"AVUWnydqGMPeuCn4l-cj\",\n         \"type\":\"power\", \"host\": \"node01.excess-project.eu\",\n         \"@timestamp\": \"2016-02-15T12:46:48.749\",\n         \"GPU1:power\": \"168.519\"\n     }, {\n         \"WorkflowID\":\"hoppe\",\n         \"task\":\"testing\",\n         \"ExperimentID\":\"AVNXMXcvGMPeuCn4bMe0\",\n         \"type\": \"power\",\n         \"host\": \"node01.excess-project.eu\",\n         \"@timestamp\": \"2016-02-15T12:43:48.524\",\n         \"GPU0:power\": \"152.427\"\n     }\n]",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/metrics",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "href",
            "description": "<p>links to all updated experiments' profiled metrics</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n      \"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix_vector_scal01/AVUWnydqGMPeuCn4l-cj\",\n      \"http://mf.excess-project.eu:3030/v2/mf/profiles/hoppe_testing/AVNXMXcvGMPeuCn4bMe0\"\n]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/metrics.js",
    "groupTitle": "Metrics"
  },
  {
    "type": "post",
    "url": "/metrics/:workflowID/:experimentID",
    "title": "2. Send one metric with given workflow ID and experiment ID",
    "version": "2.0.0",
    "name": "PostMetrics",
    "group": "Metrics",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifier of a workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>identifier of an experiment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "type",
            "description": "<p>type of the metric, e.g. power, temperature, and so on</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "host",
            "description": "<p>hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "timestamp",
            "description": "<p>timestamp, when the metric is collected</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "metric",
            "description": "<p>value of the metric</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"type\": \"power\",\n  \"host\": \"fe.excess-project.eu\",\n  \"@timestamp\": \"2016-02-15T12:42:22.000\",\n  \"GPU0:power\": \"152.427\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/metrics/hpcfapix/AVNXMXcvGMPeuCn4bMe0?task=vector_scal01",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "metricID",
            "description": "<p>identifier of the sent metric</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metricID.href",
            "description": "<p>link to the experiment with updated metrics</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"AVXt3coOz5chEwIt8_Ma\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/vector_scal01/AVNXMXcvGMPeuCn4bMe0\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/metrics.js",
    "groupTitle": "Metrics"
  },
  {
    "type": "get",
    "url": "/profiles/:workflowID/:taskID/:experimentID",
    "title": "3. Request a profiled experiment with given workflow ID, task ID and experiment ID",
    "version": "2.0.0",
    "name": "GetProfilesExperiment",
    "group": "Profiles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifer of a workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "taskID",
            "description": "<p>identifier of a registered task</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>identifier of an experiment</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/vector_scal01/AVSbT0ChGMPeuCn4QYjq",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "Metrics",
            "description": "<p>measurements based on a system</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Metrics.timestamp",
            "description": "<p>timestamp, when the metric data is collected</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Metrics.host",
            "description": "<p>hostname of the system</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Metrics.task",
            "description": "<p>task identifier</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Metrics.type",
            "description": "<p>metrics type</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Metrics.metric",
            "description": "<p>value of the specific metric</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n    {\n     \"@timestamp\":\"2016-05-10T17:35:59.576\",\n     \"host\":\"node01.excess-project.eu\",\n     \"task\":\"vector_scal01\",\n     \"type\":\"energy\",\n     \"DRAM_ENERGY:PACKAGE0\":1.5715,\n     \"DRAM_POWER:PACKAGE0\":1.571,\n    },{\n      \"@timestamp\":\"2016-05-10T17:35:59.708\",\n      \"host\":\"node01.excess-project.eu\",\n      \"task\":\"vector_scal01\",\n      \"type\":\"memory\",\n      \"MemTotal\":32771284,\n      \"MemFree\":31720604\n    },{\n      \"@timestamp\":\"2016-05-10T17:35:59.831\",\n      \"host\":\"node01.excess-project.eu\",\n      \"task\":\"vector_scal01\",\n      \"type\":\"temperature\",\n      \"CPU1_Core 1\":30,\n      \"CPU1_Core 0\":25\n    }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalSeverError",
            "description": "<p>No results found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Sever Error\n{\n  \"error\": \"No results found.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/profiles.js",
    "groupTitle": "Profiles"
  },
  {
    "type": "get",
    "url": "/profiles/:workflowID/:taskID",
    "title": "2. Request a list of profiled experiments with given workflow ID and task ID",
    "version": "2.0.0",
    "name": "GetProfilesTask",
    "group": "Profiles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifer of a workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "taskID",
            "description": "<p>identifier of a registered task</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/vector_scal01",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "date",
            "description": "<p>date, when the task is registered</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "date.experimentID",
            "description": "<p>identifier of an experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "date.experimentID.href",
            "description": "<p>link to the experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"2016-05-11\":{\n     \"AVSf5_wVGMPeuCn4Qdw2\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/vector_scal01/AVSf5_wVGMPeuCn4Qdw2\"\n     },\n     \"AVSf-mU4GMPeuCn4Qd0L\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/vector_scal01/AVSf-mU4GMPeuCn4Qd0L\"\n     }\n  },\n  \"2016-05-10\":{\n     \"AVXAMB5FLeaeU4rxyi3w\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/vector_scal01/AVXAMB5FLeaeU4rxyi3w\"\n     },\n     \"AVVT4dhwenoRsEhyDkeb\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/vector_scal01/AVVT4dhwenoRsEhyDkeb\"\n     }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalSeverError",
            "description": "<p>No results found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Sever Error\n{\n  \"error\": \"no such index.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/profiles.js",
    "groupTitle": "Profiles"
  },
  {
    "type": "get",
    "url": "/profiles/:workflowID",
    "title": "1. Request a list of profiled tasks with given workflow ID",
    "version": "2.0.0",
    "name": "GetProfilesWorkflow",
    "group": "Profiles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifer of a workflow</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "taskID",
            "description": "<p>identifier of a registered task</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "taskID.experimentID",
            "description": "<p>identifier of an experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "taskID.experimentID.href",
            "description": "<p>link to the experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"vector_scal01\":{\n     \"AVSf5_wVGMPeuCn4Qdw2\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/vector_scal01/AVSf5_wVGMPeuCn4Qdw2\"\n     },\n     \"AVSf-mU4GMPeuCn4Qd0L\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/vector_scal01/AVSf-mU4GMPeuCn4Qd0L\"\n     }\n  },\n  \"mfnode01\":{\n     \"AVXAMB5FLeaeU4rxyi3w\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/mfnode01/AVXAMB5FLeaeU4rxyi3w\"\n     },\n     \"AVVT4dhwenoRsEhyDkeb\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v2/mf/profiles/hpcfapix/mfnode01/AVVT4dhwenoRsEhyDkeb\"\n     }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalSeverError",
            "description": "<p>No results found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Sever Error\n{\n  \"error\": \"No results found.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/profiles.js",
    "groupTitle": "Profiles"
  },
  {
    "type": "get",
    "url": "/runtime/:workflowID/:taskID/:experimentID",
    "title": "1. Request the runtime of an experiment with given workflow ID, task ID and experiment ID",
    "version": "2.0.0",
    "name": "GetRuntime",
    "group": "Runtime",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifer of a workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "taskID",
            "description": "<p>identifier of a task</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "expID",
            "description": "<p>Experiment identifer of an experiment</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/runtime/hpcfapix/vector_scal01/AVSbT0ChGMPeuCn4QYjq",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "start",
            "description": "<p>start timestamp of the experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "end",
            "description": "<p>end timestamp of the experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "runtime",
            "description": "<p>duration of the experiment in seconds</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "host",
            "description": "<p>hostname of the system</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"start\":\"2016-05-10T17:35:49.125\",\n     \"end\":\"2016-05-10T17:36:01.749\",\n     \"runtime\":12.624000072479248,\n     \"host\":\"node01.excess-project.eu\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "InternalSeverError",
            "description": "<p>No results found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Sever Error\n{\n  \"error\": \"No results found.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/runtime.js",
    "groupTitle": "Runtime"
  },
  {
    "type": "get",
    "url": "/statistics/:workflowID/:taskID/:experimentID",
    "title": "2. Request the statistics of an experiment with given workflow ID, task ID and experiment ID",
    "version": "2.0.0",
    "name": "GetStatsExperiment",
    "group": "Statistics",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifer of a workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "taskID",
            "description": "<p>identifier of a task</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>identifier of an experiment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "metric",
            "description": "<p>name of a metric</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "host",
            "description": "<p>hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "from",
            "description": "<p>start time of the statistics</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "to",
            "description": "<p>end time of the statistics</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i 'http://mf.excess-project.eu:3030/v2/mf/statistics/hpcfapix/vector_scal01/AVSbT0ChGMPeuCn4QYjq?metric=DRAM_POWER:PACKAGE0&metric=DRAM_POWER:PACKAGE1&host=node01&from=2016-05-10T17:35:57.610&to=2016-05-10T17:36:57.610'",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>link to the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric",
            "description": "<p>name of the metric</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "statistics",
            "description": "<p>statistics of the metric during the time interval</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "min",
            "description": "<p>minimum measurement during the time interval</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "max",
            "description": "<p>maximum measurement during the time interval</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n   {\n       \"user\":\n              {\"href\":\"http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix\"},\n       \"metric\":\"DRAM_POWER:PACKAGE0\",\n       \"statistics\":\n              {\"count\":6,\n               \"min\":1.5568,\n               \"max\":1.5724,\n               \"avg\":1.5640333333333334,\n               \"sum\":9.3842,\n               \"sum_of_squares\":14.677405239999999,\n               \"variance\":0.000033938888888881045,\n               \"std_deviation\":0.0058257093034995355,\n               \"std_deviation_bounds\":\n                      {\"upper\":1.5756847519403325,\n                       \"lower\":1.5523819147263342}\n              },\n       \"min\":\n              {\"@timestamp\":\"2016-05-10T17:36:00.851\",\n               \"host\":\"node01.excess-project.eu\",\n               \"task\":\"vector_scal01\",\n               \"type\":\"energy\",\n               \"DRAM_ENERGY:PACKAGE0\":1.5573,\n               \"DRAM_POWER:PACKAGE0\":1.5568,\n               \"DRAM_ENERGY:PACKAGE1\":1.5584,\n               \"DRAM_POWER:PACKAGE1\":1.5578}\n       \"max\":{\n               \"@timestamp\":\"2016-05-10T17:35:57.610\",\n               \"host\":\"node01.excess-project.eu\",\n               \"task\":\"vector_scal01\",\n               \"type\":\"energy\",\n               \"DRAM_ENERGY:PACKAGE0\":1.5727,\n               \"DRAM_POWER:PACKAGE0\":1.5724,\n               \"DRAM_ENERGY:PACKAGE1\":1.5692,\n               \"DRAM_POWER:PACKAGE1\":1.5689}\n   }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoResults",
            "description": "<p>response is empty for the metric.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": \"response is empty for the metric.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/statistics.js",
    "groupTitle": "Statistics"
  },
  {
    "type": "get",
    "url": "/statistics/:workflowID/:taskID",
    "title": "1. Request the statistics of a task with given workflow ID and task ID",
    "version": "2.0.0",
    "name": "GetStatsTask",
    "group": "Statistics",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifer of a workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "taskID",
            "description": "<p>identifier of a task</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "metric",
            "description": "<p>name of a metric</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "host",
            "description": "<p>hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "from",
            "description": "<p>start time of the statistics</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "to",
            "description": "<p>end time of the statistics</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i 'http://mf.excess-project.eu:3030/v2/mf/statistics/hpcfapix/vector_scal01?metric=DRAM_POWER:PACKAGE0&metric=DRAM_POWER:PACKAGE1&host=node01&from=2016-05-10T17:35:57.610&to=2016-05-10T17:36:57.610'",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "user",
            "description": "<p>link to the user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric",
            "description": "<p>name of the metric</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "statistics",
            "description": "<p>statistics of the metric during the time interval</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "min",
            "description": "<p>minimum measurement during the time interval</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "max",
            "description": "<p>maximum measurement during the time interval</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n   {\n       \"user\":\n              {\"href\":\"http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix\"},\n       \"metric\":\"DRAM_POWER:PACKAGE0\",\n       \"statistics\":\n              {\"count\":6,\n               \"min\":1.5568,\n               \"max\":1.5724,\n               \"avg\":1.5640333333333334,\n               \"sum\":9.3842,\n               \"sum_of_squares\":14.677405239999999,\n               \"variance\":0.000033938888888881045,\n               \"std_deviation\":0.0058257093034995355,\n               \"std_deviation_bounds\":\n                      {\"upper\":1.5756847519403325,\n                       \"lower\":1.5523819147263342}\n              },\n       \"min\":\n              {\"@timestamp\":\"2016-05-10T17:36:00.851\",\n               \"host\":\"node01.excess-project.eu\",\n               \"task\":\"vector_scal01\",\n               \"type\":\"energy\",\n               \"DRAM_ENERGY:PACKAGE0\":1.5573,\n               \"DRAM_POWER:PACKAGE0\":1.5568,\n               \"DRAM_ENERGY:PACKAGE1\":1.5584,\n               \"DRAM_POWER:PACKAGE1\":1.5578}\n       \"max\":{\n               \"@timestamp\":\"2016-05-10T17:35:57.610\",\n               \"host\":\"node01.excess-project.eu\",\n               \"task\":\"vector_scal01\",\n               \"type\":\"energy\",\n               \"DRAM_ENERGY:PACKAGE0\":1.5727,\n               \"DRAM_POWER:PACKAGE0\":1.5724,\n               \"DRAM_ENERGY:PACKAGE1\":1.5692,\n               \"DRAM_POWER:PACKAGE1\":1.5689}\n   }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NoResults",
            "description": "<p>response is empty for the metric.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"error\": \"response is empty for the metric.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/statistics.js",
    "groupTitle": "Statistics"
  },
  {
    "type": "get",
    "url": "/units",
    "title": "1. Request a list of registered units",
    "version": "2.0.0",
    "name": "GetUnits",
    "group": "Units",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "metric",
            "description": "<p>metric object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric.name",
            "description": "<p>name of the metric</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric.plugin",
            "description": "<p>plugin, to whom the metric belongs</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric.unit",
            "description": "<p>unit of the metric</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"CPU0_Core 13\":\n           {\"name\":\"CPU0_Core 13\",\n            \"plugin\":\"mf_plugin_sensors\",\n            \"unit\":\"°c\"},\n     \"CPU1_Core 5\":\n           {\"name\":\"CPU1_Core 5\",\n            \"plugin\":\"mf_plugin_sensors\",\n            \"unit\":\"°c\"},\n     \"VDDIO\":\n           {\"name\":\"VDDIO\",\n            \"plugin\":\"mf_plugin_movidius\",\n            \"unit\":\"mA\"}\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/units",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "NotFound",
            "description": "<p>Not Found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 NotFound\n{\n  \"error\": \"Not Found.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/units.js",
    "groupTitle": "Units"
  },
  {
    "type": "put",
    "url": "/units/:metricID",
    "title": "2. Register a unit for a metric",
    "version": "2.0.0",
    "name": "PutUnits",
    "group": "Units",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "metricID",
            "description": "<p>identifier of a metric</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "href",
            "description": "<p>link to the registered metric and its unit</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"href\":\"http://mf.excess-project.eu:3030/v2/mf/units/GPU1:MEM_used\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/units/GPU1:MEM_used",
        "type": "curl"
      }
    ],
    "filename": "routes/v2/units.js",
    "groupTitle": "Units"
  },
  {
    "type": "post",
    "url": "/users/:userID/:experimentID/create",
    "title": "3. Create a user and an associated experiment with given experiment ID",
    "version": "2.0.0",
    "name": "PostUserExperiment",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userID",
            "description": "<p>identifier for a user, e.g. 'excess'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>identifier given for the experiment</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>identifier given for the experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n\n     AVX9O-3oz5chEwIt8_M9",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix/AVX9O-3oz5chEwIt8_M9/create",
        "type": "curl"
      }
    ],
    "filename": "routes/v2/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/users/:userID/create",
    "title": "2. Create a user and an associated experiment",
    "version": "2.0.0",
    "name": "PostUsers",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userID",
            "description": "<p>identifier for a user, e.g. 'excess'</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>unique identifier generated for the experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\nAVX9O-3oz5chEwIt8_M9",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix/create",
        "type": "curl"
      }
    ],
    "filename": "routes/v2/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "put",
    "url": "/users/:userID",
    "title": "1. Registers a new user",
    "version": "2.0.0",
    "name": "PutUsers",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userID",
            "description": "<p>identifier for a user, e.g. 'excess'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>name of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "affiliation",
            "description": "<p>affiliation of the user</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "applications",
            "description": "<p>list of applications to be monitored</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"name\": \"Fangli Pi\",\n  \"affiliation\": \"HLRS\",\n  \"applications\": [\n     \"avx\"\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "href",
            "description": "<p>link to the data stored for the given user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"href\":\"http://mf.excess-project.eu:3030/v2/mf/users/hpcfapix\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "DatabaseError",
            "description": "<p>The given user could not be registered at the database</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Resource could not be stored.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v2/users.js",
    "groupTitle": "Users"
  }
] });
