import adminRoutes from 'routes/adminRoutes.js';
import operatorRoutes from 'routes/operatorRoutes.js';
import managerRoutes from 'routes/managerRoutes.js';

describe('Route definitions', () => {
    test('admin routes has 3 entries', () => {
        expect(adminRoutes).toHaveLength(3);
        expect(adminRoutes[0]).toHaveProperty('path');
        expect(adminRoutes[0]).toHaveProperty('component');
        expect(adminRoutes[0]).toHaveProperty('layout', '/admin');
    });

    test('operator routes has 5 entries', () => {
        expect(operatorRoutes).toHaveLength(5);
        expect(operatorRoutes[0]).toHaveProperty('layout', '/operator');
    });

    test('manager routes has 2 entries', () => {
        expect(managerRoutes).toHaveLength(2);
        expect(managerRoutes[0]).toHaveProperty('layout', '/manager');
        expect(managerRoutes[1]).toHaveProperty('layout', '/manager');
    });
});
