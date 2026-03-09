import React from "react";
import StatusCard from "components/StatusCard/StatusCard.jsx";

import counterpart from "counterpart";
import * as Tr from "react-translate-component";
import spanish from "../../langs/spanish.js";
import english from "../../langs/english.js";
import portuguese from "../../langs/portuguese.js";

import { connect } from "react-redux";

import { Row, Col } from "reactstrap";

counterpart.registerTranslations('en', english);
counterpart.registerTranslations('es', spanish);
counterpart.registerTranslations('po', portuguese);

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            totalClients: 150,
            activeContracts: 124,
            pendingInvoices: 23,
            suspendedServices: 8
        };
    }

    render() {
        const updatedText = counterpart.translate('dashboard.updated');
        const lastMonthText = counterpart.translate('dashboard.lastMonth');

        return (
            <div className="content">
                <Row>
                    <Col lg={3} md={6} sm={6}>
                        <StatusCard
                            icon="nc-icon nc-globe"
                            iconColor="primary"
                            title={<Tr content="dashboard.totalClients" />}
                            value={this.state.totalClients}
                            trend="up"
                            trendText={`${updatedText} — ${lastMonthText}`}
                        />
                    </Col>
                    <Col lg={3} md={6} sm={6}>
                        <StatusCard
                            icon="nc-icon nc-single-copy-04"
                            iconColor="success"
                            title={<Tr content="dashboard.activeContracts" />}
                            value={this.state.activeContracts}
                            trend="up"
                            trendText={`${updatedText} — ${lastMonthText}`}
                        />
                    </Col>
                    <Col lg={3} md={6} sm={6}>
                        <StatusCard
                            icon="nc-icon nc-bell-55"
                            iconColor="warning"
                            title={<Tr content="dashboard.pendingInvoices" />}
                            value={this.state.pendingInvoices}
                            trend="down"
                            trendText={`${updatedText} — ${lastMonthText}`}
                        />
                    </Col>
                    <Col lg={3} md={6} sm={6}>
                        <StatusCard
                            icon="nc-icon nc-simple-remove"
                            iconColor="danger"
                            title={<Tr content="dashboard.suspendedServices" />}
                            value={this.state.suspendedServices}
                            trend="neutral"
                            trendText={`${updatedText} — ${lastMonthText}`}
                        />
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

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
