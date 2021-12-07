import React from 'react';
import { Nav } from 'react-bootstrap';
import './index.css';
const Header = (props) => {
	console.log(props) 	
	return (
		<header className="app-header navbar">
			{props.app.userId && <div className="nav-desktop"><a className="  navbar-brand" href={props.app.siteUrl}>
				{props.logo && <img className="navbar-brand-full" src={props.logo} alt=" Logo" />}
				{props.logo && <img className="navbar-brand-minimized" src={props.logo} width="30" alt=" Logo" />}
			</a>
				<button onClick={props.toggleSidebar} className="navbar-toggler sidebar-toggler d-lg-none" type="button" data-toggle="sidebar-show">
					<span className="navbar-toggler-icon"></span>
				</button></div>}


			{ props.app.userId && <div className="nav-mobile"> <a className="  navbar-brand" href={props.app.siteUrl}>
				{props.logo && <img className="navbar-brand-full" src={props.logo} alt=" Logo" />}
				{props.logo && <img className="navbar-brand-minimized" src={props.logo} width="30" height="30" alt=" Logo" />}
			</a><button onClick={props.toggleSidebar} className="navbar-toggler sidebar-toggler d-lg-none " type="button" data-toggle="sidebar-show">
					<span className="navbar-toggler-icon"></span>
				</button></div>}
			{props.app.userId && <Nav defaultActiveKey="/logout" as="ul">
				<Nav.Item as="li">
					<Nav.Link onClick={props.logOutUser} href=""><i className="fa fa-sign-out" aria-hidden="true"></i>Logout</Nav.Link>
				</Nav.Item>
			</Nav>}


		</header>
	);

}

export default Header;