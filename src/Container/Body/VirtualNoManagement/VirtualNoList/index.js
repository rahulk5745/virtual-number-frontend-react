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
class VirtualNoList extends Component {
	constructor( props ) {

		super( props );
		this.state = {
			didList: [],
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
			confirmDelete:false
		}

		//<Route path={`${urlPrefix}/campaign-summary`} ><ListCampaign app={props.app} /></Route>
	}
	componentDidMount() {
		this.getDids();
	}
	getDids = () => {
		const apiPath = this.props.app.apiPath;
		Fetcher.get( apiPath + '/app/did/list')
			.then( res => {
				this.setState( {
					didList: res,
					showModal: false,
					modalHeading: 'Status',
					modalContent: '',
					confirmDelete:false
				} )
			} )
			.catch( err => { console.log( 'Error in fetching DIDs', err ) } );
	}
	updateAgentStatus = ( agentId, agentStatus ) => {
		const status = agentStatus ? 0 : 1;
		const data = {
			"agentId": agentId,
			"agentStatus": status,
		}

		return Fetcher.post( this.props.app.apiPath + '/app/agent/edit', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify( data ) } )
			.then( res => {
				this.getDids();

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

		const didList = this.state.didList;
		const columns = [
			{
				dataField: 'did',
				text: 'Virtual No.',
				sort: true,
				searchable: true
			}
		];

		const dids = didList.map( ( did, index ) => {
			return {
				id: did.id,
				did: did.did,
			};
		} )
		const { SearchBar, ClearSearchButton } = Search;

		const defaultSorted = [ {
			dataField: 'id',
			order: 'desc'
		} ];

		const paginationOption = {
			custom: true,
			totalSize: dids.length,
			sizePerPage: 10,
			sizePerPageList: [ 10, 25, 50, 100 ]
		};

		return (
			<Card>
				<Card.Header>Virtual No. Details</Card.Header>
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
											keyField="id"
											data={dids}
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
														<Link  className="float-right btn btn-default btn-primary btn-round" to={`${this.props.app.urlPrefix}/virtual-no`}>Purchase Virtual No.</Link>
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
				</Card.Body>
			</Card>

		);
	}
}

export default VirtualNoList;