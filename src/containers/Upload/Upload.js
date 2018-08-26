import React, { Component } from 'react';
import { Container, Row, Col,Modal,ModalBody,ModalHeader } from 'reactstrap';
import forge from 'node-forge';
import BasicForm from '../../components/Forms/BasicForm/BasicForm';
import ArtifactCard from '../../components/Cards/ArtifactCard/ArtifactCard';
import ImagePreviewCard from '../../components/Cards/ImagePreviewCard/ImagePreviewCard';
import WarningModal from '../../components/Modals/WarningModal';
import ProofOfOwnershipContract from '../../../build/contracts/ProofOfExistence.json';
import getWeb3 from '../../utils/getWeb3';
import ipfs from '../../ipfs/ipfs';

class Upload extends Component {

    state = {
        storageValue: 0,
        web3: null,
        firstname: '',
        lastame: '',
        email: '',
        dateInput: '',
        textAreaInput: '',
        fileInput: '',
        fileBuffer: '',
        digest: '',
        isUploaded: false,
        loadingWarning : false
    }

    componentWillMount() {
        // Get network provider and web3 instance.
        // See utils/getWeb3 for more info.

        console.log("componentWillMount Upload")

        getWeb3
            .then(results => {
                const publicAddress = results.web3.eth.coinbase.toLowerCase()
                console.log(" componentWillMount Upload this: ", this)
                this.setState({
                    web3: results.web3,
                    loading: true,
                    publicAddress: publicAddress
                })
                console.log("ipfs =", ipfs);
                this.instantiateContract();
            })
            .catch(() => {
                console.log('Error finding web3.')
            });


    }

    toggleWarning = () => {
        this.setState({
            warning: !this.state.warning,
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log("Clicked on Submit button ");
        console.log(this.state);
        this.setState({loadingWarning:true});    
        
        const powInstance = this.powInstance;
        ipfs.files.add(this.state.fileBuffer, (error, result) => {
            if (error) {
                console.error(error);
                this.setState({loadingWarning:false});   
  
                return;
            }
            this.setState({ ipfsHash: result[0].hash })
            console.log('digest: ', this.state.digest);
            console.log('First Name: :', this.state.firstname);
            console.log('Last Name: :', this.state.lastName);
            console.log('ipfsHash: ', result[0].hash);
            console.log('account: ', this.state.account);

            console.log("File has been uploaded to IPFS");

            powInstance.uploadDocument(this.state.digest, this.state.firstname + " : " + this.state.lastname, result[0].hash, { from: this.state.account });
            this.setState({loadingWarning:false});
            //.then((result)=>{
            //    console.log("upload document result: " , result)

            /*
             powInstance.fetchDocument.call(this.state.digest, { from: this.state.account }).then(result => {
                this.setState({digest:result[0],timestamp:result[1].valueOf(),ipfsHash:result[2]})
                console.log("fetch document: ", result);
            }).error((error)=>{
                console.log("error: ", error);
                window.alert(error);
            })
            */
        });
    }


    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;
        //console.log("name=" + name);
        //console.log("value=" + value);

        if (name !== "fileInput" && value.length !== 0) {
            this.setState({ [name]: value });
        } else {
            console.log("empty data nothing to set")
        }
    }

    handleImageChange = (e) => {
        e.preventDefault();
        console.log("inside _handleImageChange ")

        let file = e.target.files[0];
        let reader = new window.FileReader();
        let readerPreview = new FileReader();

        console.log(file);
        console.log("name=" + e.target.name);
        console.log("value=" + e.target.value);

        if (file) {
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
                var md = forge.md.sha256.create();
                md.update(Buffer(reader.result));
                let digest = '0x' + md.digest().toHex();
                console.log("digest: ", digest);
                //console.log(reader.result);
                this.setState({ fileInput: file.name, fileBuffer: Buffer(reader.result), digest: digest });
                console.log('buffer:', this.state.fileBuffer);
                var docHash = digest;
                console.log("docHash: " + docHash);
            }

            readerPreview.readAsDataURL(file);
            readerPreview.onloadend = () => {
                    this.setState({ imagePreview: readerPreview.result });
                }
        } else {
            console.log('There is no image file selected')
            this.setState({ fileInput: '', fileBuffer: '' });
        }

        console.log(this.state.fileBuffer);

    }

    instantiateContract = () => {
        /*
         * SMART CONTRACT EXAMPLE
         *
         * Normally these functions would be called in the context of a
         * state management library, but for convenience I've placed them here.
         */

        const contract = require('truffle-contract')
        const pow = contract(ProofOfOwnershipContract)
        pow.setProvider(this.state.web3.currentProvider)

        // Declaring this for later so we can chain functions on powInstance.
        //var powInstance


        const publicAddress = this.state.web3.eth.coinbase.toLowerCase();
        console.log("--------public address----------")
        console.log(publicAddress);
        
        // Get accounts.
        this.state.web3.eth.getAccounts((error, accounts) => {
            
            pow.deployed().then((instance) => {
                this.powInstance = instance;
                this.setState({ account: accounts[0] });
                console.log('state: ', this)
            })
        })
    }


    render() {

        let { fileBuffer } = this.state;
        let $imagePreview = null;
        let $modal = null;
        let ipfsUrl = null
        if (this.state.ipfsHash) {
            ipfsUrl = 'https://ipfs.infura.io/ipfs/' + this.state.ipfsHash;
        }

        console.log('ipfsUrl: ' + ipfsUrl);

        if (fileBuffer) {
            console.log("Document has been selected")
            console.log(this.state.fileInput)
            $imagePreview = (
                <div>
                    <ImagePreviewCard fileBuffer={this.state.imagePreview} />
                    <ArtifactCard
                        fileInput={this.state.fileInput}
                        name={this.state.firstname + " : " + this.state.lastname}
                        email={this.state.email}
                        timestamp={this.state.dateInput}
                        docHash={this.state.digest}
                        ipfsHash={this.state.ipfsHash} />
                </div>
            );
        }

        if (this.state.isUploaded) {
            $modal = (
                <div>
                    <WarningModal
                        warning={this.state.warning}
                        toggleWarning={this.toggleWarning}
                        message="The document does not exist in blockchain"
                    />);
            </div>
            );
        }

        return (
            <div>
              <Modal color="primary" isOpen={this.state.loadingWarning} >
                  <ModalBody>
                        Uploading the document. Please wait...
                  </ModalBody>
               </Modal>
                <Container fluid>
                    <Row>
                        <Col xs="12" md="6" xl="6">
                            <BasicForm
                                name={"user1"}
                                handleSubmit={this.handleSubmit}
                                handleChange={this.handleChange}
                                handleImageChange={this.handleImageChange} />
                        </Col >
                        <Col xs="12" md="6" xl="6">
                            {$imagePreview}
                            {$modal}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Upload;