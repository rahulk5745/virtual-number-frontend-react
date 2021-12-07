
import React from 'react';
import SideNav from './SideNav/';
import Dashboard from './Dashboard';
import Login from './Login/';
import AgentsList from './AgentManagement/AgentsList';
import LeadsList from './LeadsManagement/LeadsList';
import AddAgent from './AgentManagement/AddAgent';
import UserManagement from './UserManagement';
import CreateUser from './UserManagement/CreateUser';
import UpdateUser from './UserManagement/UpdateUser';
import Report from './Report' 	
import Remarks from './Remarks';
import AddVirtualNo from './VirtualNoManagement/AddVirtualNo';
import VirtualNoList from './VirtualNoManagement/VirtualNoList';
import FreeTrialRegsiter from './FreeTrialRegsiter';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from 'history';
import Cookies from 'js-cookie';
// import { VirtualProvider } from "../Helpers/VirtualContaxt";

const Body = (props) => {
	const app = props.app;
	console.log(props)
	// Get the current location.
	const history = createBrowserHistory();
	const location = history.location;

	let homePage = '';
	if (!Cookies.get('token') && (app.userId === '' || typeof app.userId === 'undefined' || app.token === '' || typeof app.token === 'undefined') && location.pathname !== '/freetrial') {

		homePage = <Login setUserToken={props.setUserToken} app={app} />;
		// console.log(app)
	} else if (location.pathname === '/freetrial') {
		homePage = <Route path="/freetrial"><FreeTrialRegsiter app={app} /></Route>
	} else {
		let sideNav = '';
		if (location.pathname !== '/freetrial') {
			sideNav = <SideNav toggleSidebar={props.toggleSidebar} app={app} />;
		}

		homePage = <div className="app-body">
			{sideNav}
			<main className="main">
				<div className="container-fluid">
					<Switch>
						{Cookies.get('role') === "ROLE_AGENT" &&
							<Route exact path="/"><LeadsList app={app} {...props} /></Route>
						}
						{Cookies.get('role') !== "ROLE_AGENT" &&
							<Route exact path="/"><Dashboard app={app} {...props} /></Route>
						}
						<Route path="/my-virtualnos"><VirtualNoList app={app} /></Route>
						<Route exact path="/virtual-no" render={(routeprops) => (
							<AddVirtualNo app={props.app} {...routeprops} />)
						} />
						<Route path="/my-agents"><AgentsList app={app} /></Route>
						<Route path="/my-leads"><LeadsList app={app} /></Route>

						<Route exact path="/add-agent" render={(routeprops) => (
							<AddAgent app={props.app} {...routeprops} />)
						} />

						<Route path="/user-management"><UserManagement app={app} /></Route>
						<Route exact path="/update-user/:selectedUserId" render={(routeprops) => (
							<UpdateUser selectedUserId={routeprops.match.params.selectedUserId} app={props.app} {...routeprops} />)
						} />
						<Route path="/create-user"><CreateUser app={app} /></Route>
						<Route path="/report"><Report app={app} /></Route>
						<Route path="/remarks"><Remarks app={app} /></Route>
					</Switch>

				</div>
			</main>
		</div>;
	}
	return (
		// <VirtualProvider value={{ msg: "Hello" }}>
		<Router>
			{homePage}
		</Router>
		// </VirtualProvider>
		
	);
}

export default Body;
