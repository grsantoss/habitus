# Habitus Finance - Financial Simulation SaaS

A comprehensive SaaS platform for financial simulation and analysis with an interactive dashboard, scenario creation, and reporting features.

## Features

- User authentication with role-based access (user/admin)
- Excel spreadsheet upload for data input
- Manual data entry interface
- Interactive financial dashboard with visualizations
- Scenario creation and comparison
- PDF report generation
- Admin panel with user management and action logs

## Technology Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Node.js/Express
- **Database**: MongoDB
- **Authentication**: JWT
- **File Processing**: SheetJS for Excel files
- **Visualization**: Chart.js

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Git

### Setup Instructions

1. Clone the repository
```
git clone <repository-url>
cd Habitus_Profecia
```

2. Create environment file
```
cp .env.example .env
```

3. Configure your .env file with appropriate values:
```
MONGO_URI=mongodb://localhost:27017/habitus-finance
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```

4. Install dependencies
```
npm install
npm run install-client
```

5. Start development server
```
npm run dev
```

This will start both the backend server (on port 5000) and frontend client (on port 3000).

### Alternative: Run Server and Client Separately

Backend:
```
npm run server
```

Frontend:
```
npm run client
```

## Testing Guide

1. **Register a new user**
   - Navigate to `/register`
   - Create an account with email and password

2. **Login**
   - Navigate to `/login`
   - Use your registered credentials

3. **Upload Financial Data**
   - Navigate to Spreadsheet Upload page
   - Use the sample Excel template in `/samples` directory or create your own
   - Upload the file

4. **Manual Data Entry**
   - Navigate to the data entry form
   - Input financial data across all categories
   - Save the data

5. **Create Scenarios**
   - Navigate to scenario creation
   - Adjust parameters to create different financial scenarios
   - Save scenarios with descriptive names

6. **Dashboard Analysis**
   - Navigate to the dashboard
   - Compare different scenarios
   - Analyze charts and financial metrics

7. **Generate Reports**
   - Select a scenario
   - Generate PDF report
   - Verify all data is correctly displayed

8. **Admin Features** (requires admin account)
   - Login with admin credentials
   - Navigate to `/admin`
   - Test user management features
   - Review action logs

## API Documentation

The API documentation is available at `/api-docs.md` with detailed information about all endpoints.

## Sample Data

Sample spreadsheet templates are available in the `/samples` directory.

## Troubleshooting

- If database connection fails, ensure MongoDB is running and your connection string is correct
- For JWT errors, try clearing local storage and logging in again
- For Excel upload issues, ensure your file follows the required template structure

## License

[MIT](LICENSE)

## Configuração do Ambiente

1. Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações:
- `MONGO_URI`: URL de conexão com o MongoDB
- `JWT_SECRET`: Chave secreta para tokens JWT
- `PORT`: Porta do servidor (padrão: 5000)
- `NODE_ENV`: Ambiente (development/production)

3. Instale as dependências:
```bash
npm install
cd client && npm install && cd ..
```

4. Inicie o MongoDB:
```bash
docker-compose up -d mongodb
```

5. Execute os seeds do banco:
```bash
npm run db:seed
```

6. Inicie a aplicação:
```bash
npm run dev
``` 