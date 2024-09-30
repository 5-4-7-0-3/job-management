# Job Management API

## Project Description

The Job Management API is a RESTful API developed using NestJS and MongoDB, designed to manage employers, job vacancies, and workers. The API supports standard CRUD operations and includes additional features such as job archiving and changing the employer for a worker.

## Requirements

- **Node.js**: Version 14 or higher
- **MongoDB**: Connection to a MongoDB database

## Setting Up the Project

### Cloning the Repository

```bash
git clone <repository_URL>
cd job-management
```

## Installing Dependencies

```bash
npm install
```
## Configuring the Environment

1. Create a .env file based on .env.example:

```bash
cp .env.example .env
```

2. Edit the .env file and fill in the necessary environment variables:

```bash
PORT=3000

DATABASE_URL=mongodb://username:password@host:port/database
```

## Running the Project

```bash
npm run start:dev
```

## Development Mode

```bash
npm run build
npm run start
```

## Implemented Custom Endpoints

### 1. Archive Job

- **URL:** `/jobs/:id/archive`
- **Description:** Changes the job status to `archived`.
- **Request Method:** `PUT`
- **Request Body:** None
- **Example Response:**

    ```json
    {
      "_id": "60d5f9f4e1d2c00c8c8e5c21",
      "name": "Software Engineer",
      "status": "archived",
      "salary": 5000,
      "workers": ["60d5f9e4e1d2c00c8c8e5c20"],
      "owner": "60d5f9d4e1d2c00c8c8e5c19",
      "deleted_at": null,
      "createdAt": "2023-07-19T12:00:00.000Z",
      "updatedAt": "2024-04-01T15:30:00.000Z",
      "__v": 0
    }
    ```

### 2. Change Worker Employer

- **URL:** `/workers/:id/new-employer`
- **Description:** Changes the employer of a worker and adds a record to the hiring history.
- **Request Method:** `PUT`
- **Request Body:**

    ```json
    {
      "employerId": "60d5f9d4e1d2c00c8c8e5c19",
      "operation": "hire" // or "fire"
    }
    ```

- **Example Response:**

    ```json
    {
      "_id": "60d5f9f4e1d2c00c8c8e5c21",
      "name": "John Doe",
      "salary": 3000,
      "owner": "60d5f9d4e1d2c00c8c8e5c19",
      "job": "60d5f9e4e1d2c00c8c8e5c20",
      "history": [
        {
          "event": "HIRED",
          "date": "2024-04-01T15:30:00.000Z",
          "job": "60d5f9e4e1d2c00c8c8e5c20"
        }
      ],
      "deleted_at": null,
      "createdAt": "2023-07-19T12:00:00.000Z",
      "updatedAt": "2024-04-01T15:30:00.000Z",
      "__v": 1
    }
    ```

### 3. Search Jobs by Date Range

- **URL:** `/jobs/date-period`
- **Description:** Returns a list of jobs created within the specified date range.
- **Request Method:** `GET`
- **Request Parameters:**
  - `startDate` (string, required) – start date in ISO format
  - `endDate` (string, required) – end date in ISO format
- **Example Response:**

    ```json
    [
      {
        "_id": "60d5f9f4e1d2c00c8c8e5c21",
        "name": "Software Engineer",
        "status": "active",
        "salary": 5000,
        "workers": ["60d5f9e4e1d2c00c8c8e5c20"],
        "owner": "60d5f9d4e1d2c00c8c8e5c19",
        "deleted_at": null,
        "createdAt": "2023-07-19T12:00:00.000Z",
        "updatedAt": "2024-04-01T15:30:00.000Z",
        "__v": 0
      }
    ]
    ```

### 4. Get Matched Jobs for a Worker

- **URL:** `/workers/:id/matched-jobs`
- **Description:** Returns a list of jobs where the salary is greater than or equal to the worker's salary, and the job status is `open` or `pending`.
- **Request Method:** `GET`
- **Request Body:** None
- **Example Response:**

    ```json
    [
      {
        "_id": "60d5f9f4e1d2c00c8c8e5c22",
        "name": "Senior Developer",
        "status": "active",
        "salary": 7000,
        "workers": [],
        "owner": "60d5f9d4e1d2c00c8c8e5c19",
        "deleted_at": null,
        "createdAt": "2023-08-01T12:00:00.000Z",
        "updatedAt": "2024-04-01T15:30:00.000Z",
        "__v": 0
      }
    ]
    ```

    ### 5. Find Workers by Employer ID

- **URL:** `/employers/:id/workers`
- **Description:** Returns a list of worker names associated with a specific employer.
- **Request Method:** `GET`
- **Example Response:**

    ```json
    {
      "workers": [
        "John Doe",
        "Jane Smith"
      ]
    }
    ```

- **Error Response (if Employer not found):**

    ```json
    {
      "statusCode": 404,
      "message": "Employer not found",
      "error": "Not Found"
    }
    ```

### Additional Error Handling

If the provided ID is not valid or the employer is not found, the method throws a `NotFoundException` with the message "Employer not found".