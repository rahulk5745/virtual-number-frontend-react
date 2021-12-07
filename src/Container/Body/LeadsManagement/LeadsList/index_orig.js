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
class LeadsList extends Component {
	constructor( props ) {

		super( props );
		this.state = {
			leadsList: [],
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
			confirmDelete:false,
			agentId:''
		}
	}
	componentDidMount() {
		this.getLeads();
	}
	getLeads = () => {
		const apiPath = this.props.app.apiPath;
		const userId = this.props.app.userId;
		Fetcher.get( apiPath + '/app/leads/'  + userId)
			.then( res => {
				this.setState( {
					leadsList: res,
					showModal: false,
					modalHeading: 'Status',
					modalContent: '',
					confirmDelete:false,
					agentId:''
				} )
			} )
			.catch( err => { console.log( 'Error in fetching Leads', err ) } );
	}

	confirmCallNow= ( status, leadNo) =>{
			this.setState( {
				confirmCallNow: status,
				leadNo:leadNo,
				agentId:this.props.app.userId
			} );
		}
		callNow=()=>{

			const data = {
				"leadNo": this.state.leadNo,
				"agentId": this.state.agentId
			}
			return Fetcher.post( this.props.app.apiPath + '/app/lead/', { headers: { "Content-type": "application/json" }, method: 'POST',body: JSON.stringify( data ) } )
				.then( res => {

					this.setState( {
						confirmCallNow: false,
						leadNo:'',
						agentId:''
					} );
				} )
				.catch( err => {
					console.log( 'Error in Call Now', err )

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
				this.getLeads();

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

		const leadsList = this.state.leadsList;
		const columns = [
			{
				dataField: 'leadId',
				text: 'Lead ID',
				sort: false,
				hidden: true
			},
			{
				dataField: 'leadNo',
				text: 'Lead No.',
				sort: true,
				searchable: true
			},{
				dataField: '',
				text: 'Actions',
				sort: false,
				searchable: false
			}
		];

		const leads = leadsList.map( ( lead, index ) => {
			let rec =[<a key={`callNow-${index}`} className=" btn-sm callnow-btn btn btn-default btn-primary" onClick={( e ) => { this.confirmCallNow( true,  lead.leadNo ) }} href="#">Call Now</a>];
			return {
				leadId: lead.leadId,
				leadNo: lead.leadNo,
			};
		} )
		const { SearchBar, ClearSearchButton } = Search;

		const defaultSorted = [ {
			dataField: 'leadId',
			order: 'desc'
		} ];

		const paginationOption = {
			custom: true,
			totalSize: leads.length,
			sizePerPage: 5,
			sizePerPageList: [ 5, 10, 20, 50, 100 ]
		};

		return (
			<Card>
				<Card.Header>Lead Details</Card.Header>
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
											keyField="leadId"
											data={leads}
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
														<hr />
														<BootstrapTable bordered={true} striped={true} condensed wrapperClasses="table-responsive" classes="widgetlist-table"  {...props.baseProps}  {...paginationTableProps} />
														<PaginationListStandalone {...paginationProps} />
													</div>
												)
											}
										</ToolkitProvider>
									)
							}
						</PaginationProvider>
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

					<Modal size="md" show={this.state.confirmCallNow}  onHide={() => this.confirmCallNow( false, '' )}>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
							Call Now
							</Modal.Title>

						</Modal.Header>
						<Modal.Body>
							Are you sure you want to call this number?
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.confirmCallNow( false, '' )} variant="secondary">CANCEL</Button>
							<Button onClick={this.callNow}  variant="primary">YES</Button>
						</Modal.Footer>
					</Modal>
				</Card.Body>
			</Card>

		);
	}
}

export default LeadsList;