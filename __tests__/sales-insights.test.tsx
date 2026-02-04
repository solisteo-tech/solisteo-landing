import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SellerSalesPage from '@/app/(seller)/seller/sales/page';
import { TestQueryProvider } from './TestQueryProvider';

// Mock the API module
jest.mock('@/lib/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn((url: string) => {
      if (url.includes('/sales/insights')) {
        return Promise.resolve({
          data: {
            summary: {
              total_gmv: 123456,
              total_units: 789,
              avg_order_value: 156,
              growth_pct: 12.3,
            },
            insights: ['Sales grew by 12.3% vs previous period.'],
            anomalies: [],
            meta: { generated_at: new Date().toISOString() },
          },
        });
      }
      if (url.includes('/sales/aggregates/')) {
        return Promise.resolve({
          data: { summary: {}, data: [{ label: 'North', sum_gmv: 1111 }] },
        });
      }
      if (url.includes('/sales/distinct-skus')) {
        return Promise.resolve({ data: ['SKU-1', 'SKU-2'] });
      }
      return Promise.resolve({ data: {} });
    }),
  },
}));

describe('SellerSalesPage insights UI', () => {
  it('renders KPI cards with values', async () => {
    render(
      <TestQueryProvider>
        <SellerSalesPage />
      </TestQueryProvider>
    );
    
    // Wait for the insights to load
    await waitFor(() => {
      const kpiElement = screen.getByTestId('kpi-total_gmv');
      expect(kpiElement).toBeInTheDocument();
    });

    // Check that the page title is rendered
    expect(screen.getByText(/Sales Insights/i)).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    render(
      <TestQueryProvider>
        <SellerSalesPage />
      </TestQueryProvider>
    );
    
    // Should show loading placeholders
    const cards = document.querySelectorAll('.animate-pulse');
    expect(cards.length).toBeGreaterThan(0);
  });
});
