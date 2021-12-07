import React, { Component } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { Fetcher } from "../../../Helpers/fetcher.js";
import { Redirect } from "react-router-dom";


// import "./index.css";
class UpdateUser extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			name: '',
			email: '',
			mobile: '',
			address: '',
			company_name: '',
			pincode: '',
			redirectToUserManagement: false,
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
		};

	}
	componentDidMount() {
		const apiPath = this.props.app.apiPath;
		const userId = this.props.selectedUserId;
		const data = {
			parent: this.props.app.userId,
		}
		 Fetcher.get( apiPath + '/app/user/profile/' + userId)
			.then( res => {
				this.setState( {
					name: res.name,
					email: res.email,
					mobile: res.mobile,
					address: res.address,
					company_name: res.company_name,
					pincode: res.pincode,
				} )
				console.log(res)
			} )
			.catch( err => { console.log( 'Error in fetching Users data', err ) } );
	}


	setvalue = ( e ) => {
		this.setState( {
			[ e.target.name ]: e.target.value,
			[e.target.email]:e.target.value,
			[e.target.mobile]:e.target.value,
			[e.target.address]:e.target.value,
			[e.target.company]:e.target.value,
			[e.target.pincode]:e.target.value,
		} );
	}
	hideModal = () => {
		this.setState( {
			showModal: false,
			redirectToUserManagement: this.state.redirectToUserManagement
		} );
	}


	updateUser = ( event ) => {
		event.preventDefault();
		const state = cloneDeep( this.state );

		const data = {
			user_id:this.props.selectedUserId,
			name: state.name,
			email: state.email,
			mobile: state.mobile,
			address: state.address,
			company_name: state.company_name,
			pincode: state.pincode,
		}
			this.saveData( data, false );

	}
	saveData = ( data ) => {
		const id = this.props.selectedUserId;
		return Fetcher.post( this.props.app.apiPath + '/app/user/update/' + id, { headers: { "Content-type": "application/json" }, method: 'PATCH', body: JSON.stringify( data ) } )
			.then( res => {
				
				let modalHeading;
				let redirectToUserManagement;
				if ( res.message === 'Parameters Incorrect' || res.message === 'User Creation Failed' ) {
					modalHeading = 'Error';
					redirectToUserManagement = false;
				} else {
					modalHeading = 'Success';
					redirectToUserManagement = true;
					alert( ' User updated successfully. ' )

				}
				this.setState( {
					showModal: true,
					modalHeading: modalHeading,
					modalContent: res.message,
					redirectToUserManagement: redirectToUserManagement
				} )

			} )
			.catch( err => {
				console.log( 'Error in Updating Account', err )
				this.setState( {
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				} )
			} );
			
	}
	
	render() {
		if ( this.state.redirectToUserManagement === true ) {
			return <Redirect to={'/user-management/'} />
		}
		console.log(this.props)
		return (

			<Form method="post" onSubmit={this.updateUser}>
				<Row>
					<Col sm={12}>
						<Card>
							<Card.Header>Update User</Card.Header>
							<Card.Body>

								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Label>Name</Form.Label>
											<Form.Control required name="name" type="text" placeholder="Name" onChange={e => this.setvalue( e )} value={this.state.name} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Label>Email ID</Form.Label>
											<Form.Control required name="email"type="text" placeholder="Email ID" onChange={e => this.setvalue( e )} value={this.state.email} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Label>Mobile Number</Form.Label>
											<Form.Control required name="mobile" type="text" placeholder="Mobile Number" onChange={e => this.setvalue( e )} value={this.state.mobile} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Label>Address</Form.Label>
											<Form.Control required name="address" type="text" placeholder="Address" onChange={e => this.setvalue( e )} value={this.state.address} />
										</Form.Group>
									</Col>
								</Row>

								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Label>Pincode</Form.Label>
											<Form.Control required name="pincode" type="text" placeholder="Pincode" onChange={e => this.setvalue( e )} value={this.state.pincode} />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Label>Company</Form.Label>
											<Form.Control required name="company" type="text" placeholder="Company Name" onChange={e => this.setvalue( e )} value={this.state.company_name} />
										</Form.Group>
									</Col>
								</Row>

								{this.state.showModal && <div className="login-error">{this.state.modalContent}</div>}
								<Button className="btn-round" variant="primary" type="submit">Update User</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Form>
		);
	}

}
export default UpdateUser;