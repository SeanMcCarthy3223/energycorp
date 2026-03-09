import CreateReports from "views/manager/CreateReports.jsx";
import OverdueClients from "views/manager/OverdueClients.jsx";

var managerRoutes = [
  {
    path: "/createReports",
    name: "Create Report",
    icon: "nc-icon nc-diamond",
    component: CreateReports,
    layout: "/manager"
  },
  {
    path: "/overdueClients",
    name: "Overdue Clients",
    icon: "nc-icon nc-bell-55",
    component: OverdueClients,
    layout: "/manager"
  }
];

export default managerRoutes;
