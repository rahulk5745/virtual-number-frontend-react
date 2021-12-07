//LeadsList

import React, { Component } from 'react';
import { Card, Modal, Button, Container, Col, Row, Table, Spinner } from 'react-bootstrap';
import { Redirect } from "react-router-dom";
import ReactPlayer from 'react-player';
import VirtualContaxt from "../../../Helpers/VirtualContaxt";
import Cookies from 'js-cookie';
import { Fetcher } from "../../../Helpers/fetcher.js";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import './index.css';
class LeadsList extends Component {
	static contextType = VirtualContaxt
	constructor(props) {

		super(props);
		this.state = {
			leads: {},
			clientHistory: [],
			clientHisLoading: false,
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
			confirmSkip: false,
			called: true,
			confirmSubmit: false,
			redirect: false

		}
		this.textInput = React.createRef();
	}

	handleChange = () => {
		this.setState({
			remarks: this.textInput.current.value
		})
	}
	componentDidMount() {
		const apiPath = this.props.app.apiPath;
		const userId = this.props.app.userId || Cookies.get('userId');
		const { leads, setLeads } = this.context;
		// const { clientHistory, clientHisLoading } = this.state;
		console.log("this.props.app", this.props);
		if (leads && !leads.length) {
			Fetcher.get(apiPath + '/app/leads/' + userId)
				.then(res => {
					this.setState({ leads: res });
					setLeads(res);
					if (res["leadId"]) {
						this.setState({ clientHisLoading: true });

						Fetcher.get(`${apiPath}/app/agent/clienthistory/${userId}/${res["leadId"]}`)
							.then(clientHis => {
								this.setState({ clientHistory: clientHis, clientHisLoading: false });
							})
							.catch(err => {
								this.setState({ clientHisLoading: false });
								console.log('Error in fetching Leads', err)
							});
					}

				})
				.catch(err => { console.log('Error in fetching Leads', err) });
		}
		if (leads && leads.length && JSON.stringify(leads) !== JSON.stringify(this.leads)) {
			this.setState({ leads });
		}

	}

	reloadData = () => {
		const apiPath = this.props.app.apiPath;
		const userId = this.props.app.userId;
		Fetcher.get(apiPath + '/app/leads/' + userId)
			.then(res => {
				// console.log(res);
				this.setState({
					leads: res,
					success: '',
					called: true,
					sent: true,
					sub: true
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
			confirmSkip: false,
			leadNo: '',
			leadAdded: true,
			success: ''

		});
		this.reloadData();


		return Fetcher.post(this.props.app.apiPath + '/app/skip/', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
			.then(res => {
				this.reloadData();
				this.setState({
					confirmSkip: false,
					callActive: true,
					redirectToLeadsList: false,
					leadAdded: true,
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
			"remarks": this.state.feedback.toString(),
			"leadNo": this.state.leads.leadNo,
			"userId": this.props.app.userId,
			"id": this.state.leads.leadId
		}
		this.setState({
			sub: false,

		});
		return Fetcher.post(this.props.app.apiPath + '/app/calldispose/', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
			.then(res => {
				this.setState({
					confirmCallNow: false,
					leadNo: '',
					redirectToLeadsList: false,
					leadAdded: true
				});
				this.setState({ success: "Feedback for " + data.leadNo + " submitted   successfuly. " });
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

	callNow = () => {

		const data = {
			"leadNo": this.state.leadNo,
			"userId": this.state.userId,
			"id": this.state.leadId
		}

		this.setState({
			confirmCallNow: true,
			called: false,
			redirectToLeadsList: false,
			leadAdded: true,
			callActive: false,

		});

		return Fetcher.post(this.props.app.apiPath + '/app/lead/', { headers: { "Content-type": "application/json" }, method: 'POST', body: JSON.stringify(data) })
			.then(res => {
				this.setState({
					confirmCallNow: false,
					redirectToLeadsList: false,
					leadAdded: true,
					success: res ? res.message : "Call sent  successfuly to " + data.leadNo,
					redirect: true
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


	handleCheckboxChange = (event) => {
		const target = event.target
		const checked = target.checked
		const name = target.name
		let feedbacks = this.state.feedbacks;
		if (checked) {
			this.setState({
				feedback: [...this.state.feedback, name]
			})
			feedbacks[name - 1].isChecked = true;
		} else {
			var array = [...this.state.feedback]; // make a separate copy of the array
			var index = array.indexOf(target.name)
			if (index !== -1) {
				array.splice(index, 1);
				this.setState({ feedback: array });
			}
			feedbacks[name - 1].isChecked = false;
		}
	}

	handleAllChecked = (event) => {
		let feedbacks = this.state.feedbacks;
		feedbacks.forEach(feedbacks => feedbacks.isChecked = event.target.checked);
		this.setState({ feedbacks: feedbacks });
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
		let rec = [<div><a className=" btn-lg callnow-btn btn btn-default btn-danger" onClick={(e) => { this.confirmSkipNow(true, this.state.leads.leadNo, this.state.leads.leadId) }} href="#">Skip</a><a className=" btn-lg callnow-btn btn btn-default btn-success" onClick={(e) => { this.confirmCallNow(true, this.state.leads.leadNo, this.state.leads.leadId) }} href="#">Call Now</a><a className=" btn-lg callnow-btn btn btn-default btn-danger" onClick={(e) => { this.confirmSkipNow(true, this.state.leads.leadNo, this.state.leads.leadId) }} href="#">Send Sms</a></div>];
		let companyWebsiteUrl = [this.state.leads.companyWebsite ? <a href={this.state.leads && this.state.leads.companyWebsite} target="_blank">{this.state.leads.companyWebsite}</a> : "-"];

		if (this.state.redirect) {
			return <Redirect to={`remarks`} />
		}

		return (

			<>
				<Card>
					<Card.Header>Leads Details</Card.Header>
					<Card.Body>
						<Table striped bordered hover>
							<thead>
								<tr>
									<th>Event</th>
									<th>Data</th>
									<th>Lead No.</th>
									<th>EmailId</th>
									<th>Req Date</th>
									<th>status</th>
								</tr>
							</thead>
							<tbody>
								{!!this.state.clientHistory.length && this.state.clientHistory.map((client) => <tr >
									<td>{client.event || ""}</td>
									<td>{client.data || ""}</td>
									<td>{client.leadNo || ""}</td>
									<td>{client.emailId || ""}</td>
									<td>{client.reqDate || ""}</td>
									<td>{client.status || ""}</td>
								</tr>)
								}
								{!!(!this.state.clientHistory.length && !this.state.clientHisLoading) && <tr >
									<td colSpan="6">
										<div style={{ display: "flex", justifyContent: "center" }}> No Data </div>
									</td>
								</tr>}
								{this.state.clientHisLoading && <tr >
									<td colSpan="6">
										<Spinner style={{ display: "flex", margin: 'auto' }} animation="border" role="status">
											<span className="sr-only">Loading...</span>
										</Spinner>
									</td>
								</tr>}
							</tbody>
						</Table>

						<Table bordered>
							<tbody>
								<tr>
									<td>Mobile Number</td>
									<td>{this.state.leads && this.state.leads.leadNo || "-"}</td>
								</tr>
								<tr>
									<td>Website</td>
									<td>{companyWebsiteUrl || "-"}</td>
								</tr>
								<tr>
									<td>City</td>
									<td>{this.state.leads && this.state.leads.city || "-"}</td>
								</tr>
							</tbody>
						</Table>

						{/* <Row>
							<Col xs="5" lg={{ span: 3, offset: 3 }}>
								<div className="row firstCol">Mobile No.</div>
							</Col>
							<Col xs="2" lg="1">
								<div className="row">:</div>
							</Col>
							<Col xs="5" lg="5">
								<div className="row firstCol">{this.state.leads && this.state.leads.leadNo || "-"}</div>
							</Col>
						</Row>
						<Row>
							<Col xs="5" lg={{ span: 3, offset: 3 }}>
								<div className="row firstCol">Website</div>
							</Col>
							<Col xs="2" lg="1">
								<div className="row">:</div>
							</Col>
							<Col xs="5" lg="5">
								<div className="row firstCol">{companyWebsiteUrl || "-"}</div>
							</Col>
						</Row>
						<Row>
							<Col xs="5" lg={{ span: 3, offset: 3 }}>
								<div className="row firstCol">City</div>
							</Col>
							<Col xs="2" lg="1">
								<div className="row">:</div>
							</Col>
							<Col xs="5" lg="5">
								<div className="row firstCol">{this.state.leads && this.state.leads.city || "-"}</div>
							</Col>
						</Row> */}

						<Row className="align-items-center">
							<Col xs="12">
								<div className="success"> {this.state.success}</div>
							</Col>
						</Row>

						<div style={{ display: 'flex', justifyContent: 'center', padding: '5px 0px' }}>
							<Button disabled={!this.state.called} variant={(this.state.called ? 'primary' : 'danger')} className="btnGAp customButton" onClick={(e) => { this.confirmCallNow(true, this.state.leads.leadNo, this.state.leads.leadId) }}>{(this.state.called ? 'Call' : 'Called')}</Button>{' '}

							<Button className="btnGAp customButton" variant="primary" onClick={(e) => { this.confirmSkipNow(true, this.state.leads.leadNo, this.state.leads.leadId) }}>Next</Button>
						</div>

					</Card.Body>
				</Card>

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
						<div>Do you want to call now ?</div>

					</Modal.Body>
					<Modal.Footer>
						<Button className="btnGAp customButton" onClick={() => this.confirmCallNow(false, '', '')} variant="secondary">CANCEL</Button>
						{this.state.callActive ? <Button className="btnGAp customButton" onClick={this.callNow} variant="primary">Call</Button> : <Button className="btnGAp customButton" onClick={this.callDispose} variant="primary">Submit</Button>}


					</Modal.Footer>
				</Modal>

				<Modal size="md" show={this.state.confirmSkip} onHide={() => this.confirmCallNow(false, '', '')}>
					<Modal.Header closeButton>
						<Modal.Title id="example-modal-sizes-title-sm">
							Skip
							</Modal.Title>

					</Modal.Header>
					<Modal.Body>
						Do you want to fetch next customer?
						</Modal.Body>
					<Modal.Footer>
						<Button className="btnGAp customButton" onClick={() => this.confirmSkipNow(false, '', '')} variant="secondary">CANCEL</Button>
						<Button className="btnGAp customButton" onClick={this.skipNow} variant="primary">Yes</Button>


					</Modal.Footer>
				</Modal>
			</>

		);
	}
}

export default LeadsList;