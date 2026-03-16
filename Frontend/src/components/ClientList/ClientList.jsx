import React from "react";
import {
    Card,
    CardBody,
    Table,
    Badge,
    Button,
    Input,
    Row,
    Col
} from "reactstrap";

import counterpart from "counterpart";
import * as Tr from "react-translate-component";
import spanish from "../../langs/spanish.js";
import english from "../../langs/english.js";
import portuguese from "../../langs/portuguese.js";

import { connect } from "react-redux";

import "./ClientList.scss";

counterpart.registerTranslations('en', english);
counterpart.registerTranslations('es', spanish);
counterpart.registerTranslations('po', portuguese);

class ClientList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: "",
            clients: [
                {
                    id: 1,
                    name: "Maria Silva",
                    contract: "CTR-2024-0891",
                    counter: "CNT-4521",
                    status: "active"
                },
                {
                    id: 2,
                    name: "Jo\u00e3o Santos",
                    contract: "CTR-2024-0742",
                    counter: "CNT-3189",
                    status: "active"
                },
                {
                    id: 3,
                    name: "Ana Ferreira",
                    contract: "CTR-2024-0655",
                    counter: "CNT-2847",
                    status: "overdue"
                },
                {
                    id: 4,
                    name: "Carlos Mendes",
                    contract: "CTR-2024-0498",
                    counter: "CNT-1563",
                    status: "suspended"
                },
                {
                    id: 5,
                    name: "Lucia Rodrigues",
                    contract: "CTR-2024-0301",
                    counter: "CNT-0921",
                    status: "active"
                }
            ]
        };
    }

    handleSearch = (e) => {
        this.setState({ searchTerm: e.target.value });
    };

    getFilteredClients = () => {
        const { searchTerm, clients } = this.state;
        if (!searchTerm) return clients;
        const term = searchTerm.toLowerCase();
        return clients.filter(
            (c) =>
                c.name.toLowerCase().includes(term) ||
                c.contract.toLowerCase().includes(term) ||
                c.counter.toLowerCase().includes(term)
        );
    };

    renderStatusBadge(status) {
        const colorMap = {
            active: "success",
            overdue: "warning",
            suspended: "danger"
        };
        const labelKey = {
            active: "clientList.statusActive",
            overdue: "clientList.statusOverdue",
            suspended: "clientList.statusSuspended"
        };
        return (
            <Badge className="client-list__badge" color={colorMap[status]}>
                <Tr content={labelKey[status]} />
            </Badge>
        );
    }

    render() {
        const filtered = this.getFilteredClients();
        const searchPlaceholder = counterpart.translate("clientList.searchPlaceholder");

        return (
            <div className="content">
                <Card className="client-list__card">
                    <CardBody>
                        <div className="client-list__header">
                            <div className="client-list__title-group">
                                <h3 className="client-list__title">
                                    <Tr content="clientList.title" />
                                </h3>
                                <p className="client-list__subtitle">
                                    <Tr content="clientList.subtitle" />
                                </p>
                            </div>
                            <div className="client-list__search">
                                <Input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={this.state.searchTerm}
                                    onChange={this.handleSearch}
                                />
                            </div>
                        </div>
                        <Table className="client-list__table" responsive>
                            <thead>
                                <tr>
                                    <th><Tr content="clientList.colName" /></th>
                                    <th><Tr content="clientList.colContract" /></th>
                                    <th><Tr content="clientList.colCounter" /></th>
                                    <th><Tr content="clientList.colStatus" /></th>
                                    <th className="text-right">
                                        <Tr content="clientList.colActions" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((client) => (
                                    <tr key={client.id}>
                                        <td className="client-list__name">
                                            {client.name}
                                        </td>
                                        <td>{client.contract}</td>
                                        <td>{client.counter}</td>
                                        <td>
                                            {this.renderStatusBadge(client.status)}
                                        </td>
                                        <td className="td-actions text-right">
                                            <Button
                                                className="btn-round btn-icon btn-icon-mini"
                                                color="info"
                                                size="sm"
                                                title="View"
                                            >
                                                <i className="nc-icon nc-alert-circle-i" />
                                            </Button>
                                            <Button
                                                className="btn-round btn-icon btn-icon-mini"
                                                color="warning"
                                                size="sm"
                                                title="Edit"
                                            >
                                                <i className="nc-icon nc-ruler-pencil" />
                                            </Button>
                                            <Button
                                                className="btn-round btn-icon btn-icon-mini"
                                                color="danger"
                                                size="sm"
                                                title="Delete"
                                            >
                                                <i className="nc-icon nc-simple-remove" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    counterpart.setLocale(state.language);
    return { lng: state.language };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ClientList);
