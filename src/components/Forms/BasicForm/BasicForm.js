import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
} from 'reactstrap';

const BasicForm = (props) => {

  return (
    <div className="animated fadeIn flex-row align-items-center">
      <Card className="bg-info">
        <br />
        <CardBody>
          <Form action="" method="post" encType="multipart/form-data" className="form-horizontal text-white">
            <FormGroup row>
              <Col xs="12" md="9">
                <h5 className="form-control-static text-white"><strong>Please provide details in below section:</strong></h5>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="exampleInputName2" >Doc Title</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" maxLength={30}  id="exampleInputName2" placeholder="iron-suit" name="firstname" onChange={(event) => props.handleChange(event)} required />
                <FormText className="help-block">Please enter your first name</FormText>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Col md="3">
                <Label htmlFor="exampleInputName3" >Doc Tags</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="text" maxLength={30} id="exampleInputName3" placeholder="superhero" name="lastname" onChange={(event) => props.handleChange(event)} required />
                <FormText className="help-block">Please enter your last name</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="exampleInputEmail2" >Email</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="email" maxLength={40} id="exampleInputEmail2" placeholder="ironman@marvels.com" name="email" onChange={(event) => props.handleChange(event)} required />
                <FormText className="help-block">Please enter your email</FormText>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="dateInput">Date </Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="date" id="dateInput" name="dateInput" placeholder="date" onChange={(event) => props.handleChange(event)} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col md="3">
                <Label htmlFor="fileInput">Input</Label>
              </Col>
              <Col xs="12" md="9">
                <Input type="file" id="fileInput" name="fileInput" onChange={(e) => props.handleImageChange(e)} />
                <FormText className="help-block">Only .jpg supported for now</FormText>
              </Col>
            </FormGroup>
          </Form>
            <Button type="reset" size="sm" color="warning"><i className="fa fa-ban"></i> Reset</Button>&nbsp; &nbsp;
          <Button type="submit" size="sm" color="success" onClick={props.handleSubmit}><i className="fa fa-dot-circle-o"></i> Submit</Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default BasicForm;
