
# Currency Exchange API

A Node.js API for currency conversion with caching and rate limiting.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Error Codes](#error-codes)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Nancy4Hany/Currency-Exchange-API
   cd currency-exchange-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env` file:
   ```plaintext
   PORT=3000
   APY_TOKEN=your_api_key_here
   ```

4. Start the server:
   ```bash
   npm start
   ```
   You can also use docker: 
   ```bash
   docker-compose up --build 
   ```
 5. Test:
   ```bash
   npm test
   ```

## Usage

To interact with the API, you can use Swagger documentation, Postman, or `curl` commands. The Swagger documentation is available at `http://localhost:3000/api-docs`.

### Example `curl` Command

```bash
curl -X POST http://localhost:3000/api/exchange   -H "Content-Type: application/json"   -d '{
        "source": "inr",
        "targets": ["usd", "aed", "eur"]
      }'
```

## API Endpoints

### POST /api/exchange

**Description**: Convert currency to multiple target currencies.

- **URL**: `/api/exchange`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "source": "string (required)",
    "targets": ["string", "string", ...] (required),
    "date": "string (optional)"
  }
  ```
- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:
    ```json
    {
      "inr_usd": 0.012085,
      "inr_aed": 0.044382,
      "inr_eur": 0.011266
    }
    ```

- **Error Responses**:
  - **400**: `Bad request - Missing or invalid parameters`
    ```json
    {
      "error": "Invalid input: source and targets are required."
    }
    ```
  - **429**: `Too many requests - Rate limit exceeded`
    ```json
    {
      "error": "Too many requests, please try again later."
    }
    ```
  - **500**: `Internal server error`
    ```json
    {
      "error": "Unexpected error occurred."
    }
    ```

## Environment Variables

| Variable   | Description              |
|------------|--------------------------|
| `PORT`     | The port on which the API runs |
| `APY_TOKEN`| API token for the currency conversion service |

## Error Codes

- **400**: Bad request - Required fields missing or invalid.
- **429**: Too many requests - Rate limit exceeded.
- **500**: Internal server error.


