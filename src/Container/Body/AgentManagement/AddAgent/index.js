import React, { Component } from 'react';
import { Form, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { Fetcher } from "../../../Helpers/fetcher.js";
import { Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";

class AddAgent extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			agentName: '',
			agentNumber: '',
			countryCode:'',
			agentAdded:false,
			redirectToAgentsList:false,
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
		};

	}

	setvalue = ( e ) => {
		let newState={};
		if( e.target.name === 'widgetId'){
			let index = e.nativeEvent.target.selectedIndex;
			let label = e.nativeEvent.target[index].text;
			newState = {
				[ e.target.agentName ]: e.target.value,
				[ e.target.agentNumber ]: e.target.value,
				[ e.target.countryCode ]: e.target.value,
				// [ e.target.name ]: e.target.value,

				


				widgetName: label
			}
		}else{
			newState = {
				[ e.target.name ]: e.target.value,
				// [ e.target.agentName ]: e.target.value,
				// [ e.target.agentNumber ]: e.target.value,
				// [ e.target.countryCode ]: e.target.value,
			}
		}
		this.setState( newState);
	}
	hideModal = () => {
		this.setState( {
			showModal: false,
			redirectToAgentsList:this.state.agentAdded
		} );
	}

	handleAddAgentSubmit = ( event ) => {
		event.preventDefault();
		const state = cloneDeep( this.state );
		const data = {
			"in_userid": this.props.app.userId,
			"in_agentname": state.agentName,
			"in_agentno":state.agentNumber,
			"in_cc":state.countryCode,
			"in_lc":'',
			"in_agentemail":''
		}

		return Fetcher.post( this.props.app.apiPath + '/app/agent', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify( data ) } )
			.then( res => {
				let modalHeading;
				if ( res.message === 'Parameters Incorrect' || res.message === 'Agent Already Exists' ) {
					modalHeading = 'Error';
				} else if ( res.message === 'Agent Configured Successfully' ) {
					modalHeading = 'Success';
				}
				this.setState( {
					showModal: true,
					modalHeading: modalHeading,
					modalContent: res.message,
					agentName: '',
					agentNumber:'',
					countryCode:'',
					agentAdded:true
				} )

			} )
			.catch( err => {
				console.log( 'Error in Add Widget', err )
				this.setState( {
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				} )
			} );

	}

	render() {
		if ( this.state.redirectToAgentsList === true ) {
			return <Redirect to='/my-agents' />
		}

		return (
			<Form className="create-new-widget" onSubmit={( e ) => this.handleAddAgentSubmit( e )}>
				<Row>
					<Col sm={12}>
						<Card>
							<Card.Header>Add New Agent</Card.Header>
							<Card.Body>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="agentName">
											{/* <Form.Label>Coupon Description</Form.Label> */}
											<Form.Control required name="agentName" onChange={e => this.setvalue( e )} value={this.state.agentName} type="text" placeholder="Agent Name" />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="agentNumber">
											{/* <Form.Label>Coupon Code</Form.Label> */}
											<Form.Control required name="agentNumber" onChange={e => this.setvalue( e )} value={this.state.agentNumber} type="text" placeholder="Agent Number" />
										</Form.Group>
									</Col>
								</Row>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="countryCode">
											<Form.Control required name="countryCode" onChange={e => this.setvalue( e )} value={this.state.countryCode} type="text" placeholder="Country Code without prefixing (+) sign" />
										</Form.Group>
									</Col>
								</Row>

								<Button className="btn-round" variant="primary" type="submit">Add Agent</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>
				<Modal size="sm" show={this.state.showModal} onHide={() => this.hideModal( false )}>
					<Modal.Header closeButton>
						<Modal.Title id="example-modal-sizes-title-sm">
							{this.state.modalHeading}
						</Modal.Title>

					</Modal.Header>
					<Modal.Body>{this.state.modalContent} </Modal.Body>
				</Modal>
			</Form>

		);
	}

}
export default AddAgent;