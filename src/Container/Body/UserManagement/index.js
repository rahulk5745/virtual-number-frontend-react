import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { Link } from "react-router-dom";
import { Button, Modal, Card, Col, Form, Row } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import { Fetcher } from "../../Helpers/fetcher.js";
import ReactTooltip from 'react-tooltip';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import "./index.css";
class UserManagement extends Component {
	constructor( props ) {

		super( props );
		this.state = {
			userList: [],
			adminCredits: 0,
			creditsToAdd:0,
			confirmDelete: false,
			selectedUserId:0,
			showAddCreditModal:false,
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
		}
	}
	componentDidMount() {
		this.getUsers();
	}


	getUsers = () => {
		const apiPath = this.props.app.apiPath;
		const userId = this.props.app.userId;
		Fetcher.get( apiPath + '/app/user/' + userId )
			.then( res => {
				this.setState( {
					userList: res.users,
					adminCredits: res.adminCredits,
					showModal: false,
					showAddCreditModal:false,
					confirmDelete: false,
				} )
			} )
			.catch( err => { console.log( 'Error in fetching Users List', err ) } );
	}

	confirmDelete = ( status, userId ) => {
		this.setState( {
			confirmDelete: status,
			selectedUserId: userId
		} );
		//console.log(userId)
	}

	deleteUser = () => {
		const userId = this.state.selectedUserId;
		const data = {
			parent: this.props.app.userId,
		}
		console.log(data)
		return Fetcher.post( this.props.app.apiPath + '/app/user/' + userId, { headers: { "Content-type": "application/json" }, method: 'DELETE',  body:JSON.stringify( data) }  )
			.then( res => {
				this.getUsers();
			})
			.catch( err => {
				console.log( 'Error in Deleting User', err )

				this.setState( {
					showModal: true,
					modalHeading: 'Error',
					modalContent: 'Error in Deleting User, please try again',

				} )
			} );

	}
	addCredits = (event ) =>{
		event.preventDefault();
		const data = {
			userId: this.state.selectedUserId,
			parent: this.props.app.userId,
			credits: this.state.creditsToAdd,
		}
		return Fetcher.post( this.props.app.apiPath + '/app/credits', { headers: { "Content-type": "application/json" }, method: 'POST', body:  data.parent  } )
			.then( res => {
				if ( res.message === 'Parameters Incorrect'  ) {
					alert( 'Adding Credits failed.' )
				} else {
					alert( res.message )
				}
				this.getUsers();
			} )
			.catch( err => {
				console.log( 'Error in Adding Credits', err )
				this.setState( {
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				} )
			} );


	}

	setvalue = ( e ) => {
		this.setState( {
			[ e.target.name ]: e.target.value,
		} );
	}

	setMessageShow = ( status ) => {
		this.setState( {
			showModal: false,
			showAddCreditModal:false,
		} );
	}

	showAddCreditModal = ( userId ) => {
		this.setState( {
			showAddCreditModal:true,
			selectedUserId: userId
		} );
	}
	

	render() {

		const userList = this.state.userList;
		const columns = [
			{
				dataField: 'username',
				text: 'Username',
				sort: false,
				hidden: false
			},
			{
				dataField: 'name',
				text: 'Name',
				sort: true,
				searchable: true
			}, {
				dataField: 'emailId',
				text: 'Email Id',
				sort: true,
				searchable: true
			}, {
				dataField: 'number',
				text: 'Number',
				sort: true,
				searchable: false
			}, {
				dataField: 'address',
				text: 'Address',
				sort: true,
				searchable: false
			}, {
				dataField: 'pincode',
				text: 'Pincode',
				sort: true,
				searchable: false
			}, {
				dataField: 'company',
				text: 'Company',	
				sort: true,
				searchable: false
			},{
				dataField: 'credits',
				text: 'Credits Available',
				sort: false,
				searchable: false
			}, {
				dataField: 'creditsUsed',
				text: 'Credits Used',
				sort: false,
				searchable: false
			},
			{
				dataField: 'action',
				text: 'Action',
				sort: false,
				searchable: false
			}, ];

		const users = userList.map( ( user, index ) => {
			let action = [ <Link data-tip="Edit User Profile" key={`${index}-edit-user`} className="edit-user" to={`${this.props.app.urlPrefix}/update-user/${user.user_id}`}><i className="fa fa-edit"></i></Link> ];
			action.push( <a data-tip="Add Credits" key={`${index}-add-credit`} className="add-credit" onClick={( e ) => { this.showAddCreditModal( user.userId ) }} href="#"><i className="fa fa-plus"></i></a> )
			action.push( <a data-tip="Delete User" key={`${index}-delete-user`} className="delete-user" onClick={( e ) => { this.confirmDelete( true, user.user_id ) }} href="#"><i className="fa fa-trash"></i></a> )
			//console.log(user.user_id) 
			return {
				userId: user.user_id,
				username: user.username,
				name: user.name,
				emailId: user.email,
				number: user.mobile,
				address: user.address,
				pincode: user.pincode,
				company: user.company_name,
				credits: user.credits,
				creditsUsed: user.creditsUsed,
				action: action
			};
		} )
		const { SearchBar, ClearSearchButton } = Search;

		const defaultSorted = [ {
			dataField: 'userId',
			order: 'desc'
		} ];

		const paginationOption = {
			custom: true,
			totalSize: users.length,
			sizePerPage: 10,
			sizePerPageList: [ 10, 25, 50, 100 ]
		};
console.log(this.props)
		return (
			<Card>
				<Card.Header>Users List<span>&nbsp;&nbsp;&nbsp;</span><span className="float-none avail-credit-cont"><span className="credits-avail">Available Credits: {this.state.adminCredits}</span></span></Card.Header>
				<Card.Body>
					<div className="widget-list-table-cont">
						{/* <h3>Campaign Summary</h3> */}
						{/*{!isEmpty( this.state.userList ) && <PaginationProvider pagination={paginationFactory( paginationOption )}>*/}
						{<PaginationProvider pagination={paginationFactory( paginationOption )}>
							{
								( {
									paginationProps,
									paginationTableProps
								} ) => (
										<ToolkitProvider
											keyField="userId"
											data={users}
											columns={columns}
											search
											bootstrap4

										>
											{
												props => (
													<div className="">
														Show <SizePerPageDropdownStandalone className="search-dropdown" {...paginationProps} /> items
														<span className="search-cont"><SearchBar  {...props.searchProps} /></span>
														<ClearSearchButton className="btn-primary btn-round" {...props.searchProps} />
														{/*<span>&nbsp;&nbsp;&nbsp;</span><span className="float-none avail-credit-cont"><span className="credits-avail">Available Credits: {this.state.adminCredits}</span></span>*/}
														<Link className="float-right btn btn-default btn-primary" to={`${this.props.app.urlPrefix}/create-user`}>Add User</Link>
														<hr />
														<BootstrapTable defaultSorted={defaultSorted} bordered={true} striped={true} condensed wrapperClasses="table-responsive" classes="widgetlist-table"  {...props.baseProps}  {...paginationTableProps} />
														<PaginationListStandalone {...paginationProps} />
														<ReactTooltip />
													</div>
												)
											}
										</ToolkitProvider>
									)
							}
						</PaginationProvider>}
					</div>
					<Modal size="sm" show={this.state.showAddCreditModal} onHide={() => this.setMessageShow( false )}>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
								Add Credits
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form method="post" onSubmit={this.addCredits}>
								<Row>
									<Col sm={6}>
										<Form.Group controlId="referrerDomain">
											<Form.Control required name="creditsToAdd" type="text" placeholder="Credits" onChange={e => this.setvalue( e )} value={this.state.creditsToAdd} />
										</Form.Group>
									</Col>
								</Row>
								<Button variant="primary" type="submit">Add Credits</Button>
							</Form>
							</Modal.Body>
					</Modal>



					<Modal size="sm" show={this.state.showModal} onHide={() => this.setMessageShow( false )}>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
								{this.state.modalHeading}
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>{this.state.modalContent}</Modal.Body>
					</Modal>

					<Modal size="md" show={this.state.confirmDelete} onHide={() => this.confirmDelete( false, '' )}>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
								Delete User
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							Are you sure you want to delete this user?
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.confirmDelete( false, '' )} variant="secondary">Close</Button>
							<Button onClick={this.deleteUser} variant="primary">Ok</Button>
						</Modal.Footer>
					</Modal>

				</Card.Body>
			</Card>

		);
	}
}

export default UserManagement;