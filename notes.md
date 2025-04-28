# Leetlab project notes


### What are the tokens?

   when you hit this route..


```javascript
   const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submission/batch?base64_encoded=false`,
    {
      submission,
    }
```
what you get in return after hitting this route is a array of submission that contain the following fields like 

* language id
* output of the code
* status 
* error(if any)
* token

```json
{
  "submissions": [
    {
      "language_id": 46,
      "stdout": "hello from Bash\n",
      "status_id": 3,
      "stderr": null,
      "token": "db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"
    },
    {
      "language_id": 71,
      "stdout": "hello from Python\n",
      "status_id": 3,
      "stderr": null,
      "token": "ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1"
    },
    {
      "language_id": 72,
      "stdout": "hello from Ruby\n",
      "status_id": 3,
      "stderr": null,
      "token": "1b35ec3b-5776-48ef-b646-d5522bdeb2cc"
    }
  ]
}
```






### What are the statuses?
   * Statuses means the, what is the status of your code execution, following are the status and their description.

```
    [
  {
    "id": 1,
    "description": "In Queue"
  },
  {
    "id": 2,
    "description": "Processing"
  },
  {
    "id": 3,
    "description": "Accepted"
  },
  {
    "id": 4,
    "description": "Wrong Answer"
  },
  {
    "id": 5,
    "description": "Time Limit Exceeded"
  },
  {
    "id": 6,
    "description": "Compilation Error"
  },
  {
    "id": 7,
    "description": "Runtime Error (SIGSEGV)"
  },
  {
    "id": 8,
    "description": "Runtime Error (SIGXFSZ)"
  },
  {
    "id": 9,
    "description": "Runtime Error (SIGFPE)"
  },
  {
    "id": 10,
    "description": "Runtime Error (SIGABRT)"
  },
  {
    "id": 11,
    "description": "Runtime Error (NZEC)"
  },
  {
    "id": 12,
    "description": "Runtime Error (Other)"
  },
  {
    "id": 13,
    "description": "Internal Error"
  },
  {
    "id": 14,
    "description": "Exec Format Error"
  }
]
```
