import React, { Component } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { Fetcher } from "../../Helpers/fetcher.js";
import { Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";


// import "./index.css";
class FreeTrialRegsiter extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			username: '',
			password: '',
			confirmPassword: '',
			name: '',
			emailid: '',
			number: '',
			//address: '',
			//company: '',
			//pincode: '',
			redirectToLogin:false,
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
		};

	}



	setvalue = ( e ) => {
		this.setState( {
			[ e.target.name ]: e.target.value,
		} );
	}
	hideModal = () => {
		this.setState( {
			showModal: false,
			redirectToLogin: this.state.redirectToLogin
		} );
	}


	registerUser = ( event ) => {
		event.preventDefault();
		const state = cloneDeep( this.state );
		if(state.confirmPassword !== state.password){
			alert('Password & Confim Password don\'t match' );
			return;
		}
		const data = {
			username: state.username,
			password: state.password,
			name: state.name,
			emailid: state.emailid,
			number: state.number,
			//address: state.address,
			//company: state.company,
			//pincode: state.pincode,
			//credits:0,
			parent:50000

		}

		return Fetcher.post( this.props.app.apiPath + '/app/trynbuy', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify( data ) } )
			.then( res => {
				let modalHeading;
				let redirectToLogin;
				if ( res.message === 'Parameters Incorrect' || res.message === 'User Creation Failed' || res.message === 'User Already Exists! Please choose another Username') {
					modalHeading = 'Error';
					redirectToLogin= false;
					alert( res.message )
				} else {
					modalHeading = 'Success';
					redirectToLogin= true;
					alert( res.message )

				}
				this.setState( {
					showModal: true,
					modalHeading: modalHeading,
					modalContent: res.message,
					redirectToLogin: redirectToLogin
				} )

			} )
			.catch( err => {
				console.log( 'Error in Register Account', err )
				this.setState( {
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				} )
			} );

	}

	render() {
		if ( this.state.redirectToLogin === true ) {
			return <Redirect to={'/login'} />

		}

		return (
			<div className="app flex-row align-items-center">
				<Container>
					<Row className="justify-content-center">
						<Col sm="12">
							<Card className="p-4">
								<Card.Body>
									<Form method="post" onSubmit={this.registerUser}>
										<div className="login-logo text-center"><img className="navbar-brand-full" src={this.props.app.logo} alt="CoreUI Logo" /></div>

										<p className="text-muted text-center">Register a new account</p>
										<InputGroup className="mb-4">
											<Form.Control required className="field-username" name="username" type="text" placeholder="Username" onChange={e => this.setvalue( e )} value={this.state.username} autoComplete="username" />
										</InputGroup>

										<InputGroup className="mb-4">
											<Form.Control required name="password" type="password" placeholder="Password" onChange={e => this.setvalue( e )} value={this.state.password}  />
										</InputGroup>
										<InputGroup className="mb-4">
											<Form.Control required name="confirmPassword" type="password" placeholder="Confirm Password" onChange={e => this.setvalue( e )} value={this.state.confirmPassword}  />
										</InputGroup>

										<InputGroup className="mb-4">
											<Form.Control required name="name" type="text" placeholder="Name" onChange={e => this.setvalue( e )} value={this.state.name}  />
										</InputGroup>

										<InputGroup className="mb-4">
											<Form.Control required name="emailid" type="text" placeholder="Email ID" onChange={e => this.setvalue( e )} value={this.state.emailid}  />
										</InputGroup>

										<InputGroup className="mb-4">
											<Form.Control required name="number" type="text" placeholder="Mobile Number" onChange={e => this.setvalue( e )} value={this.state.number}  />
										</InputGroup>

										{/*<InputGroup className="mb-4">
											<Form.Control required name="address" type="text" placeholder="Address" onChange={e => this.setvalue( e )} value={this.state.address}  />
										</InputGroup>

										<InputGroup className="mb-4">
											<Form.Control required name="company" type="text" placeholder="Company Name" onChange={e => this.setvalue( e )} value={this.state.company}  />
										</InputGroup>

										<InputGroup className="mb-4">
											<Form.Control required name="pincode" type="text" placeholder="Pincode" onChange={e => this.setvalue( e )} value={this.state.pincode}  />
										</InputGroup>*/}

										{this.state.showModal && <div className="login-error">{this.state.modalContent}</div>}
										<Row>
											<Col xs="6">
												<Button type="submit" color="primary" className="px-4 btn-round">Register</Button>
											</Col>
											{/* <Col xs="6" className="text-right">
													<Button color="link" className="px-0">Forgot password?</Button>
												</Col> */}
										</Row>
									</Form>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</Container>

			</div>
		);
	}

}
export default FreeTrialRegsiter;