import React, { Component } from 'react';
import { Button, Card, Col, Form, Row, Modal } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { Fetcher } from "../../../Helpers/fetcher.js";
import { Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";


// import "./index.css";
class CreateUser extends Component {
	constructor(props) {
		super(props);
		this.logoInput = React.createRef();
		this.state = {
			username: '',
			password: '',
			confirmPassword: '',
			name: '',
			emailid: '',
			number: '',
			address: '',
			company: '',
			pincode: '',
			credits: '',
			domain: '',
			logoInput: this.logoInput,
			logo: '',
			redirectToUserManagement: false,
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
		};

	}



	setvalue = (e) => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	}
	hideModal = () => {
		this.setState({
			showModal: false,
			redirectToUserManagement: this.state.redirectToUserManagement
		});
	}


	registerUser = (event) => {
		event.preventDefault();
		const state = cloneDeep(this.state);
		if (state.confirmPassword !== state.password) {
			alert('Password & Confim Password don\'t match');
			return;
		}
		const data = {
			username: state.username,
			password: state.password,
			name: state.name,
			emailid: state.emailid,
			number: state.number,
			address: state.address,
			company: state.company,
			pincode: state.pincode,
			credits: state.credits,
			logo: state.logo,
			domain: state.domain,
			parent: this.props.app.userId

		}

		if ((this.props.app.role === 'ROLE_SADMIN') && (state.logoInput.current.files.length > 0)) {

			const logoFile = state.logoInput.current.files[0];
			const siteUrl = this.props.app.siteUrl;

			const fd = new FormData();
			fd.append('logoFile', logoFile);
			fd.append('userId', this.props.app.userId);
			return Fetcher.post(siteUrl + '/uploadfile.php', { method: 'POST', body: fd })
				.then(res => {
					// console.log( res )
					// Add New base Upload to db
					if (res.uploaded) {
						data.logo = this.props.app.apiPath + '/img/' + res.file_name
						this.saveData(data, data.logo);
					} else {
						return alert('Error in uplaoding logo, please try again.');
					}

				})
				.catch(err => { console.log('Error in uploading logo Files', err) });
		}
		else {
			this.saveData(data, false);
		}
	}
	saveData = (data, logoUrl) => {
		return Fetcher.post(this.props.app.apiPath + '/app/register', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
			.then(res => {
				let modalHeading;
				let redirectToUserManagement;
				if (res.message === 'Parameters Incorrect' || res.message === 'User Creation Failed') {
					modalHeading = 'Error';
					redirectToUserManagement = false;
				} else {
					modalHeading = 'Success';
					redirectToUserManagement = true;
					//alert( ' User created successfully. ' )

				}
				this.setState({
					showModal: true,
					modalHeading: modalHeading,
					modalContent: res.message,
					redirectToUserManagement: redirectToUserManagement
				})

			})
			.catch(err => {
				console.log('Error in Register Account', err)
				this.setState({
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				})
			});

	}

	setMessageShow = (status) => {
		this.setState({
			showModal: false,
		});
	}

	render() {
		if (this.state.redirectToUserManagement === true) {
			return <Redirect to={'/user-management/'} />

		}
		console.log(this.props)
		return (

			<Form method="post" onSubmit={this.registerUser}>
				<Row>
					<Col sm={12}>
						<Card>
							<Card.Header>Create New User</Card.Header>
							<Card.Body>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required className="field-username" name="username" type="text" placeholder="Username" onChange={e => this.setvalue(e)} value={this.state.username} autoComplete="username" />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="password" type="password" placeholder="Password" onChange={e => this.setvalue(e)} value={this.state.password} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="confirmPassword" type="password" placeholder="Confirm Password" onChange={e => this.setvalue(e)} value={this.state.confirmPassword} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="name" type="text" placeholder="Name" onChange={e => this.setvalue(e)} value={this.state.name} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="emailid" type="text" placeholder="Email ID" onChange={e => this.setvalue(e)} value={this.state.emailid} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="number" type="text" placeholder="Mobile Number" onChange={e => this.setvalue(e)} value={this.state.number} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="address" type="text" placeholder="Address" onChange={e => this.setvalue(e)} value={this.state.address} />
										</Form.Group>
									</Col>
								</Row>

								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="pincode" type="text" placeholder="Pincode" onChange={e => this.setvalue(e)} value={this.state.pincode} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="company" type="text" placeholder="Company Name" onChange={e => this.setvalue(e)} value={this.state.company} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="credits" type="text" placeholder="Add Credits" onChange={e => this.setvalue(e)} value={this.state.credits} />
										</Form.Group>
									</Col>
								</Row>
								{(this.props.app.role === 'ROLE_SADMIN') && <Row>
									<Col sm={6}>
										<Form.Group >
											<Form.Label>Logo</Form.Label>
											<Form.Control name="newContactsFile" onChange={this.onFileChangeHandler} ref={this.logoInput} type="file" />
										</Form.Group>
									</Col>
								</Row>}
								{(this.props.app.role === 'ROLE_SADMIN') && <Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="domain" type="text" placeholder="Domain" onChange={e => this.setvalue(e)} value={this.state.domain} />
										</Form.Group>
									</Col>
								</Row>}

								<Modal size="sm" show={this.state.showModal} onHide={() => this.setMessageShow(false)}>
									<Modal.Header closeButton>
										<Modal.Title id="example-modal-sizes-title-sm">
											{this.state.modalHeading}
										</Modal.Title>
									</Modal.Header>
									<Modal.Body>{this.state.modalContent}</Modal.Body>
								</Modal>
								<Button className="btn-round" variant="primary" type="submit">Create User</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Form>
		);
	}

}
export default CreateUser;