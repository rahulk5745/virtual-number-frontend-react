import React, { Component, Fragment } from 'react';
import { Form, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import { Fetcher } from "../../../Helpers/fetcher.js";
import { Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";


// import "./index.css";
class VirtualNo extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			numberType: 'premium',
			preimumDid: [],
			normalDid: [],
			id: '',
			did: '',
			redirectToAgentsList: false,
			showModal: false,
			modalHeading: 'Status',
		};

	}

	componentDidMount() {
		const apiPath = this.props.app.apiPath;
		Fetcher.get( apiPath + '/app/did/premium' )
			.then( res => {
				this.setState( {
					preimumDid: res
				} )
			} )
			.catch( err => { console.log( 'Error in fetching Premium DID', err ) } );

		Fetcher.get( apiPath + '/app/did/normal' )
			.then( res => {
				this.setState( {
					normalDid: res
				} )
			} )
			.catch( err => { console.log( 'Error in fetching Normal DID', err ) } );


	}

	showModal = () => {
		this.setState( {
			showModal: true,
			modalHeading: 'Purchase Virtual Number',
		} )
	}

	setvalue = ( e ) => {
		let newState = {};
		newState = {
			[ e.target.name ]: e.target.value,
			did:'',
			id:''
		}
		this.setState( newState );
	}
	setDid = ( e ) => {
		let index = e.nativeEvent.target.selectedIndex;
		let label = e.nativeEvent.target[index].text;
		this.setState( {
			did: label,
			id: e.target.value
		} );
	}

	hideModal = () => {
		this.setState( {
			showModal: false,
			redirectToAgentsList: true,
		} );
	}


	handleSubmit = ( event ) => {
		event.preventDefault();
		const state = cloneDeep( this.state );
		if ( state.id == '' ) {
			alert( 'Please select a Number first' );
			return;
		}

		const data = {
			"id": state.id,
			"did": state.did,
		}

		return Fetcher.post( this.props.app.apiPath + '/app/did/buy', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify( data ) } )
			.then( res => {
				let modalHeading;
				if ( res.message === 'Parameters Incorrect' ) {
					modalHeading = 'Error';
					alert('Number purchased failed, please try again')
				} else {
					modalHeading = 'Success';
					alert('Number purchased successfully');
					this.hideModal();
				}


			} )
			.catch( err => {
				console.log( 'Error in Add DID', err )
			} );

	}

	render() {
		if ( this.state.redirectToAgentsList === true ) {
			return <Redirect to={`/my-virtualnos`} />
		}
		let numbersArray = [];
		if ( this.state.numberType === 'premium' ) {
			numbersArray = this.state.preimumDid;
		} else {
			numbersArray = this.state.normalDid;
		}
		const numbersList = numbersArray.map( ( number, index ) => {
			return <option key={`number-${number.did}`} value={number.id}>{number.did}</option>;
		} );

		return (
			<Fragment>
				<Row>
					<Col sm={12}>
						<Card>
							<Card.Header>Purchase Virtual Number</Card.Header>
							<Card.Body>
								<p>No Virtual No. Purchased</p>
								<Button onClick={this.showModal} variant="primary" type="submit">Purchase Now</Button>
							</Card.Body>
						</Card>
					</Col>
				</Row>


				<Modal size="md" show={this.state.showModal} onHide={() => this.hideModal( false )}>
					<Modal.Header closeButton>
						<Modal.Title id="example-modal-sizes-title-sm">
							{this.state.modalHeading}
						</Modal.Title>

					</Modal.Header>
					<Modal.Body>
						<Form className="create-new-widget" onSubmit={e =>
							window.confirm( "Are you sure, you want to buy?" ) &&
							this.handleSubmit( e )
						}>
							<Row>
								<Col sm={12}>

									<Row>
										<Col sm={6}>
											<Form.Group controlId="notype">
												<div>
													<Form.Check id="notype-0" custom inline checked={this.state.numberType === "premium"} label="Premium Virtual No" name="numberType" onChange={e => this.setvalue( e )} value="premium" type="radio" />
													<Form.Check id="notype-1" custom inline checked={this.state.numberType === "normal"} label="Normal Virtual No" name="numberType" onChange={e => this.setvalue( e )} value="normal" type="radio" />
												</div>
											</Form.Group>
										</Col>
									</Row>

									<Row>
										<Col sm={6}>
											<Form.Group controlId="number">
												<Form.Label>Select Number</Form.Label>
												<Form.Control name="did" onChange={e => this.setDid( e )} as="select">
													<option value="">Select</option>
													{numbersList}
												</Form.Control>
											</Form.Group>
										</Col>
									</Row>



									<Button variant="primary" type="submit">Buy</Button>

								</Col>
							</Row>
						</Form>

					</Modal.Body>
				</Modal>

			</Fragment>
		);
	}

}
export default VirtualNo;