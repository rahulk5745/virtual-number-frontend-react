import React, { Component } from 'react';
import { Nav, NavDropdown } from 'react-bootstrap';
import { Link } from "react-router-dom";
import './index.css';
class SideNav extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			showWidgetsNav: false
		}
	}
	render() {
		const urlPrefix = '';
		let nav = '';
		if ( this.props.app.role === 'ROLE_ADMIN' || this.props.app.role === 'ROLE_SADMIN' ) {
			nav = <Nav defaultActiveKey="/" className="flex-column"><NavDropdown show title="" className="nav-heading nav-desktop nav-dropdown" id="nav-dropdown">
				<Link className="dropdown-item" to="/"><i className="fa fa-home"></i>Dashboard</Link>
				//url prefix
				<Link className="dropdown-item" to={`${urlPrefix}/user-management`}><i className="fa fa-edit"></i>User Management</Link>
			</NavDropdown>
				<NavDropdown show title="" className="nav-heading nav-mobile nav-dropdown" id="nav-dropdown">
					<Link onClick={this.props.toggleSidebar} className="dropdown-item" to="/"><i className="fa fa-home"></i>Dashboard</Link>
					<Link className="dropdown-item" to={`${urlPrefix}/user-management`}><i className="fa fa-edit"></i>User Management</Link>
				</NavDropdown>
			</Nav>;
		}
		else if ( this.props.app.role === 'ROLE_USER' ) {
			nav = <Nav defaultActiveKey="" className="flex-column"><NavDropdown show title="" className="nav-heading nav-desktop nav-dropdown" id="nav-dropdown">
				<Link className="dropdown-item" to="/"><i className="fa fa-home"></i>Dashboard</Link>
				<Link className="dropdown-item" to={`${urlPrefix}/user-management`}><i className="fa fa-edit"></i>User Management</Link>
				<Link className="dropdown-item" to={`${urlPrefix}/my-virtualnos`}><i className="fa fa-list"></i>My Virtual Nos.</Link>
				<Link className="dropdown-item" to={`${urlPrefix}/my-agents`}><i className="fa fa-list"></i>My Agents</Link>
				<Link className="dropdown-item" to={`${urlPrefix}/report`}><i className="fa fa-tasks"></i>Report</Link>
			</NavDropdown>
				<NavDropdown show title="" className="nav-heading nav-mobile nav-dropdown" id="nav-dropdown">
					{/* <NavDropdown.Item href="/build/add-campaign" eventKey="4.1"><i className="fa fa-edit"></i>Compose Voice SMS</NavDropdown.Item>
			<NavDropdown.Item href="/build/campaign-summary" eventKey="4.2"><i className="fa fa-edit"></i>Voice Campaign Summary</NavDropdown.Item> */}
					<Link onClick={this.props.toggleSidebar} className="dropdown-item" to="/"><i className="fa fa-home"></i>Dashboard</Link>
					<Link className="dropdown-item" to={`${urlPrefix}/user-management`}><i className="fa fa-edit"></i>User Management</Link>
					<Link onClick={this.props.toggleSidebar} className="dropdown-item" to={`${urlPrefix}/my-virtualnos`}><i className="fa fa-list"></i>My Virtual Nos.</Link>
					<Link onClick={this.props.toggleSidebar} className="dropdown-item" to={`${urlPrefix}/my-agents`}><i className="fa fa-list"></i>My Agents</Link>
					<Link onClick={this.props.toggleSidebar} className="dropdown-item" to={`${urlPrefix}/report`}><i className="fa fa-tasks"></i>Report</Link>
			</NavDropdown>
			</Nav>;
		}
		else if ( this.props.app.role === 'ROLE_AGENT' ) {
			nav = <Nav defaultActiveKey="" className="flex-column"><NavDropdown show title="" className="nav-heading nav-desktop nav-dropdown" id="nav-dropdown">
				<Link className="dropdown-item" to="/"><i className="fa fa-list"></i>My Leads</Link>
				<Link className="dropdown-item" to={`${urlPrefix}/report`}><i className="fa fa-tasks"></i>Report</Link>
			</NavDropdown>
				<NavDropdown show title="" className="nav-heading nav-mobile nav-dropdown" id="nav-dropdown">
					<Link className="dropdown-item" to="/"><i className="fa fa-list"></i>My Leads</Link>
					<Link className="dropdown-item" to={`${urlPrefix}/report`}><i className="fa fa-tasks"></i>Report</Link>
				</NavDropdown>
			</Nav>;
		}
		else {
			nav = <Nav defaultActiveKey="" className="flex-column"><NavDropdown show title="" className="nav-heading nav-desktop nav-dropdown" id="nav-dropdown">
				<Link className="dropdown-item" to="/"><i className="fa fa-home"></i>Dashboard</Link>
				<Link className="dropdown-item" to={`${urlPrefix}/my-virtualnos`}><i className="fa fa-list"></i>My Virtual Nos.</Link>
				<Link className="dropdown-item" to={`${urlPrefix}/my-agents`}><i className="fa fa-list"></i>My Agents</Link>
				<Link className="dropdown-item" to={`${urlPrefix}/report`}><i className="fa fa-tasks"></i>Report</Link>
			</NavDropdown>
				<NavDropdown show title="" className="nav-heading nav-mobile nav-dropdown" id="nav-dropdown">
					{/* <NavDropdown.Item href="/build/add-campaign" eventKey="4.1"><i className="fa fa-edit"></i>Compose Voice SMS</NavDropdown.Item>
			<NavDropdown.Item href="/build/campaign-summary" eventKey="4.2"><i className="fa fa-edit"></i>Voice Campaign Summary</NavDropdown.Item> */}
					<Link onClick={this.props.toggleSidebar} className="dropdown-item" to="/"><i className="fa fa-home"></i>Dashboard</Link>
					<Link onClick={this.props.toggleSidebar} className="dropdown-item" to={`${urlPrefix}/my-virtualnos`}><i className="fa fa-list"></i>My Virtual Nos.</Link>
					<Link onClick={this.props.toggleSidebar} className="dropdown-item" to={`${urlPrefix}/my-agents`}><i className="fa fa-list"></i>My Agents</Link>
					<Link onClick={this.props.toggleSidebar} className="dropdown-item" to={`${urlPrefix}/report`}><i className="fa fa-tasks"></i>Report</Link>
				</NavDropdown>
			</Nav>;
		}
		return (
			<div className="sidebar">
				<nav className="sidebar-nav">
					{nav}
				</nav>
			</div>
		);
	}

}

export default SideNav;