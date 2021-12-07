import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { Card, Modal, Button } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import { Fetcher } from "../../Helpers/fetcher.js";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './index.css';
class Report extends Component {
	constructor( props ) {

		super( props );
		this.state = {
			report: [],
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
			copied: false,
			selecteduuID: '',
			callUID:''
		}

		//<Route path={`${urlPrefix}/campaign-summary`} ><ListCampaign app={props.app} /></Route>
	}
	componentDidMount() {
		const apiPath = this.props.app.apiPath;
		console.log(apiPath)
		const userId = this.props.app.userId;
		Fetcher.get( apiPath + '/app/report/' + userId )
			.then( res => {
				this.setState( {
					report: res
				} )
				console.log(res)
			} )
			.catch( err => { console.log( 'Error in fetching report', err ) } );

	}

	showModal = uuID => {
		const code = `
		`;
		this.setState( {
			showModal: true,
			modalHeading: 'Listen Recording',
			modalContent: <ReactPlayer url={`${this.props.app.recPath}{${uuID}}.wav`} playing />,
			selecteduuID: uuID,
			copied: false
		} )
	}

	confirmCallNow= ( status, callUID) =>{
		this.setState( {
			confirmCallNow: status,
			callUID:callUID
		} );
	}
	callNow=()=>{

		const data = {
			"callUID": this.state.callUID
		}
		return Fetcher.post( this.props.app.apiPath + '/app/followup/', { headers: { "Content-type": "application/json" }, method: 'POST',body: JSON.stringify( data ) } )
			.then( res => {

				this.setState( {
					confirmCallNow: false,
					callUID:''
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
	render() {

		const reportList = this.state.report;
		const columns = [
			{
				dataField: 'attemptId',
				text: 'attemptId',
				sort: true,
				hidden: true
			},
			{
				dataField: 'uuID',
				text: 'uuID',
				sort: false,
				hidden: true
			},
			{
				dataField: 'customerNo',
				text: 'Customer Number',
				sort: false,
				hidden: false
			},
			{
				dataField: 'agentNo',
				text: 'Agent No',
				sort: true,
				searchable: true
			}, {
				dataField: 'ansTime',
				text: 'Start Time',
				sort: true,
				searchable: true
			}, {
				dataField: 'endTime',
				text: 'End Time',
				sort: true,
				searchable: false
			},{
				dataField: 'leadTalkDuration',
				text: 'Duration',
				sort: true,
				searchable: false
			},{
				dataField: 'remarks',
				text: 'Remarks',
				sort: false,
				searchable: false
			},{
				dataField: 'actions',
				text: 'Listen Recording',
				sort: false,
				searchable: false
			},
			 ];
			 console.log(reportList)
			const report = reportList.map( ( row, index ) => {
			let rec =[<a key={`recording-${index}`} className=" btn-sm btn btn-default btn-success" onClick={( e ) => { this.showModal( row.uuID ) }} href="#">Listen</a>];

			let customerNo = '';
			//if ( row.status !== 'Fail' ) {
				//rec.push(<a key={`recording-${index}`} className=" btn-sm btn btn-default btn-success" onClick={( e ) => { this.showModal( row.uuID ) }} href="#">Listen</a>);
			//}
			//if ( row.leadTalkDuration > 0 ) {
				//customerNo = row.customerNo
			//}
			return {
				attemptId: row.attempt_id,
				uuID: row.uuid,
				customerNo: row.lead_no,
				agentNo: row.agent_no,
				ansTime: row.agent_ans_time,
				endTime: row.agent_end_time,
				leadTalkDuration: row.lead_talk_duration,
				remarks: row.remarks,
				actions: rec,
			};
		} )

		const { SearchBar, ClearSearchButton } = Search;

		const defaultSorted = [ {
			dataField: 'attemptId',
			order: 'desc'
		} ];

		const paginationOption = {
			custom: true,
			totalSize: report.length,
			sizePerPage: 10,
			sizePerPageList: [ 10, 25, 50, 100 ]
		};

		return (
			<Card>
				<Card.Header>Report</Card.Header>
				<Card.Body>
					<div className="widget-list-table-cont">
						{/* <h3>Campaign Summary</h3> */}
		{/*{!isEmpty( this.state.report ) && <PaginationProvider pagination={paginationFactory( paginationOption )}>*/}
						<PaginationProvider pagination={paginationFactory( paginationOption )}>
							{
								( {
									paginationProps,
									paginationTableProps
								} ) => (
										<ToolkitProvider
											keyField="attemptId"
											data={report}
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
														<BootstrapTable defaultSorted={defaultSorted} bordered={true} striped={true} condensed wrapperClasses="table-responsive" classes="widgetlist-table"  {...props.baseProps}  {...paginationTableProps} />
														<PaginationListStandalone {...paginationProps} />
													</div>
												)
											}
										</ToolkitProvider>
									)
							}
						</PaginationProvider>
					</div>
					<Modal size="lg" show={this.state.showModal} onHide={() => this.setMessageShow( false )}>
						<Modal.Header closeButton>
							<Modal.Title className="modal-heading" id="example-modal-sizes-title-sm">
								{this.state.modalHeading}
							</Modal.Title>

						</Modal.Header>
						<Modal.Body >
							<ReactPlayer url={`${this.props.app.recPath}${this.state.selecteduuID}.wav`} controls width='90%' height='80px' />
						</Modal.Body>

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

export default Report;