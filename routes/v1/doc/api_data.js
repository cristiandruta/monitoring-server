define({ "api": [
  {
    "type": "get",
    "url": "/experiments",
    "title": "Request a list of registered experiments",
    "version": "1.0.0",
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
            "description": "<p>References a registered experiment by its ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experimentID.href",
            "description": "<p>Resource location of the given experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"AVUWoIRDGMPeuCn4l-cl\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v1/mf/experiments/AVUWoIRDGMPeuCn4l-cl?workflow=test_hoppe\"\n  },\n  \"AVNXMbaBGMPeuCn4bMfv\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v1/mf/experiments/AVNXMbaBGMPeuCn4bMfv?workflow=goud\"\n  },\n  \"AVNXMsA_GMPeuCn4bMj7\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v1/mf/experiments/AVNXMsA_GMPeuCn4bMj7?workflow=athena\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/experiments",
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
    "filename": "routes/v1/experiments.js",
    "groupTitle": "Experiments"
  },
  {
    "type": "get",
    "url": "/experiments/:id",
    "title": "Request a registered experiment",
    "version": "1.0.0",
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
            "description": "<p>Experiment identifier</p>"
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
            "field": "user",
            "description": "<p>User name of the experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "application",
            "description": "<p>Application name of the experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "host",
            "description": "<p>System hostname</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "timestamp",
            "description": "<p>Timestamp when the experiment is registered</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "job_id",
            "description": "<p>Job ID of the experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"application\":\"bvlc_alexnet_time_profile\",\n  \"host\":\"fe.excess-project.eu\",\n  \"user\":\"athena\",\n  \"@timestamp\":\"2016-02-15T12:42:22.000\",\n  \"job_id\":\"143249.fe.excess-project.eu\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/experiments/AVNXMXcvGMPeuCn4bMe0?workflow=athena",
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
    "filename": "routes/v1/experiments.js",
    "groupTitle": "Experiments"
  },
  {
    "type": "post",
    "url": "/experiments/:workflowID",
    "title": "Create a new experiment with given workflow ID",
    "version": "1.0.0",
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
            "description": "<p>Workflow identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "application",
            "description": "<p>Application name, provided while registering a new experiment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "host",
            "description": "<p>Hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "user",
            "description": "<p>Username, like who is registering the experiment</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "timestamp",
            "description": "<p>When the experiment is registered</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "job_id",
            "description": "<p>Job ID, provided while registering a new experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"application\": \"bvlc_alexnet_time_profile\",\n  \"host\": \"fe.excess-project.eu\",\n  \"user\": \"athena\",\n  \"@timestamp\": \"2016-02-15T12:42:22.000\",\n  \"job_id\": \"143249.fe.excess-project.eu\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/experiments/abc123456_def",
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
            "description": "<p>References a registered experiment by its ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experimentID.href",
            "description": "<p>Link to the created experiment resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"AVXt3coOz5chEwIt8_Ma\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v1/mf/experiments/AVXt3coOz5chEwIt8_Ma?workflow=abc123456_def\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/experiments.js",
    "groupTitle": "Experiments"
  },
  {
    "type": "post",
    "url": "/metrics",
    "title": "Send bulk of metrics",
    "version": "1.0.0",
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
            "description": "<p>Hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "task",
            "description": "<p>Type of the metric, e.g. power, temperature, and so on</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ExperimentID",
            "description": "<p>When the metric is collected</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "host",
            "description": "<p>Hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>Type of the metric, e.g. power, temperature, and so on</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "timestamp",
            "description": "<p>When the metric is collected</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "metric",
            "description": "<p>Value of the metric</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "[\n    {\n         \"WorkflowID\":\"hoppe\",\n         \"task\":\"testing\",\n         \"ExperimentID\":\"AVUWnydqGMPeuCn4l-cj\",\n         \"type\":\"power\", \"host\": \"node01.excess-project.eu\", \n         \"@timestamp\": \"2016-02-15T12:46:48.749\", \n         \"GPU1:power\": \"168.519\"\n     }, {\n         \"WorkflowID\":\"athena\",\n         \"task\":\"bvlc_alexnet_time_profile\",\n         \"ExperimentID\":\"AVNXMXcvGMPeuCn4bMe0\",\n         \"type\": \"power\", \n         \"host\": \"node01.excess-project.eu\", \n         \"@timestamp\": \"2016-02-15T12:43:48.524\", \n         \"GPU0:power\": \"152.427\"\n     }\n]",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/metrics",
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
            "description": "<p>Links to all updated experiments' profiled metrics</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n      \"http://mf.excess-project.eu:3030/v1/mf/profiles/hoppe_testing/AVUWnydqGMPeuCn4l-cj\",\n      \"http://mf.excess-project.eu:3030/v1/mf/profiles/athena_bvlc_alexnet_time_profile/AVNXMXcvGMPeuCn4bMe0\"\n]",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/metrics.js",
    "groupTitle": "Metrics"
  },
  {
    "type": "post",
    "url": "/metrics/:workflowID/:experimentID",
    "title": "Send one metric",
    "version": "1.0.0",
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
            "description": "<p>Workflow identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>Experiment identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "host",
            "description": "<p>Hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "description": "<p>Type of the metric, e.g. power, temperature, and so on</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "timestamp",
            "description": "<p>When the metric is collected</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "metric",
            "description": "<p>Value of the metric</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"host\": \"fe.excess-project.eu\",\n  \"type\": \"power\",\n  \"@timestamp\": \"2016-02-15T12:42:22.000\",\n  \"GPU0:power\": \"152.427\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/metrics/athena/AVNXMXcvGMPeuCn4bMe0?task=bvlc_alexnet_time_profile",
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
            "description": "<p>References a sent metric by its ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metricID.href",
            "description": "<p>Link to the specfic experiment all profiled metrics</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"AVXt3coOz5chEwIt8_Ma\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v1/mf/profiles/athena/bvlc_alexnet_time_profile/AVNXMXcvGMPeuCn4bMe0\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/metrics.js",
    "groupTitle": "Metrics"
  },
  {
    "type": "get",
    "url": "/profiles/:workflowID/:taskID/:expID",
    "title": "Request a profiled experiment",
    "version": "1.0.0",
    "name": "GetProfilesExperiment",
    "group": "Profiles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "workflowID",
            "description": "<p>Workflow identifer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "taskID",
            "description": "<p>Task name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "expID",
            "description": "<p>Experiment identifer</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/vector_scal01/AVSbT0ChGMPeuCn4QYjq",
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
            "description": "<p>Measurements based on a system</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Metrics.timestamp",
            "description": "<p>Timestamp when the metric data is collected</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Metrics.host",
            "description": "<p>Hostname of the system</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Metrics.task",
            "description": "<p>Task name</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "Metrics.type",
            "description": "<p>Metrics type</p>"
          },
          {
            "group": "Success 200",
            "type": "Number",
            "optional": false,
            "field": "Metrics.metric",
            "description": "<p>Value of the specific metric</p>"
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
    "filename": "routes/v1/profiles.js",
    "groupTitle": "Profiles"
  },
  {
    "type": "get",
    "url": "/profiles/:workflowID/:taskID",
    "title": "Request a list of profiled experiments",
    "version": "1.0.0",
    "name": "GetProfilesTask",
    "group": "Profiles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "workflowID",
            "description": "<p>Workflow identifer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "taskID",
            "description": "<p>Task name</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/vector_scal01",
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
            "description": "<p>Date, when the task is registered</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "date.experimentID",
            "description": "<p>References in experiment by its experimentID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "date.experimentID.href",
            "description": "<p>Resource location of the specific experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"\"2016-05-11\"\":{\n     \"AVSf5_wVGMPeuCn4Qdw2\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/vector_scal01/AVSf5_wVGMPeuCn4Qdw2\"\n     },\n     \"AVSf-mU4GMPeuCn4Qd0L\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/vector_scal01/AVSf-mU4GMPeuCn4Qd0L\"\n     }\n  },\n  \"2016-05-10\":{\n     \"AVXAMB5FLeaeU4rxyi3w\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/vector_scal01/AVXAMB5FLeaeU4rxyi3w\"\n     },\n     \"AVVT4dhwenoRsEhyDkeb\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/vector_scal01/AVVT4dhwenoRsEhyDkeb\"\n     }\n  }\n}",
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
    "filename": "routes/v1/profiles.js",
    "groupTitle": "Profiles"
  },
  {
    "type": "get",
    "url": "/profiles/:workflowID",
    "title": "Request a list of profiled tasks",
    "version": "1.0.0",
    "name": "GetProfilesWorkflow",
    "group": "Profiles",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "workflowID",
            "description": "<p>Workflow identifer</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix",
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
            "field": "task",
            "description": "<p>References a registered task by its name</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "task.experimentID",
            "description": "<p>References an experiment by its experimentID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "task.experimentID.href",
            "description": "<p>Resource location of the specific experiment</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"vector_scal01\":{\n     \"AVSf5_wVGMPeuCn4Qdw2\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/vector_scal01/AVSf5_wVGMPeuCn4Qdw2\"\n     },\n     \"AVSf-mU4GMPeuCn4Qd0L\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/vector_scal01/AVSf-mU4GMPeuCn4Qd0L\"\n     }\n  },\n  \"mfnode01\":{\n     \"AVXAMB5FLeaeU4rxyi3w\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/mfnode01/AVXAMB5FLeaeU4rxyi3w\"\n     },\n     \"AVVT4dhwenoRsEhyDkeb\":{\n           \"href\":\"http://mf.excess-project.eu:3030/v1/mf/profiles/hpcfapix/mfnode01/AVVT4dhwenoRsEhyDkeb\"\n     }\n  }\n}",
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
    "filename": "routes/v1/profiles.js",
    "groupTitle": "Profiles"
  },
  {
    "type": "get",
    "url": "/runtime/:workflowID/:taskID/:expID",
    "title": "Request the duration of an experiment",
    "version": "1.0.0",
    "name": "GetRuntime",
    "group": "Runtime",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "workflowID",
            "description": "<p>Workflow identifer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "taskID",
            "description": "<p>Task name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "expID",
            "description": "<p>Experiment identifer</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/runtime/hpcfapix/vector_scal01/AVSbT0ChGMPeuCn4QYjq",
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
            "description": "<p>Start timestamp of the experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "end",
            "description": "<p>End timestamp of the experiment</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "runtime",
            "description": "<p>Duration of the experiment in seconds</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "host",
            "description": "<p>Hostname of the system</p>"
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
    "filename": "routes/v1/runtime.js",
    "groupTitle": "Runtime"
  },
  {
    "type": "get",
    "url": "/statistics/:workflowID/:taskID/:experimentID",
    "title": "Request the statistics of a specific experiment",
    "version": "1.0.0",
    "name": "GetStatsExperiment",
    "group": "Statistics",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "workflowID",
            "description": "<p>Workflow identifer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "taskID",
            "description": "<p>Task name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "experimentID",
            "description": "<p>Experiment identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "metric",
            "description": "<p>Name of the desired metric</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "host",
            "description": "<p>Hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "from",
            "description": "<p>Start point of the time interval</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "to",
            "description": "<p>End point of the time interval</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i 'http://mf.excess-project.eu:3030/v1/mf/statistics/hpcfapix/vector_scal01/AVSbT0ChGMPeuCn4QYjq?metric=DRAM_POWER:PACKAGE0&metric=DRAM_POWER:PACKAGE1&host=node01&from=2016-05-10T17:35:57.610&to=2016-05-10T17:36:57.610'",
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
            "description": "<p>Link to the correspondence user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric",
            "description": "<p>Name of the metric</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "statistics",
            "description": "<p>Statistics of the metric during the time interval</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "min",
            "description": "<p>Minimum measurement during the time interval</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "max",
            "description": "<p>Maximum measurement during the time interval</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n   {\n       \"user\":\n              {\"href\":\"http://mf.excess-project.eu:3030/v1/mf/users/hpcfapix\"},\n       \"metric\":\"DRAM_POWER:PACKAGE0\",\n       \"statistics\":\n              {\"count\":6,\n               \"min\":1.5568,\n               \"max\":1.5724,\n               \"avg\":1.5640333333333334,\n               \"sum\":9.3842,\n               \"sum_of_squares\":14.677405239999999,\n               \"variance\":0.000033938888888881045,\n               \"std_deviation\":0.0058257093034995355,\n               \"std_deviation_bounds\":\n                      {\"upper\":1.5756847519403325,\n                       \"lower\":1.5523819147263342}\n              },\n       \"min\":\n              {\"@timestamp\":\"2016-05-10T17:36:00.851\",\n               \"host\":\"node01.excess-project.eu\",\n               \"task\":\"vector_scal01\",\n               \"type\":\"energy\",\n               \"DRAM_ENERGY:PACKAGE0\":1.5573,\n               \"DRAM_POWER:PACKAGE0\":1.5568,\n               \"DRAM_ENERGY:PACKAGE1\":1.5584,\n               \"DRAM_POWER:PACKAGE1\":1.5578}\n       \"max\":{\n               \"@timestamp\":\"2016-05-10T17:35:57.610\",\n               \"host\":\"node01.excess-project.eu\",\n               \"task\":\"vector_scal01\",\n               \"type\":\"energy\",\n               \"DRAM_ENERGY:PACKAGE0\":1.5727,\n               \"DRAM_POWER:PACKAGE0\":1.5724,\n               \"DRAM_ENERGY:PACKAGE1\":1.5692,\n               \"DRAM_POWER:PACKAGE1\":1.5689}\n   }\n]",
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
    "filename": "routes/v1/statistics.js",
    "groupTitle": "Statistics"
  },
  {
    "type": "get",
    "url": "/statistics/:workflowID/:taskID",
    "title": "Request the statistics of a specific task",
    "version": "1.0.0",
    "name": "GetStatsTask",
    "group": "Statistics",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "workflowID",
            "description": "<p>Workflow identifer</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "taskID",
            "description": "<p>Task name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "metric",
            "description": "<p>Name of the desired metric</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "host",
            "description": "<p>Hostname of the system</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "from",
            "description": "<p>Start point of the time interval</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "to",
            "description": "<p>End point of the time interval</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i 'http://mf.excess-project.eu:3030/v1/mf/statistics/hpcfapix/vector_scal01?metric=DRAM_POWER:PACKAGE0&metric=DRAM_POWER:PACKAGE1&host=node01&from=2016-05-10T17:35:57.610&to=2016-05-10T17:36:57.610'",
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
            "description": "<p>Link to the correspondence user</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric",
            "description": "<p>Name of the metric</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "statistics",
            "description": "<p>Statistics of the metric during the time interval</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "min",
            "description": "<p>Minimum measurement during the time interval</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "max",
            "description": "<p>Maximum measurement during the time interval</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n   {\n       \"user\":\n              {\"href\":\"http://mf.excess-project.eu:3030/v1/mf/users/hpcfapix\"},\n       \"metric\":\"DRAM_POWER:PACKAGE0\",\n       \"statistics\":\n              {\"count\":6,\n               \"min\":1.5568,\n               \"max\":1.5724,\n               \"avg\":1.5640333333333334,\n               \"sum\":9.3842,\n               \"sum_of_squares\":14.677405239999999,\n               \"variance\":0.000033938888888881045,\n               \"std_deviation\":0.0058257093034995355,\n               \"std_deviation_bounds\":\n                      {\"upper\":1.5756847519403325,\n                       \"lower\":1.5523819147263342}\n              },\n       \"min\":\n              {\"@timestamp\":\"2016-05-10T17:36:00.851\",\n               \"host\":\"node01.excess-project.eu\",\n               \"task\":\"vector_scal01\",\n               \"type\":\"energy\",\n               \"DRAM_ENERGY:PACKAGE0\":1.5573,\n               \"DRAM_POWER:PACKAGE0\":1.5568,\n               \"DRAM_ENERGY:PACKAGE1\":1.5584,\n               \"DRAM_POWER:PACKAGE1\":1.5578}\n       \"max\":{\n               \"@timestamp\":\"2016-05-10T17:35:57.610\",\n               \"host\":\"node01.excess-project.eu\",\n               \"task\":\"vector_scal01\",\n               \"type\":\"energy\",\n               \"DRAM_ENERGY:PACKAGE0\":1.5727,\n               \"DRAM_POWER:PACKAGE0\":1.5724,\n               \"DRAM_ENERGY:PACKAGE1\":1.5692,\n               \"DRAM_POWER:PACKAGE1\":1.5689}\n   }\n]",
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
    "filename": "routes/v1/statistics.js",
    "groupTitle": "Statistics"
  },
  {
    "type": "get",
    "url": "/units",
    "title": "Request a list of registered units",
    "version": "1.0.0",
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
            "description": "<p>Metric object</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric.name",
            "description": "<p>Name of the metric</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric.plugin",
            "description": "<p>Plugin, to whom the metric belong</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "metric.unit",
            "description": "<p>Unit of the metric</p>"
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
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/units",
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
    "filename": "routes/v1/units.js",
    "groupTitle": "Units"
  },
  {
    "type": "put",
    "url": "/units/:metric_id",
    "title": "Register a unit of a metric",
    "version": "1.0.0",
    "name": "PutUnits",
    "group": "Units",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "metric_id",
            "description": "<p>Metric identifier</p>"
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
            "description": "<p>Link to the registered metric and its unit</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"href\":\"http://fangli-ThinkPad-T450s:3030/v1/v1/mf/units/GPU1:MEM_used\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/units/GPU1:MEM_used",
        "type": "curl"
      }
    ],
    "filename": "routes/v1/units.js",
    "groupTitle": "Units"
  },
  {
    "type": "post",
    "url": "/users/:uid/:eid/create",
    "title": "Create a user and associated experiment with an experiment ID",
    "version": "1.0.0",
    "name": "PostUserExperiment",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "uid",
            "description": "<p>User identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "eid",
            "description": "<p>Experiment identifier</p>"
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
            "field": "eid",
            "description": "<p>The specified experiment identifier</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     AVX9O-3oz5chEwIt8_M9\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/users/hpcfapix/AVX9O-3oz5chEwIt8_M9/create",
        "type": "curl"
      }
    ],
    "filename": "routes/v1/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "post",
    "url": "/users/:id/create",
    "title": "Create a user and associated experiment",
    "version": "1.0.0",
    "name": "PostUsers",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User identifier</p>"
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
            "description": "<p>Experiment identifier</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     AVX9O-3oz5chEwIt8_M9\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/users/hpcfapix/create",
        "type": "curl"
      }
    ],
    "filename": "routes/v1/users.js",
    "groupTitle": "Users"
  },
  {
    "type": "put",
    "url": "/users/:id",
    "title": "Register/Update a user's information",
    "version": "1.0.0",
    "name": "PutUsers",
    "group": "Users",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>User identifier</p>"
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
            "description": "<p>Link to the registered/updated user</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n     \"href\":\"http://fangli-ThinkPad-T450s:3030/v1/v1/mf/users/hpcfapix\"\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/mf/users/hpcfapix",
        "type": "curl"
      }
    ],
    "filename": "routes/v1/users.js",
    "groupTitle": "Users"
  },
  {
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "optional": false,
            "field": "varname1",
            "description": "<p>No type.</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "varname2",
            "description": "<p>With type.</p>"
          }
        ]
      }
    },
    "type": "",
    "url": "",
    "version": "0.0.0",
    "filename": "routes/v1/doc/main.js",
    "group": "_home_fangli_MF_monitoring_server_routes_v1_doc_main_js",
    "groupTitle": "_home_fangli_MF_monitoring_server_routes_v1_doc_main_js",
    "name": ""
  }
] });
