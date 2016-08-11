define({ "api": [
  {
    "type": "get",
    "url": "/deployments/:workflowID/:taskID/:platformID",
    "title": "3. Return available deployment plans",
    "version": "1.0.0",
    "name": "GetDeployments",
    "group": "Deployment_Plans",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifier for a workflow, e.g. 'ms2'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "taskID",
            "description": "<p>identifier for a task, e.g. 't2.1'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platformID",
            "description": "<p>identifier for a platform, e.g. 'excesscluster'</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/dreamcloud/mf/deployments/ms2/t2.1/excesscluster",
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
            "field": "deploymentPlanID",
            "description": "<p>identifier for a deployment plan</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "deploymentPlanID.href",
            "description": "<p>link to the actual deployment plan</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"cf8ba177b43e4a837c4c213f6a149ead4f1ec9ef2e976306a07711e88bf6c60c\": {\n     \"href\": \"http://mf.excess-project.eu:3030/v1/dreamcloud/mf/deployments/ms2/t2.1/excesscluster/cf8ba177b43e4a837c4c213f6a149ead4f1ec9ef2e976306a07711e88bf6c60c\"\n  },\n  \"e57d089e2cc396f04d277aa35c399b4a5af5b56f65682b4f4952dd7f334a2c15\": {\n     \"href\": \"http://mf.excess-project.eu:3030/v1/dreamcloud/mf/deployments/ms2/t2.1/excesscluster/e57d089e2cc396f04d277aa35c399b4a5af5b56f65682b4f4952dd7f334a2c15\"\n  },\n  \"d6d33f5097e23e55659aba9004dbeb257970926e3927a01c10ff431fe48555e9\": {\n     \"href\": \"http://mf.excess-project.eu:3030/v1/dreamcloud/mf/deployments/ms2/t2.1/excesscluster/d6d33f5097e23e55659aba9004dbeb257970926e3927a01c10ff431fe48555e9\"\n  },\n  \"79f2e72501da8a8bcff9d6cd711b44a0fe8174a751e897c51ef7a7d110b925d8\": {\n     \"href\": \"http://mf.excess-project.eu:3030/v1/dreamcloud/mf/deployments/ms2/t2.1/excesscluster/79f2e72501da8a8bcff9d6cd711b44a0fe8174a751e897c51ef7a7d110b925d8\"\n  },\n  ..\n}",
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
            "field": "NotFound",
            "description": "<p>No deployment plans available for the given combination of workflow, task, and platform</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"No deployment plans found for the given worklow, task, and platform.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/dreamcloud/deployments.js",
    "groupTitle": "Deployment_Plans"
  },
  {
    "type": "get",
    "url": "/deployments/:workflowID/:taskID/:platformID/:deploymentPlanID",
    "title": "2. Return a given deployment plan",
    "version": "1.0.0",
    "name": "GetExperiments",
    "group": "Deployment_Plans",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifier for a workflow, e.g. 'ms2'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "taskID",
            "description": "<p>identifier for a task, e.g. 't2.1'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platformID",
            "description": "<p>identifier for a platform, e.g. 'excesscluster'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "deploymentPlanID",
            "description": "<p>identifier for a deployment plan, e.g. 'cf8ba177b43e4a837c4c213f6a149ead4f1ec9ef2e976306a07711e88bf6c60c'</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/dreamcloud/mf/deployments/ms2/t2.1/excesscluster/cf8ba177b43e4a837c4c213f6a149ead4f1ec9ef2e976306a07711e88bf6c60c",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "estimatedTime",
            "description": "<p>estimated time to finish</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "node",
            "description": "<p>aggregates information for a node the task was deployed on</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "node.id",
            "description": "<p>identifier for the node</p>"
          },
          {
            "group": "Success 200",
            "type": "Array",
            "optional": true,
            "field": "node.cpus",
            "description": "<p>array of CPU cores</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "node.cpus.id",
            "description": "<p>identifier of the core</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "node.cpus.pwMode",
            "description": "<p>power mode of the CPU in percentage (100 equals full perfomance)</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": true,
            "field": "experiments",
            "description": "<p>list of experiments</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": true,
            "field": "experiments.experiment",
            "description": "<p>identifier of the experiment that used this deployment plan</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"estimatedTime\": 0,\n  \"node\": {\n    \"id\": \"node02\",\n    \"cpus\": [\n      {\n        \"id\": \"cpu0\",\n        \"cores\": [\n          {\n            \"id\": \"core0\",\n            \"pwMode\": 100\n          },\n          {\n            \"id\": \"core1\",\n            \"pwMode\": 100\n          }\n        ]\n      }\n    ]\n  },\n  \"experiments\": {\n    \"AVXQa1RU0GMPeuCn4_2S\": 1\n  }\n}",
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
            "field": "NotFound",
            "description": "<p>No deployment plans available for the given combination of workflow, task, and platform</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"Deployment plan unavailable.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/dreamcloud/deployments.js",
    "groupTitle": "Deployment_Plans"
  },
  {
    "type": "put",
    "url": "/deployments/:workflowID/:taskID/:platformID/:experimentID",
    "title": "1. Add a new deployment plan",
    "version": "1.0.0",
    "name": "PutDeployments",
    "group": "Deployment_Plans",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>identifier for a workflow, e.g. 'ms2'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "taskID",
            "description": "<p>identifier for a task, e.g. 't2.1'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "platformID",
            "description": "<p>identifier for a platform, e.g. 'excesscluster'</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>identifier of an experiment, e.g. 'AVX123A3asd_S'</p>"
          }
        ],
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "estimatedTime",
            "description": "<p>estimated time to finish</p>"
          },
          {
            "group": "body",
            "type": "Object",
            "optional": true,
            "field": "node",
            "description": "<p>aggregates information for a node the task was deployed on</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "node.id",
            "description": "<p>identifier for the node</p>"
          },
          {
            "group": "body",
            "type": "Array",
            "optional": true,
            "field": "node.cpus",
            "description": "<p>array of CPU cores</p>"
          },
          {
            "group": "body",
            "type": "Object",
            "optional": true,
            "field": "node.cpus.id",
            "description": "<p>identifier of the core</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": true,
            "field": "node.cpus.pwMode",
            "description": "<p>power mode of the CPU in percentage (100 equals full perfomance)</p>"
          },
          {
            "group": "body",
            "type": "Object",
            "optional": true,
            "field": "experiments",
            "description": "<p>list of experiments</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"estimatedTime\":217,\n  \"node\":{\n    \"id\":\"node01\",\n    \"cpus\":[\n      {\n        \"id\":\"cpu0\",\n        \"cores\":[\n          {\n            \"id\":\"core0\",\n            \"pwMode\":100\n          },\n          {\n            \"id\":\"core1\",\n            \"pwMode\":100\n          },\n          {\n            \"id\":\"core2\",\n            \"pwMode\":100\n          },\n          {\n            \"id\":\"core3\",\n            \"pwMode\":100\n          }\n        ]\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/dreamcloud/mf/deployments/ms2/t2.1/excesscluster/AVX123A3asd_S",
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
            "field": "deploymentPlanID",
            "description": "<p>identifier for a deployment plan</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "deploymentPlanID.href",
            "description": "<p>link to the actual deployment plan</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"deployment_id\": \"da117e8171ae58b935a02a9768c21ce96ffd5f6e\"\n  \"predicted_time\": 2017\n  \"href\": \"http://mf.excess-project.eu:3030/v1/dreamcloud/mf/deployments/ms2/t2.1/test_cluster/da117e8171ae58b935a02a9768c21ce96ffd5f6e\"\n }",
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
            "description": "<p>Could not store given deployment plan.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Could not store given deployment plan.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/dreamcloud/deployments.js",
    "groupTitle": "Deployment_Plans"
  },
  {
    "type": "get",
    "url": "/workflows/:workflowID",
    "title": "2. Get information about a specific workflow",
    "version": "1.0.0",
    "name": "GetWorkflow",
    "group": "Workflows",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>Unique workflow identifier</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/dreamcloud/mf/workflows/ms2",
        "type": "curl"
      }
    ],
    "success": {
      "fields": {
        "body": [
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "wf_id",
            "description": "<p>References a registered workflow by its ID</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "author",
            "description": "<p>Author name if provided while registering a new workflow</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "optimization",
            "description": "<p>Optimization criterium: time, energy, balanced</p>"
          },
          {
            "group": "body",
            "type": "Array",
            "optional": false,
            "field": "tasks",
            "description": "<p>List of individual tasks the workflow is composed of</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "tasks.name",
            "description": "<p>ID of the given task (:taskID)</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "tasks.exec",
            "description": "<p>Executable for the given task</p>"
          },
          {
            "group": "body",
            "type": "String",
            "optional": false,
            "field": "tasks.cores_nr",
            "description": "<p>Range of CPU cores used for executing the task on</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"wf_id\": \"ms2\",\n  \"author\": \"Random Guy\",\n  \"optimization\": \"Time\",\n  \"tasks\": [\n    {\n      \"name\": \"T1\",\n      \"exec\": \"/home/ubuntu/ms2/t1.sh\",\n      \"cores_nr\": \"1-2\"\n    },\n    {\n      \"name\": \"T2.1\",\n      \"exec\": \"/home/ubuntu/ms2/t21.sh\",\n      \"previous\": \"T1\",\n      \"cores_nr\": \"1-2\"\n     }\n  ]\n}",
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
            "field": "WorkflowNotAvailable",
            "description": "<p>Given ID does not refer to a workflow.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"Workflow with the ID ':workflowID' not found.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/dreamcloud/workflows.js",
    "groupTitle": "Workflows"
  },
  {
    "type": "get",
    "url": "/workflows",
    "title": "3. Request a list of registered workflows",
    "version": "1.0.0",
    "name": "GetWorkflows",
    "group": "Workflows",
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": ":workflowID",
            "description": "<p>References a registered workflow by its ID</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": ":workflowID.href",
            "description": "<p>Resource location of the given workflow</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"hpcdhopp\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v1/dreamcloud/mf/workflows/hpcdhopp\"\n  },\n  \"hpcdkhab\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v1/dreamcloud/mf/workflows/hpcdkhab\"\n  },\n  \"hpcfapix\": {\n    \"href\": \"http://mf.excess-project.eu:3030/v1/dreamcloud/mf/workflows/hpcfapix\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/dreamcloud/mf/workflows",
        "type": "curl"
      }
    ],
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "WorkflowsNotAvailable",
            "description": "<p>No workflows found.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 404 Not Found\n{\n  \"error\": \"No workflows found.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/dreamcloud/workflows.js",
    "groupTitle": "Workflows"
  },
  {
    "type": "put",
    "url": "/workflows",
    "title": "4. Register a new workflow and create a new experiment",
    "version": "1.0.0",
    "name": "PutWorkflow",
    "group": "Workflows",
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/dreamcloud/mf/workflows",
        "type": "curl"
      }
    ],
    "parameter": {
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"wf_id\": \"ms2\",\n  \"author\": \"Random Guy\",\n  \"optimization\": \"Time\",\n  \"tasks\": [\n    {\n      \"name\": \"T1\",\n      \"exec\": \"/home/ubuntu/ms2/t1.sh\",\n      \"cores_nr\": \"1-2\"\n    },\n    {\n      \"name\": \"T2.1\",\n      \"exec\": \"/home/ubuntu/ms2/t21.sh\",\n      \"previous\": \"T1\",\n      \"cores_nr\": \"1-2\"\n     }\n  ]\n}",
          "type": "json"
        }
      ],
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "wf_id",
            "description": "<p>References a registered workflow by its ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "author",
            "description": "<p>Author name if provided while registering a new workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "optimization",
            "description": "<p>Optimization criterium: time, energy, balanced</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "tasks",
            "description": "<p>List of individual tasks the workflow is composed of</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tasks.name",
            "description": "<p>ID of the given task (:taskID)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tasks.exec",
            "description": "<p>Executable for the given task</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tasks.cores_nr",
            "description": "<p>Range of CPU cores used for executing the task on</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "workflow",
            "description": "<p>Workflow-related information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "workflow.id",
            "description": "<p>Unique ID of a given workflow</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "workflow.href",
            "description": "<p>Link to the workflow resource</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "experiment",
            "description": "<p>Experiment-related information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experiment.id",
            "description": "<p>Unique ID of the experiment associated with the workflow</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experiment.href",
            "description": "<p>Link to the experiment resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"workflow\": {\n    \"id\":   \"ms2\",\n    \"href\": \"http://mf.excess-project.eu:3030/v1/workflows/ms2\"\n  },\n  \"experiment\": {\n    \"id\":   \"AVXotMWFA9kSggr_MSq2\",\n    \"href\": \"http://mf.excess-project.eu:3030/v1/experiments/AVXotMWFA9kSggr_MSq2?workflow=ms2\"\n  }\n}",
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
            "field": "StorageError",
            "description": "<p>Given workflow could not be stored.</p>"
          },
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "WorkflowIDMissing",
            "description": "<p>The key wf_id is missing</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Resource could not be stored\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"error\": \"The parameter 'wf_id' to reference a workflow ID is missing.\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/dreamcloud/workflows.js",
    "groupTitle": "Workflows"
  },
  {
    "type": "put",
    "url": "/workflows/:workflowID",
    "title": "1. Register a new workflow with a custom ID",
    "version": "1.0.0",
    "name": "PutWorkflowID",
    "group": "Workflows",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>Unique workflow identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "wf_id",
            "description": "<p>References a registered workflow by its ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "author",
            "description": "<p>Author name if provided while registering a new workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "optimization",
            "description": "<p>Optimization criterium: time, energy, balanced</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "tasks",
            "description": "<p>List of individual tasks the workflow is composed of</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tasks.name",
            "description": "<p>ID of the given task (:taskID)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tasks.exec",
            "description": "<p>Executable for the given task</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tasks.cores_nr",
            "description": "<p>Range of CPU cores used for executing the task on</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"wf_id\": \"ms2\",\n  \"author\": \"Random Guy\",\n  \"optimization\": \"Time\",\n  \"tasks\": [\n    {\n      \"name\": \"T1\",\n      \"exec\": \"/home/ubuntu/ms2/t1.sh\",\n      \"cores_nr\": \"1-2\"\n    },\n    {\n      \"name\": \"T2.1\",\n      \"exec\": \"/home/ubuntu/ms2/t21.sh\",\n      \"previous\": \"T1\",\n      \"cores_nr\": \"1-2\"\n     }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/dreamcloud/mf/workflows/ms2",
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
            "description": "<p>Link to the stored workflow resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"href\": \"http://mf.excess-project.eu:3030/v1/dreamcloud/mf/workflows/ms2\",\n}",
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
            "field": "StorageError",
            "description": "<p>Given workflow could not be stored.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Resource could not be stored\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/dreamcloud/workflows.js",
    "groupTitle": "Workflows"
  },
  {
    "type": "put",
    "url": "/workflows/:workflowID/:experimentID",
    "title": "5. Register a new workflow and experiment using custom IDs",
    "version": "1.0.0",
    "name": "PutWorkflowIDExperimentID",
    "group": "Workflows",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "workflowID",
            "description": "<p>Unique workflow identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "experimentID",
            "description": "<p>Unique experiment identifier</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "wf_id",
            "description": "<p>References a registered workflow by its ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "author",
            "description": "<p>Author name if provided while registering a new workflow</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "optimization",
            "description": "<p>Optimization criterium: time, energy, balanced</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "tasks",
            "description": "<p>List of individual tasks the workflow is composed of</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tasks.name",
            "description": "<p>ID of the given task (:taskID)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tasks.exec",
            "description": "<p>Executable for the given task</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "tasks.cores_nr",
            "description": "<p>Range of CPU cores used for executing the task on</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"wf_id\": \"ms2\",\n  \"author\": \"Random Guy\",\n  \"optimization\": \"Time\",\n  \"tasks\": [\n    {\n      \"name\": \"T1\",\n      \"exec\": \"/home/ubuntu/ms2/t1.sh\",\n      \"cores_nr\": \"1-2\"\n    },\n    {\n      \"name\": \"T2.1\",\n      \"exec\": \"/home/ubuntu/ms2/t21.sh\",\n      \"previous\": \"T1\",\n      \"cores_nr\": \"1-2\"\n     }\n  ]\n}",
          "type": "json"
        }
      ]
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "curl -i http://mf.excess-project.eu:3030/v1/dreamcloud/mf/workflows/ms2/myUniqueID",
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
            "field": "workflow",
            "description": "<p>Workflow-related information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "workflow.id",
            "description": "<p>Unique ID of a given workflow</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "workflow.href",
            "description": "<p>Link to the workflow resource</p>"
          },
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "experiment",
            "description": "<p>Experiment-related information</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experiment.id",
            "description": "<p>Unique ID of the experiment associated with the workflow</p>"
          },
          {
            "group": "Success 200",
            "type": "String",
            "optional": false,
            "field": "experiment.href",
            "description": "<p>Link to the experiment resource</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"workflow\": {\n    \"id\":   \"ms2\",\n    \"href\": \"http://mf.excess-project.eu:3030/v1/workflows/ms2\"\n  },\n  \"experiment\": {\n    \"id\":   \"myUniqueID\",\n    \"href\": \"http://mf.excess-project.eu:3030/v1/experiments/myUniqueID?workflow=ms2\"\n  }\n}",
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
            "field": "StorageError",
            "description": "<p>Given workflow could not be stored.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 500 Internal Server Error\n{\n  \"error\": \"Resource could not be stored\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "routes/v1/dreamcloud/workflows.js",
    "groupTitle": "Workflows"
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
    "filename": "routes/v1/dreamcloud/doc/main.js",
    "group": "_home_hopped_hlrs_codebase_excess_16_6_github_monitoring_server_routes_v1_dreamcloud_doc_main_js",
    "groupTitle": "_home_hopped_hlrs_codebase_excess_16_6_github_monitoring_server_routes_v1_dreamcloud_doc_main_js",
    "name": ""
  }
] });
