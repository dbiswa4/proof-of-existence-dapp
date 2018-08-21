import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import getWeb3 from '../../utils/getWeb3';
import ProofOfExistenceContract from '../../../build/contracts/ProofOfExistence.json';

class Home extends Component {

    state = {
        userName:'',
        docHashList: [],
        items: []
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        getWeb3
            .then(results => {
                let personalAddress = results.web3.eth.coinbase.toLowerCase();
                console.log("Home: personalAddress: ", personalAddress);
                this.setState({
                    web3: results.web3,
                    address: personalAddress
                })
                // Instantiate contract once web3 provided.
                this.instantiateContract()

            })
            .catch(() => {
                console.log('Error finding web3.')
            })
    }

    instantiateContract = () => {
        const contract = require('truffle-contract')
        const pow = contract(ProofOfExistenceContract)
        pow.setProvider(this.state.web3.currentProvider)

        // Declaring this for later so we can chain functions on powInstance.
        //var powInstance
        const publicAddress = this.state.web3.eth.coinbase.toLowerCase();
        console.log("--------public address----------")
        console.log("publicAddress", publicAddress);
        console.log('Home : state: ', this.state)

        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            pow.deployed().then((instance) => {
                console.log("inside deployed method");
                this.powInstance = instance;
                this.setState({ account: accounts[0] });
                return instance.fetchAllDocumentsDetails.call(accounts[0], { from: accounts[0] })
            }).then((results) => {
                // Update state with the result.
                console.log("Documents details fetched");
                console.log("User Name", results[0]);
                console.log("Doc List", results[1]);
                this.setState({userName : results[0]})
                this.setState({ docHashList: results[1] })
                results[1].map((x, index) => {
                    this.powInstance.fetchDocument.call(x, { from: accounts[0] })
                        .then((result) => {
                            let item = {
                                docHash: result[0],
                                docTimestamp: result[1],
                                ipfsHash: result[2],
                                userName: this.state.userName
                            }
                            let itemsList = this.state.items;
                            itemsList.push(item);
                            this.setState({ items: itemsList })
                            return '';
                        })
                        return '';
                })
                console.log("state = ", this.state)
            }).catch((error) => {
                console.log("----------------error---------------")
                console.log(error)
                this.setState({ items: null })
                window.alert("Unable to fetch documents. Deploy Smart Contracts and Activate Metmask")
            })
        })
    }

    render() {
        const stylr = { maxHeight: "440px", overflowY: "scroll" }

        let items = this.state.items;
        let $displayCards = null;

        if (items !== null && items.length !== 0) {
            $displayCards = items.map((item,index) => {
                return (
                    <Row key={index}>
                        <Col xs="12" sm="12" lg="12">
                            <Card className="text-dark bg-light">
                                <CardBody className="pb-0">
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>User Name :</strong> {item.userName}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>Doc Timestamp :</strong> {item.docTimestamp.toNumber()}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>Doc Hash :</strong> {item.docHash}</div>
                                    </Col>
                                    <Col xs="12" md="12">
                                        <div className="tag token"><strong>IPFS Hash :</strong> {item.ipfsHash}</div>
                                    </Col>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                )
            });

        } else {
            $displayCards = () => {
                return (
                    <Row>
                        <Col xs="12" sm="12" lg="12">
                            <Card className="text-dark bg-white">
                                <CardBody className="pb-0">
                                    <div className="tag">
                                        You have not uploaded any documents yet.
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                );
            }
        }
        return (
            <div>
                <Container fluid>
                    <br />
                    <Row>
                        <Col>
                        <h3>Your document details in Proof Of Existence DApp:</h3>
                        </Col>
                        </Row>

                    <Row>
                        <Col>
                            <Card className="bg-info">
                                <CardBody>
                                    <div className="container-fluid p-5 activity">
                                        <div className="col text-center mb-2">
                                            <h4 className="mb-3"><strong></strong>Recent  Activities</h4>
                                        </div>
                                        <div id="activity_stream" style={stylr}>
                                            <div className="mb-4 col offset-lg-1 col-lg-10">
                                                {$displayCards}
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    };
}

export default Home;