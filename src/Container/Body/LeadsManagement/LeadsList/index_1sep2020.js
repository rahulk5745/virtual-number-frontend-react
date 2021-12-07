import React, { Component } from 'react';
import { isEmpty } from 'lodash';
import { Card, Modal, Button, Form } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import ReactPlayer from 'react-player';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import paginationFactory, { PaginationProvider, PaginationListStandalone, SizePerPageDropdownStandalone } from 'react-bootstrap-table2-paginator';
import { Fetcher } from "../../../Helpers/fetcher.js";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './index.css';
class LeadsList extends Component {
	constructor(props) {

		super(props);
		this.state = {
			leads: [],
			showModal: false,
			modalHeading: 'Status',
			modalContent: '',
			copied: false,
			selecteduuID: '',
			leadAdded: false,
			redirectToLeadsList: false,
			callUID: '',
			callActive: true,
			remarks: '',
			confirmSkip: false
		}
		this.textInput = React.createRef();
		//<Route path={`${urlPrefix}/campaign-summary`} ><ListCampaign app={props.app} /></Route>
	}

	handleChange = () => {
		this.setState({
			remarks: this.textInput.current.value
		})
	}
	componentDidMount() {
		const apiPath = this.props.app.apiPath;
		const userId = this.props.app.userId;
		Fetcher.get(apiPath + '/app/leads/' + userId)
			.then(res => {
				console.log(res);
				this.setState({
					leads: res
				})
			})
			.catch(err => { console.log('Error in fetching Leads', err) });
	}

	reloadData = () => {
		const apiPath = this.props.app.apiPath;
		const userId = this.props.app.userId;
		Fetcher.get(apiPath + '/app/leads/' + userId)
			.then(res => {
				// console.log(res);
				this.setState({
					leads: res
				})
			})
			.catch(err => { console.log('Error in fetching Leads', err) });
	}

	showModal = uuID => {
		const code = `
		`;
		this.setState({
			showModal: true,
			modalHeading: 'Listen Recording',
			modalContent: <ReactPlayer url={`${this.props.app.apiPath}/rec/{${uuID}}.wav`} playing />,
			selecteduuID: uuID,
			copied: false

		})
	}

	confirmCallNow = (status, leadNo, leadId) => {
		this.setState({
			confirmCallNow: status,
			leadNo: leadNo,
			userId: this.props.app.userId,
			leadId: leadId,
			callActive: true

		});
	}

	confirmSkipNow = (status, leadNo, leadId) => {
		this.setState({
			confirmSkip: status,
			leadNo: leadNo,
			userId: this.props.app.userId,
			leadId: leadId

		});
	}
	skipNow = () => {

		const data = {
			"leadNo": this.state.leadNo,
			"userId": this.state.userId,
			"id": this.state.leadId
		}

		this.setState({
			confirmSkip: true,
			//leadNo: '',
			redirectToLeadsList: false,
			leadAdded: true,
			callActive: false,

		});



		return Fetcher.post(this.props.app.apiPath + '/app/skip/', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
			.then(res => {
				this.reloadData();
				this.setState({
					confirmSkip: false,
					callActive: true,
					redirectToLeadsList: false,
					leadAdded: true,
					confirmCallNow: true,
					callActive: false,
				});
			})
			.catch(err => {
				console.log('Error in Call Now', err)

				this.setState({
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				})
			});

	}

	callDispose = () => {
		const data = {
			"remarks": this.state.remarks,
			"leadNo": this.state.leadNo,
			"userId": this.state.userId,
			"id": this.state.leadId
		}

		//alert(data.remarks+' - '+data.leadNo+' - '+data.userId+' - '+data.id);
		return Fetcher.post(this.props.app.apiPath + '/app/calldispose/', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
			.then(res => {
				this.reloadData();
				this.setState({
					confirmCallNow: false,
					leadNo: '',
					redirectToLeadsList: false,
					leadAdded: true
				});
			})
			.catch(err => {
				console.log('Error in Call Now', err)

				/*this.setState({
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				})*/
			});


	}

	callNow = () => {

		const data = {
			"leadNo": this.state.leadNo,
			"userId": this.state.userId,
			"id": this.state.leadId
		}

		this.setState({
			confirmCallNow: true,
			//leadNo: '',
			redirectToLeadsList: false,
			leadAdded: true,
			callActive: false,

		});

		//alert(da);

		return Fetcher.post(this.props.app.apiPath + '/app/lead/', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
			.then(res => {

				this.setState({
					confirmCallNow: true,
					//leadNo:'',
					redirectToLeadsList: false,
					leadAdded: true,

				});
			})
			.catch(err => {
				console.log('Error in Call Now', err)

				this.setState({
					showModal: true,
					modalHeading: 'Error',
					modalContent: err.message,

				})
			});

	}



	setMessageShow = (status) => {
		alert(status);
		this.setState({
			showModal: false,
			callActive: true,
			redirectToLeadsList: this.state.leadAdded
		});
	}
	render() {
		if (this.state.redirectToLeadsList === true) {
			return <Redirect to={`/my-leads`} />
		}

		const leadsList = this.state.leads;
		const columns = [
			{
				dataField: 'leadId',
				text: 'leadId',
				sort: true,
				hidden: true
			},
			{
				dataField: 'leadNo',
				text: 'Customer Number',
				sort: false,
				hidden: false
			}, {
				dataField: 'companyWebsite',
				text: 'Company Website',
				sort: false,
				hidden: false
			},
			{
				dataField: 'actions',
				text: 'Actions',
				sort: true,
				searchable: false
			}
		];
		// console.log(leadsList)
		const leads = leadsList.map((row, index) => {
			let rec = [<div><a key={`callNow-${index}`} className=" btn-sm callnow-btn btn btn-default btn-primary" onClick={(e) => { this.confirmSkipNow(true, row.leadNo, row.leadId) }} href="#">Skip</a><a key={`callNow-${index}`} className=" btn-sm callnow-btn btn btn-default btn-primary" onClick={(e) => { this.confirmCallNow(true, row.leadNo, row.leadId) }} href="#">Call Now</a></div>];
			let companyWebsiteUrl = [<a href={row.companyWebsite} target="_blank">{row.companyWebsite}</a>];
			return {
				leadId: row.leadId,
				leadNo: row.leadNo,
				companyWebsite: companyWebsiteUrl,
				actions: rec
			};
		})

		const { SearchBar, ClearSearchButton } = Search;

		const defaultSorted = [{
			dataField: 'leadId',
			order: 'asc'
		}];

		const paginationOption = {
			custom: true,
			totalSize: leads.length,
			sizePerPage: 5,
			sizePerPageList: [5, 10, 25, 50, 100]
		};

		return (
			<Card>
				<Card.Header>Leads Details</Card.Header>
				<Card.Body>
					<div className="widget-list-table-cont">
						{/* <h3>Campaign Summary</h3> */}
						{/*{!isEmpty( this.state.report ) && <PaginationProvider pagination={paginationFactory( paginationOption )}>*/}
						<PaginationProvider pagination={paginationFactory(paginationOption)}>
							{
								({
									paginationProps,
									paginationTableProps
								}) => (
										<ToolkitProvider
											keyField="attemptId"
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
					<Modal size="lg" show={this.state.showModal} onHide={() => this.setMessageShow(false)}>
						<Modal.Header closeButton>
							<Modal.Title className="modal-heading" id="example-modal-sizes-title-sm">
								{this.state.modalHeading}
							</Modal.Title>

						</Modal.Header>
						<Modal.Body >
							<ReactPlayer url={`${this.props.app.apiPath}/rec/${this.state.selecteduuID}.wav`} controls width='90%' height='80px' />
						</Modal.Body>

					</Modal>

					<Modal size="md" show={this.state.confirmCallNow} onHide={() => this.confirmCallNow(false, '', '')}>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
								Call Now
							</Modal.Title>

						</Modal.Header>
						<Modal.Body>
							{this.state.callActive ? <div>Do you want to call now ?</div> : <div></div>}

							{!this.state.callActive &&

								<Form.Group controlId="exampleForm.ControlTextarea1">
									<Form.Label>Add Remarks</Form.Label>
									<Form.Control ref={this.textInput} type="text" onChange={() => this.handleChange()} as="textarea" rows="3" />
								</Form.Group>
							}

						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.confirmCallNow(false, '', '')} variant="secondary">CANCEL</Button>
							{this.state.callActive ? <Button onClick={this.callNow} variant="primary">Call</Button> : <Button onClick={this.callDispose} variant="primary">Submit</Button>}


						</Modal.Footer>
					</Modal>

					<Modal size="md" show={this.state.confirmSkip} onHide={() => this.confirmCallNow(false, '', '')}>
						<Modal.Header closeButton>
							<Modal.Title id="example-modal-sizes-title-sm">
								Call Now
							</Modal.Title>

						</Modal.Header>
						<Modal.Body>
							Do you want to skip this customer?
						</Modal.Body>
						<Modal.Footer>
							<Button onClick={() => this.confirmSkipNow(false, '', '')} variant="secondary">CANCEL</Button>
							<Button onClick={this.skipNow} variant="primary">Yes</Button>


						</Modal.Footer>
					</Modal>

				</Card.Body>
			</Card>

		);
	}
}

export default LeadsList;