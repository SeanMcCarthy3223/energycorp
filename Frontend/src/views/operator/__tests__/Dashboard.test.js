import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from 'store';

import Dashboard from 'views/operator/Dashboard.jsx';

const renderComponent = () => render(
    <Provider store={store}>
        <Dashboard />
    </Provider>
);

describe('Dashboard', () => {
    test('renders content wrapper', () => {
        const { container } = renderComponent();
        expect(container.querySelector('.content')).toBeInTheDocument();
    });

    test('renders 4 stat cards', () => {
        const { container } = renderComponent();
        const cards = container.querySelectorAll('.card-stats');
        expect(cards).toHaveLength(4);
    });

    test('displays stat values', () => {
        const { getByText } = renderComponent();
        expect(getByText('150')).toBeInTheDocument();
        expect(getByText('124')).toBeInTheDocument();
        expect(getByText('23')).toBeInTheDocument();
        expect(getByText('8')).toBeInTheDocument();
    });
});
