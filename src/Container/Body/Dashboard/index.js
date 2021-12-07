import React, { Component } from 'react';
import {  Card, Col,Row  } from 'react-bootstrap';
import { Fetcher } from '../../Helpers/fetcher.js';
import './index.css';
class Dashboard extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			dashboardData: []
		}
	}
	componentDidMount() {
		const apiPath = this.props.app.apiPath;
		const userId = this.props.app.userId;
		Fetcher.get( apiPath+'/app/dashboard/'+userId )
			.then( res => {
				console.log(res)
				this.setState( {
					dashboardData: res.data1
				} )
				console.log(this.state.dashboardData)
			} )
			.catch( err => { console.log( 'Error in fetching Dashboard Data', err ) } );
	}

	render() {


		return (
			<div className="animated fadeIn">
				<Row>
					{(this.props.app.role === 'ROLE_ADMIN' || this.props.app.role === 'ROLE_SADMIN' ) && <Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-success dashboard-card">
							<Card.Body className="pb-0">
							<div className="dashboard-card-heading">Total Users</div>
								<div className="text-value dashboard-card-data">{this.state.dashboardData.totalUsers}</div>

							</Card.Body>
						</Card>
					</Col>}
					{(this.props.app.role === 'ROLE_USER') && <Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-primary dashboard-card">
							<Card.Body className="pb-0">
							<div className="dashboard-card-heading">Total Calls</div>
								<div className="text-value dashboard-card-data">{this.state.dashboardData.totalCalls}</div>

							</Card.Body>
						</Card>
					</Col>}
					{(this.props.app.role === 'ROLE_USER') && <Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-success dashboard-card">
							<Card.Body className="pb-0">
							<div className="dashboard-card-heading">Connected Calls</div>
								<div className="text-value dashboard-card-data">{this.state.dashboardData.connectedCalls}</div>

							</Card.Body>
						</Card>
					</Col>}
					{(this.props.app.role === 'ROLE_USER') && <Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-danger dashboard-card">
							<Card.Body className="pb-0">
							<div className="dashboard-card-heading">Failed Calls</div>
								<div className="text-value dashboard-card-data">{this.state.dashboardData.failedCalls}</div>

							</Card.Body>
						</Card>
					</Col>}
					{(this.props.app.role === 'ROLE_USER') && <Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-primary dashboard-card">
							<Card.Body className="pb-0">
							<div className="dashboard-card-heading">Registered Agents</div>
								<div className="text-value dashboard-card-data">{this.state.dashboardData.registeredAgents}</div>

							</Card.Body>
						</Card>
					</Col>}
					{(this.props.app.role === 'ROLE_USER') && <Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-success dashboard-card">
							<Card.Body className="pb-0">
							<div className="dashboard-card-heading">Active Agents</div>
								<div className="text-value dashboard-card-data">{this.state.dashboardData.activeAgents}</div>

							</Card.Body>
						</Card>
					</Col>}
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-info dashboard-card">
							<Card.Body className="pb-0">
							<div className="dashboard-card-heading">Credits Available</div>
								<div className="text-value dashboard-card-data">{this.state.dashboardData.creditsAvailable}</div>

							</Card.Body>
						</Card>
					</Col>
					<Col xs="12" sm="6" lg="3">
						<Card className="text-white bg-danger dashboard-card">
							<Card.Body className="pb-0">
							<div className="dashboard-card-heading">Credits Used</div>
								<div className="text-value dashboard-card-data">{this.state.dashboardData.creditsUsed}</div>

							</Card.Body>
						</Card>
					</Col>


				</Row>
			</div>
		);
	}

}

export default Dashboard;