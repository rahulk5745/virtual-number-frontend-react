import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { Card, Modal, Button } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import { Fetcher } from "../../../Helpers/fetcher.js";
import ToggleButton from 'react-toggle-button'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';

import "./index.css";
class AgentsList extends Component {
	constructor( props ) {

		super( props );
		this.state = {
			agentList: [],
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
			confirmDelete:false,
			agentId:''
		}
	}
	componentDidMount() {
		this.getAgents();
	}
	getAgents = () => {
		const apiPath = this.props.app.apiPath;
		//console.log(this.props)
		const userId = this.props.app.userId
		//console.log(userId)
		Fetcher.get( apiPath + '/app/agent/list/' )
			.then( res => {
				this.setState( {
					agentList: res,
					showModal: false,
					modalHeading: 'Status',
					modalContent: '',
					confirmDelete:false,
					agentId:''
				} )
				//console.log(res)	
			} )
			.catch( err => { console.log( 'Error in fetching Agents', err ) } );
			//console.log(this.state.agentList)
	}
	updateAgentStatus = ( agentId, agentStatus ) => {
		const status = agentStatus ? 1 : !agentStatus ? 0: 1;
		
		const data = {
			"agentId": agentId,
		
			"agentStatus": status,
		}

		return Fetcher.post( this.props.app.apiPath + '/app/agent/login', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify( data ) } )
			.then( res => {
				this.getAgents();

			} )
			.catch( err => {
				console.log( 'Error in Logout', err )

				this.setState( {
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				} )
			} );

	}

	setMessageShow = ( status ) => {

		this.setState( {
			showModal: false,
		} );
	}
	confirmDelete= ( status, agentId) =>{
		this.setState( {
			confirmDelete: status,
			agentId:agentId
		} );
	}
	deleteAgent=()=>{
		const agentId = this.state.agentId;
		return Fetcher.post( this.props.app.apiPath + '/app/agent/'+agentId, { headers: { "Content-type": "application/json" }, method: 'DELETE' } )
			.then( res => {
				this.getAgents(); 
			} )
			.catch( err => {
				console.log( 'Error in Deleting Agent', err )

				this.setState( {
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				} )
			} );

	}
	render() {

		const agentList = this.state.agentList;
		//console.log(this.state.agentList)
		const columns = [
			{
				dataField: 'agentId',
				text: 'Agent ID',
				sort: false,
				hidden: true
			},
			{
				dataField: 'agentName',
				text: 'Agent Name',
				sort: true,
				searchable: true
			},  {
				dataField: 'agentNumber',
				text: 'Agent No',
				sort: true,
				searchable: false
			}, {
				dataField: 'agentStatus',
				text: 'Agent Status',
				sort: true,
				searchable: false
			}, {
				dataField: 'logOut',
				text: 'LogIn/LogOut',
				sort: false,
				searchable: false
			},
			{
				dataField: 'delete',
				text: 'Delete Agent',
				sort: false,
				searchable: false
			}
		];

		const agents = agentList.map( ( agent, index ) => {
			return {
				agentId: agent.agent_id,
				agentName: agent.agent_name,
				agentNumber: agent.phone_no,
				agentStatus: agent.status ? <span className="active">Active</span> : <span className="inactive">Inactive</span>,
				logOut: <ToggleButton
					value={ !agent.status || false}
					onToggle={( e ) => this.updateAgentStatus( agent.agent_id, agent.status )}
					inactiveLabel=""
					activeLabel=""
					colors={{
						active: {
						  base: 'rgb(199,5,5)',
						},
						inactive: {
						  base: 'rgb(0,128,0)',
						}
					  }} />
				,
				delete: <a className="delete-agent" onClick={( e ) => { this.confirmDelete( true, agent.agent_id ) }} href="#"><i className="fa fa-trash"></i></a>,
			};
		} )
		const { SearchBar, ClearSearchButton } = Search;

		const defaultSorted = [ {
			dataField: 'agentId',
			order: 'desc'
		} ];

		const paginationOption = {
			custom: true,
			totalSize: agents.length,
			sizePerPage: 10,
			sizePerPageList: [ 10, 25, 50, 100 ]
		};

		return (
			<Card>
				<Card.Header>Agent Details</Card.Header>
				<Card.Body>
					<div className="widget-list-table-cont">
						{/* <h3>Campaign Summary</h3> */}
						 <PaginationProvider pagination={paginationFactory( paginationOption )}>
							{
								( {
									paginationProps,
									paginationTableProps
								} ) => (
										<ToolkitProvider
											keyField="agentId"
											data={agents}
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
														<Link  className="float-right btn btn-default btn-primary btn-round" to={`${this.props.app.urlPrefix}/add-agent/`}>Add New Agent</Link>
														<hr />
														<BootstrapTable bordered={true} striped={true} condensed wrapperClasses="table-responsive" classes="widgetlist-table"  {...props.baseProps}  {...paginationTableProps} />
														<PaginationListStandalone {...paginationProps} />
													</div>
												)
											}
										</ToolkitProvider>
									)
							}
						</PaginationProvider>{/*  */}
					</div>
					<Modal size="sm" show={this.state.showModal} onHide={() => this.setMessageShow( false )}>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
								{this.state.modalHeading}
							</Modal.Title>

						</Modal.Header>
						<Modal.Body>{this.state.modalContent}

						</Modal.Body>
					</Modal>

					<Modal size="md" show={this.state.confirmDelete}  onHide={() => this.confirmDelete( false, '' )}>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
							Delete Agent
							</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							Are you sure you want to delete this agent?
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.confirmDelete( false, '' )} variant="secondary">CANCEL</Button>
							<Button onClick={this.deleteAgent}  variant="primary">YES</Button>
						</Modal.Footer>
					</Modal>
				</Card.Body>
			</Card>

		);
	}
}

export default AgentsList;