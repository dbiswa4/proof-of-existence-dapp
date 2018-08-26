import React from 'react';
import {Card,CardBody,Row,Col,Label} from 'reactstrap';

const artifactCard = (props) => {

    return (
        <div className="animated fadeIn flex-row align-items-center">
            <div className="animated fadeIn">
                <Card className="bg-info">
                    <CardBody>
                        <Row>
                            <Col xs="12" md="3" xl="3">
                                <Label htmlFor="textarea-input">Tags</Label>
                            </Col>
                            <Col xs="12" md="6" xl="6">
                                <Label>{props.name}</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" md="3" xl="3">
                                <Label htmlFor="textarea-input">Timestamp</Label>
                            </Col>
                            <Col xs="12" md="6" xl="6">
                                <Label>{props.timestamp}</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" md="3" xl="3">
                                <Label htmlFor="textarea-input">Doc Hash</Label>
                            </Col>
                            <Col xs="12" md="6" xl="6">
                                <Label>{props.docHash}</Label>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12" md="3" xl="3">
                                <Label htmlFor="textarea-input">IPFS Hash</Label>
                            </Col>
                            <Col xs="12" md="6" xl="6">
                                <Label>{props.ipfsHash}</Label>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default artifactCard;
