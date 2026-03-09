import React from "react";
import { Card, CardBody, CardFooter, Row, Col } from "reactstrap";
import "./StatusCard.scss";

class StatusCard extends React.Component {
    render() {
        const { icon, title, value, trendText, iconColor, trend } = this.props;
        const trendClass = trend === "up"
            ? "status-card-trend-up"
            : trend === "down"
                ? "status-card-trend-down"
                : "status-card-trend-neutral";

        return (
            <Card className="card-stats">
                <CardBody>
                    <Row>
                        <Col xs={5} md={4}>
                            <div className={`status-card-icon-circle icon-${iconColor}`}>
                                <i className={icon} />
                            </div>
                        </Col>
                        <Col xs={7} md={8}>
                            <div className="numbers">
                                <p className="card-category">{title}</p>
                                <p className="card-title">{value}</p>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
                <CardFooter>
                    <hr />
                    <div className="stats">
                        <span className={trendClass}>
                            {trendText}
                        </span>
                    </div>
                </CardFooter>
            </Card>
        );
    }
}

export default StatusCard;
