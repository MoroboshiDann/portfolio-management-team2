# Portfolio Pulse Backend Server

This is the backend server for the Portfolio Pulse financial portfolio management system.

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up the database**:
   - Create a MySQL database named `portfolio_pulse`
   - Import the schema from `schema.sql`:
     ```bash
     mysql -u root -p < schema.sql
     ```
   - Or run the SQL commands directly in your MySQL client

3. **Configure environment variables**:
   - Update the `.env` file with your MySQL credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=n3u3da!
     DB_NAME=portfolio_pulse
     PORT=5000
     ```

4. **Start the server**:
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **API Endpoints**:
   - Portfolio chart data: `GET /api/portfolio/chart-data`
   - Transaction chart data: `GET /api/transactions/chart-data`

## Database Schema

The application uses two main tables:

1. **portfolio_values**: Stores historical portfolio values by date
2. **transactions**: Records all financial transactions

See `schema.sql` for the complete database structure and sample data.