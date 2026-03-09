import React from "react";

import counterpart from "counterpart";
import * as Tr from "react-translate-component";
import spanish from "../../langs/spanish.js";
import english from "../../langs/english.js";
import portuguese from "../../langs/portuguese.js";

import { connect } from "react-redux";

import Auth from "components/auth/auth.js";

import {
    Card,
    CardHeader,
    CardBody,
    CardTitle,
    Row,
    Col,
    Table
} from "reactstrap";

counterpart.registerTranslations('en', english);
counterpart.registerTranslations('es', spanish);
counterpart.registerTranslations('po', portuguese);

class OverdueClients extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            overdueClients: [],
            loading: true
        };
    }

    async componentDidMount() {
        try {
            const res = await fetch('/api/reports/overdue-clients/', {
                headers: {
                    'Authorization': 'Token ' + Auth.getSession().token
                }
            });
            const data = await res.json();
            this.setState({ overdueClients: data, loading: false });
        } catch (err) {
            console.log(err);
            this.setState({ loading: false });
        }
    }

    render() {
        const rows = this.state.overdueClients.map((item, k) => (
            <tr key={k}>
                <th scope="row">{k + 1}</th>
                <td>{item.client_name}</td>
                <td>{item.contract_number}</td>
                <td>{item.invoice_date}</td>
                <td>{item.amount_owed}</td>
                <td>{item.days_overdue}</td>
            </tr>
        ));

        return (
            <div className="content">
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardHeader>
                                <CardTitle tag="h5">
                                    <Tr content="overdueClients.title" />
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                {this.state.loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <Table responsive>
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>
                                                    <Tr content="overdueClients.clientName" />
                                                </th>
                                                <th>
                                                    <Tr content="overdueClients.contractNumber" />
                                                </th>
                                                <th>
                                                    <Tr content="overdueClients.invoiceDate" />
                                                </th>
                                                <th>
                                                    <Tr content="overdueClients.amountOwed" />
                                                </th>
                                                <th>
                                                    <Tr content="overdueClients.daysOverdue" />
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows}
                                        </tbody>
                                    </Table>
                                )}
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    counterpart.setLocale(state.language);
    return { lng: state.language };
};

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(OverdueClients);
