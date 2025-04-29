import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Chart components
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    spreadsheetCount: 0,
    scenarioCount: 0,
    recentScenarios: [],
    summaryData: null
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch spreadsheet count
        const spreadsheetsRes = await axios.get('/api/spreadsheets');
        
        // Fetch scenarios
        const scenariosRes = await axios.get('/api/scenarios');
        
        // Process data for dashboard
        const spreadsheetCount = spreadsheetsRes.data.length;
        const scenarioCount = scenariosRes.data.length;
        const recentScenarios = scenariosRes.data
          .sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt))
          .slice(0, 5);
        
        // Calculate summary data if scenarios exist
        let summaryData = null;
        if (scenariosRes.data.length > 0) {
          // Use the most recent scenario for summary
          const latestScenario = scenariosRes.data[0];
          summaryData = {
            annualRevenues: latestScenario.summary.annualRevenues,
            annualExpenses: latestScenario.summary.annualExpenses,
            annualInvestments: latestScenario.summary.annualInvestments,
            annualNetIncome: latestScenario.summary.annualNetIncome,
            monthlyData: {
              revenues: latestScenario.summary.monthlyRevenues,
              expenses: latestScenario.summary.monthlyExpenses,
              netIncome: latestScenario.summary.monthlyNetIncome
            }
          };
        }
        
        setStats({
          spreadsheetCount,
          scenarioCount,
          recentScenarios,
          summaryData
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        toast.error('Erro ao carregar dados do dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  // Pie chart data
  const pieData = stats.summaryData ? {
    labels: ['Receitas', 'Despesas', 'Investimentos'],
    datasets: [
      {
        data: [
          stats.summaryData.annualRevenues,
          stats.summaryData.annualExpenses,
          stats.summaryData.annualInvestments
        ],
        backgroundColor: [
          'rgba(52, 211, 153, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)'
        ],
        borderColor: [
          'rgba(52, 211, 153, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)'
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  // Bar chart data
  const barData = stats.summaryData ? {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    datasets: [
      {
        label: 'Receitas',
        data: stats.summaryData.monthlyData.revenues,
        backgroundColor: 'rgba(52, 211, 153, 0.5)',
      },
      {
        label: 'Despesas',
        data: stats.summaryData.monthlyData.expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
      },
      {
        label: 'Resultado Líquido',
        data: stats.summaryData.monthlyData.netIncome,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  } : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Dashboard</h2>
          <p className="mt-1 text-sm text-gray-500">
            Bem-vindo, {user?.name}! Aqui está um resumo da sua atividade financeira.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Planilhas</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.spreadsheetCount}</div>
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/spreadsheets" className="font-medium text-primary-600 hover:text-primary-500">Ver todas<span aria-hidden="true"> &rarr;</span></Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">Cenários</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{stats.scenarioCount}</div>
                </dd>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link to="/scenarios" className="font-medium text-primary-600 hover:text-primary-500">Ver todos<span aria-hidden="true"> &rarr;</span></Link>
            </div>
          </div>
        </div>

        {stats.summaryData && (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Resultado Anual</dt>
                  <dd className="flex items-baseline">
                    <div className={`text-2xl font-semibold ${stats.summaryData.annualNetIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(stats.summaryData.annualNetIncome)}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <span className="font-medium text-gray-500">Receitas: {formatCurrency(stats.summaryData.annualRevenues)} | Despesas: {formatCurrency(stats.summaryData.annualExpenses)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      {stats.summaryData && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Distribuição Anual</h3>
              <div className="h-64">
                <Pie data={pieData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Evolução Mensal</h3>
              <div className="h-64">
                <Bar 
                  data={barData} 
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Scenarios */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Cenários Recentes</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Seus últimos cenários financeiros criados ou modificados.</p>
        </div>
        {stats.recentScenarios.length > 0 ? (
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {stats.recentScenarios.map((scenario) => (
                <li key={scenario._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary-600 truncate">{scenario.name}</p>
                      <p className="text-sm text-gray-500">{formatDate(scenario.modifiedAt)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;